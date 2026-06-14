#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build spglib.wasm from the spglib 2.7.0 source using CMake +
# wasi-sdk. Single-threaded, static libsymspg + thin CLI wrapper.
#
# Designed to run inside the Docker container defined by build/spglib/Dockerfile,
# but also usable on a host with wasi-sdk >= 24, wasmtime, binaryen (wasm-opt),
# and cmake installed.
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory     (default: /tmp/spglib-build)
#   OUT_DIR       — where spglib.wasm lands     (default: ./out)
#   TARBALL_SHA   — expected sha256 of the tarball (set below)
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/../.."

# ── Configuration ────────────────────────────────────────────────────────────

SPGLIB_VERSION="2.7.0"
TARBALL_URL="https://github.com/spglib/spglib/archive/refs/tags/v${SPGLIB_VERSION}.tar.gz"
TARBALL_SHA="${TARBALL_SHA:-b22fc9abae9716c574fbc6d55cfc53ed654a714fccc5657a26ff5d18114bd8bd}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/spglib-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

# ── Step 1: Fetch + verify tarball ───────────────────────────────────────────

mkdir -p "${BUILD_DIR}"
TARBALL="${BUILD_DIR}/spglib-${SPGLIB_VERSION}.tar.gz"

if [[ ! -f "${TARBALL}" ]]; then
  echo "==> Downloading spglib-${SPGLIB_VERSION} source tarball"
  curl -fSL -o "${TARBALL}" "${TARBALL_URL}"
fi

echo "==> Verifying tarball sha256"
ACTUAL_SHA="$(sha256sum "${TARBALL}" | awk '{print $1}')"
if [[ "${ACTUAL_SHA}" != "${TARBALL_SHA}" ]]; then
  echo "ERROR: sha256 mismatch" >&2
  echo "  expected: ${TARBALL_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  exit 1
fi

# ── Step 2: Extract ──────────────────────────────────────────────────────────

SRC_DIR="${BUILD_DIR}/spglib-${SPGLIB_VERSION}"
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "==> Extracting tarball"
  tar -xzf "${TARBALL}" -C "${BUILD_DIR}"
fi

# ── Step 3: CMake configure ─────────────────────────────────────────────────
# Uses the wasi-sdk CMake toolchain file (single-threaded sysroot).
# The six -DSPGLIB_* flags match kit/spglib/recipe.json build.args verbatim:
#   -DSPGLIB_SHARED_LIBS=OFF     static library (WASI has no dynamic linking)
#   -DSPGLIB_WITH_TESTS=OFF      skip test binaries
#   -DSPGLIB_WITH_Fortran=OFF    no Fortran interface
#   -DSPGLIB_WITH_Python=OFF     no Python interface
#   -DSPGLIB_USE_OMP=OFF         no OpenMP (single-threaded invariant)
#   -DCMAKE_BUILD_TYPE=MinSizeRel  optimize for size

CMAKE_BUILD_DIR="${BUILD_DIR}/cmake-build"

echo "==> Configuring spglib with CMake + wasi-sdk toolchain"
cmake -B "${CMAKE_BUILD_DIR}" -S "${SRC_DIR}" -G "Unix Makefiles" \
  -DCMAKE_TOOLCHAIN_FILE="${WASI_SDK}/share/cmake/wasi-sdk.cmake" \
  -DSPGLIB_SHARED_LIBS=OFF \
  -DSPGLIB_WITH_TESTS=OFF \
  -DSPGLIB_WITH_Fortran=OFF \
  -DSPGLIB_WITH_Python=OFF \
  -DSPGLIB_USE_OMP=OFF \
  -DCMAKE_BUILD_TYPE=MinSizeRel

# ── Step 4: Build the static library ────────────────────────────────────────

echo "==> Building libsymspg (static)"
cmake --build "${CMAKE_BUILD_DIR}" -j"$(nproc)" --target Spglib_symspg

# Locate the static library
LIB_DIR="${CMAKE_BUILD_DIR}/src"
LIBSYMSPG="${LIB_DIR}/libsymspg.a"
if [[ ! -f "${LIBSYMSPG}" ]]; then
  # Fallback: search the build tree
  LIBSYMSPG="$(find "${CMAKE_BUILD_DIR}" -name 'libsymspg.a' -type f | head -1)"
  if [[ -z "${LIBSYMSPG}" ]]; then
    echo "ERROR: libsymspg.a not found in ${CMAKE_BUILD_DIR}" >&2
    exit 1
  fi
fi
echo "==> Built: ${LIBSYMSPG}"

# ── Step 5: Compile + link the CLI wrapper ──────────────────────────────────

echo "==> Compiling spglib_cli.c + linking spglib.wasm"
WASM_RAW="${BUILD_DIR}/spglib.raw.wasm"

"${WASI_SDK}/bin/clang" \
  -O2 \
  -I "${SRC_DIR}/include" \
  -o "${WASM_RAW}" \
  "${SCRIPT_DIR}/spglib_cli.c" \
  "${LIBSYMSPG}" \
  -lm

echo "==> Linked: ${WASM_RAW} ($(wc -c < "${WASM_RAW}" | tr -d ' ') bytes)"

# ── Step 6: Optimize + strip ────────────────────────────────────────────────

mkdir -p "${OUT_DIR}"
WASM_FINAL="${OUT_DIR}/spglib.wasm"

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> spglib.wasm: ${FINAL_SIZE} bytes"

# ── Step 7: Smoke test via wasmtime + manifest golden ────────────────────────

MANIFEST="${REPO_ROOT}/kit/spglib/manifest.json"
if [[ ! -f "${MANIFEST}" ]]; then
  echo "WARNING: manifest.json not found at ${MANIFEST}, skipping smoke test" >&2
  exit 0
fi

echo "==> Running smoke tests against manifest goldens"
PASS=0
FAIL=0

while IFS='|' read -r op_id op_tool args_b64 stdin_b64 expect_b64; do
  echo -n "    ${op_id} (${op_tool}): "

  ARGS=()
  while IFS= read -r a || [[ -n "${a}" ]]; do ARGS+=("${a}"); done \
    < <(printf '%s' "${args_b64}" | base64 -d)
  STDIN_DATA="$(printf '%s' "${stdin_b64}" | base64 -d)"
  EXPECT="$(printf '%s' "${expect_b64}" | base64 -d)"

  CMD=(wasmtime run "${WASM_FINAL}")
  [[ ${#ARGS[@]} -gt 0 ]] && CMD+=("${ARGS[@]}")
  if [[ -n "${STDIN_DATA}" ]]; then
    ACTUAL="$(printf '%s\n' "${STDIN_DATA}" | "${CMD[@]}" 2>/dev/null)" || true
  else
    ACTUAL="$("${CMD[@]}" < /dev/null 2>/dev/null)" || true
  fi

  if [[ "${ACTUAL}" == "${EXPECT}" ]]; then
    echo "PASS"
    PASS=$((PASS + 1))
  else
    echo "FAIL"
    printf '      expected: %q\n' "${EXPECT}"
    printf '      actual:   %q\n' "${ACTUAL}"
    FAIL=$((FAIL + 1))
  fi
done < <(node -e '
  const m = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  const b64 = (s) => Buffer.from(String(s ?? ""), "utf8").toString("base64");
  for (const op of m.operations) {
    const sp    = op.stdinParam;
    const subst = (s) => String(s).replace(/\{(\w+)\}/g,
      (_, k) => (op.golden.input?.[k] ?? `{${k}}`));
    const args  = (op.argsTemplate || []).map(subst);
    const stdin = sp ? (op.golden.input?.[sp] ?? "") : "";
    process.stdout.write([
      op.id,
      op.tool || op.id,
      b64(args.join("\n")),
      b64(stdin),
      b64(op.golden.expect),
    ].join("|") + "\n");
  }
' "${MANIFEST}")

echo ""
echo "==> Smoke test results: ${PASS} passed, ${FAIL} failed out of $((PASS + FAIL))"

if [[ "${FAIL}" -gt 0 ]]; then
  echo "ERROR: smoke test failures — goldens do not match" >&2
  exit 1
fi

echo "==> Build complete: ${WASM_FINAL}"
echo "==> Next steps: copy spglib.wasm to kit/spglib/artifacts/, stamp sha256, flip verified:true, npm run verify"

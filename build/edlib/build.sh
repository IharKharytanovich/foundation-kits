#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build edlib.wasm from the edlib v1.2.7 source using wasi-sdk
# clang++. Single-threaded, direct compile of edlib.cpp + thin CLI wrapper.
#
# Designed to run inside the Docker container defined by build/edlib/Dockerfile,
# but also usable on a host with wasi-sdk >= 24, wasmtime, binaryen (wasm-opt),
# and Node installed.
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory     (default: /tmp/edlib-build)
#   OUT_DIR       — where edlib.wasm lands      (default: ./out)
#   TARBALL_SHA   — expected sha256 of the tarball (MUST be set before build)
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/../.."

# ── Configuration ────────────────────────────────────────────────────────────

EDLIB_VERSION="1.2.7"
TARBALL_URL="https://github.com/Martinsos/edlib/archive/refs/tags/v${EDLIB_VERSION}.tar.gz"
TARBALL_SHA="${TARBALL_SHA:-PLACEHOLDER_SET_BEFORE_BUILD}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/edlib-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

# ── Step 1: Fetch + verify tarball ───────────────────────────────────────────

mkdir -p "${BUILD_DIR}"
TARBALL="${BUILD_DIR}/edlib-${EDLIB_VERSION}.tar.gz"

if [[ ! -f "${TARBALL}" ]]; then
  echo "==> Downloading edlib-${EDLIB_VERSION} source tarball"
  curl -fSL -o "${TARBALL}" "${TARBALL_URL}"
fi

echo "==> Verifying tarball sha256"
ACTUAL_SHA="$(sha256sum "${TARBALL}" | awk '{print $1}')"
if [[ "${ACTUAL_SHA}" != "${TARBALL_SHA}" ]]; then
  echo "ERROR: sha256 mismatch" >&2
  echo "  expected: ${TARBALL_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  echo "" >&2
  echo "If this is the first run, set TARBALL_SHA to the actual hash above:" >&2
  echo "  export TARBALL_SHA=${ACTUAL_SHA}" >&2
  exit 1
fi

# ── Step 2: Extract ──────────────────────────────────────────────────────────

SRC_DIR="${BUILD_DIR}/edlib-${EDLIB_VERSION}"
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "==> Extracting tarball"
  tar -xzf "${TARBALL}" -C "${BUILD_DIR}"
fi

# ── Step 3: Compile + link with clang++ ──────────────────────────────────────
# edlib is a single C++ translation unit (edlib.cpp) with an extern "C" header.
# The CLI driver (edlib_cli.c) is compiled as C by clang++ (by .c extension).
# No cmake, no separate library build — direct single-invocation compile+link.
# Single-threaded: no threading flags, no SharedArrayBuffer.

echo "==> Compiling edlib_cli.c + edlib.cpp → edlib.wasm (single-threaded)"
WASM_RAW="${BUILD_DIR}/edlib.raw.wasm"

"${WASI_SDK}/bin/clang++" \
  -O2 \
  -fno-exceptions \
  -fno-rtti \
  -I "${SRC_DIR}/edlib/include" \
  -o "${WASM_RAW}" \
  "${SCRIPT_DIR}/edlib_cli.c" \
  "${SRC_DIR}/edlib/src/edlib.cpp" \
  -lm

echo "==> Linked: ${WASM_RAW} ($(wc -c < "${WASM_RAW}" | tr -d ' ') bytes)"

# ── Step 4: Optimize + strip ────────────────────────────────────────────────

mkdir -p "${OUT_DIR}"
WASM_FINAL="${OUT_DIR}/edlib.wasm"

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> edlib.wasm: ${FINAL_SIZE} bytes"

# ── Step 5: Smoke test via wasmtime + manifest golden ────────────────────────

MANIFEST="${REPO_ROOT}/kit/edlib/manifest.json"
if [[ ! -f "${MANIFEST}" ]]; then
  echo "WARNING: manifest.json not found at ${MANIFEST}, skipping smoke test" >&2
  echo "==> Build complete: ${WASM_FINAL}"
  echo "==> Next steps:"
  echo "    1. Ensure kit/edlib/manifest.json exists (from the edlib-kit phase)"
  echo "    2. Re-run this build to execute the smoke test"
  exit 0
fi

echo "==> Running smoke tests against manifest goldens"
PASS=0
FAIL=0
CAPTURED=0

# Sentinel value for operations whose golden.expect is not yet known
CAPTURE_SENTINEL="<captured at build>"

while IFS='|' read -r op_id op_tool args_b64 stdin_b64 expect_b64; do
  echo -n "    ${op_id} (${op_tool}): "

  ARGS=()
  while IFS= read -r a || [[ -n "${a}" ]]; do ARGS+=("${a}"); done \
    < <(printf '%s' "${args_b64}" | base64 -d)
  STDIN_DATA="$(printf '%s' "${stdin_b64}" | base64 -d)"
  EXPECT="$(printf '%s' "${expect_b64}" | base64 -d)"

  # NOTE: pass guest args directly after the module — wasmtime treats a literal
  # "--" as a guest argv entry (not a separator), which would reach edlib_cli.c
  # as argv[1] and be misread as the task name.
  CMD=(wasmtime run "${WASM_FINAL}")
  [[ ${#ARGS[@]} -gt 0 ]] && CMD+=("${ARGS[@]}")
  if [[ -n "${STDIN_DATA}" ]]; then
    ACTUAL="$(printf '%s\n' "${STDIN_DATA}" | "${CMD[@]}" 2>/dev/null)" || true
  else
    ACTUAL="$("${CMD[@]}" < /dev/null 2>/dev/null)" || true
  fi

  # If the expect is the capture sentinel, print actual for the maintainer
  # to paste into the manifest — do NOT count as pass or fail.
  if [[ "${EXPECT}" == "${CAPTURE_SENTINEL}" ]]; then
    echo "CAPTURED (paste into manifest)"
    printf '      actual output: %s\n' "${ACTUAL}"
    CAPTURED=$((CAPTURED + 1))
  elif [[ "${ACTUAL}" == "${EXPECT}" ]]; then
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
echo "==> Smoke test results: ${PASS} passed, ${FAIL} failed, ${CAPTURED} captured out of $((PASS + FAIL + CAPTURED))"

if [[ "${FAIL}" -gt 0 ]]; then
  echo "ERROR: smoke test failures — goldens do not match" >&2
  exit 1
fi

echo "==> Build complete: ${WASM_FINAL}"
echo ""
echo "==> Next steps:"
echo "    1. Copy edlib.wasm to kit/edlib/artifacts/:"
echo "       mkdir -p kit/edlib/artifacts && cp ${WASM_FINAL} kit/edlib/artifacts/edlib.wasm"
echo "    2. Stamp the real sha256 into kit/edlib/kit.json artifacts[0].sha256:"
echo "       sha256sum kit/edlib/artifacts/edlib.wasm"
echo "    3. Flip verified to true in kit/edlib/kit.json"
echo "    4. Paste any CAPTURED align CIGAR output into kit/edlib/manifest.json operations[1].golden.expect"
echo "    5. Run: npm run verify && npm run license-gate -- edlib"
echo "    6. Dry-run: npm run publish-kit -- edlib@1.2.7 --dry-run"
echo "    7. Tag + push: git tag edlib@1.2.7 && git push origin edlib@1.2.7"

#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build z3.wasm from the Z3 4.16.0 source using CMake + wasi-sdk.
# Single-threaded, no pthreads, WASM exceptions enabled, LTO OFF.
#
# Designed to run inside the Docker container defined by build/z3/Dockerfile,
# but also usable on a host with wasi-sdk ≥ 33, wasmtime ≥ 37, binaryen
# (wasm-opt), cmake, and Node installed.
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory     (default: /tmp/z3-build)
#   OUT_DIR       — where z3.wasm lands         (default: ./out)
#   TARBALL_SHA   — expected sha256 of the tarball (set below)
#
# NOTE: LTO must NOT be enabled — EH + LTO is a known wasi-sdk bug (#629).
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/../.."

# ── Configuration ────────────────────────────────────────────────────────────

Z3_VERSION="4.16.0"
TARBALL_URL="https://github.com/Z3Prover/z3/archive/refs/tags/z3-${Z3_VERSION}.tar.gz"
# Set this to the known sha256 of the release tarball before building.
TARBALL_SHA="${TARBALL_SHA:-c68c3e5e4810b16126b8cb4c47eee85c1ac3e24a81914c8e371b40de9dd33ac7}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/z3-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

# ── Step 1: Fetch + verify tarball ───────────────────────────────────────────

mkdir -p "${BUILD_DIR}"
TARBALL="${BUILD_DIR}/z3-${Z3_VERSION}.tar.gz"

if [[ ! -f "${TARBALL}" ]]; then
  echo "==> Downloading z3-${Z3_VERSION} source tarball"
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

SRC_DIR="${BUILD_DIR}/z3-z3-${Z3_VERSION}"
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "==> Extracting tarball"
  tar -xzf "${TARBALL}" -C "${BUILD_DIR}"
fi

# ── Step 3: CMake configure ─────────────────────────────────────────────────
# Uses the wasi-sdk CMake toolchain file (single-threaded sysroot, NOT the
# pthreads variant). Exception flags are required because
# z3 throws/catches C++ exceptions on normal control-flow paths.
#
# The eight -DZ3_* flags match kit/z3/recipe.json build.args verbatim:
#   -DZ3_SINGLE_THREADED=ON          remove all threading (mutexes, atomics)
#   -DZ3_POLLING_TIMER=ON            remove scoped_timer's std::thread (Z3 #5746)
#   -DZ3_BUILD_LIBZ3_SHARED=OFF      static library (WASI has no dynamic linking)
#   -DZ3_USE_LIB_GMP=FALSE           no GMP dependency
#   -DZ3_BUILD_EXECUTABLE=ON         build the z3 CLI binary
#   -DZ3_BUILD_TEST_EXECUTABLES=OFF   skip test binaries
#   -DZ3_ENABLE_EXAMPLE_TARGETS=OFF   skip example binaries
#   -DCMAKE_BUILD_TYPE=MinSizeRel     optimize for size

CMAKE_BUILD_DIR="${BUILD_DIR}/cmake-build"

# WASI emulation libs — wasm has no signals, mmap, process clocks, or getpid.
# wasi-sdk ships drop-in emulations enabled by a -D define (compile) + a -l lib
# (link). z3 touches all four: SIGINT (scoped_ctrl_c), mmap (memory manager),
# clocks (timers/rlimit), getpid (random seed / tmp names). Unused ones are inert.
WASI_EMUL_DEFS="-D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_MMAN -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_GETPID"
WASI_EMUL_LIBS="-lwasi-emulated-signal -lwasi-emulated-mman -lwasi-emulated-process-clocks -lwasi-emulated-getpid"

# Link-time stubs (pthread_atfork — absent from single-threaded wasi-libc; WASI
# has no fork). Compiled to one object and appended to the final link line.
echo "==> Compiling WASI link stubs"
STUB_OBJ="${BUILD_DIR}/wasm-stubs.o"
"${WASI_SDK}/bin/clang" -O2 -c "${SCRIPT_DIR}/wasm-stubs.c" -o "${STUB_OBJ}"
WASI_EMUL_LIBS="${WASI_EMUL_LIBS} ${STUB_OBJ}"

echo "==> Configuring z3 with CMake + wasi-sdk toolchain"
cmake -B "${CMAKE_BUILD_DIR}" -S "${SRC_DIR}" -G "Unix Makefiles" \
  -DCMAKE_TOOLCHAIN_FILE="${WASI_SDK}/share/cmake/wasi-sdk.cmake" \
  -DZ3_SINGLE_THREADED=ON \
  -DZ3_POLLING_TIMER=ON \
  -DZ3_BUILD_LIBZ3_SHARED=OFF \
  -DZ3_USE_LIB_GMP=FALSE \
  -DZ3_BUILD_EXECUTABLE=ON \
  -DZ3_BUILD_TEST_EXECUTABLES=OFF \
  -DZ3_ENABLE_EXAMPLE_TARGETS=OFF \
  -DCMAKE_BUILD_TYPE=MinSizeRel \
  -DCMAKE_C_FLAGS="-fwasm-exceptions -mllvm -wasm-use-legacy-eh=false -include ${SCRIPT_DIR}/wasm-fenv-compat.h ${WASI_EMUL_DEFS}" \
  -DCMAKE_CXX_FLAGS="-fwasm-exceptions -mllvm -wasm-use-legacy-eh=false -include ${SCRIPT_DIR}/wasm-fenv-compat.h ${WASI_EMUL_DEFS}" \
  -DCMAKE_EXE_LINKER_FLAGS="-fwasm-exceptions -lunwind ${WASI_EMUL_LIBS}"

# ── Step 4: Build ────────────────────────────────────────────────────────────

echo "==> Building z3 (this may take several minutes)"
# CMake target is "shell" (z3's src/shell/CMakeLists.txt sets OUTPUT_NAME z3);
# there is no target literally named "z3".
cmake --build "${CMAKE_BUILD_DIR}" -j"$(nproc)" --target shell

# Locate the produced z3 binary. CMake places it under src/shell/ in the build
# tree (z3's CMakeLists sets OUTPUT_NAME z3 on the "shell" target).
Z3_BIN="${CMAKE_BUILD_DIR}/src/shell/z3"
if [[ ! -f "${Z3_BIN}" ]]; then
  # Fallback: search the build tree
  Z3_BIN="$(find "${CMAKE_BUILD_DIR}" -name 'z3' -type f | head -1)"
  if [[ -z "${Z3_BIN}" ]]; then
    echo "ERROR: z3 binary not found in ${CMAKE_BUILD_DIR}" >&2
    exit 1
  fi
fi
echo "==> Built: ${Z3_BIN} ($(wc -c < "${Z3_BIN}" | tr -d ' ') bytes)"

# ── Step 5: Optimize + strip ────────────────────────────────────────────────

mkdir -p "${OUT_DIR}"
WASM_RAW="${OUT_DIR}/z3.raw.wasm"
WASM_FINAL="${OUT_DIR}/z3.wasm"

cp "${Z3_BIN}" "${WASM_RAW}"

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz --enable-exception-handling "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug --enable-exception-handling "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> z3.wasm: ${FINAL_SIZE} bytes"

# ── Step 6: Smoke test via wasmtime + manifest goldens ───────────────────────

MANIFEST="${REPO_ROOT}/kit/z3/manifest.json"
if [[ ! -f "${MANIFEST}" ]]; then
  echo "WARNING: manifest.json not found at ${MANIFEST}, skipping smoke test" >&2
  exit 0
fi

echo "==> Running smoke tests against manifest goldens"
PASS=0
FAIL=0

# One record per operation, emitted by a single node pass. golden.expect and the
# stdin payload contain newlines and arbitrary bytes, so every variable-length
# field is base64-encoded — keeping each record on ONE '|'-delimited line that
# the shell can read safely. Fields: id, tool, argsB64 (argv \n-joined),
# stdinB64 (golden.input[stdinParam]), expectB64 (golden.expect).
while IFS='|' read -r op_id op_tool args_b64 stdin_b64 expect_b64; do
  echo -n "    ${op_id} (${op_tool}): "

  # Decode argv (newline-separated) into an array. The `|| [[ -n "$a" ]]` guard
  # keeps the final element when base64 output has no trailing newline.
  ARGS=()
  while IFS= read -r a || [[ -n "${a}" ]]; do ARGS+=("${a}"); done \
    < <(printf '%s' "${args_b64}" | base64 -d)
  STDIN_DATA="$(printf '%s' "${stdin_b64}" | base64 -d)"
  EXPECT="$(printf '%s' "${expect_b64}" | base64 -d)"

  # z3 needs wasmtime's -W exceptions=y flag to enable the WASM exception-
  # handling proposal (off by default in wasmtime). Everything after the module
  # path is already guest argv, so do NOT add a "--" separator: wasmtime forwards
  # a bare "--" to the guest, and z3's parse_cmd_line_args treats a lone "--" as
  # "the rest of argv is one input filename" — producing
  # (error "failed to open file '-smt2 -in'") and empty stdout.
  # LTO must not be added (wasi-sdk bug #629).
  CMD=(wasmtime run -W exceptions=y "${WASM_FINAL}")
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
echo "==> Next steps: copy z3.wasm to kit/z3/artifacts/, stamp sha256, flip verified:true, npm run verify"

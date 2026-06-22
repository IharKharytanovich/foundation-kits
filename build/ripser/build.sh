#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build ripser.wasm from the Ripser v1.2.1 source using wasi-sdk.
# Single-threaded, single C++ translation unit (ripser.cpp is already a CLI).
#
# Designed to run inside the Docker container defined by build/ripser/Dockerfile,
# but also usable on a host with wasi-sdk >= 24, wasmtime, and binaryen
# (wasm-opt) installed.
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory     (default: /tmp/ripser-build)
#   OUT_DIR       — where ripser.wasm lands     (default: ./out)
#   TARBALL_SHA   — expected sha256 of the tarball (set below)
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Configuration ────────────────────────────────────────────────────────────

RIPSER_VERSION="1.2.1"
RIPSER_TAG="v${RIPSER_VERSION}"
TARBALL_URL="https://github.com/Ripser/ripser/archive/refs/tags/${RIPSER_TAG}.tar.gz"
# Pinned sha256 of the Ripser v1.2.1 source tarball (captured on first download).
TARBALL_SHA="${TARBALL_SHA:-4be600591dced310550a78b718f3f4019f11049bad0fbf14eea1f85d835b16e1}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/ripser-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

# ── Step 1: Fetch + verify tarball ───────────────────────────────────────────

mkdir -p "${BUILD_DIR}"
TARBALL="${BUILD_DIR}/ripser-${RIPSER_VERSION}.tar.gz"

if [[ ! -f "${TARBALL}" ]]; then
  echo "==> Downloading Ripser ${RIPSER_TAG} source tarball"
  curl -fSL -o "${TARBALL}" "${TARBALL_URL}"
fi

echo "==> Verifying tarball sha256"
ACTUAL_SHA="$(sha256sum "${TARBALL}" | awk '{print $1}')"
if [[ "${TARBALL_SHA}" == "PLACEHOLDER_SET_BEFORE_BUILD" ]]; then
  echo "WARNING: TARBALL_SHA is a placeholder — recording actual sha256 for future use" >&2
  echo "  actual: ${ACTUAL_SHA}" >&2
  echo "  Set TARBALL_SHA=${ACTUAL_SHA} in this script before production use." >&2
elif [[ "${ACTUAL_SHA}" != "${TARBALL_SHA}" ]]; then
  echo "ERROR: sha256 mismatch" >&2
  echo "  expected: ${TARBALL_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  exit 1
fi

# ── Step 2: Extract ──────────────────────────────────────────────────────────

SRC_DIR="${BUILD_DIR}/ripser-${RIPSER_VERSION}"
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "==> Extracting tarball"
  tar -xzf "${TARBALL}" -C "${BUILD_DIR}"
fi

# ── Step 3: Compile ripser.cpp → ripser.wasm (single-threaded) ───────────────
# ripser.cpp is a self-contained single translation unit with main().
# No thin driver needed — it IS the CLI.
#
# Build flags:
#   -O2                    — optimise for speed (ripser is compute-heavy)
#   -DNDEBUG               — disable asserts (release build)
#   -std=c++14             — ripser requires C++14 features
#   No threading flags      — single-threaded invariant (factory constraint)
#   No -DUSE_COEFFICIENTS  — default field (Z/2Z), keeps golden stable

echo "==> Compiling ripser.cpp with wasi-sdk clang++ (single-threaded)"
WASM_RAW="${BUILD_DIR}/ripser.raw.wasm"

# wasi-sdk's prebuilt libc++abi has no C++ exception runtime (__cxa_throw /
# __cxa_allocate_exception are undefined; -fwasm-exceptions fails identically).
# ripser.cpp throws one fatal std::overflow_error and never catches, so we link
# tiny abort() stubs (eh_stubs.c) that resolve those two symbols in-module —
# keeping the .wasm free of undefined host imports. See eh_stubs.c for rationale.
echo "==> Compiling exception-ABI stubs (eh_stubs.c)"
EH_STUBS_OBJ="${BUILD_DIR}/eh_stubs.o"
"${WASI_SDK}/bin/clang" -O2 -c "${SCRIPT_DIR}/eh_stubs.c" -o "${EH_STUBS_OBJ}"

"${WASI_SDK}/bin/clang++" \
  -std=c++14 \
  -O2 \
  -DNDEBUG \
  -o "${WASM_RAW}" \
  "${SRC_DIR}/ripser.cpp" \
  "${EH_STUBS_OBJ}"

echo "==> Compiled: ${WASM_RAW} ($(wc -c < "${WASM_RAW}" | tr -d ' ') bytes)"

# ── Step 4: Optimize + strip ────────────────────────────────────────────────

mkdir -p "${OUT_DIR}"
WASM_FINAL="${OUT_DIR}/ripser.wasm"

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> ripser.wasm: ${FINAL_SIZE} bytes"

# ── Step 5: Smoke test — determinism gate ────────────────────────────────────
# Inline the fixed lower-distance matrix from the spec (TR-009 single-source
# golden). 3 points, equilateral, all pairwise distances = 2.
# Lower-distance-matrix format: row i lists distances to points 0..i-1.
#   d(1,0) = 2
#   d(2,0) = 2, d(2,1) = 2
#
# Run ripser TWICE on this input and assert byte-identical stdout (determinism).
# The build does NOT assert a specific barcode value — the value is captured
# and printed for the maintainer to paste into kit/ripser/manifest.json.
#
# ripser reads a FILE PATH argument (not stdin), so we write the matrix to a
# temp file and grant wasmtime access via --dir.

SMOKE_DIR="${BUILD_DIR}/smoke"
mkdir -p "${SMOKE_DIR}"

cat > "${SMOKE_DIR}/matrix.txt" <<'MATRIX'
2
2 2
MATRIX

echo "==> Smoke test: determinism gate (two runs, byte-identical)"

# Run 1
wasmtime run --dir="${SMOKE_DIR}" "${WASM_FINAL}" \
  --format lower-distance "${SMOKE_DIR}/matrix.txt" \
  > "${SMOKE_DIR}/run1.out" 2>/dev/null

# Run 2
wasmtime run --dir="${SMOKE_DIR}" "${WASM_FINAL}" \
  --format lower-distance "${SMOKE_DIR}/matrix.txt" \
  > "${SMOKE_DIR}/run2.out" 2>/dev/null

# Assert byte-identical
if cmp -s "${SMOKE_DIR}/run1.out" "${SMOKE_DIR}/run2.out"; then
  echo "    PASS — two runs are byte-identical"
else
  echo "    FAIL — outputs differ between runs" >&2
  diff "${SMOKE_DIR}/run1.out" "${SMOKE_DIR}/run2.out" >&2 || true
  exit 1
fi

# Print the barcode for the maintainer to capture into the manifest golden
echo ""
echo "==> Captured barcode (paste into kit/ripser/manifest.json operations[0].golden.expect):"
echo "--- begin barcode ---"
cat "${SMOKE_DIR}/run1.out"
echo "--- end barcode ---"
echo ""

# Clean up smoke artifacts
rm -rf "${SMOKE_DIR}"

echo "==> Build complete: ${WASM_FINAL}"
echo "==> Next steps: copy ripser.wasm to kit/ripser/artifacts/, stamp sha256, flip verified:true, capture barcode golden, npm run verify"

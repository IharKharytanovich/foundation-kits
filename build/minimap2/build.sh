#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build minimap2.wasm from the minimap2 v2.31 source using wasi-sdk.
#
# minimap2 is a single program (not multiplexed), so there is no dispatch.c /
# tools.json — main.c is compiled directly and linked. The port has three
# concerns, all handled here:
#
#   1. SIMD — minimap2's ksw2 alignment kernels use SSE2 intrinsics. v2.31
#      already supports SIMDe (#include <simde/x86/sse2.h> under -DUSE_SIMDE).
#      We fetch SIMDe, put it on the include path, and compile the four ksw2 SSE
#      sources with -DUSE_SIMDE -D__SSE2__ -DKSW_SSE2_ONLY -msimd128. This is the
#      SSE2-only code path (the same one the upstream ARM/NEON build uses), so no
#      CPU dispatcher (ksw2_dispatch.c) is needed.
#
#   2. Threads — upstream kthread.c calls pthread_create/join UNCONDITIONALLY in
#      kt_pipeline() (even single-threaded). wasm32-wasi is single-threaded, so
#      we substitute build/minimap2/kthread_wasi.c — a synchronous, pthread-free
#      drop-in that preserves the single-worker pipeline semantics. The -t flag
#      is also forced to 1 by the kit manifest.
#
#   3. zlib + getrusage — minimap2 needs zlib (fetched + cross-compiled like the
#      samtools build) and references getrusage (stderr-only timing); a force-
#      included shim (wasi_posix_shim.h/.c) supplies a zeroed getrusage.
#
# Designed to run inside build/minimap2/Dockerfile, but usable on a host with
# wasi-sdk, wasmtime, binaryen (wasm-opt), and Node installed.
#
# Inputs (env, with defaults):
#   WASI_SDK     — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR    — scratch build directory     (default: /tmp/minimap2-build)
#   OUT_DIR      — where minimap2.wasm lands    (default: ./out)
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/../.."

# ── Configuration ────────────────────────────────────────────────────────────

MINIMAP2_VERSION="2.31"
MINIMAP2_URL="https://github.com/lh3/minimap2/archive/refs/tags/v${MINIMAP2_VERSION}.tar.gz"
MINIMAP2_SHA="${MINIMAP2_SHA:-bff334a0e4512644e2f3e29944aeec408f49450f4f74dc39fe89e5273869255b}"

# SIMDe — provides the x86 SSE2 intrinsics over wasm SIMD (-msimd128). Pinned tag.
SIMDE_VERSION="0.8.2"
SIMDE_URL="https://github.com/simd-everywhere/simde/archive/refs/tags/v${SIMDE_VERSION}.tar.gz"
SIMDE_SHA="${SIMDE_SHA:-ed2a3268658f2f2a9b5367628a85ccd4cf9516460ed8604eed369653d49b25fb}"

# zlib — minimap2 reads gz-compressed FASTA/FASTQ via zlib. wasi-sdk ships none,
# so we cross-compile it from source (same as the samtools build).
ZLIB_VERSION="1.3.1"
ZLIB_URL="https://github.com/madler/zlib/releases/download/v${ZLIB_VERSION}/zlib-${ZLIB_VERSION}.tar.gz"
ZLIB_SHA="${ZLIB_SHA:-9a93b2b7dfdac77ceba5a558a580e74667dd6fede4585b91eefb60f03b72df23}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/minimap2-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

CC="${WASI_SDK}/bin/clang"
AR="${WASI_SDK}/bin/llvm-ar"
RANLIB="${WASI_SDK}/bin/llvm-ranlib"
SYSROOT="${WASI_SDK}/share/wasi-sysroot"

export PATH="${WASI_SDK}/bin:${PATH}"

# ── Step 1: Fetch + verify tarballs ──────────────────────────────────────────

mkdir -p "${BUILD_DIR}"

fetch_verify() {
  local url="$1" out="$2" want="$3" name="$4"
  if [[ ! -f "${out}" ]]; then
    echo "==> Downloading ${name}"
    curl -fSL -o "${out}" "${url}"
  fi
  echo "==> Verifying ${name} sha256"
  local got
  got="$(sha256sum "${out}" | awk '{print $1}')"
  if [[ "${got}" != "${want}" ]]; then
    echo "ERROR: ${name} sha256 mismatch" >&2
    echo "  expected: ${want}" >&2
    echo "  actual:   ${got}" >&2
    exit 1
  fi
}

MINIMAP2_TARBALL="${BUILD_DIR}/minimap2-${MINIMAP2_VERSION}.tar.gz"
SIMDE_TARBALL="${BUILD_DIR}/simde-${SIMDE_VERSION}.tar.gz"
ZLIB_TARBALL="${BUILD_DIR}/zlib-${ZLIB_VERSION}.tar.gz"

fetch_verify "${MINIMAP2_URL}" "${MINIMAP2_TARBALL}" "${MINIMAP2_SHA}" "minimap2-${MINIMAP2_VERSION}"
fetch_verify "${SIMDE_URL}"    "${SIMDE_TARBALL}"    "${SIMDE_SHA}"    "simde-${SIMDE_VERSION}"
fetch_verify "${ZLIB_URL}"     "${ZLIB_TARBALL}"     "${ZLIB_SHA}"    "zlib-${ZLIB_VERSION}"

# ── Step 2: Extract ──────────────────────────────────────────────────────────

MINIMAP2_SRC="${BUILD_DIR}/minimap2-${MINIMAP2_VERSION}"
SIMDE_SRC="${BUILD_DIR}/simde-${SIMDE_VERSION}"
ZLIB_SRC="${BUILD_DIR}/zlib-${ZLIB_VERSION}"

[[ -d "${MINIMAP2_SRC}" ]] || { echo "==> Extracting minimap2"; tar -xzf "${MINIMAP2_TARBALL}" -C "${BUILD_DIR}"; }
[[ -d "${SIMDE_SRC}" ]]    || { echo "==> Extracting simde";    tar -xzf "${SIMDE_TARBALL}"    -C "${BUILD_DIR}"; }
[[ -d "${ZLIB_SRC}" ]]     || { echo "==> Extracting zlib";     tar -xzf "${ZLIB_TARBALL}"     -C "${BUILD_DIR}"; }

# ── Step 3: Cross-compile zlib for WASI ──────────────────────────────────────

ZLIB_INSTALL="${BUILD_DIR}/zlib-install"
if [[ ! -f "${ZLIB_INSTALL}/lib/libz.a" ]]; then
  echo "==> Building zlib for WASI"
  pushd "${ZLIB_SRC}" > /dev/null
  CC="${CC}" \
  CFLAGS="--sysroot=${SYSROOT} -O2" \
  AR="${AR}" \
  RANLIB="${RANLIB}" \
  ./configure --static --prefix="${ZLIB_INSTALL}"
  make -j"$(nproc)"
  make install
  popd > /dev/null
fi

# ── Step 4: Replace upstream kthread.c with the synchronous WASI version ──────

echo "==> Substituting single-threaded kthread.c"
cp "${SCRIPT_DIR}/kthread_wasi.c" "${MINIMAP2_SRC}/kthread.c"

# wasi-sdk's emulated getrusage (wall-clock) populates ru_utime/ru_stime but the
# emulated `struct rusage` has no ru_maxrss member. peakrss() is stderr-only
# (Peak RSS log line) and never affects PAF output — neutralize its body so the
# build compiles. The two sed targets are the non-WIN32 peakrss() return paths
# (the #ifdef __linux__ → r.ru_maxrss*1024 and #else → r.ru_maxrss branches).
echo "==> Patching peakrss() for WASI (no ru_maxrss in emulated rusage)"
sed -i 's/return r\.ru_maxrss \* 1024;/return 0; \/* WASI: no ru_maxrss *\//' "${MINIMAP2_SRC}/misc.c"
sed -i 's/return r\.ru_maxrss;/return 0; \/* WASI: no ru_maxrss *\//' "${MINIMAP2_SRC}/misc.c"

# ── Step 5: Compile objects ──────────────────────────────────────────────────
# Plain-C sources (everything except the four ksw2 SSE kernels) compile with the
# base flags. The SSE kernels additionally get SIMDe + wasm SIMD, forced onto the
# SSE2-only code path. The getrusage shim is force-included into misc.c only.

OBJ_DIR="${BUILD_DIR}/objs"
mkdir -p "${OBJ_DIR}"

BASE_CFLAGS=(
  --sysroot="${SYSROOT}"
  -O2
  -DHAVE_KALLOC
  -I"${MINIMAP2_SRC}"
  -I"${ZLIB_INSTALL}/include"
)

# SSE2 kernels via SIMDe. SIMDE_ENABLE_NATIVE_ALIASES maps _mm_* names; __SSE2__
# selects the SSE2 path inside the ksw2 sources; KSW_SSE2_ONLY undefs __SSE4_1__
# so only the SSE2 branch is compiled (no SSE4.1, no CPU dispatch).
# SIMDE_FLOAT16_API=1 (PORTABLE) is required: SIMDe's auto-detection picks the
# native _Float16 typedef for clang, but wasm32-wasi clang rejects _Float16.
# ksw2 uses only integer SSE2 ops, so the f16 path is never exercised at runtime.
SIMD_CFLAGS=(
  --sysroot="${SYSROOT}"
  -O2
  -DHAVE_KALLOC
  -DUSE_SIMDE
  -DSIMDE_ENABLE_NATIVE_ALIASES
  -DSIMDE_FLOAT16_API=1
  -D__SSE2__
  -DKSW_SSE2_ONLY
  -msimd128
  -I"${MINIMAP2_SRC}"
  -I"${SIMDE_SRC}"
  -I"${ZLIB_INSTALL}/include"
)

# Plain-C object list (mirrors the Makefile OBJS minus the SSE kernels, plus
# main.o and the getrusage shim). ksw2_ll_sse.c is also SSE2 → SIMD list.
PLAIN_SRCS=(
  kthread.c kalloc.c misc.c bseq.c sketch.c sdust.c options.c index.c
  lchain.c align.c hit.c seed.c jump.c map.c format.c pe.c esterr.c splitidx.c
  main.c
)
SIMD_SRCS=(
  ksw2_ll_sse.c
  ksw2_extz2_sse.c
  ksw2_extd2_sse.c
  ksw2_exts2_sse.c
)

LINK_OBJS=()

echo "==> Compiling plain-C objects"
for src in "${PLAIN_SRCS[@]}"; do
  obj="${OBJ_DIR}/${src%.c}.o"
  echo "    ${src}"
  EXTRA=()
  # misc.c uses getrusage(RUSAGE_SELF) for stderr-only CPU/RSS timing. wasi-sdk
  # provides an emulated getrusage gated on _WASI_EMULATED_PROCESS_CLOCKS (wall
  # clock) — enable it for misc.c only; the matching archive is linked below.
  if [[ "${src}" == "misc.c" ]]; then
    EXTRA=(-D_WASI_EMULATED_PROCESS_CLOCKS)
  fi
  "${CC}" "${BASE_CFLAGS[@]}" "${EXTRA[@]}" -c "${MINIMAP2_SRC}/${src}" -o "${obj}"
  LINK_OBJS+=("${obj}")
done

echo "==> Compiling SSE2 kernels via SIMDe (-msimd128)"
for src in "${SIMD_SRCS[@]}"; do
  obj="${OBJ_DIR}/${src%.c}.o"
  echo "    ${src}"
  "${CC}" "${SIMD_CFLAGS[@]}" -c "${MINIMAP2_SRC}/${src}" -o "${obj}"
  LINK_OBJS+=("${obj}")
done

# ── Step 6: Link minimap2.wasm ───────────────────────────────────────────────
# -lwasi-emulated-process-clocks supplies the getrusage emulation enabled for
# misc.c above.

echo "==> Linking minimap2.wasm"
mkdir -p "${OUT_DIR}"
WASM_RAW="${OUT_DIR}/minimap2.raw.wasm"
WASM_FINAL="${OUT_DIR}/minimap2.wasm"

"${CC}" --sysroot="${SYSROOT}" \
  "${LINK_OBJS[@]}" \
  -L"${ZLIB_INSTALL}/lib" -lz \
  -lwasi-emulated-process-clocks \
  -lm \
  -o "${WASM_RAW}"

# ── Step 7: Optimize + strip ─────────────────────────────────────────────────

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz --enable-simd "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug --enable-simd "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> minimap2.wasm: ${FINAL_SIZE} bytes"

# ── Step 8: Smoke test against the manifest golden ───────────────────────────
# Models the Foundation WASI runtime's two-input wiring exactly:
#   - the `reference` param is materialized as a file inside the preopened dir
#     (--dir) and its path is substituted for the {reference} placeholder in
#     argsTemplate;
#   - the `query` (stdinParam) is piped to real fd 0, with minimap2's "-" token
#     telling it to read the query from stdin.
# This is the precise invocation the kit manifest declares:
#   argv = [-x, map-ont, -t, 1, <reference-file>, -], query on stdin.
# Note: no leading tool-name token — minimap2 is a single-program (non-multiplexed)
# wasi kit, so guest argv starts right after the module (argv[0]=module).

SMOKE_DIR="${BUILD_DIR}/smoke"
mkdir -p "${SMOKE_DIR}"
printf '>chrT\nGATCAAGTTTCAGTTCGATCCTAAGCTTGACTTACCGATATGCATCAGCGATCGATCTTAAGCTGGATTCAACTGGTCAAGCTTACCGATCGATCCTAAGTTT\n' > "${SMOKE_DIR}/reference"
QUERY='>read1
CAGTTCGATCCTAAGCTTGACTTACCGATATGCATCAGCGATCGATCTTAAGCTGG'

echo "==> Running smoke test (map golden) via wasmtime"
ACTUAL="$(printf '%s\n' "${QUERY}" \
  | wasmtime run --dir "${SMOKE_DIR}::/data" "${WASM_FINAL}" \
      -x map-ont -t 1 /data/reference - 2>/dev/null)" || true

echo "--- wasm minimap2 PAF output ---"
printf '%s\n' "${ACTUAL}"
echo "--------------------------------"

EXPECT="$(printf 'read1\t56\t5\t52\t+\tchrT\t103\t15\t62\t47\t47\t10\ttp:A:P\tcm:i:7\ts1:i:47\ts2:i:0\tdv:f:0.0089\trl:i:0')"
if [[ "${ACTUAL}" == "${EXPECT}" ]]; then
  echo "==> SMOKE PASS: PAF matches the manifest golden byte-for-byte"
else
  echo "==> SMOKE FAIL: PAF differs from the captured native golden." >&2
  echo "    expected: ${EXPECT}" >&2
  echo "    actual:   ${ACTUAL}" >&2
  exit 1
fi

echo ""
echo "==> Build complete: ${WASM_FINAL}"
echo "==> Next: copy to kit/minimap2/artifacts/, stamp sha256, flip verified:true"

#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build bedtools.wasm from the bedtools 2.31.1 source tarball using
# wasi-sdk. bedtools is a single self-multiplexing C++ binary: its own main()
# dispatches on argv[1] (`bedtools merge`, `bedtools sort`, …), so there is NO
# generated dispatch.c — we compile bedtools' own tree and link its bin/bedtools.
#
# Designed to run inside the Docker container defined by build/bedtools/Dockerfile,
# but also usable on a host with wasi-sdk >= 25, wasmtime, binaryen (wasm-opt),
# Node, and python3 installed.
#
# WASM EXCEPTIONS: bedtools is exception-heavy C++ that THROWS AND CATCHES on
# normal error paths, so the binary is built with the WASM exception-handling
# proposal (-fwasm-exceptions, like kit/z3). It must be run under a runtime with
# WASM-EH enabled (`wasmtime run -W exceptions=y`; Foundation's wasi runtime, which
# already hosts z3, enables it).
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot    (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory      (default: /tmp/bedtools-build)
#   OUT_DIR       — where bedtools.wasm lands     (default: ./out)
#   BEDTOOLS_SHA  — expected sha256 of the tarball (set below)
#   ZLIB_SHA      — expected sha256 of the zlib tarball (set below)
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Configuration ────────────────────────────────────────────────────────────

BEDTOOLS_VERSION="2.31.1"
BEDTOOLS_URL="https://github.com/arq5x/bedtools2/releases/download/v${BEDTOOLS_VERSION}/bedtools-${BEDTOOLS_VERSION}.tar.gz"
# Pinned sha256 of the official 2.31.1 release source tarball.
BEDTOOLS_SHA="${BEDTOOLS_SHA:-fc7e660c2279b1e008b80aca0165a4a157daf4994d08a533ee925d73ce732b97}"

# zlib is required by bedtools (gzstream) + bundled htslib (bgzf). wasi-sdk does
# not ship zlib, so we cross-compile it from source.
ZLIB_VERSION="1.3.1"
ZLIB_URL="https://github.com/madler/zlib/releases/download/v${ZLIB_VERSION}/zlib-${ZLIB_VERSION}.tar.gz"
ZLIB_SHA="${ZLIB_SHA:-9a93b2b7dfdac77ceba5a558a580e74667dd6fede4585b91eefb60f03b72df23}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/bedtools-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

CC="${WASI_SDK}/bin/clang"
CXX="${WASI_SDK}/bin/clang++"
AR="${WASI_SDK}/bin/llvm-ar"
RANLIB="${WASI_SDK}/bin/llvm-ranlib"
SYSROOT="${WASI_SDK}/share/wasi-sysroot"
TARGET="wasm32-wasi"

export PATH="${WASI_SDK}/bin:${PATH}"

# ── WASM exception-handling flags (kit/z3 recipe) ─────────────────────────────
# bedtools throws/catches on normal control-flow paths; wasi-sdk's libc++abi
# supports the WASM EH proposal via -fwasm-exceptions. LTO must stay OFF (EH+LTO
# is a known wasi-sdk bug). -lunwind supplies the unwinder at link.
EH_CFLAGS="-fwasm-exceptions -mllvm -wasm-use-legacy-eh=false"

# ── WASI POSIX-emulation features ────────────────────────────────────────────
# bedtools + bundled htslib 1.9 reference threads (thread_pool), signals, and mmap
# at compile time. Each _WASI_EMULATED_* macro unlocks stub declarations in the
# wasi-sysroot headers; the matching -lwasi-emulated-* archive supplies the stub
# implementations at link. Single-threaded at runtime — these paths are
# compiled-but-unused. A force-included shim declares pthread_kill/popen/pclose
# (the symbols the emulated headers omit); their no-op defs live in
# wasi_posix_shim.c and are linked into the final binary.
WASI_SHIM_INCLUDE="-include ${SCRIPT_DIR}/wasi_posix_shim.h"
WASI_EMU_DEFS="-D_WASI_EMULATED_PTHREAD -D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_MMAN -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_GETPID ${WASI_SHIM_INCLUDE}"
# NB: no -lwasi-emulated-pthread — wasi-sdk 33 folds single-threaded pthread stubs
# into libc itself (the separate emulated-pthread archive was removed). The other
# emulated archives still exist under lib/wasm32-wasi/. libunwind (for -lunwind) is
# auto-located by the -fwasm-exceptions driver flag from lib/wasm32-wasi/eh/.
WASI_EMU_LIBS="-lwasi-emulated-signal -lwasi-emulated-mman -lwasi-emulated-process-clocks -lwasi-emulated-getpid"

# ── Step 1: Fetch + verify tarballs ───────────────────────────────────────────

mkdir -p "${BUILD_DIR}"

BEDTOOLS_TARBALL="${BUILD_DIR}/bedtools-${BEDTOOLS_VERSION}.tar.gz"
if [[ ! -f "${BEDTOOLS_TARBALL}" ]]; then
  echo "==> Downloading bedtools-${BEDTOOLS_VERSION}.tar.gz"
  curl -fSL -o "${BEDTOOLS_TARBALL}" "${BEDTOOLS_URL}"
fi
echo "==> Verifying bedtools tarball sha256"
ACTUAL_SHA="$(sha256sum "${BEDTOOLS_TARBALL}" | awk '{print $1}')"
if [[ "${ACTUAL_SHA}" != "${BEDTOOLS_SHA}" ]]; then
  echo "ERROR: bedtools sha256 mismatch" >&2
  echo "  expected: ${BEDTOOLS_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  exit 1
fi

ZLIB_TARBALL="${BUILD_DIR}/zlib-${ZLIB_VERSION}.tar.gz"
if [[ ! -f "${ZLIB_TARBALL}" ]]; then
  echo "==> Downloading zlib-${ZLIB_VERSION}.tar.gz"
  curl -fSL -o "${ZLIB_TARBALL}" "${ZLIB_URL}"
fi
echo "==> Verifying zlib tarball sha256"
ACTUAL_SHA="$(sha256sum "${ZLIB_TARBALL}" | awk '{print $1}')"
if [[ "${ACTUAL_SHA}" != "${ZLIB_SHA}" ]]; then
  echo "ERROR: zlib sha256 mismatch" >&2
  echo "  expected: ${ZLIB_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  exit 1
fi

# ── Step 2: Extract ────────────────────────────────────────────────────────────
# The bedtools tarball extracts to a top-level "bedtools2/" directory.

BEDTOOLS_SRC="${BUILD_DIR}/bedtools2"
ZLIB_SRC="${BUILD_DIR}/zlib-${ZLIB_VERSION}"

if [[ ! -d "${BEDTOOLS_SRC}" ]]; then
  echo "==> Extracting bedtools tarball"
  tar -xzf "${BEDTOOLS_TARBALL}" -C "${BUILD_DIR}"
fi
if [[ ! -d "${ZLIB_SRC}" ]]; then
  echo "==> Extracting zlib tarball"
  tar -xzf "${ZLIB_TARBALL}" -C "${BUILD_DIR}"
fi

# ── Step 3: Cross-compile zlib for WASI ───────────────────────────────────────

ZLIB_INSTALL="${BUILD_DIR}/zlib-install"
if [[ ! -f "${ZLIB_INSTALL}/lib/libz.a" ]]; then
  echo "==> Building zlib for WASI"
  pushd "${ZLIB_SRC}" > /dev/null
  CC="${CC}" \
  CFLAGS="--target=${TARGET} --sysroot=${SYSROOT} -O2" \
  AR="${AR}" \
  RANLIB="${RANLIB}" \
  ./configure --static --prefix="${ZLIB_INSTALL}"
  make -j"$(nproc)"
  make install
  popd > /dev/null
fi

# ── Step 4: Pre-place the WASI htslib config.h + version header ─────────────────
# bedtools' bundled htslib 1.9 has no configure; its Makefile auto-generates a
# config.h that hard-enables bz2/lzma. Copy our WASI config.h in first so that
# rule is skipped (zlib-only, no bz2/lzma/libcurl). See htslib-config.h.

HTSLIB_DIR="${BEDTOOLS_SRC}/src/utils/htslib"

echo "==> Installing WASI htslib config.h"
cp "${SCRIPT_DIR}/htslib-config.h" "${HTSLIB_DIR}/config.h"

# Strip htslib's network backend. htslib 1.9 has no configure, so its Makefile
# unconditionally compiles knetfile.o + hfile_net.o, both of which #include
# <netdb.h> (sockets) — absent from the wasi-sysroot. bedtools' local-file /
# stdin surface never opens a network URL, so we drop both objects from
# LIBHTS_OBJS and disable the single hfile.c registration that references them.
# (hfile_libcurl/gcs/s3 are plugin-only and already absent from the default list.)
echo "==> Stripping htslib network backend (no sockets under WASI)"
sed -i -e '/^[[:space:]]*knetfile\.o[[:space:]]*\\$/d' \
       -e '/^[[:space:]]*hfile_net\.o[[:space:]]*\\$/d' \
       "${HTSLIB_DIR}/Makefile"
sed -i 's@init_add_plugin(NULL, hfile_plugin_init_net, "knetfile");@/* net plugin disabled for WASI (no sockets) */@' \
       "${HTSLIB_DIR}/hfile.c"

# bedtools' `autoversion` target shells out to git to stamp version_git.h. The
# release tarball ships version_release.txt (v2.31.1); pre-write version_git.h so
# the build never needs git.
VERSION_GIT_H="${BEDTOOLS_SRC}/src/utils/version/version_git.h"
echo "==> Writing version_git.h (v${BEDTOOLS_VERSION})"
printf '#define VERSION_GIT "v%s"\n' "${BEDTOOLS_VERSION}" > "${VERSION_GIT_H}"

# ── Step 5: Build bin/bedtools with wasi-sdk ───────────────────────────────────
# bedtools' Makefile is overridable: CXXFLAGS/CPPFLAGS/LDFLAGS are appended AFTER
# bedtools' own (BT_*) flags, so ours win. BT_LIBS is hardcoded to
# `-lz -lm -lbz2 -llzma -lpthread`; we override it on the command line to drop the
# unavailable bz2/lzma/pthread (pthread is supplied via the wasi-emulated libs in
# LDFLAGS). We build the `bin/bedtools` target DIRECTLY (not `all`) to skip the
# python makeBashScripts.py step and the test/htsutil helper.
#
# C files (bundled htslib + BamTools) compile with CC + CFLAGS (no EH — C has no
# exceptions). C++ files (bedtools tree) compile with CXX + CXXFLAGS (EH on). The
# final link uses CXX with LDFLAGS carrying -fwasm-exceptions -lunwind.

echo "==> Building bin/bedtools (wasi-sdk, WASM exceptions, single-threaded)"

COMMON_INC="-I${ZLIB_INSTALL}/include"
COMMON_BASE="--target=${TARGET} --sysroot=${SYSROOT} -O2 ${WASI_EMU_DEFS} ${COMMON_INC}"

# Compile the POSIX shim to an object and inject it into the final link (appended
# to BT_LIBS below). Force-including the shim HEADER gives every TU the
# declarations; this object supplies the (weak) DEFINITIONS — chiefly system(),
# which the `regresstest` subcommand references and wasi-libc does not provide.
echo "==> Compiling wasi_posix_shim.o"
SHIM_OBJ="${BUILD_DIR}/wasi_posix_shim.o"
"${CC}" --target=${TARGET} --sysroot=${SYSROOT} -O2 \
  -c "${SCRIPT_DIR}/wasi_posix_shim.c" -o "${SHIM_OBJ}"

make -C "${BEDTOOLS_SRC}" -j"$(nproc)" VERBOSE=1 \
  CC="${CC}" \
  CXX="${CXX}" \
  AR="${AR}" \
  RANLIB="${RANLIB}" \
  CFLAGS="${COMMON_BASE}" \
  CXXFLAGS="${COMMON_BASE} ${EH_CFLAGS}" \
  CPPFLAGS="${COMMON_INC}" \
  LDFLAGS="--target=${TARGET} --sysroot=${SYSROOT} -fwasm-exceptions -L${ZLIB_INSTALL}/lib ${WASI_EMU_LIBS} -lunwind" \
  BT_LIBS="-lz -lm ${SHIM_OBJ}" \
  PYTHON="python3" \
  bin/bedtools \
  > "${BUILD_DIR}/make-bedtools.log" 2>&1 || {
    echo "ERROR: bedtools build failed — tail of make-bedtools.log:" >&2
    tail -40 "${BUILD_DIR}/make-bedtools.log" >&2
    exit 1
  }

BEDTOOLS_BIN="${BEDTOOLS_SRC}/bin/bedtools"
if [[ ! -f "${BEDTOOLS_BIN}" ]]; then
  echo "ERROR: bin/bedtools not produced" >&2
  exit 1
fi
echo "==> Built: ${BEDTOOLS_BIN}"

# ── Step 6: Optimize + strip ───────────────────────────────────────────────────
# wasm-opt must keep the exception-handling feature enabled (the binary uses it).

echo "==> Optimizing with wasm-opt -Oz (exception-handling enabled)"
mkdir -p "${OUT_DIR}"
WASM_FINAL="${OUT_DIR}/bedtools.wasm"

wasm-opt -Oz --enable-exception-handling "${BEDTOOLS_BIN}" -o "${WASM_FINAL}"
echo "==> Stripping debug sections"
wasm-opt --strip-debug --enable-exception-handling "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> bedtools.wasm: ${FINAL_SIZE} bytes"

# ── Step 7: Gated smoke test — merge golden ────────────────────────────────────
# Single-input stdin surface (kit verified ops). Two overlapping pre-sorted BED
# intervals piped to `bedtools merge -i -` collapse to one interval [100,250).
# Run under wasmtime with WASM-EH enabled. This is INLINED — it does not read
# kit/bedtools/manifest.json (the kit phase may run separately).

echo "==> Running gated smoke test: merge golden"
BED_GOLDEN="$(printf 'chr1\t100\t200\nchr1\t150\t250\n')"
EXPECT_MERGE="$(printf 'chr1\t100\t250\n')"

ACTUAL_MERGE="$(printf '%s' "${BED_GOLDEN}" \
  | wasmtime run -W exceptions=y "${WASM_FINAL}" merge -i - 2>/dev/null)" || true

if [[ "${ACTUAL_MERGE}" == "${EXPECT_MERGE}" ]]; then
  echo "    PASS: merge golden = chr1 100 250"
else
  echo "    FAIL: merge expected '$(printf '%q' "${EXPECT_MERGE}")', got '$(printf '%q' "${ACTUAL_MERGE}")'" >&2
  exit 1
fi

# ── Step 8: Capture the sort golden (non-gated) for the maintainer ─────────────
echo ""
echo "--- sort (unsorted BED → coordinate-sorted) ---"
SORT_INPUT="$(printf 'chr1\t150\t250\nchr1\t100\t200\n')"
SORT_OUTPUT="$(printf '%s' "${SORT_INPUT}" \
  | wasmtime run -W exceptions=y "${WASM_FINAL}" sort -i - 2>/dev/null)" || true
printf '%s\n' "${SORT_OUTPUT}"

echo ""
echo "==> Build complete: ${WASM_FINAL}"
echo "==> Next steps:"
echo "    1. Copy bedtools.wasm to kit/bedtools/artifacts/"
echo "    2. Stamp sha256 into kit/bedtools/kit.json (artifacts[0].sha256)"
echo "    3. Flip verified:true in kit/bedtools/kit.json + stamp artifacts[0].url"
echo "       (npm run backfill-urls)"
echo "    4. Record the sort golden above in kit/bedtools/manifest.json"
echo "    5. npm run verify && npm run license-gate -- bedtools"
echo "    6. npm run publish-kit -- bedtools@2.31.1 --dry-run"
echo "    7. git tag bedtools@2.31.1 && git push origin bedtools@2.31.1"

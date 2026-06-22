#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build the multiplexed samtools.wasm from samtools 1.21 + htslib
# 1.21 source tarballs. Designed to run inside the Docker container defined by
# build/samtools/Dockerfile, but also usable on a host with wasi-sdk, wasmtime,
# binaryen (wasm-opt), and Node installed.
#
# TWO upstream repos: htslib provides libhts.a + tabix/bgzip/htsfile utilities;
# samtools provides the samtools CLI. Both are co-pinned to 1.21.
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory     (default: /tmp/samtools-build)
#   OUT_DIR       — where samtools.wasm lands   (default: ./out)
#   HTSLIB_SHA    — expected sha256 of the htslib tarball (set below)
#   SAMTOOLS_SHA  — expected sha256 of the samtools tarball (set below)
#
# The single source of truth for the tool list is build/samtools/tools.json.
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/../.."

# ── Configuration ────────────────────────────────────────────────────────────
# Both htslib and samtools MUST be co-pinned to the same release (1.21).
# samtools links against libhts.a and the two repos' version numbers are
# aligned by the upstream project.

HTSLIB_VERSION="1.21"
SAMTOOLS_VERSION="1.21"

HTSLIB_URL="https://github.com/samtools/htslib/releases/download/${HTSLIB_VERSION}/htslib-${HTSLIB_VERSION}.tar.bz2"
SAMTOOLS_URL="https://github.com/samtools/samtools/releases/download/${SAMTOOLS_VERSION}/samtools-${SAMTOOLS_VERSION}.tar.bz2"

# Pinned sha256 of the official 1.21 release tarballs (captured on first download).
HTSLIB_SHA="${HTSLIB_SHA:-84b510e735f4963641f26fd88c8abdee81ff4cb62168310ae716636aac0f1823}"
SAMTOOLS_SHA="${SAMTOOLS_SHA:-05724b083a6b6f0305fcae5243a056cc36cf826309c3cb9347a6b89ee3fc5ada}"

# zlib is required by htslib for bgzf/BAM/CRAM compression.
ZLIB_VERSION="1.3.1"
ZLIB_URL="https://github.com/madler/zlib/releases/download/v${ZLIB_VERSION}/zlib-${ZLIB_VERSION}.tar.gz"
ZLIB_SHA="${ZLIB_SHA:-9a93b2b7dfdac77ceba5a558a580e74667dd6fede4585b91eefb60f03b72df23}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/samtools-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

CC="${WASI_SDK}/bin/clang"
AR="${WASI_SDK}/bin/llvm-ar"
RANLIB="${WASI_SDK}/bin/llvm-ranlib"
NM="${WASI_SDK}/bin/llvm-nm"
SYSROOT="${WASI_SDK}/share/wasi-sysroot"

# wasi-sdk bin holds the cross tools (ar, ranlib, nm, wasm-ld) under names
# configure probes for — put it on PATH so detection resolves.
export PATH="${WASI_SDK}/bin:${PATH}"

# ── WASI POSIX-emulation features ────────────────────────────────────────────
# wasm/WASI lacks several POSIX facilities htslib + samtools reference at compile
# time (threads in bgzf.c/thread_pool.c; signals in sam.c; mmap in faidx.c;
# clock()/getpid() in hts_os.c and samtools). Each _WASI_EMULATED_* macro unlocks
# stub declarations in the wasi-sysroot headers (which otherwise hard-#error), and
# the matching -lwasi-emulated-* archive supplies the (always-failing / minimal)
# stub implementations at the final link. These paths are compiled-but-unused at
# runtime: samtools runs single-threaded (no -@), installs no signal handlers, and
# the count-reverse golden touches none of them. Defines and libs are paired —
# enabling a define without its archive would break the final link.
# Force-include a shim declaring pthread_kill (the one threading symbol the
# emulated <pthread.h> omits); its no-op definition (wasi_posix_shim.c) is
# linked into the final binary. See wasi_posix_shim.h for rationale.
WASI_SHIM_INCLUDE="-include ${SCRIPT_DIR}/wasi_posix_shim.h"
WASI_EMU_CFLAGS="-D_WASI_EMULATED_PTHREAD -D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_MMAN -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_GETPID ${WASI_SHIM_INCLUDE}"
WASI_EMU_DEFS=(-D_WASI_EMULATED_PTHREAD -D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_MMAN -D_WASI_EMULATED_PROCESS_CLOCKS -D_WASI_EMULATED_GETPID -include "${SCRIPT_DIR}/wasi_posix_shim.h")
WASI_EMU_LIBS=(-lwasi-emulated-pthread -lwasi-emulated-signal -lwasi-emulated-mman -lwasi-emulated-process-clocks -lwasi-emulated-getpid)

# ── Step 0: Read tools.json ──────────────────────────────────────────────────

TOOLS_JSON="${SCRIPT_DIR}/tools.json"
if [[ ! -f "${TOOLS_JSON}" ]]; then
  echo "ERROR: tools.json not found at ${TOOLS_JSON}" >&2
  exit 1
fi

# Read tool names and sources into arrays
TOOL_NAMES=()
TOOL_SOURCES=()
while IFS= read -r name; do
  TOOL_NAMES+=("${name}")
done < <(node -e "JSON.parse(require('fs').readFileSync('${TOOLS_JSON}','utf8')).forEach(t=>console.log(t.name))")
while IFS= read -r src; do
  TOOL_SOURCES+=("${src}")
done < <(node -e "JSON.parse(require('fs').readFileSync('${TOOLS_JSON}','utf8')).forEach(t=>console.log(t.source))")

echo "==> ${#TOOL_NAMES[@]} tools loaded from tools.json"

# ── Step 1: Fetch + verify tarballs ─────────────────────────────────────────

mkdir -p "${BUILD_DIR}"

# -- htslib --
HTSLIB_TARBALL="${BUILD_DIR}/htslib-${HTSLIB_VERSION}.tar.bz2"
if [[ ! -f "${HTSLIB_TARBALL}" ]]; then
  echo "==> Downloading htslib-${HTSLIB_VERSION}.tar.bz2"
  curl -fSL -o "${HTSLIB_TARBALL}" "${HTSLIB_URL}"
fi
echo "==> Verifying htslib tarball sha256"
ACTUAL_SHA="$(sha256sum "${HTSLIB_TARBALL}" | awk '{print $1}')"
if [[ "${ACTUAL_SHA}" != "${HTSLIB_SHA}" ]]; then
  echo "ERROR: htslib sha256 mismatch" >&2
  echo "  expected: ${HTSLIB_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  exit 1
fi

# -- samtools --
SAMTOOLS_TARBALL="${BUILD_DIR}/samtools-${SAMTOOLS_VERSION}.tar.bz2"
if [[ ! -f "${SAMTOOLS_TARBALL}" ]]; then
  echo "==> Downloading samtools-${SAMTOOLS_VERSION}.tar.bz2"
  curl -fSL -o "${SAMTOOLS_TARBALL}" "${SAMTOOLS_URL}"
fi
echo "==> Verifying samtools tarball sha256"
ACTUAL_SHA="$(sha256sum "${SAMTOOLS_TARBALL}" | awk '{print $1}')"
if [[ "${ACTUAL_SHA}" != "${SAMTOOLS_SHA}" ]]; then
  echo "ERROR: samtools sha256 mismatch" >&2
  echo "  expected: ${SAMTOOLS_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  exit 1
fi

# -- zlib (htslib dependency) --
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

# ── Step 2: Extract ─────────────────────────────────────────────────────────

HTSLIB_SRC="${BUILD_DIR}/htslib-${HTSLIB_VERSION}"
SAMTOOLS_SRC="${BUILD_DIR}/samtools-${SAMTOOLS_VERSION}"
ZLIB_SRC="${BUILD_DIR}/zlib-${ZLIB_VERSION}"

if [[ ! -d "${HTSLIB_SRC}" ]]; then
  echo "==> Extracting htslib tarball"
  tar -xjf "${HTSLIB_TARBALL}" -C "${BUILD_DIR}"
fi
if [[ ! -d "${SAMTOOLS_SRC}" ]]; then
  echo "==> Extracting samtools tarball"
  tar -xjf "${SAMTOOLS_TARBALL}" -C "${BUILD_DIR}"
fi
if [[ ! -d "${ZLIB_SRC}" ]]; then
  echo "==> Extracting zlib tarball"
  tar -xzf "${ZLIB_TARBALL}" -C "${BUILD_DIR}"
fi

# ── Step 3: Cross-compile zlib for WASI ─────────────────────────────────────
# htslib requires zlib for bgzf/BAM/CRAM compression. wasi-sdk does not ship
# zlib, so we cross-compile it from source.

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

# ── Step 4: Configure + build htslib (libhts.a) ────────────────────────────
# Single-threaded: no pthreads, no libcurl, no plugins, no cloud (GCS/S3).
# Disable bz2/lzma/libdeflate (unavailable in WASI; zlib suffices for BAM).
# CRAM support is KEPT (user decision 1A) — the cram/ subdirectory carries a
# different sub-license, documented in the kit's provenance.buildNote.

echo "==> Configuring htslib with wasi-sdk (single-threaded, zlib-only)"
pushd "${HTSLIB_SRC}" > /dev/null

export CC AR RANLIB NM
export CFLAGS="--sysroot=${SYSROOT} -O2 ${WASI_EMU_CFLAGS} -I${ZLIB_INSTALL}/include"
export LDFLAGS="-L${ZLIB_INSTALL}/lib"

./configure \
  --host=wasm32-wasi \
  --enable-static \
  --disable-shared \
  --disable-bz2 \
  --disable-lzma \
  --without-libdeflate \
  --disable-libcurl \
  --disable-plugins \
  --disable-gcs \
  --disable-s3 \
  ac_cv_func_malloc_0_nonnull=yes \
  ac_cv_func_realloc_0_nonnull=yes \
  > "${BUILD_DIR}/htslib-configure.log" 2>&1

popd > /dev/null

echo "==> Building libhts.a"
make -C "${HTSLIB_SRC}" -j"$(nproc)" lib-static \
  > "${BUILD_DIR}/htslib-make.log" 2>&1

if [[ ! -f "${HTSLIB_SRC}/libhts.a" ]]; then
  echo "ERROR: libhts.a not found after build" >&2
  exit 1
fi
echo "==> Built: ${HTSLIB_SRC}/libhts.a"

# ── Step 5: Configure samtools ──────────────────────────────────────────────
# Configure samtools against the built htslib. This generates config.h and
# the Makefile with the correct include/link paths. We do NOT run the full
# make — the link step would fail because we use our own multiplexed dispatch.

echo "==> Configuring samtools with wasi-sdk"
pushd "${SAMTOOLS_SRC}" > /dev/null

export CFLAGS="--sysroot=${SYSROOT} -O2 ${WASI_EMU_CFLAGS} -I${ZLIB_INSTALL}/include"
export LDFLAGS="-L${ZLIB_INSTALL}/lib"

./configure \
  --host=wasm32-wasi \
  --with-htslib="${HTSLIB_SRC}" \
  --without-curses \
  ac_cv_func_malloc_0_nonnull=yes \
  ac_cv_func_realloc_0_nonnull=yes \
  > "${BUILD_DIR}/samtools-configure.log" 2>&1

popd > /dev/null

# ── Step 6: Build samtools library objects ──────────────────────────────────
# Use make to compile all samtools .o files. The final link step will fail
# (we use our own multiplexed dispatch), but all .o files will be valid WASI
# objects because configure set up the Makefile with wasi-sdk clang.
#
# -k (keep-going): samtools' `all` target also builds its bundled test programs
# (test/test.c etc.), which reference POSIX bits like dup2 that wasm lacks and
# that the binary itself never needs. Without -k, a single test-program compile
# error aborts the parallel build before bamtk.o + the library objects are done.
# -k lets every needed object finish; the test/ objects we don't collect (the
# library-object scan below is maxdepth 1, so test/ is excluded) and the final
# samtools link failing is expected and ignored.

echo "==> Building samtools objects (link + test-program failures expected)"
make -C "${SAMTOOLS_SRC}" -j"$(nproc)" -k \
  > "${BUILD_DIR}/make-samtools.log" 2>&1 || {
  echo "    (link + test-program build failed as expected under WASI — library .o files still valid)"
}

# Verify the key object was produced
if [[ ! -f "${SAMTOOLS_SRC}/bamtk.o" ]]; then
  echo "ERROR: samtools build did not produce bamtk.o" >&2
  exit 1
fi

# Collect samtools library objects (all top-level .o EXCEPT bamtk.o — the entry
# point is recompiled below with -Dmain=samtools_main). maxdepth 1 deliberately
# skips test/ and misc/ helper programs. The one bundled subdirectory object we
# DO need is lz4/lz4.o: samtools statically links its vendored LZ4 for temp-file
# compression (tmp_file.o references LZ4_compress_fast_continue et al.), so it is
# appended explicitly. (libst.a is NOT needed — its members sam_opts.o /
# sam_utils.o / bedidx.o / bam.o are top-level objects already collected here.)
SAMTOOLS_LIB_OBJS=()
while IFS= read -r obj; do
  SAMTOOLS_LIB_OBJS+=("${obj}")
done < <(find "${SAMTOOLS_SRC}" -maxdepth 1 -name '*.o' ! -name 'bamtk.o' -type f)

LZ4_OBJ="${SAMTOOLS_SRC}/lz4/lz4.o"
if [[ -f "${LZ4_OBJ}" ]]; then
  SAMTOOLS_LIB_OBJS+=("${LZ4_OBJ}")
else
  echo "ERROR: bundled lz4/lz4.o not found at ${LZ4_OBJ}" >&2
  exit 1
fi

echo "==> Collected ${#SAMTOOLS_LIB_OBJS[@]} samtools library objects (incl. lz4)"

# ── Step 7: Compile tool entry points (rename main + localize globals) ──────
# Each tool's main() is renamed to <tool>_main via -Dmain=<tool>_main. Then
# two-pass symbol localization (llvm-nm + -D<sym>=<tool>_<sym>) prevents
# global-symbol collisions when linking multiple tools into one binary.
# Source paths in tools.json use a <repo>/<file> convention:
#   "samtools/<file>" → SAMTOOLS_SRC/<file>
#   "htslib/<file>"   → HTSLIB_SRC/<file>
#
# IMPORTANT — localization applies only to the htslib utility tools (bgzip,
# tabix, htsfile). Those are self-contained single files whose generic file-scope
# globals (error, verbose, status, file_type, …) would otherwise collide with the
# samtools library objects we also link. The samtools tool (bamtk.c) is the
# OPPOSITE case: its globals (samtools_version, samtools_feature_string) are the
# samtools program's internal API, *referenced by* the samtools library objects
# (bam_*.o). Renaming them would orphan those references (undefined symbol at
# link). So bamtk.c gets ONLY the -Dmain rename, never global localization.

OBJ_DIR="${BUILD_DIR}/objs"
mkdir -p "${OBJ_DIR}"

# CFLAGS per source repo
SAMTOOLS_BIN_CFLAGS=(
  --sysroot="${SYSROOT}" -O2
  -DHAVE_CONFIG_H
  "${WASI_EMU_DEFS[@]}"
  -I"${SAMTOOLS_SRC}"
  -I"${HTSLIB_SRC}"
  -I"${ZLIB_INSTALL}/include"
)
HTSLIB_BIN_CFLAGS=(
  --sysroot="${SYSROOT}" -O2
  -DHAVE_CONFIG_H
  "${WASI_EMU_DEFS[@]}"
  -I"${HTSLIB_SRC}"
  -I"${ZLIB_INSTALL}/include"
)

echo "==> Compiling tool entry points (rename main + localize file-scope globals)"
for i in "${!TOOL_NAMES[@]}"; do
  name="${TOOL_NAMES[$i]}"
  src="${TOOL_SOURCES[$i]}"
  echo "    ${name} (${src})"

  # Resolve source path and choose CFLAGS based on repo prefix. `localize`
  # gates global-symbol renaming: off for the samtools program file (bamtk.c),
  # on for the standalone htslib utilities. See the Step 7 note above.
  case "${src}" in
    samtools/*)
      full_src="${SAMTOOLS_SRC}/${src#samtools/}"
      TOOL_CFLAGS=("${SAMTOOLS_BIN_CFLAGS[@]}")
      localize=false
      ;;
    htslib/*)
      full_src="${HTSLIB_SRC}/${src#htslib/}"
      TOOL_CFLAGS=("${HTSLIB_BIN_CFLAGS[@]}")
      localize=true
      ;;
    *)
      echo "ERROR: unknown source prefix in '${src}'" >&2
      exit 1
      ;;
  esac

  # Pass 1 — compile to discover this TU's defined global symbols.
  "${CC}" "${TOOL_CFLAGS[@]}" "-Dmain=${name}_main" \
    -c "${full_src}" -o "${OBJ_DIR}/${name}.o"

  # samtools program file (bamtk.c): only -Dmain, keep shared globals intact.
  [[ "${localize}" != "true" ]] && continue

  # Build a -D rename per defined global except the entry point.
  RENAMES=()
  while IFS= read -r sym; do
    [[ -z "${sym}" || "${sym}" == "${name}_main" ]] && continue
    RENAMES+=("-D${sym}=${name}_${sym}")
  done < <("${NM}" -g --defined-only "${OBJ_DIR}/${name}.o" \
             | awk '{print $NF}')

  # Pass 2 — recompile with the entry-point rename + per-tool symbol prefixes.
  if [[ ${#RENAMES[@]} -gt 0 ]]; then
    "${CC}" "${TOOL_CFLAGS[@]}" "-Dmain=${name}_main" "${RENAMES[@]}" \
      -c "${full_src}" -o "${OBJ_DIR}/${name}.o"
  fi
done

# ── Step 8: Generate + compile dispatch.c ────────────────────────────────────

echo "==> Generating dispatch.c"
node "${SCRIPT_DIR}/gen-dispatch.mjs"
DISPATCH_C="${SCRIPT_DIR}/dispatch.c"

echo "==> Compiling dispatch.c"
"${CC}" --sysroot="${SYSROOT}" -O2 \
  -c "${DISPATCH_C}" \
  -o "${OBJ_DIR}/dispatch.o"

# Compile the pthread_kill no-op stub (definition for the force-included decl).
echo "==> Compiling wasi_posix_shim.c"
"${CC}" --sysroot="${SYSROOT}" -O2 \
  -c "${SCRIPT_DIR}/wasi_posix_shim.c" \
  -o "${OBJ_DIR}/wasi_posix_shim.o"

# ── Step 9: Link into samtools.wasm ─────────────────────────────────────────

echo "==> Linking samtools.wasm"
mkdir -p "${OUT_DIR}"
WASM_RAW="${OUT_DIR}/samtools.raw.wasm"
WASM_FINAL="${OUT_DIR}/samtools.wasm"

LINK_OBJS=("${OBJ_DIR}/dispatch.o" "${OBJ_DIR}/wasi_posix_shim.o")
for name in "${TOOL_NAMES[@]}"; do
  LINK_OBJS+=("${OBJ_DIR}/${name}.o")
done

"${CC}" --sysroot="${SYSROOT}" \
  "${LINK_OBJS[@]}" \
  "${SAMTOOLS_LIB_OBJS[@]}" \
  -L"${HTSLIB_SRC}" -lhts \
  -L"${ZLIB_INSTALL}/lib" -lz \
  "${WASI_EMU_LIBS[@]}" \
  -lm \
  -o "${WASM_RAW}"

# ── Step 10: Optimize + strip ────────────────────────────────────────────────

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> samtools.wasm: ${FINAL_SIZE} bytes"

# ── Step 11: Gated smoke test — count-reverse golden ────────────────────────
# This is the single-source golden from the spec (TR-009). The fixed SAM
# payload has 2 mapped reads: one forward (FLAG 0) and one reverse (FLAG 16).
# `samtools view -c -f 16 -` counts reverse-strand records → exactly 1.
# This test is INLINED — it does NOT read kit/samtools/manifest.json (the kit
# phase runs in parallel and that file may not exist at build time).

echo "==> Running gated smoke test: count-reverse golden"

SAM_GOLDEN="$(printf '@HD\tVN:1.6\tSO:coordinate\n@SQ\tSN:ref\tLN:45\nr1\t0\tref\t1\t60\t4M\t*\t0\t0\tACGT\t*\nr2\t16\tref\t5\t60\t4M\t*\t0\t0\tTTGA\t*\n')"

ACTUAL="$(printf '%s' "${SAM_GOLDEN}" \
  | wasmtime run "${WASM_FINAL}" samtools view -c -f 16 - 2>/dev/null)" || true

if [[ "${ACTUAL}" = "1" ]]; then
  echo "    PASS: count-reverse = 1"
else
  echo "    FAIL: count-reverse expected '1', got '${ACTUAL}'" >&2
  exit 1
fi

# ── Step 12: Capture non-gated goldens for maintainer ────────────────────────
# These outputs are NOT asserted — they are printed so the maintainer can
# record them in kit/samtools/manifest.json as the captured golden expects.
# Their exact values depend on htslib output formatting at version 1.21.

echo ""
echo "==> Capturing non-gated golden outputs (record these in manifest.json):"

echo ""
echo "--- view (reverse-strand SAM records) ---"
VIEW_OUTPUT="$(printf '%s' "${SAM_GOLDEN}" \
  | wasmtime run "${WASM_FINAL}" samtools view -f 16 - 2>/dev/null)" || true
printf '%s\n' "${VIEW_OUTPUT}"

echo ""
echo "--- bgzip (round-trip compress/decompress) ---"
BGZIP_INPUT="hello bgzip"
BGZIP_OUTPUT="$(printf '%s' "${BGZIP_INPUT}" \
  | wasmtime run "${WASM_FINAL}" bgzip -c - 2>/dev/null \
  | wasmtime run "${WASM_FINAL}" bgzip -d -c - 2>/dev/null)" || true
printf '%s\n' "${BGZIP_OUTPUT}"

echo ""
echo "--- htsfile (identify file format on stdin) ---"
HTSFILE_OUTPUT="$(printf '%s' "${SAM_GOLDEN}" \
  | wasmtime run "${WASM_FINAL}" htsfile - 2>/dev/null)" || true
printf '%s\n' "${HTSFILE_OUTPUT}"

echo ""
echo "==> Build complete: ${WASM_FINAL}"
echo "==> Next steps:"
echo "    1. Copy samtools.wasm to kit/samtools/artifacts/"
echo "    2. Stamp sha256 into kit/samtools/kit.json"
echo "    3. Flip verified:true in kit/samtools/kit.json"
echo "    4. Record the captured golden outputs above in manifest.json"
echo "    5. npm run verify && npm run license-gate -- samtools"
echo "    6. npm run publish-kit -- samtools@1.21 --dry-run"
echo "    7. git tag samtools@1.21 && git push origin samtools@1.21"

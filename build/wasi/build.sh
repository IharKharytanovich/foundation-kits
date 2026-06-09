#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build the multiplexed viennarna.wasm from the ViennaRNA 2.7.2
# release tarball. Designed to run inside the Docker container defined by
# build/wasi/Dockerfile, but also usable on a host with wasi-sdk, wasmtime,
# binaryen (wasm-opt), and Node installed.
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory     (default: /tmp/vrna-build)
#   OUT_DIR       — where viennarna.wasm lands  (default: ./out)
#   TARBALL_SHA   — expected sha256 of the tarball (set below)
#
# The single source of truth for the tool list is build/wasi/tools.json.
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/../.."

# ── Configuration ────────────────────────────────────────────────────────────

TARBALL_VERSION="2.7.2"
TARBALL_URL="https://www.tbi.univie.ac.at/RNA/download/sourcecode/2_7_x/ViennaRNA-${TARBALL_VERSION}.tar.gz"
# Set this to the known sha256 of the release tarball before building.
TARBALL_SHA="${TARBALL_SHA:-PLACEHOLDER_SET_BEFORE_BUILD}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/vrna-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

CC="${WASI_SDK}/bin/clang"
CXX="${WASI_SDK}/bin/clang++"
AR="${WASI_SDK}/bin/llvm-ar"
RANLIB="${WASI_SDK}/bin/llvm-ranlib"
NM="${WASI_SDK}/bin/llvm-nm"
LD="${WASI_SDK}/bin/wasm-ld"
SYSROOT="${WASI_SDK}/share/wasi-sysroot"

# wasi-sdk bin holds the cross tools (ar, ranlib, nm, wasm-ld) under names
# configure probes for — put it on PATH so libtool's ld/ar detection resolves.
export PATH="${WASI_SDK}/bin:${PATH}"

CONFIGURE_FLAGS=(
  --host=wasm32-wasi
  --disable-openmp
  --disable-pthreads
  --without-perl
  --without-python
  --without-swig
  --without-gsl
  --disable-mpfr
  --without-svm
  --without-rnaxplorer
  --without-forester
  --without-kinfold
  --disable-naview
)

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

# ── Step 1: Fetch + verify tarball ───────────────────────────────────────────

mkdir -p "${BUILD_DIR}"
TARBALL="${BUILD_DIR}/ViennaRNA-${TARBALL_VERSION}.tar.gz"

if [[ ! -f "${TARBALL}" ]]; then
  echo "==> Downloading ViennaRNA-${TARBALL_VERSION}.tar.gz"
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

SRC_DIR="${BUILD_DIR}/ViennaRNA-${TARBALL_VERSION}"
if [[ ! -d "${SRC_DIR}" ]]; then
  echo "==> Extracting tarball"
  tar -xzf "${TARBALL}" -C "${BUILD_DIR}"
fi

# ── Step 2.5: Neutralize the bundled dlib (threadless-WASI port) ──────────────
# ViennaRNA bundles dlib-20.0 solely to power vrna_equilibrium_conc() — the
# concentration-dependent equilibrium solver reached only via RNAmultifold's /
# RNAcofold's --concentrations path. dlib hard-assumes a hosted C++11 with
# threads (std::future / std::thread / std::packaged_task) plus its own
# pthread-backed thread_pool and OS sockets/signals — none of which exist on the
# single-threaded WASI target (and the factory forbids wasm32-wasi-threads).
#
# wrap_dlib.cpp is the SOLE dlib consumer in the tree, exposing exactly one
# C-ABI symbol: vrna_equilibrium_conc(). No manifest golden exercises the
# concentration solver (cofold/multifold goldens emit plain MFE structures), so
# we drop dlib from the build entirely:
#   1. Replace wrap_dlib.cpp with a stub providing vrna_equilibrium_conc() that
#      returns NULL and warns once on stderr (the unsupported-feature contract).
#   2. Empty dlib's monolithic all/source.cpp so no dlib bytes are compiled.
# Result: all 25 tools build; only the (untested, optional) --concentrations
# numeric output is unavailable on WASI. Idempotent (stub carries a marker).
WRAP_DLIB="${SRC_DIR}/src/ViennaRNA/wrap_dlib.cpp"
DLIB_SOURCE="${SRC_DIR}/src/dlib-20.0/dlib/all/source.cpp"
if [[ ! -f "${WRAP_DLIB}" || ! -f "${DLIB_SOURCE}" ]]; then
  echo "ERROR: expected dlib files missing (wrap_dlib.cpp / all/source.cpp) — upstream layout changed." >&2
  exit 1
fi
if ! grep -q 'VRNA_WASI_DLIB_STUB' "${WRAP_DLIB}"; then
  echo "==> Stubbing dlib out (wrap_dlib.cpp + dlib/all/source.cpp) for threadless WASI"
  cat > "${WRAP_DLIB}" <<'STUB'
/* VRNA_WASI_DLIB_STUB — threadless-WASI build.
 *
 * Upstream wrap_dlib.cpp wraps dlib's trust-region optimizer to solve
 * concentration-dependent equilibrium concentrations. dlib cannot compile for
 * single-threaded WASI (it requires hosted C++11 threads + pthreads). The
 * concentration solver is reached only via the optional --concentrations path,
 * which no kit manifest golden exercises. This stub keeps the C ABI intact so
 * RNAmultifold / RNAcofold link and run their MFE paths; the solver itself is
 * unavailable and reports so once.
 */
#include <stdio.h>
#include <stdlib.h>

#ifdef __cplusplus
extern "C" {
#endif

double *
vrna_equilibrium_conc(const double        *eq_constants,
                      double              *concentration_strands,
                      const unsigned int  **A,
                      size_t              num_strands,
                      size_t              num_complexes)
{
  (void)eq_constants; (void)concentration_strands; (void)A;
  (void)num_strands;  (void)num_complexes;
  static int warned = 0;
  if (!warned) {
    warned = 1;
    fprintf(stderr,
            "ViennaRNA WASI build: concentration-dependent equilibrium "
            "(--concentrations) is not available (dlib excluded).\n");
  }
  return NULL;
}

#ifdef __cplusplus
}
#endif
STUB
  printf '/* VRNA_WASI_DLIB_STUB: dlib excluded from threadless-WASI build */\n' > "${DLIB_SOURCE}"
else
  echo "==> dlib already stubbed"
fi

# ── Step 3: Configure ────────────────────────────────────────────────────────

echo "==> Configuring with wasi-sdk"
pushd "${SRC_DIR}" > /dev/null

export CC CXX AR RANLIB NM LD
export CFLAGS="--sysroot=${SYSROOT} -O2"
export CXXFLAGS="--sysroot=${SYSROOT} -O2"

# Cross-compile cache overrides: configure probes malloc(0)/realloc(0) with a RUN
# test (AC_FUNC_MALLOC/REALLOC) that can't execute under cross-compilation, so it
# assumes a broken allocator and redirects malloc->rpl_malloc / realloc->rpl_realloc
# in config.h — gnulib replacements that don't exist here, breaking the final link.
# wasi-libc's malloc(0) returns a valid unique pointer, so force the "works" result.
./configure "${CONFIGURE_FLAGS[@]}" \
  --prefix="${BUILD_DIR}/install" \
  ac_cv_func_malloc_0_nonnull=yes \
  ac_cv_func_realloc_0_nonnull=yes \
  > "${BUILD_DIR}/configure.log" 2>&1

popd > /dev/null

# ── Step 3.5: Force-enable C11 features (cross-compile correction) ────────────
# ViennaRNA's configure probes for C11 (anonymous unions of unnamed structs +
# _Generic) with a RUN test (ac_fn_c_try_run). Under cross-compilation that test
# can't execute, so configure conservatively sets -DVRNA_DISABLE_C11_FEATURES —
# even though wasi-sdk clang fully supports C11. That breaks the build two ways:
#   * the bin tools (e.g. RNAcofold) use the _Generic sparse-matrix convenience
#     macros (vrna_smx_csr_get/_free), which only exist WITHOUT the disable flag
#     (sparse_mx.h gates them on #ifndef VRNA_DISABLE_C11_FEATURES, no fallback);
#   * the flag also toggles anonymous unions in shared structs, so libRNA and the
#     tools MUST agree on it or struct layouts diverge (silent ABI corruption).
# The define lands only in the generated Makefiles' RNA_CPPFLAGS (not config.h),
# so strip it everywhere to build the whole tree with C11 on, consistently.
if grep -rlq 'DVRNA_DISABLE_C11_FEATURES' "${SRC_DIR}" --include=Makefile 2>/dev/null; then
  echo "==> Re-enabling C11 features (stripping -DVRNA_DISABLE_C11_FEATURES from Makefiles)"
  grep -rlZ 'DVRNA_DISABLE_C11_FEATURES' "${SRC_DIR}" --include=Makefile 2>/dev/null \
    | xargs -0 sed -i 's/-DVRNA_DISABLE_C11_FEATURES //g'
fi

# ── Step 3.6: Fix RNA2Dfold's braceless OpenMP guard (upstream bug) ───────────
# RNA2Dfold.c guards the -j/--numThreads handler with a BRACELESS `if`:
#       if (args_info.numThreads_given)
#     #ifdef _OPENMP
#         omp_set_num_threads(args_info.numThreads_arg);
#     #else
#         vrna_log_error("... OpenMP ...");
#         exit(EXIT_FAILURE);   <- second statement, NOT under the if
#     #endif
# In a NON-OpenMP build (our threadless WASI target) the preprocessor drops the
# omp branch, leaving two statements under a braceless if — so exit(EXIT_FAILURE)
# runs UNCONDITIONALLY at startup. RNA2Dfold then dies before reading any input
# (silently: logging is compiled out), producing empty output + exit 1. Brace the
# body so exit fires only when -j is actually passed. RNApvmin.c has the same
# handler but already braces it; RNA2Dfold is the sole offender. Fail loudly if
# the pattern is gone (upstream fixed it, or a version bump changed the source).
echo "==> Patching RNA2Dfold.c braceless OpenMP guard"
perl -0777 -i -pe '
  my $n = s/if \(args_info\.numThreads_given\)\n(#ifdef _OPENMP\n.*?\n#endif)/if (args_info.numThreads_given) {\n$1\n  }/s;
  die "RNA2Dfold numThreads guard pattern not found — review build/wasi/build.sh Step 3.6\n" unless $n;
' "${SRC_DIR}/src/bin/RNA2Dfold.c"

# ── Step 4: Build libRNA.a + libhelpers.a ────────────────────────────────────

echo "==> Building libRNA"
make -C "${SRC_DIR}/src/ViennaRNA" -j"$(nproc)" libRNA.a \
  > "${BUILD_DIR}/make-libRNA.log" 2>&1

# ── Common compile flags for bin sources (tools, cmdl parsers, helpers) ───────
# Mirrors upstream src/bin Makefile: RNA_CPPFLAGS + -I$(top_srcdir)/src, plus
# -I$(top_builddir) (= SRC_DIR) for the generated config.h. C11 stays ENABLED
# (Step 3.5), so the _Generic convenience macros are available.
OBJ_DIR="${BUILD_DIR}/objs"
mkdir -p "${OBJ_DIR}"
BIN_CFLAGS=(
  --sysroot="${SYSROOT}" -O2
  -DHAVE_CONFIG_H
  -DVRNA_LOG_NO_DEBUG_RNALIB
  -D_WASI_EMULATED_PROCESS_CLOCKS
  -I"${SRC_DIR}/src"
  -I"${SRC_DIR}/src/ViennaRNA"
  -I"${SRC_DIR}/src/bin"
  -I"${SRC_DIR}"
)

# ── Step 4.5: Compile shared bin helpers + per-tool gengetopt parsers ─────────
# Upstream `make -C src/bin` aborts when it tries to LINK the native executables
# (they have no WASI entry), silently leaving most .o unbuilt. Compile exactly
# the objects the multiplexed binary needs, directly:
#   * 5 shared helper TUs (id handling, modified bases, probing data, parallel,
#     gengetopt glue), referenced by many tools — compiled ONCE.
#   * each tool's <tool>_cmdl.c gengetopt parser. Its symbols are per-tool
#     prefixed (e.g. RNAcofold_cmdline_parser), so parsers never collide.
echo "==> Compiling shared bin helpers"
BIN_HELPERS=(gengetopt_helpers input_id_helpers modified_bases_helpers parallel_helpers probing_data_helpers)
HELPER_OBJS=()
for h in "${BIN_HELPERS[@]}"; do
  if [[ -f "${SRC_DIR}/src/bin/${h}.c" ]]; then
    echo "    ${h}"
    "${CC}" "${BIN_CFLAGS[@]}" -c "${SRC_DIR}/src/bin/${h}.c" -o "${OBJ_DIR}/${h}.o"
    HELPER_OBJS+=("${OBJ_DIR}/${h}.o")
  fi
done

echo "==> Compiling per-tool gengetopt parsers"
for name in "${TOOL_NAMES[@]}"; do
  cmdl="${SRC_DIR}/src/bin/${name}_cmdl.c"
  if [[ -f "${cmdl}" ]]; then
    "${CC}" "${BIN_CFLAGS[@]}" -c "${cmdl}" -o "${OBJ_DIR}/${name}_cmdl.o"
    HELPER_OBJS+=("${OBJ_DIR}/${name}_cmdl.o")
  fi
done

# sanitize_input(): referenced by the CLI front-ends (RNAfold etc.) but omitted
# from libRNA.a, and upstream's src/ViennaRNA/io/sanitize.c needs <termios.h>
# (absent on WASI) to detect interactive-terminal escape sequences. On WASI there
# is no controlling terminal, so unnamed CLI arguments are always plain file
# paths — exactly upstream's non-terminal (_WIN32) path, which returns 0. Provide
# that as a tiny stub instead of porting the terminal code.
echo "==> Compiling sanitize_input stub (no terminal on WASI)"
SANITIZE_STUB="${OBJ_DIR}/sanitize_input_stub.c"
cat > "${SANITIZE_STUB}" <<'STUB'
/* WASI has no controlling terminal: CLI inputs are always plain file paths, so
 * sanitize_input reports "not an interactive escape sequence" (0), matching
 * upstream's _WIN32 branch. Avoids <termios.h>, which wasi-libc lacks. */
int
sanitize_input(const char *string)
{
  (void)string;
  return 0;
}
STUB
"${CC}" "${BIN_CFLAGS[@]}" -c "${SANITIZE_STUB}" -o "${OBJ_DIR}/sanitize_input_stub.o"
HELPER_OBJS+=("${OBJ_DIR}/sanitize_input_stub.o")

# ── Step 5: Compile each tool (rename main + localize file-scope globals) ─────
# Each ViennaRNA program is a standalone TU, and many define the SAME non-static
# file-scope helpers (postscript_layout, init_default_options, process_input,
# flush_cstr_callback, unpaired, …) — linked together they collide. WASM objects
# can't be post-processed by llvm-objcopy (it rejects symbol ops on wasm), so we
# localize at the source level: pass 1 compiles the TU and llvm-nm lists its
# DEFINED globals; pass 2 recompiles with -D<sym>=<tool>_<sym> for every one
# except <tool>_main. The only symbol a tool then exports is its entry point —
# no collisions with other tools or libRNA — and every intra-TU reference stays
# consistent (the macro rewrites definition and uses together).
echo "==> Compiling tool sources (rename main + localize file-scope globals)"
for i in "${!TOOL_NAMES[@]}"; do
  name="${TOOL_NAMES[$i]}"
  src="${TOOL_SOURCES[$i]}"
  echo "    ${name}"
  # Pass 1 — compile to discover this TU's defined global symbols.
  "${CC}" "${BIN_CFLAGS[@]}" "-Dmain=${name}_main" \
    -c "${SRC_DIR}/${src}" -o "${OBJ_DIR}/${name}.o"
  # Build a -D rename per defined global except the entry point.
  RENAMES=()
  while IFS= read -r sym; do
    [[ -z "${sym}" || "${sym}" == "${name}_main" ]] && continue
    RENAMES+=("-D${sym}=${name}_${sym}")
  done < <("${WASI_SDK}/bin/llvm-nm" -g --defined-only "${OBJ_DIR}/${name}.o" \
             | awk '{print $NF}')
  # Pass 2 — recompile with the entry-point rename + per-tool symbol prefixes.
  if [[ ${#RENAMES[@]} -gt 0 ]]; then
    "${CC}" "${BIN_CFLAGS[@]}" "-Dmain=${name}_main" "${RENAMES[@]}" \
      -c "${SRC_DIR}/${src}" -o "${OBJ_DIR}/${name}.o"
  fi
done

# ── Step 6: Generate + compile dispatch.c ────────────────────────────────────

echo "==> Generating dispatch.c"
node "${SCRIPT_DIR}/gen-dispatch.mjs"
DISPATCH_C="${SCRIPT_DIR}/dispatch.c"

echo "==> Compiling dispatch.c"
"${CC}" --sysroot="${SYSROOT}" -O2 \
  -c "${DISPATCH_C}" \
  -o "${OBJ_DIR}/dispatch.o"

# ── Step 7: Link into viennarna.wasm ─────────────────────────────────────────

echo "==> Linking viennarna.wasm"
mkdir -p "${OUT_DIR}"
WASM_RAW="${OUT_DIR}/viennarna.raw.wasm"
WASM_FINAL="${OUT_DIR}/viennarna.wasm"

OBJS=("${OBJ_DIR}/dispatch.o")
for name in "${TOOL_NAMES[@]}"; do
  OBJS+=("${OBJ_DIR}/${name}.o")
done

# HELPER_OBJS (shared helpers + per-tool cmdl parsers) were compiled in Step 4.5.
# -lwasi-emulated-process-clocks supplies clock() (used by RNAplex); the matching
# -D_WASI_EMULATED_PROCESS_CLOCKS is set in BIN_CFLAGS.
"${CC}" --sysroot="${SYSROOT}" \
  "${OBJS[@]}" \
  "${HELPER_OBJS[@]}" \
  -L"${SRC_DIR}/src/ViennaRNA/.libs" \
  -lRNA -lm -lwasi-emulated-process-clocks -lwasi-emulated-getpid \
  -o "${WASM_RAW}"

# ── Step 8: Optimize + strip ─────────────────────────────────────────────────

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> viennarna.wasm: ${FINAL_SIZE} bytes"

# ── Step 9: Smoke test via wasmtime + manifest goldens ───────────────────────

MANIFEST="${REPO_ROOT}/kit/viennarna/manifest.json"
if [[ ! -f "${MANIFEST}" ]]; then
  echo "WARNING: manifest.json not found at ${MANIFEST}, skipping smoke test" >&2
  exit 0
fi

echo "==> Running smoke tests against manifest goldens"
PASS=0
FAIL=0

# One record per operation, emitted by a single node pass. golden.expect and the
# stdin payload contain newlines and arbitrary bytes, so every variable-length
# field is base64-encoded — keeping each record on ONE tab-delimited line that
# the shell can read safely (a previous version embedded raw newlines and broke
# on every multi-line golden). Fields: id, tool, argsB64 (argv \n-joined),
# stdinB64 (golden.input[stdinParam]), expectB64 (golden.expect).
# Fields are '|'-delimited, NOT tab: tab is IFS-whitespace, so `read` would
# collapse an empty field (e.g. an op with no argsTemplate) and shift every
# later field left. '|' is non-whitespace and never appears in base64.
while IFS='|' read -r op_id op_tool args_b64 stdin_b64 expect_b64; do
  echo -n "    ${op_id} (${op_tool}): "

  # Decode argv (newline-separated) into an array. The `|| [[ -n "$a" ]]` guard
  # keeps the final element when base64 output has no trailing newline (otherwise
  # `read` returns false at EOF and the last argv token is silently dropped).
  ARGS=()
  while IFS= read -r a || [[ -n "${a}" ]]; do ARGS+=("${a}"); done \
    < <(printf '%s' "${args_b64}" | base64 -d)
  STDIN_DATA="$(printf '%s' "${stdin_b64}" | base64 -d)"
  EXPECT="$(printf '%s' "${expect_b64}" | base64 -d)"

  # Dispatch: argv[1] is the tool name (NO `--`, which wasmtime would forward as
  # argv[1] itself). Line-based tools want a trailing newline on stdin.
  CMD=(wasmtime run "${WASM_FINAL}" "${op_tool}")
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
    // argsTemplate carries {param} placeholders filled from golden.input — the
    // same substitution Foundation performs when it builds the command line.
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
echo "==> Next steps: stamp sha256 into kit.json, flip verified:true, npm run verify"

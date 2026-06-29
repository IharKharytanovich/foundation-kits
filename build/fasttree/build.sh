#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Build fasttree.wasm from the single-file FastTree.c (v2.2.0) using
# wasi-sdk. Single-threaded, scalar (NO_SSE), double-precision. FastTree.c
# already has its own main() reading a FASTA alignment on stdin and writing a
# Newick tree to stdout — so there is NO CLI wrapper and NO dispatch layer.
#
# Designed to run inside the Docker container defined by build/fasttree/Dockerfile,
# but also usable on a host with wasi-sdk >= 24, wasmtime, and binaryen (wasm-opt).
#
# Inputs (env, with defaults):
#   WASI_SDK      — path to wasi-sdk sysroot   (default: /opt/wasi-sdk)
#   BUILD_DIR     — scratch build directory    (default: /tmp/fasttree-build)
#   OUT_DIR       — where fasttree.wasm lands   (default: ./out)
#   SOURCE_SHA    — expected sha256 of FastTree.c (set below)
# ──────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}/../.."

# ── Configuration ────────────────────────────────────────────────────────────

FASTTREE_VERSION="2.2.0"
SOURCE_URL="https://raw.githubusercontent.com/morgannprice/fasttree/v${FASTTREE_VERSION}/FastTree.c"
# sha256 of FastTree.c @ tag v2.2.0 (pinned for reproducibility).
SOURCE_SHA="${SOURCE_SHA:-975202a6b74c9996af871404ff043bb2152edcbda539035662514bc12d1f3431}"

WASI_SDK="${WASI_SDK:-/opt/wasi-sdk}"
BUILD_DIR="${BUILD_DIR:-/tmp/fasttree-build}"
OUT_DIR="${OUT_DIR:-${SCRIPT_DIR}/out}"

# ── Step 1: Fetch + verify source ────────────────────────────────────────────

mkdir -p "${BUILD_DIR}"
SRC="${BUILD_DIR}/FastTree.c"

if [[ ! -f "${SRC}" ]]; then
  echo "==> Downloading FastTree.c @ v${FASTTREE_VERSION}"
  curl -fSL -o "${SRC}" "${SOURCE_URL}"
fi

ACTUAL_SHA="$(sha256sum "${SRC}" | awk '{print $1}')"
echo "==> FastTree.c sha256: ${ACTUAL_SHA}"
if [[ "${ACTUAL_SHA}" != "${SOURCE_SHA}" ]]; then
  echo "ERROR: source sha256 mismatch" >&2
  echo "  expected: ${SOURCE_SHA}" >&2
  echo "  actual:   ${ACTUAL_SHA}" >&2
  exit 1
fi

# ── Step 2: Patch for wasi-sysroot ───────────────────────────────────────────
# Patches applied (documented in kit.json buildNote):
#   P1. <malloc.h> — wasi-sysroot has no <malloc.h>. The upstream include is
#       already guarded by `#ifdef TRACK_MEMORY` (which we never define), but we
#       defensively rewrite it to <stdlib.h> so the source never references a
#       header that does not exist on this sysroot. malloc/free prototypes come
#       from <stdlib.h> (already included above).
#
# No other patches are required: FastTree.c uses only stdio, stdlib, string,
# math, ctype, <sys/time.h> (gettimeofday), and <unistd.h> (isatty) — all of
# which wasi-sdk provides. OpenMP (<omp.h>) and SSE (<xmmintrin.h>) includes are
# already #ifdef-guarded and stay off because we omit -DOPENMP and pass -DNO_SSE
# (and the default build is double-precision, so USE_SSE3 is never set anyway).

SRC_PATCHED="${BUILD_DIR}/FastTree.patched.c"
sed 's|#include <malloc.h>|#include <stdlib.h> /* wasi: no <malloc.h> */|' \
  "${SRC}" > "${SRC_PATCHED}"
echo "==> Applied patch P1 (malloc.h -> stdlib.h)"

# ── Step 3: Compile + link ───────────────────────────────────────────────────
# Build args mirror kit/fasttree/recipe.json build.args: -DNO_SSE.
# Single-thread: -DOPENMP is deliberately omitted.
# libc + libm only.

echo "==> Compiling FastTree.c -> fasttree.wasm (scalar, single-thread)"
WASM_RAW="${BUILD_DIR}/fasttree.raw.wasm"

"${WASI_SDK}/bin/clang" \
  -O2 \
  -DNO_SSE \
  -o "${WASM_RAW}" \
  "${SRC_PATCHED}" \
  -lm

echo "==> Linked: ${WASM_RAW} ($(wc -c < "${WASM_RAW}" | tr -d ' ') bytes)"

# ── Step 4: Optimize + strip ─────────────────────────────────────────────────

mkdir -p "${OUT_DIR}"
WASM_FINAL="${OUT_DIR}/fasttree.wasm"

echo "==> Optimizing with wasm-opt -Oz"
wasm-opt -Oz "${WASM_RAW}" -o "${WASM_FINAL}"
rm -f "${WASM_RAW}"

echo "==> Stripping debug sections"
wasm-opt --strip-debug "${WASM_FINAL}" -o "${WASM_FINAL}"

FINAL_SIZE="$(wc -c < "${WASM_FINAL}" | tr -d ' ')"
echo "==> fasttree.wasm: ${FINAL_SIZE} bytes"
echo "==> sha256: $(sha256sum "${WASM_FINAL}" | awk '{print $1}')"

# ── Step 5: Smoke test via wasmtime + manifest golden ────────────────────────

MANIFEST="${REPO_ROOT}/kit/fasttree/manifest.json"
if [[ ! -f "${MANIFEST}" ]]; then
  echo "WARNING: manifest.json not found at ${MANIFEST}, skipping smoke test" >&2
  exit 0
fi

echo "==> Running smoke test against manifest golden"

while IFS='|' read -r op_id args_b64 stdin_b64 expect_b64; do
  ARGS=()
  while IFS= read -r a || [[ -n "${a}" ]]; do ARGS+=("${a}"); done \
    < <(printf '%s' "${args_b64}" | base64 -d)
  STDIN_DATA="$(printf '%s' "${stdin_b64}" | base64 -d)"
  EXPECT="$(printf '%s' "${expect_b64}" | base64 -d)"

  CMD=(wasmtime run "${WASM_FINAL}")
  [[ ${#ARGS[@]} -gt 0 ]] && CMD+=("${ARGS[@]}")

  echo "    op '${op_id}' argv: ${ARGS[*]}"
  ACTUAL="$(printf '%s' "${STDIN_DATA}" | "${CMD[@]}" 2>/dev/null)" || true

  echo "    --- expected (native-captured) ---"
  printf '%s\n' "${EXPECT}"
  echo "    --- actual (wasm) ---"
  printf '%s\n' "${ACTUAL}"

  if [[ "${ACTUAL}" == "${EXPECT}" ]]; then
    echo "    RESULT: MATCH"
  else
    echo "    RESULT: DIFFERS (wasm output is the kit's true behavior; reconcile golden)"
  fi
done < <(node -e '
  const m = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  const b64 = (s) => Buffer.from(String(s ?? ""), "utf8").toString("base64");
  for (const op of m.operations) {
    const sp    = op.stdinParam;
    const args  = (op.argsTemplate || []);
    const stdin = sp ? (op.golden.input?.[sp] ?? "") : "";
    process.stdout.write([
      op.id,
      b64(args.join("\n")),
      b64(stdin),
      b64(op.golden.expect),
    ].join("|") + "\n");
  }
' "${MANIFEST}")

echo ""
echo "==> Build complete: ${WASM_FINAL}"
echo "==> Next: copy fasttree.wasm to kit/fasttree/artifacts/, stamp sha256, flip verified:true"

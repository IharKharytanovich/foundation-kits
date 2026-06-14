# build/z3 — Z3 WASI cross-compile toolchain

Cross-compiles the [Z3 SMT solver](https://github.com/Z3Prover/z3) (v4.16.0)
into a single-threaded WASI binary (`z3.wasm`) using CMake + wasi-sdk ≥ 33.

## Contents

| File | Role |
|---|---|
| `build.sh` | Orchestrates the full build: fetch tarball → CMake configure → build → wasm-opt → smoke test. |
| `Dockerfile` | Reproducible build container: ubuntu + pinned wasi-sdk ≥ 33, wasmtime ≥ 37, binaryen, cmake, Node. Arch-aware (`TARGETARCH`): builds native on x86_64 **and** arm64. |
| `wasm-fenv-compat.h` | Force-included shim defining `FE_UPWARD`/`FE_DOWNWARD`/`FE_TOWARDZERO` (absent from wasi-libc; wasm rounds to nearest only) so `hwf.cpp` compiles. |
| `wasm-stubs.c` | No-op `pthread_atfork` (absent from single-threaded wasi-libc; WASI has no `fork`) so `scoped_timer.cpp` links. |
| `README.md` | This file — run instructions + maintainer hand-off. |
| `.gitignore` | Excludes scratch build output (`*.wasm`, `out/`). |

## How it works

1. `build.sh` fetches + sha-verifies the z3 4.16.0 source tarball.
2. Configures via CMake with the wasi-sdk toolchain file and single-threaded
   flags (`-DZ3_SINGLE_THREADED=ON -DZ3_POLLING_TIMER=ON`).
3. Builds the **`shell`** CMake target (z3's `src/shell/CMakeLists.txt` sets
   `OUTPUT_NAME z3`; there is no target literally named `z3`) to a WASI binary.
4. Runs `wasm-opt -Oz` + strip for size optimization.
5. Smoke-tests every manifest golden via `wasmtime run -W exceptions=y`
   (no `--` separator — wasmtime forwards a bare `--` to the guest, and z3 reads
   it as "the rest of argv is one input filename").

### Key build flags

- **`-DZ3_SINGLE_THREADED=ON`** — removes all threading (mutexes, atomics).
- **`-DZ3_POLLING_TIMER=ON`** — removes `scoped_timer`'s `std::thread`
  (Z3 issue [#5746](https://github.com/Z3Prover/z3/issues/5746)); without this,
  the single-threaded build still spawns a timer thread.
- **`-fwasm-exceptions`** — enables C++ exception handling via the WASM EH
  proposal (z3 uses exceptions on normal control-flow paths).
- **`-mllvm -wasm-use-legacy-eh=false`** — use the standard (non-legacy) EH
  encoding.
- **`-lunwind`** — link the unwinder for WASM exceptions.
- **LTO is OFF** — EH + LTO is a known wasi-sdk bug
  ([#629](https://github.com/WebAssembly/wasi-sdk/issues/629)); do NOT add
  `-flto`.

### WASM portability shims (why z3 needs help to build under WASI)

wasm/wasi-libc lacks several POSIX facilities z3 expects. `build.sh` bridges the
gap — none of these affect the theories the kit exposes:

- **fenv rounding modes** — wasm rounds to nearest-even only; wasi-libc omits
  `FE_UPWARD`/`FE_DOWNWARD`/`FE_TOWARDZERO`. `wasm-fenv-compat.h` is force-included
  (`-include`) to define them so `src/util/hwf.cpp` compiles. The hardware-float
  path is unused (z3 uses software `mpf`).
- **signals / mmap / process clocks / getpid** — provided by wasi-sdk's drop-in
  emulations: `-D_WASI_EMULATED_*` at compile + `-lwasi-emulated-*` at link
  (`signal`, `mman`, `process-clocks`, `getpid`). z3 touches SIGINT
  (`scoped_ctrl_c.cpp`), mmap (memory manager), clocks (timers), getpid.
- **`pthread_atfork`** — absent from single-threaded wasi-libc; WASI has no
  `fork`. `wasm-stubs.c` supplies a no-op so `src/util/scoped_timer.cpp` links.

## Running the build

### Via Docker (recommended)

```bash
# From the repo root. Docker selects the host architecture automatically;
# pass --platform to force one. TARBALL_SHA is already pinned in build.sh.
docker build --platform linux/arm64 -f build/z3/Dockerfile -t z3-wasi-build .
docker run --rm --platform linux/arm64 \
  -v "$(pwd)/kit/z3/artifacts:/out" z3-wasi-build

# Optional: cache the scratch build dir across runs (incremental relink):
#   -v /tmp/z3-build-cache:/tmp/z3-build
```

`z3.wasm` (≈11.5 MB) lands in `kit/z3/artifacts/`. The run ends with a
`wasmtime` smoke test over all eight manifest goldens (`8 passed, 0 failed`).

### Locally (requires wasi-sdk ≥ 33, wasmtime ≥ 37, binaryen, cmake, Node)

```bash
export WASI_SDK=/path/to/wasi-sdk
export TARBALL_SHA="<sha256 of z3-4.16.0.tar.gz>"
bash build/z3/build.sh
```

The binary lands in `build/z3/out/z3.wasm` (or `$OUT_DIR`).

## Build status & reproduction

This pipeline has been **run end-to-end on arm64 (Docker Desktop / Apple
Silicon)**: z3 4.16.0 cross-compiles clean, `z3.wasm` (≈11.5 MB) passes all eight
manifest goldens under `wasmtime`, and `kit/z3` is published-ready
(`verified: true`, real `sha256` stamped). A maintainer reproducing or refreshing
the artifact:

1. **Provision the build environment**: use the Dockerfile (recommended), or
   install wasi-sdk ≥ 33, wasmtime ≥ 37, binaryen (`wasm-opt`), cmake, Node ≥ 22
   locally. `TARBALL_SHA` is already pinned in `build.sh`.
2. **Run the build**: the Docker workflow above (or `bash build/z3/build.sh`
   locally). It fetches + sha-verifies the tarball, cross-compiles with the
   single-threaded flags and WASM shims, runs `wasm-opt`, and smoke-tests against
   the manifest goldens. The Docker workflow writes `z3.wasm` straight into
   `kit/z3/artifacts/` (volume mount); the local script writes to `$OUT_DIR` —
   copy it to `kit/z3/artifacts/z3.wasm`.
3. **Re-stamp the sha256** only if the bytes changed (the build is deterministic,
   so a clean rebuild reproduces the same hash):
   ```bash
   sha256sum kit/z3/artifacts/z3.wasm
   # → paste the 64-hex-char hash into kit.json artifacts[0].sha256
   ```
   `verified: true` is already set.

4. **Run the factory suite**:
   ```bash
   npm run verify
   npm run license-gate -- z3
   ```
5. **Dry-run publish**:
   ```bash
   npm run publish-kit -- z3@4.16.0 --dry-run
   ```
6. **Tag + push** (the actual publish):
   ```bash
   git tag z3@4.16.0
   git push origin z3@4.16.0
   ```
   CI runs verify → license-gate → publish.mjs → GitHub Release `z3@4.16.0`.
   The `artifacts[].url` in `kit.json` goes live at that point.

> **CI note:** the build environment (wasi-sdk, wasmtime, Docker) is not yet
> provisioned in `.github/workflows/`; the publish step currently runs where the
> bytes already exist (see `docs/publishing-and-validation.md`).

## 4 GB wasm32 memory ceiling

WASM's 32-bit address space limits the z3 process to **4 GB of linear memory**.
For most SMT-LIB2 scripts this is more than sufficient, but very large inputs
(e.g. massive bit-vector problems, complex quantifier-heavy theories) may exceed
it. If z3 runs out of memory, set the z3 `memory_max_size` parameter in the
SMT-LIB2 script or consider simplifying the problem.

This is a fundamental wasm32 limitation, not specific to this build. A wasm64
(memory64) target would lift it but is not yet supported by the factory runtime.

## Emscripten STANDALONE_WASM fallback

If the **wasi-sdk C++ exception path proves unworkable** (e.g. a wasi-sdk
regression blocks the build), an alternative path exists:

- Build z3 with **Emscripten** using `-s STANDALONE_WASM=1 -s SINGLE_FILE=0`
  (pure WASI-compatible output, no JS glue) with `-fwasm-exceptions` and
  **no `-pthread`** / no `-s USE_PTHREADS=1` (single-threaded invariant).
- Emscripten's EH support is more mature than wasi-sdk's and has been tested
  with z3 (see [cpitclaudel/z3.wasm](https://github.com/cpitclaudel/z3.wasm)).
- The resulting `.wasm` still runs under `wasmtime -W exceptions=y` and the
  kit definition (`runtime: wasi`, `wasiTools: ["z3"]`) does not change — only
  the build pipeline differs.
- **Use this only as a last resort** if the primary wasi-sdk ≥ 33 path fails.
  The wasi-sdk path is preferred because it produces a pure WASI binary without
  Emscripten's runtime overhead.

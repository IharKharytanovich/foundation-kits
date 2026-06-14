# build/edlib — edlib WASI cross-compile toolchain

Cross-compiles [edlib](https://github.com/Martinsos/edlib) (v1.2.7) into a
single-threaded WASI binary (`edlib.wasm`) using wasi-sdk clang++. Includes a
thin C driver (`edlib_cli.c`) that reads a mode + two sequences on stdin and,
based on its task (`argv[1]`), reports the edit distance or the edit distance +
CIGAR alignment path.

## Contents

| File | Role |
|---|---|
| `build.sh` | Orchestrates the full build: fetch tarball → compile+link with clang++ (single-threaded, no cmake) → wasm-opt → smoke test against manifest goldens. |
| `Dockerfile` | Reproducible build container: ubuntu + pinned wasi-sdk, wasmtime, binaryen, Node. Arch-aware (`TARGETARCH`): builds native on x86_64 and arm64. |
| `edlib_cli.c` | Single-operation stdin→stdout CLI wrapper: reads `<mode>\n<query>\n<target>` on stdin; dispatches on `argv[1]` (`distance`/`align`) to `edlibAlign` with the appropriate task. Prints result to stdout. |
| `README.md` | This file — run instructions + maintainer hand-off. |
| `.gitignore` | Excludes scratch build output (`*.wasm`, `out/`). |

## How it works

1. `build.sh` fetches + sha-verifies the edlib 1.2.7 source tarball.
2. Compiles `edlib_cli.c` + `edlib/src/edlib.cpp` directly with `clang++` (no
   cmake, no separate library — edlib is a single translation unit).
3. Flags: `-O2 -fno-exceptions -fno-rtti` (edlib uses no exceptions or RTTI).
4. Runs `wasm-opt -Oz` + strip for size optimization.
5. Smoke-tests the `distance` golden via `wasmtime run` against
   `kit/edlib/manifest.json`; the `align` golden is CAPTURED (printed for the
   maintainer to paste into the manifest).

### Key build facts

- edlib is **C++ with an `extern "C"` header** — the driver (`edlib_cli.c`) is
  compiled as C by the `.c` extension, while `edlib.cpp` is compiled as C++. Both
  are compiled in a single `clang++` invocation.
- **Single-threaded**: no threading flags, no SharedArrayBuffer, no worker threads.
  edlib's core algorithm is inherently single-threaded.
- **No cmake needed** — unlike spglib, edlib has no build system dependencies. The
  entire library is one source file (`edlib.cpp`) + one header (`edlib.h`).

### Memory ceiling

wasm32 has a 4 GB linear memory ceiling. For typical bioinformatics alignment
tasks (sequences up to tens of megabases), this is sufficient. Genome-scale
whole-chromosome alignment (100+ MB sequences) may exceed the memory limit.

## Running the build

### Via Docker (recommended)

```bash
# From the repo root.
docker build -f build/edlib/Dockerfile -t edlib-wasi-build .
docker run --rm \
  -e TARBALL_SHA=<sha256-of-tarball> \
  -v "$(pwd)/kit/edlib/artifacts:/out" \
  edlib-wasi-build
```

`edlib.wasm` lands in `kit/edlib/artifacts/`. The run ends with a `wasmtime`
smoke test over the manifest golden.

### Locally (requires wasi-sdk >= 24, wasmtime, binaryen, Node)

```bash
export WASI_SDK=/path/to/wasi-sdk
export TARBALL_SHA=<sha256-of-tarball>
bash build/edlib/build.sh
```

The binary lands in `build/edlib/out/edlib.wasm` (or `$OUT_DIR`).

### Obtaining the tarball SHA256

On first run, if `TARBALL_SHA` is not set (or left as the placeholder), the
script downloads the tarball and prints the actual hash in the error message.
Set the env var and re-run:

```bash
export TARBALL_SHA=<actual-hash-from-error-output>
bash build/edlib/build.sh
```

## Manual build hand-off

The WASI cross-compile is an **exploratory maintainer step** — the build
environment (wasi-sdk, wasmtime, Docker) is not yet provisioned in CI. After the
orchestrator completes the kit authoring phase, a maintainer must:

1. **Provision the build environment**: install wasi-sdk >= 24, wasmtime, binaryen
   (`wasm-opt`), and Node >= 22 — or use the Dockerfile.
2. **Obtain the tarball SHA256**: run the build once without `TARBALL_SHA` set;
   the error output shows the actual hash. Set `export TARBALL_SHA=<hash>`.
3. **Run the build**: `bash build/edlib/build.sh` (local) or the Docker workflow
   above. The script fetches the edlib 1.2.7 tarball, cross-compiles, and
   smoke-tests against the manifest golden.
4. **Copy the artifact**: move the produced `edlib.wasm` to
   `kit/edlib/artifacts/edlib.wasm`:
   ```bash
   mkdir -p kit/edlib/artifacts
   cp build/edlib/out/edlib.wasm kit/edlib/artifacts/edlib.wasm
   ```
5. **Stamp the real sha256** into `kit/edlib/kit.json`:
   ```bash
   sha256sum kit/edlib/artifacts/edlib.wasm
   # → paste the 64-hex-char hash into kit.json artifacts[0].sha256
   ```
6. **Flip `verified`** to `true` in `kit/edlib/kit.json`.
7. **Paste the captured `align` CIGAR** into the manifest: the smoke test prints
   the actual output for the `align` operation (marked `CAPTURED`). Copy that
   value into `kit/edlib/manifest.json` → `operations[1].golden.expect`.
8. **Run the factory suite**:
   ```bash
   npm run verify
   npm run license-gate -- edlib
   ```
9. **Dry-run publish**:
   ```bash
   npm run publish-kit -- edlib@1.2.7 --dry-run
   ```
10. **Tag + push** (the actual publish):
    ```bash
    git tag edlib@1.2.7
    git push origin edlib@1.2.7
    ```
    CI runs verify → license-gate → publish.mjs → GitHub Release `edlib@1.2.7`.
    The `artifacts[].url` in `kit.json` goes live at that point.

> **CI note:** the build environment (wasi-sdk, wasmtime, Docker) is not yet
> provisioned in `.github/workflows/`; the publish step currently runs where the
> bytes already exist (see `docs/publishing-and-validation.md`).

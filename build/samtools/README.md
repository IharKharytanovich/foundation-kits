# build/samtools — samtools+htslib WASI cross-compile toolchain

Cross-compiles [samtools](https://github.com/samtools/samtools) (v1.21) and
[htslib](https://github.com/samtools/htslib) (v1.21) into a single multiplexed
WASI binary (`samtools.wasm`) containing 4 programs: `samtools`, `tabix`,
`bgzip`, and `htsfile`. Built single-threaded (no pthreads) using wasi-sdk.

## Contents

| File | Role |
|---|---|
| `tools.json` | **Single source of truth** for the binary's tool registry — one `{name, source}` entry per program. |
| `gen-dispatch.mjs` | Generator: reads `tools.json`, emits a `dispatch.c` that routes `argv[1]` to `<tool>_main()`. |
| `build.sh` | Orchestrates the full build: fetch zlib+htslib+samtools → cross-compile zlib → configure+build libhts.a → configure samtools → compile tool objects → generate+compile dispatch → link → wasm-opt → smoke test. |
| `Dockerfile` | Reproducible build container: ubuntu + pinned wasi-sdk, wasmtime, binaryen, Node. Arch-aware (`TARGETARCH`): builds native on x86_64 and arm64. |
| `README.md` | This file — run instructions + maintainer hand-off. |
| `.gitignore` | Excludes the generated `dispatch.c` and scratch build output. |

## How it works

1. `tools.json` lists 4 programs from two upstream repos:
   - **samtools** (`bamtk.c`) — from the samtools repo
   - **tabix**, **bgzip**, **htsfile** — from the htslib repo
2. `gen-dispatch.mjs` reads the registry and generates `dispatch.c` — a C source
   with one `if (!strcmp(argv[1], "<tool>")) return <tool>_main(argc-1, argv+1);`
   branch per tool, plus usage-to-stderr fallbacks.
3. `build.sh` drives the cross-compile:
   - Fetches + sha-verifies the zlib, htslib 1.21, and samtools 1.21 tarballs.
   - Cross-compiles zlib for WASI (htslib requires it for bgzf/BAM/CRAM).
   - Configures htslib single-threaded (no pthreads, no bz2/lzma/libdeflate/
     libcurl/plugins/GCS/S3) and builds `libhts.a`.
   - Configures samtools against the built htslib.
   - Builds samtools `.o` files via `make` (the link step is expected to fail;
     the valid `.o` objects are collected).
   - Compiles each tool's entry-point source with `-Dmain=<tool>_main` and
     performs two-pass symbol localization (llvm-nm + per-symbol rename macros)
     to prevent global-symbol collisions in the multiplexed binary.
   - Generates `dispatch.c` and compiles it.
   - Links everything into one `samtools.wasm`.
   - Runs `wasm-opt -Oz` + strip for size optimization.
   - Runs the **gated** `count-reverse` smoke test via `wasmtime`: pipes a fixed
     2-record SAM (one forward, one reverse) to `samtools view -c -f 16 -` and
     asserts the output is exactly `1`.
   - Prints non-gated operation outputs (view, bgzip, htsfile) for the
     maintainer to capture as manifest goldens.
4. The `Dockerfile` packages the complete build environment.

## htslib + samtools 1.21 co-pin

Both repos are **co-pinned to 1.21**. Their version numbers are aligned by the
upstream project — samtools links against libhts.a and expects a matching
version. The pins live as `HTSLIB_VERSION` and `SAMTOOLS_VERSION` at the top of
`build.sh`; changing one requires changing the other.

## CRAM sub-license

CRAM support is **included** in the build (user decision 1A — CRAM is a core
genomic format and the biowasm precedent includes it). The `cram/` subdirectory
in htslib carries files under a different upstream license (Modified BSD / MIT
variant). The kit's `provenance.license` is `MIT` (the primary samtools/htslib
license); the CRAM sub-license fact is documented in `provenance.buildNote` in
`kit/samtools/kit.json`.

## Running the build

### Via Docker (recommended)

```bash
# From the repo root:
docker build -f build/samtools/Dockerfile -t samtools-wasi-build .
docker run --rm -v "$(pwd)/kit/samtools/artifacts:/out" samtools-wasi-build
```

### Locally (requires wasi-sdk >= 25, wasmtime, binaryen, Node >= 22)

```bash
export WASI_SDK=/path/to/wasi-sdk
export HTSLIB_SHA="<sha256 of htslib-1.21.tar.bz2>"
export SAMTOOLS_SHA="<sha256 of samtools-1.21.tar.bz2>"
bash build/samtools/build.sh
```

The binary lands in `build/samtools/out/samtools.wasm` (or `$OUT_DIR`).

### Build flags

- **Single-threaded** — no `-pthread`, no OpenMP, no pthreads. The WASI target
  does not support shared memory / threads (factory invariant).
- **zlib-only compression** — bz2, lzma, libdeflate disabled. zlib is
  cross-compiled from source (v1.3.1).
- **No network deps** — libcurl, GCS, S3 plugins disabled. CRAM
  reference-fetch is offline only.
- **CRAM kept** — the `cram/` code compiles with the MIT primary license.

## Manual build hand-off

The WASI cross-compile is an **exploratory maintainer step** — the build
environment (wasi-sdk, wasmtime, Docker) is not yet provisioned in CI. After the
orchestrator completes the kit authoring phases, a maintainer must:

1. **Provision the build environment**: install wasi-sdk >= 25, wasmtime, binaryen
   (`wasm-opt`), and Node >= 22 — or use the Dockerfile.
2. **Set the tarball hashes**: record the sha256 of the htslib and samtools 1.21
   tarballs as `HTSLIB_SHA` and `SAMTOOLS_SHA` environment variables (or update
   the defaults in `build.sh`).
3. **Run the build**: `bash build/samtools/build.sh` (local) or the Docker workflow
   above. The script fetches the tarballs, cross-compiles, and runs the gated
   `count-reverse` smoke test.
4. **Copy the artifact**: move the produced `samtools.wasm` to
   `kit/samtools/artifacts/samtools.wasm`.
5. **Stamp the real sha256** into `kit/samtools/kit.json`:
   ```bash
   sha256sum kit/samtools/artifacts/samtools.wasm
   # → paste the 64-hex-char hash into kit.json artifacts[0].sha256
   ```
6. **Flip `verified`** to `true` in `kit/samtools/kit.json`.
7. **Capture the non-gated goldens**: the build script prints the outputs for
   `view`, `bgzip`, and `htsfile` operations. Record those values as
   `golden.expect` in the corresponding operations in
   `kit/samtools/manifest.json`.
8. **Run the factory suite**:
   ```bash
   npm run verify
   npm run license-gate -- samtools
   ```
9. **Dry-run publish**:
   ```bash
   npm run publish-kit -- samtools@1.21 --dry-run
   ```
10. **Tag + push** (the actual publish):
    ```bash
    git tag samtools@1.21
    git push origin samtools@1.21
    ```
    CI runs verify → license-gate → publish.mjs → GitHub Release `samtools@1.21`.
    The `artifacts[].url` in `kit.json` goes live at that point.

> **CI note:** the build environment (wasi-sdk, wasmtime, Docker) is not yet
> provisioned in `.github/workflows/`; the publish step currently runs where the
> bytes already exist (see `docs/publishing-and-validation.md`).

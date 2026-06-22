# build/ripser — Ripser WASI cross-compile toolchain

Cross-compiles [Ripser](https://github.com/Ripser/ripser) (v1.2.1) into a
single-threaded WASI binary (`ripser.wasm`) using wasi-sdk clang++. Ripser is a
single C++ translation unit (`ripser.cpp`) that is **already a CLI** with
`main()` — there is no thin C driver needed (unlike spglib, which is a library
and required a separate CLI wrapper).

## Contents

| File | Role |
|---|---|
| `build.sh` | Orchestrates the full build: fetch tarball → compile `ripser.cpp` → wasm-opt → determinism smoke test. |
| `Dockerfile` | Reproducible build container: ubuntu + pinned wasi-sdk, wasmtime, binaryen. Arch-aware (`TARGETARCH`): builds native on x86_64 and arm64. No cmake or Node needed. |
| `README.md` | This file — run instructions + maintainer hand-off. |
| `.gitignore` | Excludes scratch build output (`*.wasm`, `out/`). |

## How it works

1. `build.sh` fetches + sha-verifies the Ripser v1.2.1 source tarball.
2. Compiles `ripser.cpp` directly with wasi-sdk `clang++` — single translation
   unit, single-threaded (no `-pthread`), C++14, release flags (`-O2 -DNDEBUG`).
3. Runs `wasm-opt -Oz` + strip for size optimization.
4. Smoke-tests determinism via `wasmtime run`: runs the inline golden matrix
   (a 3-point equilateral lower-distance matrix `"2\n2 2\n"`) through
   `ripser --format lower-distance` **twice** and asserts byte-identical output.
5. Prints the captured barcode for the maintainer to paste into the manifest.

### Key build flags

- **`-std=c++14`** — Ripser requires C++14 features.
- **`-O2`** — optimize for speed (Ripser is compute-heavy).
- **`-DNDEBUG`** — disable asserts (release build).
- **No `-pthread`** — single-threaded invariant (factory constraint).
- **No `-DUSE_COEFFICIENTS`** — default field (Z/2Z), keeps golden stable.

### Build notes

- Ripser is a **single self-contained C++ file** (`ripser.cpp`) with zero
  external dependencies — no build system, no library linking, no POSIX shims.
- The upstream [live.ripser.org](https://live.ripser.org) Emscripten/WASM demo
  proves the code compiles cleanly to WebAssembly.
- Ripser reads its distance matrix from a **file path** argument (not stdin).
  The smoke test writes the matrix to a temp file and uses `wasmtime --dir` to
  grant filesystem access. The Foundation runtime handles this via
  `stdinAsFile:true` in `kit.json`.

### Determinism gate

The smoke test asserts **determinism** (two runs of the same input produce
byte-identical output), NOT a pre-asserted barcode value. The barcode value
depends on Ripser's exact output formatting and cannot be hand-derived — it is
**captured** at build time and pasted into `kit/ripser/manifest.json`
`operations[0].golden.expect` by the maintainer.

## Running the build

### Via Docker (recommended)

```bash
# From the repo root.
docker build -f build/ripser/Dockerfile -t ripser-wasi-build .
docker run --rm -v "$(pwd)/kit/ripser/artifacts:/out" ripser-wasi-build
```

`ripser.wasm` lands in `kit/ripser/artifacts/`. The run ends with a determinism
smoke test and prints the captured barcode.

### Locally (requires wasi-sdk, wasmtime, binaryen)

```bash
export WASI_SDK=/path/to/wasi-sdk
bash build/ripser/build.sh
```

The binary lands in `build/ripser/out/ripser.wasm` (or `$OUT_DIR`).

## Manual build hand-off

The WASI cross-compile is an **exploratory maintainer step** — the build
environment (wasi-sdk, wasmtime, Docker) is not yet provisioned in CI. After the
orchestrator completes the kit authoring phase, a maintainer must:

1. **Provision the build environment**: install wasi-sdk >= 24, wasmtime, and
   binaryen (`wasm-opt`) — or use the Dockerfile.
2. **Run the build**: `bash build/ripser/build.sh` (local) or the Docker workflow
   above. The script fetches the Ripser v1.2.1 tarball, cross-compiles, and
   smoke-tests determinism (two runs byte-identical).
3. **Copy the artifact**: move the produced `ripser.wasm` to
   `kit/ripser/artifacts/ripser.wasm`.
4. **Stamp the real sha256** into `kit/ripser/kit.json`:
   ```bash
   sha256sum kit/ripser/artifacts/ripser.wasm
   # → paste the 64-hex-char hash into kit.json artifacts[0].sha256
   ```
5. **Flip `verified`** to `true` in `kit/ripser/kit.json`.
6. **Capture the barcode golden**: copy the barcode printed by the build
   (between `--- begin barcode ---` and `--- end barcode ---`) into
   `kit/ripser/manifest.json` `operations[0].golden.expect`.
7. **Run the factory suite**:
   ```bash
   npm run verify
   npm run license-gate -- ripser
   ```
8. **Dry-run publish**:
   ```bash
   npm run publish-kit -- ripser@1.2.1 --dry-run
   ```
9. **Tag + push** (the actual publish):
   ```bash
   git tag ripser@1.2.1
   git push origin ripser@1.2.1
   ```
   CI runs verify → license-gate → publish.mjs → GitHub Release `ripser@1.2.1`.
   The `artifacts[].url` in `kit.json` goes live at that point.

> **CI note:** the build environment (wasi-sdk, wasmtime, Docker) is not yet
> provisioned in `.github/workflows/`; the publish step currently runs where the
> bytes already exist (see `docs/publishing-and-validation.md`).

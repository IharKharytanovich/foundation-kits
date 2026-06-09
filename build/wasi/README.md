# build/wasi — WASI cross-compile toolchain

The factory's WASI build toolchain. Compiles upstream C source into a single
multiplexed `.wasm` binary that dispatches on `argv[1]` — the same contract
proven by `kit/seqtk/`.

## Contents

| File | Role |
|---|---|
| `tools.json` | **Single source of truth** for the binary's tool registry — one `{name, source}` entry per program. |
| `gen-dispatch.mjs` | Generator: reads `tools.json`, emits a `dispatch.c` that routes `argv[1]` to `<tool>_main()`. |
| `gen-dispatch.test.mjs` | vitest tests for the generator (`npx vitest run -c build/wasi/vitest.config.mjs`). |
| `vitest.config.mjs` | Scoped vitest config for build toolchain tests. |
| `build.sh` | Orchestrates the full build: fetch tarball → configure → make libs → compile tools → generate+compile dispatch → link → wasm-opt → smoke test. |
| `Dockerfile` | Reproducible build container: ubuntu + pinned wasi-sdk, wasmtime, binaryen, Node. |
| `.gitignore` | Excludes the generated `dispatch.c` (build artifact, never committed). |

## How it works

1. `tools.json` lists all programs (currently 25 ViennaRNA CLI tools).
2. `gen-dispatch.mjs` reads the registry and generates `dispatch.c` — a C source
   with one `if (!strcmp(argv[1], "<tool>")) return <tool>_main(argc-1, argv+1);`
   branch per tool, plus usage-to-stderr fallbacks.
3. `build.sh` drives the cross-compile:
   - Fetches + sha-verifies the upstream release tarball.
   - `./configure` with WASI-specific flags (no OpenMP, no pthreads, no optional
     deps, naview excluded).
   - Builds `libRNA.a` + helper objects.
   - Compiles each `src/bin/<tool>.c` with `-Dmain=<tool>_main`.
   - Compiles the generated `dispatch.c`.
   - Links everything into one `viennarna.wasm`.
   - Runs `wasm-opt -Oz` + strip.
   - Smoke-tests every manifest golden via `wasmtime`.
4. The `Dockerfile` packages the complete environment.

## Running the build

### Via Docker (recommended)

```bash
# From the repo root:
docker build -f build/wasi/Dockerfile -t viennarna-wasi-build .
docker run --rm -v "$(pwd)/kit/viennarna/artifacts:/out" viennarna-wasi-build
```

### Locally (requires wasi-sdk, wasmtime, binaryen, Node)

```bash
export WASI_SDK=/path/to/wasi-sdk
export TARBALL_SHA="<sha256 of ViennaRNA-2.7.2.tar.gz>"
bash build/wasi/build.sh
```

The binary lands in `build/wasi/out/viennarna.wasm` (or `$OUT_DIR`).

## Adding / removing tools

Edit `tools.json` — it is the single source of truth for the binary's contents.
The generator, build script, and smoke tests all derive from it. No other file
needs a manual update when the tool list changes.

## Manual build hand-off

The WASI cross-compile is an **exploratory maintainer step** — the build
environment (wasi-sdk, wasmtime, Docker) is not yet provisioned in CI. After the
orchestrator completes the kit authoring phases, a maintainer must:

1. **Provision the build environment**: install wasi-sdk ≥ 20, wasmtime, binaryen
   (`wasm-opt`), and Node ≥ 22 — or use the Dockerfile.
2. **Run the build**: `bash build/wasi/build.sh` (local) or the Docker workflow
   above. The script fetches the ViennaRNA 2.7.2 tarball, cross-compiles, and
   smoke-tests against manifest goldens.
3. **Copy the artifact**: move the produced `viennarna.wasm` to
   `kit/viennarna/artifacts/viennarna.wasm`.
4. **Stamp the real sha256** into `kit/viennarna/kit.json`:
   ```bash
   sha256sum kit/viennarna/artifacts/viennarna.wasm
   # → paste the 64-hex-char hash into kit.json artifacts[0].sha256
   ```
5. **Flip `verified`** to `true` in `kit/viennarna/kit.json`.
6. **Run the factory suite**:
   ```bash
   npm run verify
   npm run license-gate -- viennarna
   ```
7. **Dry-run publish**:
   ```bash
   npm run publish-kit -- viennarna@2.7.2 --dry-run
   ```
8. **Tag + push** (the actual publish):
   ```bash
   git tag viennarna@2.7.2
   git push origin viennarna@2.7.2
   ```
   CI runs verify → license-gate → publish.mjs → GitHub Release `viennarna@2.7.2`.
   The `artifacts[].url` in `kit.json` goes live at that point.

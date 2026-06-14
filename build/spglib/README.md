# build/spglib — spglib WASI cross-compile toolchain

Cross-compiles [spglib](https://github.com/spglib/spglib) (v2.7.0) into a
single-threaded WASI binary (`spglib.wasm`) using CMake + wasi-sdk. Includes a
C CLI wrapper (`spglib_cli.c`) that reads a crystal structure on stdin and, based
on its subcommand (`argv[1]`), reports the space group, the full symmetry
dataset, all symmetry operations, the primitive cell, or the standardized
conventional cell.

## Contents

| File | Role |
|---|---|
| `build.sh` | Orchestrates the full build: fetch tarball → CMake configure → build static lib → compile+link CLI wrapper → wasm-opt → smoke test. |
| `Dockerfile` | Reproducible build container: ubuntu + pinned wasi-sdk, wasmtime, binaryen, cmake, Node. Arch-aware (`TARGETARCH`): builds native on x86_64 and arm64. |
| `spglib_cli.c` | Multi-operation stdin→stdout CLI wrapper: reads lattice, positions, types, symprec on stdin; dispatches on `argv[1]` (`spacegroup`/`dataset`/`symmetry`/`primitive`/`standardize`) to `spg_get_dataset`, `spg_find_primitive`, or `spg_standardize_cell`. Reads basis vectors as rows; transposes to spglib's column convention internally. |
| `README.md` | This file — run instructions + maintainer hand-off. |
| `.gitignore` | Excludes scratch build output (`*.wasm`, `out/`). |

## How it works

1. `build.sh` fetches + sha-verifies the spglib 2.7.0 source tarball.
2. Configures via CMake with the wasi-sdk toolchain file and static-library flags
   (`-DSPGLIB_SHARED_LIBS=OFF`, `-DSPGLIB_WITH_TESTS=OFF`, etc.).
3. Builds the `Spglib_symspg` CMake target to a static `libsymspg.a`.
4. Compiles `spglib_cli.c` and links it against `libsymspg.a` into `spglib.wasm`.
5. Runs `wasm-opt -Oz` + strip for size optimization.
6. Smoke-tests every manifest golden via `wasmtime run`.

### Key build flags

- **`-DSPGLIB_SHARED_LIBS=OFF`** — static library (WASI has no dynamic linking).
- **`-DSPGLIB_WITH_TESTS=OFF`** — skip test binaries.
- **`-DSPGLIB_WITH_Fortran=OFF`** — no Fortran interface needed.
- **`-DSPGLIB_WITH_Python=OFF`** — no Python interface needed.
- **`-DSPGLIB_USE_OMP=OFF`** — no OpenMP (single-threaded invariant).
- **`-DCMAKE_BUILD_TYPE=MinSizeRel`** — optimise for size.

### Build notes

- spglib is **pure C99** with zero external dependencies — no POSIX shims, no
  emulation libraries, no threading stubs needed (unlike the z3 build).
- No confirmed wasm32-wasi prior art. spglib's code is straightforward C99 numeric
  code; manual inspection shows no POSIX-only APIs beyond `<stdio.h>`,
  `<stdlib.h>`, `<string.h>`, `<math.h>` — all provided by wasi-libc.
- The `spg_get_international` function is deprecated in v2.7.0; the wrapper uses
  `spg_get_dataset` instead (returns the full `SpglibDataset` including
  `international_symbol` and `spacegroup_number`).

## Running the build

### Via Docker (recommended)

```bash
# From the repo root.
docker build -f build/spglib/Dockerfile -t spglib-wasi-build .
docker run --rm -v "$(pwd)/kit/spglib/artifacts:/out" spglib-wasi-build
```

`spglib.wasm` lands in `kit/spglib/artifacts/`. The run ends with a `wasmtime`
smoke test over the manifest golden (`1 passed, 0 failed`).

### Locally (requires wasi-sdk, wasmtime, binaryen, cmake, Node)

```bash
export WASI_SDK=/path/to/wasi-sdk
bash build/spglib/build.sh
```

The binary lands in `build/spglib/out/spglib.wasm` (or `$OUT_DIR`).

## Manual build hand-off

The WASI cross-compile is an **exploratory maintainer step** — the build
environment (wasi-sdk, wasmtime, Docker) is not yet provisioned in CI. After the
orchestrator completes the kit authoring phase, a maintainer must:

1. **Provision the build environment**: install wasi-sdk >= 24, wasmtime, binaryen
   (`wasm-opt`), cmake, and Node >= 22 — or use the Dockerfile.
2. **Run the build**: `bash build/spglib/build.sh` (local) or the Docker workflow
   above. The script fetches the spglib 2.7.0 tarball, cross-compiles, and
   smoke-tests against the manifest golden.
3. **Copy the artifact**: move the produced `spglib.wasm` to
   `kit/spglib/artifacts/spglib.wasm`.
4. **Stamp the real sha256** into `kit/spglib/kit.json`:
   ```bash
   sha256sum kit/spglib/artifacts/spglib.wasm
   # → paste the 64-hex-char hash into kit.json artifacts[0].sha256
   ```
5. **Flip `verified`** to `true` in `kit/spglib/kit.json`.
6. **Run the factory suite**:
   ```bash
   npm run verify
   npm run license-gate -- spglib
   ```
7. **Dry-run publish**:
   ```bash
   npm run publish-kit -- spglib@2.7.0 --dry-run
   ```
8. **Tag + push** (the actual publish):
   ```bash
   git tag spglib@2.7.0
   git push origin spglib@2.7.0
   ```
   CI runs verify → license-gate → publish.mjs → GitHub Release `spglib@2.7.0`.
   The `artifacts[].url` in `kit.json` goes live at that point.

> **CI note:** the build environment (wasi-sdk, wasmtime, Docker) is not yet
> provisioned in `.github/workflows/`; the publish step currently runs where the
> bytes already exist (see `docs/publishing-and-validation.md`).

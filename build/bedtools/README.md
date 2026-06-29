# build/bedtools — bedtools WASI cross-compile toolchain

Cross-compiles [bedtools](https://github.com/arq5x/bedtools2) (v2.31.1) into a
single self-multiplexing WASI binary (`bedtools.wasm`). Unlike viennarna/samtools
(which multiplex several separate programs through a generated `dispatch.c`),
**bedtools is already one binary** whose own `main()` dispatches on `argv[1]`
(`bedtools merge`, `bedtools sort`, …) — so there is no `tools.json` /
`gen-dispatch.mjs` here. Built single-threaded with the WASM exception-handling
proposal (same recipe as `kit/z3`).

## Contents

| File | Role |
|---|---|
| `build.sh` | Full build: fetch+verify bedtools+zlib → cross-compile zlib → pre-place WASI htslib config.h + version_git.h → `make bin/bedtools` with wasi-sdk → `wasm-opt -Oz` → gated merge smoke test. |
| `Dockerfile` | Reproducible build container: ubuntu + pinned wasi-sdk 33, wasmtime 37, binaryen 121, Node, python3. Arch-aware (`TARGETARCH`). wasi-sdk >= 33 is required for the C++ WASM-EH recipe (matches kit/z3). |
| `htslib-config.h` | WASI `config.h` copied into bedtools' bundled htslib 1.9 — zlib only, no bz2/lzma/libcurl (htslib's no-configure default would hard-enable bz2+lzma). |
| `wasi_posix_shim.{h,c}` | Declares + no-op-defines the POSIX symbols wasi-libc omits (`pthread_kill`, `popen`, `pclose`), reachable only from code paths the merge/sort surface never executes. |
| `.gitignore` | Excludes `out/` and `*.wasm` (artifacts ship via Release, never git). |

## Why WASM exceptions

bedtools is exception-heavy C++ that **throws and catches** on normal error paths.
wasi-sdk's prebuilt libc++abi supports the WASM EH proposal via `-fwasm-exceptions`
(`-mllvm -wasm-use-legacy-eh=false`, link `-lunwind`, LTO OFF). The produced
`.wasm` therefore requires a runtime with WASM-EH enabled:

- smoke test: `wasmtime run -W exceptions=y bedtools.wasm …`
- Foundation's wasi runtime already hosts `kit/z3` (same requirement), so EH is
  available there.

## The two-input I/O constraint (verified surface = single-input only)

Foundation's wasi runtime supplies **one** input — `stdin` (fd-0 or
`/tmp/stdin.txt`) — and preopens only `/tmp` (wiped after the run). There is no
mechanism to mount a **second** input file. bedtools' headline two-input ops
(`intersect -a -b`, `subtract`, `closest`) therefore **cannot** run under today's
contract and are NOT exposed in the manifest (documented in
`kit/bedtools/instruction.md` as "requires multi-file runtime contract").

The kit exposes only **single-input, stdin-driven** operations:

- `merge -i -` — merge overlapping/adjacent intervals (gated golden).
- `sort -i -` — coordinate-sort intervals.

The full binary still contains every subcommand (BAM/BamTools code compiles and
links — it just isn't reachable from the exposed surface), so the manifest can
grow more single-input ops later with no rebuild.

## How it works

1. Fetch + sha-verify the bedtools 2.31.1 source tarball and zlib 1.3.1.
2. Cross-compile zlib for WASI (bedtools' gzstream + bundled htslib need it).
3. Copy `htslib-config.h` → `src/utils/htslib/config.h` so the bundled htslib 1.9
   builds zlib-only (no bz2/lzma/libcurl). Pre-write `version_git.h` so the build
   never shells out to git.
4. `make bin/bedtools` overriding `CC`/`CXX` to wasi-sdk, appending the WASI
   sysroot + WASM-EH flags via `CXXFLAGS`/`LDFLAGS`, and overriding `BT_LIBS` to
   `-lz -lm` (dropping the hardcoded `-lbz2 -llzma -lpthread`; pthread is supplied
   by the wasi-emulated stub libs). Builds the `bin/bedtools` target directly to
   skip the python `makeBashScripts.py` and `test/htsutil` steps.
5. `wasm-opt -Oz --enable-exception-handling` + `--strip-debug`.
6. Gated smoke test: pipe a 2-interval pre-sorted BED to `merge -i -`, assert the
   merged interval. Prints the `sort` output for the maintainer to capture.

## Running the build

### Via Docker (recommended)

```bash
# From the repo root:
docker build -f build/bedtools/Dockerfile -t bedtools-wasi-build .
docker run --rm -v "$(pwd)/kit/bedtools/artifacts:/out" bedtools-wasi-build
```

### Locally (requires wasi-sdk >= 25, wasmtime, binaryen, Node, python3)

```bash
export WASI_SDK=/path/to/wasi-sdk
bash build/bedtools/build.sh
```

The binary lands in `build/bedtools/out/bedtools.wasm` (or `$OUT_DIR`).

### Build flags

- **WASM exceptions** — `-fwasm-exceptions -mllvm -wasm-use-legacy-eh=false`,
  link `-lunwind`. LTO is OFF (EH + LTO is a known wasi-sdk bug).
- **Single-threaded** — no real pthreads; the wasi-emulated-pthread stubs satisfy
  the thread-pool references htslib/BamTools compile against.
- **zlib-only compression** — bz2, lzma disabled in the bundled htslib. zlib is
  cross-compiled from source (v1.3.1).
- **No network** — htslib libcurl/GCS/S3 backends disabled (WASI has no sockets).

## Manual build hand-off

The WASI cross-compile is an **exploratory maintainer step** — the build
environment (wasi-sdk, wasmtime, Docker) is not yet provisioned in CI. After this
toolchain produces a green build, a maintainer must:

1. **Run the build**: `docker build … && docker run …` (above), or `bash
   build/bedtools/build.sh` locally.
2. **Copy the artifact**: the Docker `-v …:/out` mount drops `bedtools.wasm` into
   `kit/bedtools/artifacts/` directly.
3. **Stamp the real sha256** into `kit/bedtools/kit.json` (`artifacts[0].sha256`):
   ```bash
   sha256sum kit/bedtools/artifacts/bedtools.wasm
   ```
4. **Flip `verified`** to `true` and stamp `artifacts[0].url` (`npm run
   backfill-urls`).
5. **Record the captured goldens** in `kit/bedtools/manifest.json`.
6. **Run the factory suite**:
   ```bash
   npm run verify
   npm run license-gate -- bedtools
   ```
7. **Dry-run publish**:
   ```bash
   npm run publish-kit -- bedtools@2.31.1 --dry-run
   ```
8. **Tag + push** (the actual publish):
   ```bash
   git tag bedtools@2.31.1
   git push origin bedtools@2.31.1
   ```

> **CI note:** the build environment (wasi-sdk, wasmtime, Docker) is not yet
> provisioned in `.github/workflows/`; publish runs where the bytes already exist
> (see `docs/publishing-and-validation.md`).

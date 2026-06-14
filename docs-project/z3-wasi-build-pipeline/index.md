# Z3 WASI build pipeline + 5-kit batch

## Summary

This batch adds five new kits (51 &rarr; 56) and a new WASI build pipeline for
Z3, bringing SMT/constraint solving, mass spectrometry, scientific imaging, and
3D mesh capabilities to the catalogue.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| z3 | 4.16.0 | wasi | strict | SMT solver (SMT-LIB2 sat/unsat) over integers, reals, bit-vectors, arrays, quantifiers. |
| pyteomics | 5.0 | pyodide | loose | Mass spectrometry & proteomics: peptide mass, m/z, format parsing. |
| tifffile | 2026.6.1 | pyodide | loose | Scientific TIFF/OME-TIFF/BigTIFF read/write over numpy arrays. |
| manifold | 3.5.1-1.0.0 | jswasm | callable | Robust 3D triangle-mesh booleans (union/difference/intersection). |
| meshoptimizer | 1.1.1-1.0.0 | jswasm | callable | Mesh simplification, optimization & compression. |

### Catalogue impact

- **Pyodide**: 41 &rarr; 43 (+ pyteomics, tifffile)
- **WASI**: 2 &rarr; 3 (+ z3)
- **jswasm**: 8 &rarr; 10 (+ manifold, meshoptimizer)
- **Total**: 51 &rarr; 56 kits

### Publish status

All five kits are authored and verified (z3 is `verified:false` pending its WASI
cross-compile). None are published yet &mdash; each requires a `<id>@<ver>` tag
push through the standard pipeline (see
[publish.md](../../.claude/rules/publish.md)).

## Z3 WASI build pipeline (`build/z3/`)

### Problem

Z3 is the standard SMT solver, but its only published WASM artifact (the
`z3-solver` npm package) is an Emscripten **multi-threaded** build that uses
pthreads/SharedArrayBuffer &mdash; violating the factory's hard single-threaded
invariant. A custom single-threaded WASI build is required.

### Architecture

The pipeline lives in `build/z3/` and consists of:

| File | Role |
|---|---|
| `build.sh` | Fetch z3 4.16.0 tarball, CMake configure with wasi-sdk toolchain, build, wasm-opt, smoke test. |
| `Dockerfile` | Reproducible build env: Ubuntu + wasi-sdk 33, wasmtime 37, binaryen 121, cmake. |
| `README.md` | Run instructions + maintainer hand-off procedure. |
| `.gitignore` | Excludes `*.wasm` and `out/` build scratch. |

### Key build decisions

| Decision | Choice | Rationale |
|---|---|---|
| Toolchain | wasi-sdk &ge; 33 (LLVM 22+) | Z3 needs C++ exceptions; wasi-sdk gained working EH only in v33. |
| Thread removal | `Z3_SINGLE_THREADED=ON` + `Z3_POLLING_TIMER=ON` | `SINGLE_THREADED` alone still spawns `scoped_timer`'s `std::thread` (Z3 #5746). |
| C++ exceptions | `-fwasm-exceptions -mllvm -wasm-use-legacy-eh=false -lunwind` | Z3 throws/catches on normal control flow; RTTI on, LTO off (wasi-sdk #629). |
| Runtime testing | wasmtime &ge; 37 with `-W exceptions=y` | wasmtime EH support requires v37+. |
| Build type | `MinSizeRel` | Targets ~5-10 MB binary size. |
| Fallback | Emscripten `STANDALONE_WASM` (documented, not primary) | If wasi-sdk EH proves unworkable, Emscripten single-threaded STANDALONE_WASM is the contingency. |

### Maintainer hand-off

The WASI cross-compile is **not** run in CI or the orchestrator sandbox. After
merge, a maintainer must:

1. Run `build/z3/build.sh` (locally or via Docker) to produce `z3.wasm`.
2. Copy the artifact to `kit/z3/artifacts/z3.wasm`.
3. Stamp the real sha256 into `kit/z3/kit.json` and flip `verified: true`.
4. Run `npm run verify` + `npm run license-gate -- z3`.
5. Dry-run: `npm run publish-kit -- z3@4.16.0 --dry-run`.
6. Publish: `git tag z3@4.16.0 && git push origin z3@4.16.0`.

This mirrors the existing ViennaRNA hand-off pattern in `build/wasi/`.

## Vendor kits

### Pyteomics (pyodide, loose)

- **Upstream**: [pyteomics](https://pypi.org/project/pyteomics/) v5.0
- **License**: Apache-2.0
- **Tags**: chemistry, biology
- **Golden**: monoisotopic mass of peptide `PEPTIDE` = `799.36`
- **Dependencies**: none (pure Python)

### Tifffile (pyodide, loose)

- **Upstream**: [tifffile](https://pypi.org/project/tifffile/) v2026.6.1
- **License**: BSD-3-Clause
- **Tags**: serialization, data-science
- **Golden**: round-trip a small numpy array through a temp TIFF, assert shape/dtype
- **Dependencies**: numpy (shared, listed in `dependencies[]`)

### Manifold (jswasm, callable, emscripten)

- **Upstream**: [manifold-3d](https://www.npmjs.com/package/manifold-3d) v3.5.1
- **License**: Apache-2.0
- **Tags**: math, structure
- **Golden (scriptGolden)**: CSG volume computation = `"7"`
- **Artifacts**: manifold.js (loader) + manifold.wasm (binary)

### Meshoptimizer (jswasm, callable, emscripten)

- **Upstream**: [meshoptimizer](https://www.npmjs.com/package/meshoptimizer) v1.1.1
- **License**: MIT
- **Tags**: math, structure
- **Golden (scriptGolden)**: mesh simplification result = `"2"`
- **Artifacts**: 5 JS modules (all role: loader, wasm base64-inlined)

## Related files

- Kit definitions: `kit/{z3,pyteomics,tifffile,manifold,meshoptimizer}/`
- Build pipeline: `build/z3/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 46, KNOWN_JSWASM: 10)
- Vendor descriptors: `tooling/import-data.mjs`, `tooling/jswasm-vendor-data.mjs`

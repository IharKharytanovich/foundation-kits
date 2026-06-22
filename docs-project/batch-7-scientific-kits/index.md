# Batch-7 scientific kits

## Summary

This batch adds five new kits (70 &rarr; 75), filling verified capability gaps in
genomics file formats, topological data analysis, coordinate reference systems,
special-relativity algebra, and quantum-chemistry basis sets. Two are WASI build
kits (samtools, ripser) and three are pyodide vendor kits (pyproj, vector,
basis-set-exchange).

This batch introduces the fourth and fifth WASI build pipelines
(`build/samtools/` and `build/ripser/`), following the `build/wasi/` (ViennaRNA),
`build/spglib/`, `build/z3/`, and `build/edlib/` precedents. samtools is
multiplexed (4 tools in one binary, like ViennaRNA); ripser is a single-tool
binary (like spglib/edlib).

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| basis-set-exchange | 0.12 | pyodide | loose | Quantum-chemistry Gaussian basis sets: fetch/convert across program formats. |
| pyproj | 3.7.2 | pyodide | loose | Cartographic CRS transforms (PROJ/EPSG): reproject, project, geodesic distance. |
| ripser | 1.2.1 | wasi | strict | Vietoris&ndash;Rips persistent homology / TDA barcodes. |
| samtools | 1.21 | wasi | strict | SAM/BAM/CRAM/VCF read/write + tabix indexing + bgzip (multiplexed WASI). |
| vector | 1.8.1 | pyodide | loose | Lorentz four-vector / special-relativity algebra (boosts, invariant mass, rapidity). |

### Catalogue impact

- **Pyodide**: 54 &rarr; 57 (+ pyproj, vector, basis-set-exchange)
- **WASI**: 5 &rarr; 7 (+ samtools, ripser)
- **jswasm**: 11 (unchanged)
- **Total**: 70 &rarr; 75 kits

### Publish status

The three pyodide vendor kits are authored and verified (`verified: true`).
samtools and ripser are `verified: false` &mdash; their WASI cross-compiles are
maintainer hand-offs (see `build/samtools/README.md` and
`build/ripser/README.md`). None are published yet; each requires a `<id>@<ver>`
tag push through the standard pipeline (see
[publish.md](../../.claude/rules/publish.md)):

- `samtools@1.21`
- `ripser@1.2.1`
- `pyproj@3.7.2`
- `vector@1.8.1`
- `basis-set-exchange@0.12`

## Notable design decisions

### samtools as a multiplexed WASI build

samtools/htslib has no `py3-none-any` wheel (pysam ships only compiled platform
wheels, not available in Pyodide). A biowasm v3 single-threaded build is the
cited precedent. The kit multiplexes four CLI tools (samtools, tabix, bgzip,
htsfile) into one `samtools.wasm` binary, following the ViennaRNA multiplexed
pattern from `build/wasi/`. The build pipeline co-pins htslib and samtools at
version 1.21, compiles single-threaded (no `-pthread`), and includes a gated
smoke-test: `samtools view -c -f 16 -` on a fixed 2-record SAM &rarr; `"1\n"`.

### ripser as a single-tool WASI build

ripser.py is Cython (platform wheels, not Pyodide-loadable). The standalone
`ripser.cpp` is already a CLI with `main()`, so no thin driver is needed (unlike
spglib/edlib). The build compiles directly with wasi-sdk clang++ (single-threaded)
and gates on determinism (two runs of the same input produce byte-identical
output). The kit uses `stdinAsFile: true` &mdash; the first kit to do so &mdash;
because ripser reads a file path, and the runtime materializes stdin as a
temporary file.

### pyproj &mdash; self-contained Pyodide wheel

The Pyodide v0.29.4 wheel bundles `libproj.so` + `proj.db` (the PROJ CRS
database with 10k+ coordinate reference systems), enabling fully offline
operation. No shared-kit dependencies (`dependencies: []`).

### vector &mdash; shared dependencies

vector depends on `numpy` and `packaging`, both existing shared kits. Per the
bundling rule, these are listed in `dependencies[]` (not bundled). The numba,
awkward-array, and sympy backends are optional and not imported by the golden.

### basis-set-exchange &mdash; bundled exclusive dependencies

basis-set-exchange bundles four exclusive pure-Python dependencies into
`artifacts[]`: jsonschema, argcomplete, Unidecode, and regex. The `regex`
dependency (a C extension) was confirmed required at runtime and bundled as a
Pyodide-compiled wheel from the v0.29.4 CDN. All bundled dep licenses are
documented in `provenance.buildNote`. No shared-kit dependencies
(`dependencies: []`).

### CRAM support in samtools

CRAM support is included in the samtools build. The `cram/` subdirectory carries
a different upstream sub-license, documented in `provenance.buildNote` (following
the `naview.c` precedent from ViennaRNA). The primary license token remains `MIT`.

## Per-kit details

### samtools (SAM/BAM/CRAM/VCF + tabix + bgzip)

- **Upstream**: [samtools](https://github.com/samtools/samtools) v1.21
  (+ [htslib](https://github.com/samtools/htslib) v1.21)
- **License**: MIT
- **Tags**: genomics, sequences
- **Mode**: strict (wasi CLI, multiplexed, stdin&rarr;stdout)
- **Operations**: `count-reverse` (gated golden: `"1\n"`), `view`, `bgzip`,
  `tabix-list` (non-gated, captured at build)
- **Build pipeline**: `build/samtools/` (wasi-sdk clang, single-threaded,
  multiplexed 4-tool dispatch)
- **Status**: `verified: false` &mdash; maintainer hand-off for WASI cross-compile

### ripser (persistent homology / TDA)

- **Upstream**: [ripser](https://github.com/Ripser/ripser) v1.2.1
- **License**: MIT
- **Tags**: math, data-science
- **Mode**: strict (wasi CLI, single-tool, stdinAsFile)
- **Operations**: `barcode` (golden input: 3-point equidistant matrix;
  expect captured at build)
- **Build pipeline**: `build/ripser/` (wasi-sdk clang++, single-threaded,
  determinism-gated smoke-test)
- **Status**: `verified: false` &mdash; maintainer hand-off for WASI cross-compile

### pyproj (cartographic CRS transforms)

- **Upstream**: [pyproj](https://github.com/pyproj4/pyproj) v3.7.2
- **License**: MIT
- **Tags**: units, math
- **Mode**: loose (pyodide, import `pyproj`)
- **Golden**: EPSG:4326&rarr;EPSG:3857 transform of (2.2945, 48.8584) &rarr;
  `"255534.78,6250916.49"`
- **Dependencies**: none (self-contained wheel bundles libproj.so + proj.db)
- **Status**: `verified: true`

### vector (Lorentz four-vector algebra)

- **Upstream**: [vector](https://github.com/scikit-hep/vector) v1.8.1
- **License**: BSD-3-Clause
- **Tags**: physics, math
- **Mode**: loose (pyodide, import `vector`)
- **Golden**: `vector.obj(px=1, py=2, pz=3, E=4).mass` &rarr;
  `"1.4142135623730951"`
- **Shared deps**: numpy (2.2.5), packaging (26.2)
- **Status**: `verified: true`

### basis-set-exchange (quantum-chemistry basis sets)

- **Upstream**: [basis_set_exchange](https://github.com/MolSSI-BSE/basis_set_exchange)
  v0.12
- **License**: BSD-3-Clause
- **Tags**: chemistry, data-science
- **Mode**: loose (pyodide, import `basis_set_exchange`)
- **Golden**: `bse.get_basis('sto-3g', elements=[1], fmt='nwchem')` contains
  exponent `3.42525091` &rarr; `"True"`
- **Bundled deps**: jsonschema (MIT), argcomplete (Apache-2.0), Unidecode
  (GPL-2.0+), regex (Apache-2.0)
- **Status**: `verified: true`

## Build pipeline details

### `build/samtools/` (multiplexed WASI)

The fourth WASI build pipeline, modelled on `build/wasi/` (ViennaRNA multiplexed):

| File | Role |
|---|---|
| `tools.json` | Registry of 4 tools: samtools, tabix, bgzip, htsfile |
| `gen-dispatch.mjs` | Generates `dispatch.c` routing `argv[1]` to tool `main()` |
| `build.sh` | Fetch htslib+samtools 1.21, cross-compile, wasm-opt, smoke-test |
| `Dockerfile` | Pinned wasi-sdk / wasmtime / binaryen build environment |
| `README.md` | Build instructions and maintainer hand-off documentation |
| `.gitignore` | Excludes generated `dispatch.c` + build output |

The gated smoke-test asserts `samtools view -c -f 16 -` on the fixed SAM payload
produces exactly `1`. Non-gated goldens (view, bgzip, tabix-list) are captured at
build time.

### `build/ripser/` (single-tool WASI)

The fifth WASI build pipeline, modelled on `build/spglib/` (single-tool):

| File | Role |
|---|---|
| `build.sh` | Fetch ripser v1.2.1, clang++ compile, wasm-opt, determinism test |
| `Dockerfile` | Pinned wasi-sdk / wasmtime / binaryen build environment |
| `README.md` | Build instructions and maintainer hand-off documentation |
| `.gitignore` | Excludes build output |

No thin driver &mdash; `ripser.cpp` is already a CLI with `main()`. The
smoke-test gates on determinism: two runs of the fixed 3-point lower-distance
matrix must produce byte-identical output.

### Maintainer hand-off (samtools)

1. `docker build -t samtools-builder build/samtools/`
2. `docker run --rm -v $(pwd):/work samtools-builder`
3. Copy `samtools.wasm` to `kit/samtools/artifacts/`
4. Stamp the real sha256 in `kit.json`
5. Flip `verified: true`
6. Capture non-gated golden outputs (view, tabix-list, bgzip) into manifest
7. Run `npm run verify` + `npm run license-gate -- samtools`

### Maintainer hand-off (ripser)

1. `docker build -t ripser-builder build/ripser/`
2. `docker run --rm -v $(pwd):/work ripser-builder`
3. Copy `ripser.wasm` to `kit/ripser/artifacts/`
4. Stamp the real sha256 in `kit.json`
5. Flip `verified: true`
6. Capture the barcode golden output into manifest
7. Run `npm run verify` + `npm run license-gate -- ripser`

## Related files

- Kit definitions: `kit/{samtools,ripser,pyproj,vector,basis-set-exchange}/`
- Build pipelines: `build/samtools/`, `build/ripser/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 64, KNOWN_JSWASM: 11)
- Vendor descriptors: `tooling/import-data.mjs`

## Changelog

- **2026-06-22**: Batch-7 authored &mdash; 3 pyodide kits (all loose) + 2 wasi
  build kits (both strict), all green on verify + license-gate. 3 vendor kits
  pass verify (`verified: true`); samtools and ripser await maintainer builds.
  regex dependency for basis-set-exchange resolved: bundled as Pyodide-compiled
  wheel from v0.29.4 CDN.

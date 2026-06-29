# Batch-11 scientific kits

## Summary

This batch adds five new kits (90 &rarr; 95), filling verified capability gaps in
RF/microwave network analysis, computational-chemistry log parsing, tight-binding
electronic structure, long-read genome alignment, and de-novo phylogenetic tree
inference. Three are pyodide vendor kits (scikit-rf, cclib, pythtb) with
`verified: true` and real hashed bytes. Two (minimap2, fasttree) are honest
`verified: false` WASI skeletons &mdash; full metadata, strict manifests with
natively-captured goldens, and `wasi` build recipes, but **no artifact bytes**;
the actual WASI compilation is deferred to a follow-on spec.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| cclib | 1.8.1 | pyodide | loose | Parse computational-chemistry program output (Gaussian/ORCA/Q-Chem/NWChem/GAMESS) into typed arrays: geometries, MO energies, vibrational modes, charges. |
| fasttree | 2.2.0 | wasi | strict | De-novo approximately-ML phylogenetic tree inference from a multiple-sequence alignment &rarr; Newick (skeleton, .wasm build pending). |
| minimap2 | 2.31 | wasi | strict | Long-read / spliced / genome aligner: seed-chain-align &rarr; PAF/SAM with CIGAR (skeleton, .wasm build pending). |
| pythtb | 2.0.2 | pyodide | loose | Tight-binding electronic structure: TB Hamiltonians, band structures, Berry phase / Wannier centers, topological invariants. |
| scikit-rf | 2.0.0 | pyodide | loose | RF/microwave network analysis: S-parameters, Touchstone I/O, multi-port cascading, S&harr;Z&harr;Y&harr;ABCD conversions, calibration. |

### Catalogue impact

- **Pyodide**: 70 &rarr; 73 (+ scikit-rf, cclib, pythtb)
- **WASI**: 7 &rarr; 9 (+ minimap2, fasttree &mdash; skeletons, build pending)
- **jswasm**: 13 (unchanged)
- **Total**: 90 &rarr; 95 kits
- **Published**: 90 (unchanged &mdash; none of the 5 new kits is published yet)

### Publish status

The three pyodide vendor kits are authored, verified (`verified: true`), and
publish-ready (`--dry-run` green). The two WASI skeletons are `verified: false`
with empty `artifacts: []` and cannot be published until the follow-on WASI build
compiles their `.wasm` bytes. Each requires a `<id>@<ver>` tag push through the
standard pipeline (see [publish.md](../../.claude/rules/publish.md)):

- `scikit-rf@2.0.0` (ready)
- `cclib@1.8.1` (ready)
- `pythtb@2.0.2` (ready)
- `minimap2@2.31` (awaits WASI build)
- `fasttree@2.2.0` (awaits WASI build)

## Notable design decisions

### scikit-rf &mdash; pure-Python pyodide vendor

scikit-rf is a pure-Python package (`py3-none-any` wheel from PyPI). It provides
RF/microwave network analysis: S-parameters, Touchstone I/O, multi-port
cascading, S&harr;Z&harr;Y&harr;ABCD conversions, and calibration (import
`skrf`). Shared dependencies: numpy (2.2.5), scipy (1.14.1), pandas (2.3.3).
License token `BSD-3-Clause`. The golden creates a simple 50-ohm network and
reads back its characteristic impedance &rarr; `"150.0"`.

### cclib &mdash; pure-Python pyodide vendor

cclib is a pure-Python computational-chemistry log parser (`py3-none-any` wheel
from PyPI). It parses output from Gaussian, ORCA, Q-Chem, NWChem, GAMESS, and
other programs into typed numeric arrays (geometries, MO energies, vibrational
modes, charges). Shared dependencies: numpy (2.2.5), scipy (1.14.1),
periodictable (2.1.0), packaging (26.2). License token `BSD-3-Clause`.

### pythtb &mdash; pure-Python pyodide vendor (matplotlib lazy)

pythtb is a pure-Python tight-binding Hamiltonian toolkit (`py3-none-any` wheel
from PyPI). The matplotlib dependency question (BR-009) was resolved: `import
pythtb` does **not** require matplotlib at import time (lazy import). matplotlib
is not a kit dependency. Shared dependency: numpy (2.2.5). License token
`GPL-3.0-or-later`. The golden constructs a 1D SSH chain and solves its
eigenvalues &rarr; `"[-1.0, 1.0]"`.

### minimap2 &mdash; WASI skeleton (build pending)

minimap2 is a fast long-read / spliced genome aligner (MIT license). This batch
delivers a `verified: false` skeleton: full metadata, a strict manifest with one
`map` operation (map-ont preset, `-t 1` for determinism), a natively-captured
golden (PAF output), and a `wasi` build recipe pointing to the intended
`build/minimap2/Dockerfile`. No `.wasm` bytes &mdash; the actual WASI compilation
is deferred to a follow-on spec using the existing `build/wasi` toolchain.

### fasttree &mdash; WASI skeleton (build pending)

FastTree is a single-C-file approximately-ML phylogenetic tree tool
(GPL-2.0-or-later, dual GPLv3 noted in `buildNote`). This batch delivers a
`verified: false` skeleton: full metadata, a strict manifest with one `infer-nt`
operation, a natively-captured golden (Newick tree from a 4-sequence FASTA), and
a `wasi` build recipe with `-DNO_SSE` pointing to `build/fasttree/Dockerfile`.
No `.wasm` bytes &mdash; build deferred to the follow-on WASI spec.

## Per-kit details

### scikit-rf (RF/microwave network analysis)

- **Upstream**: [scikit-rf](https://github.com/scikit-rf/scikit-rf) v2.0.0
- **License**: BSD-3-Clause
- **Tags**: physics, signal
- **Mode**: loose (pyodide, import `skrf`)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), pandas (2.3.3)
- **Status**: `verified: true`

### cclib (computational-chemistry log parsing)

- **Upstream**: [cclib](https://github.com/cclib/cclib) v1.8.1
- **License**: BSD-3-Clause
- **Tags**: chemistry, data-science
- **Mode**: loose (pyodide, import `cclib`)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), periodictable (2.1.0), packaging (26.2)
- **Status**: `verified: true`

### pythtb (tight-binding electronic structure)

- **Upstream**: [pythtb](https://github.com/pythtb/pythtb) v2.0.2
- **License**: GPL-3.0-or-later
- **Tags**: physics, structure
- **Mode**: loose (pyodide, import `pythtb`)
- **Shared deps**: numpy (2.2.5)
- **Status**: `verified: true`

### minimap2 (long-read genome alignment)

- **Upstream**: [minimap2](https://github.com/lh3/minimap2) v2.31
- **License**: MIT
- **Tags**: sequences, genomics
- **Mode**: strict (wasi, 1 operation: `map`)
- **Status**: `verified: false` &mdash; skeleton, .wasm build pending

### fasttree (phylogenetic tree inference)

- **Upstream**: [FastTree](http://www.microbesonline.org/fasttree/) v2.2.0
- **License**: GPL-2.0-or-later
- **Tags**: phylogenetics, sequences
- **Mode**: strict (wasi, 1 operation: `infer-nt`)
- **Status**: `verified: false` &mdash; skeleton, .wasm build pending

## Related files

- Kit definitions: `kit/{scikit-rf,cclib,pythtb,minimap2,fasttree}/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 82, KNOWN_JSWASM: 13)

## Changelog

- **2026-06-29**: Batch-11 authored &mdash; 3 pyodide vendor kits (scikit-rf,
  cclib, pythtb), all loose, `verified: true`, real hashed bytes; 2 WASI
  skeletons (minimap2, fasttree), strict, `verified: false`, no bytes. All green
  on `npm run verify` + `npm run license-gate`. The 3 pyodide kits pass
  `publish-kit --dry-run`; the WASI skeletons await a follow-on build spec.

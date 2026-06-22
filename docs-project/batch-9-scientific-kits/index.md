# Batch-9 scientific kits

## Summary

This batch adds five new kits (80 &rarr; 85), filling verified capability gaps in
exact polynomial arithmetic, particle-physics profile-likelihood fitting, multiple
sequence alignment, quantum circuit simulation, and spectral baseline correction.
Four are pyodide vendor kits (flint, pyhf, cirq, pybaselines) and one is a jswasm
callable kit (kalign).

All five kits are authored and verified (`verified: true`, real hashed bytes,
goldens captured from live execution).

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| cirq | 1.6.1 | pyodide | loose | Gate-level quantum circuit construction and state-vector / density-matrix simulation (Cirq core). |
| flint | 0.8.0 | pyodide | loose | Exact polynomial, number-theory, and matrix arithmetic with certified ball arithmetic (FLINT/Arb). |
| kalign | 3.3.1-1.0.0 | jswasm | callable | Fast multiple sequence alignment (MSA) of DNA/RNA/protein (kalign, WASM). |
| pybaselines | 1.2.1 | pyodide | loose | Baseline fitting for spectral/chromatographic data: 50+ algorithms (Whittaker, polynomial, morphological, spline). |
| pyhf | 0.7.6 | pyodide | loose | Binned HistFactory profile-likelihood fits and CLs limit-setting (numpy backend). |

### Catalogue impact

- **Pyodide**: 61 &rarr; 65 (+ cirq, flint, pybaselines, pyhf)
- **WASI**: 7 (unchanged)
- **jswasm**: 12 &rarr; 13 (+ kalign)
- **Total**: 80 &rarr; 85 kits

### Publish status

All five kits are authored and verified (`verified: true`). None are published
yet; each requires a `<id>@<ver>` tag push through the standard pipeline (see
[publish.md](../../.claude/rules/publish.md)):

- `cirq@1.6.1`
- `flint@0.8.0`
- `kalign@3.3.1-1.0.0`
- `pybaselines@1.2.1`
- `pyhf@0.7.6`

## Notable design decisions

### flint &mdash; pyodide-built emscripten wheel (v0.29.4)

python-flint is a compiled C-extension package wrapping the native FLINT/Arb
library. The kit vendors the pyodide-built emscripten wheel from the v0.29.4 CDN
(not the PyPI manylinux wheel, which won't load in the shared Pyodide
interpreter). The license token is `MIT` (the python-flint binding license); the
LGPL-2.1-or-later license of the underlying native FLINT/Arb library is
documented in `provenance.buildNote`. No shared-kit dependencies
(`dependencies: []`).

### cirq &mdash; cirq-core with bundled exclusive deps

The kit pins `cirq-core 1.6.1` (the core package, not the `cirq` metapackage
which pulls hardware/cloud extras). Five pure-Python exclusive dependencies are
bundled into `artifacts[]`: attrs, duet, sortedcontainers, tqdm, and
typing_extensions. Shared deps (numpy, scipy, sympy, networkx, pandas) are listed
in `dependencies[]`. matplotlib is a lazy import and is not bundled or listed as a
dependency.

### pyhf &mdash; numpy backend with bundled exclusive deps

pyhf is vendored with the default numpy backend only (no iminuit/torch/jax/
tensorflow optional extras). Five pure-Python exclusive dependencies are bundled
into `artifacts[]`: click, jsonpatch, jsonpointer, jsonschema, and tqdm. Shared
deps (numpy, scipy, pyyaml) are listed in `dependencies[]`. The jsonschema
transitive deps (attrs, rpds-py, referencing, jsonschema-specifications) are
resolved by the Pyodide runtime from CDN, following the basis-set-exchange
precedent.

### kalign &mdash; jswasm callable, biowasm v3 single-threaded build

kalign is vendored from the biowasm v3 CDN as a single-threaded Emscripten build
(no pthreads / SharedArrayBuffer / `role: worker` artifact). The callable manifest
uses `operations: []` + `scriptable: true` with a `scriptGolden` that aligns 3
short DNA sequences via `callMain` and FS, producing deterministic gapped FASTA
output. The loader block is `{entry: artifacts/kalign.js, moduleSystem: cjs,
initStyle: factory, wasmSupply: locateFile}`.

### pybaselines &mdash; pure-Python wheel, numpy + scipy deps only

pybaselines is a pure-Python package (`py3-none-any` wheel from PyPI). It depends
only on numpy and scipy (both existing shared kits). The golden uses AsLS baseline
fitting on a fixed synthetic signal with pinned parameters and rounded output for
cross-ABI stability.

## Per-kit details

### cirq (quantum circuit simulation)

- **Upstream**: [cirq-core](https://github.com/quantumlib/Cirq) v1.6.1
- **License**: Apache-2.0
- **Tags**: physics, math
- **Mode**: loose (pyodide, import `cirq`)
- **Golden**: Bell-state circuit &rarr; rounded state vector `"[0.707, 0.000, 0.000, 0.707]"`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), sympy (1.13.3), networkx (3.4.2), pandas (2.3.3)
- **Bundled deps**: attrs (26.1.0), duet (0.2.9), sortedcontainers (2.4.0), tqdm (4.68.3), typing_extensions (4.15.0)
- **Status**: `verified: true`

### flint (exact polynomial / number-theory arithmetic)

- **Upstream**: [python-flint](https://github.com/flintlib/python-flint) v0.8.0
- **License**: MIT
- **Tags**: math, symbolic
- **Mode**: loose (pyodide, import `flint`)
- **Golden**: factor x&sup2;&minus;1 &rarr; `"(1, [(x + (-1), 1), (x + 1, 1)])"`
- **Dependencies**: none (self-contained compiled wheel)
- **Status**: `verified: true`

### kalign (multiple sequence alignment)

- **Upstream**: [kalign](https://github.com/TimoLassmann/kalign) v3.3.1 (biowasm v3)
- **License**: Apache-2.0
- **Tags**: biology, sequences
- **Mode**: callable (jswasm, single-threaded)
- **Artifacts**: `kalign.js` (loader) + `kalign.wasm` (binary)
- **Loader**: `{entry: artifacts/kalign.js, moduleSystem: cjs, initStyle: factory, wasmSupply: locateFile}`
- **scriptGolden**: align 3 short DNA sequences via callMain &rarr; gapped FASTA output (captured live in Node)
- **Descriptor**: `tooling/jswasm-vendor-data.mjs` (`JSWASM_KITS`)
- **Status**: `verified: true`

### pybaselines (spectral baseline fitting)

- **Upstream**: [pybaselines](https://github.com/derb12/pybaselines) v1.2.1
- **License**: BSD-3-Clause
- **Tags**: signal, chemistry
- **Mode**: loose (pyodide, import `pybaselines`)
- **Golden**: AsLS baseline on fixed synthetic signal &rarr; rounded baseline values
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Status**: `verified: true`

### pyhf (profile-likelihood fits)

- **Upstream**: [pyhf](https://github.com/scikit-hep/pyhf) v0.7.6
- **License**: Apache-2.0
- **Tags**: physics, statistics, fitting
- **Mode**: loose (pyodide, import `pyhf`)
- **Golden**: uncorrelated_background model CLs &rarr; `"0.602043"`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), pyyaml (6.0.2)
- **Bundled deps**: click (8.1.8), jsonpatch (1.33), jsonpointer (3.0.0), jsonschema (4.23.0), tqdm (4.68.3)
- **Status**: `verified: true`

## Related files

- Kit definitions: `kit/{cirq,flint,kalign,pybaselines,pyhf}/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 72, KNOWN_JSWASM: 13)
- Vendor descriptors: `tooling/jswasm-vendor-data.mjs` (kalign)

## Changelog

- **2026-06-22**: Batch-9 authored &mdash; 4 pyodide vendor kits (all loose,
  `verified: true`, real hashed bytes) + 1 jswasm callable kit (kalign,
  `verified: true`). All five green on `npm run verify` + `npm run license-gate`.
  flint vendors the pyodide v0.29.4 emscripten wheel (compiled C-extension);
  cirq bundles 5 exclusive pure-Python deps; pyhf bundles 5 exclusive deps;
  kalign vendored from biowasm v3 single-threaded build; pybaselines is a
  pure-Python wheel with numpy + scipy deps only.

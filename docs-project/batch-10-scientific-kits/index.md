# Batch-10 scientific kits

## Summary

This batch adds five new kits (85 &rarr; 90), filling verified capability gaps in
nonlinear optimization / algorithmic differentiation, graph analytics, fluid
dynamics, NMR spectroscopy, and optimal transport. Four are pyodide vendor kits
(casadi, igraph, fluids, nmrglue) with `verified: true` and real hashed bytes.
The fifth (pot) was initially scaffolded as a `verified: false` skeleton (the repo
had no pyodide-from-source build toolchain), then **built from source** in-session:
a reproducible `build/pot/` toolchain (pyodide-build 0.35.1 xbuildenv 0.28.0 +
emscripten 4.0.9) compiles its Cython + C++ EMD network-simplex extension to a
`pyemscripten_2025_0_wasm32` wheel matching the repo cohort. All five are now
`verified: true`.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| casadi | 3.7.0 | pyodide | loose | Nonlinear optimization with sparse symbolic & algorithmic differentiation, NLP modeling, ODE/DAE integrators. |
| fluids | 1.3.0 | pyodide | loose | Fluid dynamics & hydraulics: friction factors, Reynolds number, pipe flow, pumps, drag, two-phase flow. |
| igraph | 0.11.8 | pyodide | loose | Fast C-core graph analytics: community detection, centralities, motifs, max-flow, VF2 isomorphism. |
| nmrglue | 0.11 | pyodide | loose | NMR spectroscopy data processing: read Bruker/Varian/NMRPipe, apodization, FT, phase correction, peak picking. |
| pot | 0.9.6.post1 | pyodide | loose | Optimal transport: Wasserstein/EMD, Sinkhorn, Gromov-Wasserstein, barycenters (built-from-source pyodide wheel). |

### Catalogue impact

- **Pyodide**: 65 &rarr; 70 (+ casadi, igraph, fluids, nmrglue, pot)
- **WASI**: 7 (unchanged)
- **jswasm**: 13 (unchanged)
- **Total**: 85 &rarr; 90 kits

### Publish status

All five kits are authored and verified (`verified: true`) with real hashed bytes.
None are published yet; each requires a `<id>@<ver>` tag push through the standard
pipeline (see [publish.md](../../.claude/rules/publish.md)):

- `casadi@3.7.0`
- `fluids@1.3.0`
- `igraph@0.11.8`
- `nmrglue@0.11`
- `pot@0.9.6.post1`

## Notable design decisions

### casadi &mdash; pyodide-built emscripten wheel (v0.29.4)

CasADi is a compiled C-extension package for nonlinear optimization with
algorithmic differentiation. The kit vendors the pyodide-built emscripten wheel
from the v0.29.4 CDN (ABI `pyemscripten_2025_0_wasm32`). Single shared
dependency: numpy 2.2.5. License token `LGPL-3.0-or-later`. The golden evaluates
the derivative of x&sup2; at x=3 &rarr; `"6"` (int(float()) rounding per TR-009).

### igraph &mdash; compiled wheel with bundled texttable

python-igraph is a compiled C-extension graph analytics library. The kit vendors
the pyodide-built wheel from the v0.29.4 CDN (ABI `pyodide_2025_0_wasm32`).
texttable (1.7.0) is bundled as an exclusive dependency in `artifacts[]`; no shared
dependencies (`dependencies: []`). License token `GPL-2.0-or-later`. The golden
uses a seed-independent structural property: Famous('zachary') vertex/edge count
&rarr; `"(34, 78)"`.

### fluids &mdash; pure-Python wheel, numpy + scipy deps

fluids is a pure-Python package (`py3-none-any` wheel from PyPI). It depends on
numpy and scipy (both existing shared kits). The golden computes
`fluids.Reynolds(V=2.5, D=0.25, rho=1000, mu=1e-3)` &rarr; `"625000.0"`, a
mathematically exact result.

### nmrglue &mdash; pure-Python wheel, numpy + scipy deps

nmrglue is a pure-Python NMR spectroscopy toolkit (`py2.py3-none-any` wheel from
PyPI). It depends on numpy and scipy (both existing shared kits). License token
`BSD-3-Clause`. The golden applies a deterministic numpy-only FFT transform via
`nmrglue.proc_base.fft`.

### pot &mdash; built from source (first pyodide-native build)

POT (Python Optimal Transport) is not in the pyodide CDN distribution, so it
cannot be vendored &mdash; its Cython + C++ EMD network-simplex extension must be
compiled. This is the repo's first **pyodide-from-source** build (prior `build/`
entries are all WASI C&rarr;wasm). A reproducible `build/pot/` toolchain
(Dockerfile + build.sh) uses pyodide-build 0.35.1 + xbuildenv 0.28.0 + emscripten
4.0.9 (Python 3.13.2) to produce a `pyemscripten_2025_0_wasm32` wheel matching the
repo's numpy/scipy/casadi cohort. OpenMP auto-disables (POT's
`check_openmp_support()` probe fails under emcc &mdash; single-threaded, no patch
needed). The wheel was validated in a real pyodide 0.28.0 venv (node-backed)
against numpy 2.2.5 + scipy 1.14.1: golden `ot.emd2([0.5,0.5],[0.0,1.0],...)` &rarr;
`"0.5"` &mdash; real-runtime proof, not a host-CPython capture. `recipe.json` uses
`track: pyodide-native`; `provenance.buildNote` records the toolchain.

## Per-kit details

### casadi (nonlinear optimization)

- **Upstream**: [CasADi](https://github.com/casadi/casadi) v3.7.0
- **License**: LGPL-3.0-or-later
- **Tags**: optimization, symbolic, math
- **Mode**: loose (pyodide, import `casadi`)
- **Golden**: derivative of x&sup2; at x=3 &rarr; `"6"`
- **Shared deps**: numpy (2.2.5)
- **Status**: `verified: true`

### fluids (fluid dynamics & hydraulics)

- **Upstream**: [fluids](https://github.com/CalebBell/fluids) v1.3.0
- **License**: MIT
- **Tags**: physics, units
- **Mode**: loose (pyodide, import `fluids`)
- **Golden**: Reynolds(V=2.5, D=0.25, rho=1000, mu=1e-3) &rarr; `"625000.0"`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Status**: `verified: true`

### igraph (graph analytics)

- **Upstream**: [python-igraph](https://github.com/igraph/python-igraph) v0.11.8
- **License**: GPL-2.0-or-later
- **Tags**: graphs, data-science
- **Mode**: loose (pyodide, import `igraph`)
- **Golden**: Famous('zachary') vertex/edge count &rarr; `"(34, 78)"`
- **Bundled deps**: texttable (1.7.0)
- **Dependencies**: none (texttable is exclusive, bundled)
- **Status**: `verified: true`

### nmrglue (NMR spectroscopy)

- **Upstream**: [nmrglue](https://github.com/jjhelmus/nmrglue) v0.11
- **License**: BSD-3-Clause
- **Tags**: chemistry, signal
- **Mode**: loose (pyodide, import `nmrglue`)
- **Golden**: deterministic FFT transform via `nmrglue.proc_base.fft`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Status**: `verified: true`

### pot (optimal transport)

- **Upstream**: [POT](https://github.com/PythonOT/POT) v0.9.6.post1
- **License**: MIT
- **Tags**: optimization, ml, statistics
- **Mode**: loose (pyodide, import `ot`)
- **Golden**: `ot.emd2([0.5,0.5],[0.0,1.0],[[0.0,1.0],[1.0,0.0]])` &rarr; `"0.5"` (validated in real pyodide 0.28.0)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Build**: from source via `build/pot/` (pyodide-build 0.35.1 + emscripten 4.0.9)
- **Status**: `verified: true`

## Related files

- Kit definitions: `kit/{casadi,fluids,igraph,nmrglue,pot}/`
- POT build toolchain: `build/pot/` (Dockerfile + build.sh + README)
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 77, KNOWN_JSWASM: 13)

## Changelog

- **2026-06-22**: Batch-10 authored &mdash; 5 pyodide kits, all loose,
  `verified: true`, real hashed bytes. All green on `npm run verify` +
  `npm run license-gate` + `publish-kit --dry-run`. casadi and igraph vendor
  pyodide emscripten wheels (compiled C-extensions); igraph bundles texttable as
  an exclusive dep; fluids and nmrglue are pure-Python wheels with numpy + scipy
  deps.
- **2026-06-22**: pot **built from source** in-session &mdash; initially a
  `verified: false` skeleton, then compiled to a `pyemscripten_2025_0_wasm32`
  wheel via a new reproducible `build/pot/` toolchain (pyodide-build 0.35.1 +
  xbuildenv 0.28.0 + emscripten 4.0.9). Wheel validated in a real pyodide 0.28.0
  venv (golden `ot.emd2` &rarr; `0.5`). Now `verified: true`. This is the repo's
  first pyodide-from-source artifact build.

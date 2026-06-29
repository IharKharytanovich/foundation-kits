# Batch-12 scientific kits

## Summary

This batch adds five new kits (95 &rarr; 100), filling verified capability gaps in
time-domain electromagnetic simulation (FDTD), robot kinematics, physical/Fourier
optics, graph signal processing, and lattice basis reduction. All five are pyodide
vendor kits with `verified: true` and real hashed bytes. Four (fdtd, ikpy, pygsp,
olll) are vendored from prebuilt `py3-none-any` wheels on PyPI. One (prysm) was
built from its sdist (`prysm-0.21.1.tar.gz`) since PyPI carries no prebuilt wheel
for 0.21.1; the resulting `py2.py3-none-any` wheel is pure-Python with no compiled
extensions.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| fdtd | 0.3.5 | pyodide | loose | FDTD electromagnetic wave simulation on 1-D/2-D/3-D grids (Yee algorithm, PML boundaries). |
| ikpy | 3.4.2 | pyodide | loose | Robot kinematics: forward/inverse kinematics and Jacobians over URDF/programmatic kinematic chains. |
| olll | 1.0.2 | pyodide | loose | LLL lattice basis reduction in exact rational arithmetic (Lenstra-Lenstra-Lov&aacute;sz). |
| prysm | 0.21.1 | pyodide | loose | Physical/Fourier optics: PSF, MTF, Zernike wavefronts, interferometry, optical propagation (built from sdist). |
| pygsp | 0.6.1 | pyodide | loose | Graph signal processing: graph Fourier transform, spectral filter banks, graph wavelets. |

### Catalogue impact

- **Pyodide**: 73 &rarr; 78 (+ fdtd, ikpy, olll, prysm, pygsp)
- **WASI**: 9 (unchanged)
- **jswasm**: 13 (unchanged)
- **Total**: 95 &rarr; 100 kits
- **Published**: 90 (unchanged &mdash; none of the 5 new kits is published yet)
- **Pending first publish**: 5 &rarr; 10

### Publish status

All five kits are authored, verified (`verified: true`), and publish-ready
(`--dry-run` green). Each requires a `<id>@<ver>` tag push through the standard
pipeline (see [publish.md](../../.claude/rules/publish.md)):

- `fdtd@0.3.5` (ready)
- `ikpy@3.4.2` (ready)
- `olll@1.0.2` (ready)
- `prysm@0.21.1` (ready)
- `pygsp@0.6.1` (ready)

## Notable design decisions

### fdtd &mdash; numpy backend only

fdtd supports both NumPy and PyTorch backends. This kit selects the NumPy backend
exclusively (`fdtd.set_backend('numpy')`); the optional PyTorch backend is not
available. matplotlib and tqdm are imported at module load time but are provided
by the pyodide distribution and are not bundled as kit dependencies. Shared deps:
numpy (2.2.5), scipy (1.14.1). License: MIT. Tags: physics, pde.

### ikpy &mdash; sympy as core dependency

ikpy requires sympy at load time for symbolic rotation matrices. sympy is an
existing kit and is listed in `dependencies[]` (sympy 1.13.3) alongside numpy and
scipy. The optional `plot` extra (matplotlib, graphviz) is not available and not
imported. License: Apache-2.0 (confirmed from the repo LICENSE file; PyPI metadata
lacked a classifier). Tags: physics, optimization.

### prysm &mdash; built from sdist

PyPI 0.21.1 is sdist-only; prysm is pure-Python so the wheel was built locally
with `python -m build --wheel` from the tarball. The resulting wheel tag is
`py2.py3-none-any` (upstream declares Python 2+3 compatibility). The artifact
sha256 is the hash of the built wheel; `recipe.json.source` records the sdist URL
and sha256. matplotlib, h5py, and imageio are optional extras, not imported by the
golden. Shared deps: numpy (2.2.5), scipy (1.14.1). License: MIT. Tags: physics,
signal.

### pygsp &mdash; numpy+scipy core only

PyGSP's networkx and matplotlib dependencies are optional extras, not required for
graph construction or spectral computation. The golden runs on numpy+scipy alone.
License: BSD-3-Clause (confirmed from the repo LICENSE file; PyPI listed bare
`BSD`). Shared deps: numpy (2.2.5), scipy (1.14.1). Tags: graphs, signal.

### olll &mdash; zero dependencies

olll is pure standard-library Python (`fractions.Fraction`). It has zero
third-party dependencies &mdash; `dependencies: []` in kit.json. License: MIT.
Tags: math.

## Per-kit details

### fdtd (FDTD electromagnetic wave simulation)

- **Upstream**: [fdtd](https://github.com/flaport/fdtd) v0.3.5
- **License**: MIT
- **Tags**: physics, pde
- **Mode**: loose (pyodide, import `fdtd`)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Status**: `verified: true`

### ikpy (robot kinematics)

- **Upstream**: [ikpy](https://github.com/Phylliade/ikpy) v3.4.2
- **License**: Apache-2.0
- **Tags**: physics, optimization
- **Mode**: loose (pyodide, import `ikpy`)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), sympy (1.13.3)
- **Status**: `verified: true`

### olll (LLL lattice basis reduction)

- **Upstream**: [olll](https://github.com/orisano/olll) v1.0.2
- **License**: MIT
- **Tags**: math
- **Mode**: loose (pyodide, import `olll`)
- **Shared deps**: none
- **Status**: `verified: true`

### prysm (physical/Fourier optics)

- **Upstream**: [prysm](https://github.com/brandondube/prysm) v0.21.1
- **License**: MIT
- **Tags**: physics, signal
- **Mode**: loose (pyodide, import `prysm`)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Provenance**: wheel built from sdist (pure-Python, no compiled extensions)
- **Status**: `verified: true`

### pygsp (graph signal processing)

- **Upstream**: [PyGSP](https://github.com/epfl-lts2/pygsp) v0.6.1
- **License**: BSD-3-Clause
- **Tags**: graphs, signal
- **Mode**: loose (pyodide, import `pygsp`)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Status**: `verified: true`

## Related files

- Kit definitions: `kit/{fdtd,ikpy,olll,prysm,pygsp}/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 87, KNOWN_JSWASM: 13)

## Changelog

- **2026-06-29**: Batch-12 authored &mdash; 5 pyodide vendor kits (fdtd, ikpy,
  olll, prysm, pygsp), all loose, `verified: true`, real hashed bytes. All green
  on `npm run verify` + `npm run license-gate`. All 5 kits pass
  `publish-kit --dry-run`; publishing (tag &rarr; CI &rarr; Release) is a
  separate maintainer action.

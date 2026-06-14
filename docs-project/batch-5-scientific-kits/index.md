# Batch-5 scientific kits

## Summary

This batch adds four new kits (61 &rarr; 65), filling verified capability gaps in
statistics/econometrics, image processing, control systems, and crystallography.
Three are pyodide vendor kits (statsmodels, scikit-image, control) and one is a
wasi build kit (spglib). A fifth candidate (pyproj) was dropped &mdash; absent
from the pinned Pyodide v0.28.0 CDN.

This batch also introduces the second wasi build pipeline (`build/spglib/`),
following the `build/z3/` precedent.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| control | 0.10.2 | pyodide | loose | Feedback control systems: transfer functions, state-space, Bode/Nyquist, LQR. |
| scikit-image | 0.25.2 | pyodide | loose | Image processing on NumPy arrays: filtering, morphology, segmentation, features. |
| spglib | 2.7.0 | wasi | strict | Crystal symmetry: space-group determination, primitive cells, symmetry operations. |
| statsmodels | 0.14.4 | pyodide | loose | Statistical modelling, hypothesis testing, and econometrics (OLS, GLM, ARIMA). |

### Catalogue impact

- **Pyodide**: 48 &rarr; 51 (+ statsmodels, scikit-image, control)
- **WASI**: 3 &rarr; 4 (+ spglib)
- **jswasm**: 10 (unchanged)
- **Total**: 61 &rarr; 65 kits

### Publish status

The three pyodide vendor kits are authored and verified (`verified: true`),
passing `publish-kit --dry-run`. spglib is `verified: false` &mdash; the WASI
cross-compile is a maintainer hand-off (see `build/spglib/README.md`). None are
published yet; each requires a `<id>@<ver>` tag push through the standard
pipeline (see [publish.md](../../.claude/rules/publish.md) and
[PUBLISH.md](../../specs/batch-5-scientific-kits/PUBLISH.md)).

### Dropped: pyproj

pyproj (cartographic projections / CRS transforms) was planned as a C-extension
pyodide kit but is absent from the Pyodide v0.28.0 CDN. No emscripten wheel is
available. It may be added in a future batch if a Pyodide build becomes available
or via the `pyodide-native` build track.

## Notable design decisions

### spglib as a wasi build kit

spglib has no upstream CLI and no prebuilt WASM distribution. A thin C CLI
wrapper (`build/spglib/spglib_cli.c`) was authored to read a crystal structure on
stdin and print the space-group result to stdout, matching the Foundation WASI
contract. The build pipeline (`build/spglib/`) uses CMake + wasi-sdk
(single-threaded, no pthreads) and follows the `build/z3/` precedent. The kit is
`verified: false` until a maintainer runs the cross-compile and stamps the real
sha256.

### Bundled dependencies

- **statsmodels** bundles `patsy` (exclusive dep, single consumer).
- **scikit-image** bundles `pillow`, `imageio`, and `lazy_loader` (exclusive deps).
- All other dependencies are shared kits already in the catalogue (numpy, scipy,
  pandas, packaging, networkx, pywavelets, tifffile).

### control &mdash; matplotlib limitation

python-control lists matplotlib as an unconditional METADATA dependency, but
matplotlib is unavailable in the Pyodide sandbox (heavy native C extension). All
plotting functions are unreachable. This is documented in `instruction.md`
("When NOT to Use").

## Per-kit details

### statsmodels (statistical modelling)

- **Upstream**: [statsmodels](https://pypi.org/project/statsmodels/) v0.14.4
- **License**: BSD-3-Clause
- **Tags**: statistics, data-science
- **Golden**: OLS slope + R&sup2; &rarr; `(2.0, 1.0)`
- **Shared deps**: numpy, scipy, pandas, packaging
- **Bundled deps**: patsy

### scikit-image (image processing)

- **Upstream**: [scikit-image](https://pypi.org/project/scikit-image/) v0.25.2
- **License**: BSD-3-Clause
- **Tags**: data-science, signal
- **Golden**: Otsu threshold of camera image &rarr; `102`
- **Shared deps**: numpy, scipy, networkx, pywavelets, tifffile, packaging
- **Bundled deps**: pillow, imageio, lazy_loader

### control (feedback control systems)

- **Upstream**: [python-control](https://pypi.org/project/control/) v0.10.2
- **License**: BSD-3-Clause
- **Tags**: signal, math
- **Golden**: DC gain of `1/(s^2+2s+1)` &rarr; `1.0`
- **Shared deps**: numpy, scipy
- **Limitation**: matplotlib unavailable (plotting unreachable)

### spglib (crystal symmetry)

- **Upstream**: [spglib](https://github.com/spglib/spglib) v2.7.0
- **License**: BSD-3-Clause
- **Tags**: structure, chemistry
- **Mode**: strict (wasi CLI, stdin&rarr;stdout)
- **Golden**: BCC iron &rarr; `Im-3m (229)`
- **Build pipeline**: `build/spglib/` (CMake + wasi-sdk, single-threaded)
- **Status**: `verified: false` &mdash; maintainer hand-off for wasi cross-compile

## The `build/spglib/` pipeline

The second wasi build pipeline in the factory, modelled on `build/z3/`:

| File | Role |
|---|---|
| `Dockerfile` | Pinned wasi-sdk / wasmtime / binaryen build environment |
| `build.sh` | Fetch source, CMake configure, build, wasm-opt, smoke-test |
| `spglib_cli.c` | Thin C CLI wrapper (stdin &rarr; stdout) |
| `README.md` | Build instructions and maintainer hand-off documentation |

The smoke-test step compares `wasmtime` output against the manifest golden
(`Im-3m (229)` for BCC iron).

## Related files

- Kit definitions: `kit/{statsmodels,scikit-image,control,spglib}/`
- Build pipeline: `build/spglib/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 56, KNOWN_JSWASM: 10)
- Vendor descriptors: `tooling/import-data.mjs`
- Publish runbook: `specs/batch-5-scientific-kits/PUBLISH.md`

## Changelog

- **2026-06-14**: Batch-5 authored &mdash; 3 pyodide kits (all loose) + 1 wasi
  build kit (strict), pywavelets dep fix for scikit-image, spglib build pipeline,
  all green on verify + license-gate. 3 vendor kits pass publish-kit --dry-run;
  spglib awaits maintainer build.

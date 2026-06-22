# build/pot — POT (Python Optimal Transport) pyodide wheel

Reproducible build of the `pot` kit's artifact: a pyodide-compatible emscripten
wheel built from POT's source (POT is **not** in the pyodide CDN distribution, so
it cannot be vendored — it must be compiled).

## What it produces

`pot-<ver>-cp313-cp313-pyemscripten_2025_0_wasm32.whl` — platform tag matches the
repo's pyodide 0.28.0 cohort (numpy 2.2.5, scipy 1.14.1, casadi 3.7.0), so it
loads in the same shared interpreter and links the matching numpy C-ABI.

## Toolchain (pinned)

| Component | Version |
|---|---|
| pyodide cross-build env | 0.28.0 |
| pyodide-build | 0.35.1 |
| emscripten (emsdk) | 4.0.9 |
| Python (target) | 3.13.2 |
| ABI | 2025_0 (wasm32) |

## Native extensions

POT compiles two extensions:
- `ot/lp/emd_wrap` — C++ EMD network-simplex solver (`EMD_wrapper.cpp` + Cython).
- `ot/partial/partial_cython` — Cython.

**OpenMP** is auto-disabled: `ot/helpers/openmp_helpers.check_openmp_support()`
test-compiles an OpenMP probe, which fails under `emcc` (pyodide is
single-threaded), so no `-fopenmp` flags are emitted. No source patch is needed.

## Build

```bash
docker build -t pot-pyodide-build build/pot
docker run --rm -v "$PWD/kit/pot/artifacts:/out" pot-pyodide-build
```

The wheel lands in `kit/pot/artifacts/` (gitignored). Then stamp the URL and
verify:

```bash
npm run backfill-urls
npm run verify
npm run license-gate -- pot
npm run publish-kit -- pot@0.9.6.post1 --dry-run
```

## Validation

The built wheel was loaded in a real pyodide 0.28.0 venv (`pyodide venv`,
node-backed) alongside numpy 2.2.5 + scipy 1.14.1, and the kit golden executed:

```python
import ot
ot.emd2([0.5, 0.5], [0.0, 1.0], [[0.0, 1.0], [1.0, 0.0]])  # -> 0.5
```

This is real-runtime proof (not a host-CPython capture) that the C++ EMD solver
loads and computes correctly under emscripten.

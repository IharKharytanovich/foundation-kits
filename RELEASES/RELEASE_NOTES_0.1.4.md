# Foundation 0.1.4

**Release date:** June 2026 (in development)
**Previous version:** [0.1.3](https://github.com/IharKharytanovich/foundation/releases/tag/v0.1.3) (June 1, 2026)

Release 0.1.4 is a release about computation. 21 commits, 330 files changed
(+24,831 / −107). Foundation gains a full-fledged scientific compute engine:
running Python-in-WASM (Pyodide) and native WASI/WASM binaries right inside
the agent, with no Python installed on the machine and no network access.
On top of that sit typed math tools, portable compute packages (Kits), and
a set of domain skills for math, physics, chemistry, and biology.

---

## Highlights

### 🧮 Compute Engine (Python-in-WASM)

- New `compute` service: an in-process Python execution engine powered by
  **Pyodide 0.29.4**. `runPython({ code, seed?, timeoutMs?, ... })` runs
  computations in a `worker_threads` pool.
- Fully **offline**: the Pyodide runtime and Python wheels are shipped
  locally and loaded from disk, with no network calls.
- Hard guarantees: wall-clock timeout via `worker.terminate()`, memory
  safety through periodic worker recycling, and determinism via
  `PYTHONHASHSEED=0` and per-call RNG seeding.

### 📦 Kits — portable compute packages

- A Kit is a self-contained, versioned folder that packages a computational
  asset (a Pyodide wheel, a WASI binary, or an Emscripten WASM module)
  together with metadata, a callable-surface manifest, and a golden contract
  proving correctness.
- The `kit` service (`kernel.kit`): a single resolution and execution entry
  point — `resolve(id)`, `closure(ids)` (dependency graph with cycle
  detection), `run(payload)` (validation, `sha256` verification, routing to
  the appropriate runtime). Errors are returned as data.
- Reference kits: **numpy, scipy, sympy, seqtk**, and more. Seeded into
  `~/.found/kits` (configurable via `FOUND_KITS_DIR`).
- Registry and runtime services: `kit-registry`, `wasm`, `jswasm`.

### ➗ Math tools and the MathJSON↔SymPy bridge

- A set of typed math tools: `MathCalcTool`, `MathCalculusTool`,
  `MathMatrixTool`, `MathSolveTool`, `MathStatsTool`, `MathUnitsTool`.
- **MathJSON↔SymPy bridge**: the typed tools automatically escalate hard
  cases to SymPy via `runBridge`, which converts MathJSON into SymPy
  expressions and back.
- Verification and gating skills for math (math-verification-gating).

### 🔧 Unified `compute` tool

- The new `compute` AI tool unifies the previously separate `mathCompute`
  and `wasmCli` into a single entry point.
- A WASM C-tool platform and a JsWasm runtime with workers
  (`compute-worker`, `jswasm-worker`, `wasi-worker`).

### 🔬 Domain compute skills

Bundled skills for scientific computation were added:

- `found-compute-math`, `found-compute-physics`,
  `found-compute-chemistry`, `found-compute-biology`
- Domain "compute pillars": physics, chemistry-biology, and **ViennaRNA**
  integration.

---

## Kit library (foundation-kits)

The kit registry
([foundation-kits](https://github.com/IharKharytanovich/foundation-kits/tree/main/kit))
offers 51 kits. The agent pulls them in on demand for scientific
computation.

**Math and numerical methods**
`numpy` · `scipy` · `sympy` · `pandas` · `networkx` · `scikit-learn` ·
`scikit-fem` · `scikit-optimize` · `autograd` · `findiff` · `pywavelets` ·
`eigen` · `gmp` · `highs-js`

**Statistics, optimization, uncertainty**
`lmfit` · `iminuit` · `emcee` · `dynesty` · `uncertainties` · `salib` ·
`chaospy` · `deap`

**Chemistry**
`rdkit` · `chempy` · `molmass` · `mendeleev` · `periodictable` · `thermo` ·
`selfies` · `pint`

**Biology**
`biopython` · `dendropy` · `pyrodigal` · `freesasa` · `viennarna` · `seqtk`

**Physics, astronomy, geometry**
`astropy` · `sgp4` · `geodesy` · `geos` · `rapier2d` · `rapier3d` · `earcut`

**Support and utilities**
`decorator` · `dill` · `joblib` · `packaging` · `pytz` · `pyyaml` ·
`setuptools` · `six`

---

## Under the hood

- Documentation: `docs/compute-engine/` and `docs/kit/`.
- Build scripts: offline Pyodide vendoring (`vendor-pyodide.mjs`), kit
  artifact verification (`verify-kit-artifacts.mjs`), and archival of legacy
  compute assets (`archive-legacy-compute-assets.mjs`).
- New core services: `compute`, `kit`, `kit-registry`, `wasm`, `jswasm`.
- Expanded shared types (`@found/types/kit`) and server routes.

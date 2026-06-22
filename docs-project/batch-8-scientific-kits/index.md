# Batch-8 scientific kits

## Summary

This batch adds five new kits (75 &rarr; 80), filling verified capability gaps in
Bayesian inference diagnostics, survival analysis, galactic dynamics, convex
optimization, and macromolecular crystallography. Four are pyodide vendor kits
(arviz, lifelines, galpy, cvxpy) and one is a jswasm callable kit (gemmi).

All five kits are authored and verified (`verified: true`, real hashed bytes).
gemmi was the batch's highest-risk pick: gemmi publishes no ready-to-vendor npm
package. It is vendored from the official single-threaded Emscripten build of
gemmi's `convert` tool ([project-gemmi/wasm](https://github.com/project-gemmi/wasm),
commit `075e2a01`, embedding gemmi `v0.6.7-115-g76f405ea`) — confirmed to load and
run in Node, with the golden captured live.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| arviz | 1.2.0 | pyodide | loose | Bayesian inference diagnostics: InferenceData, R-hat, ESS, HDI, posterior summaries. |
| cvxpy | 1.6.3 | pyodide | loose | Disciplined convex optimization modelling, solved in-sandbox with CLARABEL. |
| galpy | 1.10.2 | pyodide | loose | Galactic dynamics: orbit integration, gravitational potentials, action-angle, circular velocity. |
| gemmi | 0.6.7-1.0.0 | jswasm | callable | Macromolecular crystallography: convert structure/reflection files between mmCIF/PDB/MTZ. |
| lifelines | 0.30.3 | pyodide | loose | Survival analysis: Kaplan-Meier, Cox proportional-hazards, parametric fitters, log-rank test. |

### Catalogue impact

- **Pyodide**: 57 &rarr; 61 (+ arviz, cvxpy, galpy, lifelines)
- **WASI**: 7 (unchanged)
- **jswasm**: 11 &rarr; 12 (+ gemmi)
- **Total**: 75 &rarr; 80 kits

### Publish status

All five kits are authored and verified (`verified: true`). None are published
yet; each requires a `<id>@<ver>` tag push through the standard pipeline (see
[publish.md](../../.claude/rules/publish.md)):

- `arviz@1.2.0`
- `cvxpy@1.6.3`
- `galpy@1.10.2`
- `lifelines@0.30.3`
- `gemmi@0.6.7-1.0.0`

## Notable design decisions

### gemmi &mdash; jswasm callable, vendored from the official `convert` build

gemmi is the only crystallographic-fidelity mmCIF/PDB/MTZ tool in the catalogue
(distinct from biopython's structure handling). It has no ready-to-vendor npm
package; the kit instead vendors the official single-threaded Emscripten build of
gemmi's `convert` tool from [project-gemmi/wasm](https://github.com/project-gemmi/wasm)
(`convert.js` + `convert.wasm`, commit `075e2a01`, embedding gemmi
`v0.6.7-115-g76f405ea`). Unlike every other jswasm kit (Emscripten-**MODULARIZE**
factories), this is a **non-MODULARIZE** build: `convert.js` defines a global
`Module`, sets `module.exports = Module` in Node, and auto-runs, signalling
readiness via `Module.onRuntimeInitialized`. The loader block is therefore
`{moduleSystem: cjs, initStyle: default-init, wasmSupply: locateFile}` &mdash; the
same `default-init` shape the eigen kit uses. The build loads and runs in Node; the
`scriptGolden.expect` (`"10,20,30"`) was captured live. Single-threaded invariant
enforced: no pthreads / SharedArrayBuffer / `role: worker` artifact (factory
invariant, spec TR-009). The C surface exposes file conversion (`_pdb2cif`,
`_cif2pdb`, `_cif2mtz`, `_mtz2cif`); the version pins to the embedded build version
(`0.6.7`), not the spec's assumed `0.7.5`, since the bytes are the source of truth.

### arviz &mdash; bundled exclusive dependencies + packaging

arviz bundles six exclusive deps into `artifacts[]` (arviz-base, arviz-stats,
arviz-plots, xarray, lazy_loader, typing_extensions) and depends on four shared
kits: numpy, scipy, pandas, **and packaging**. packaging is a documented deviation
from the spec's three-dep assumption &mdash; Task 2.0 research found the bundled
xarray requires packaging at runtime; it is an existing shared kit, so it is listed
in `dependencies[]` (not bundled). matplotlib is unavailable in Pyodide; plotting
is documented as out of scope in `instruction.md`.

### lifelines &mdash; autograd as a shared dep

lifelines uses autograd for automatic differentiation in its parametric fitters.
autograd is an existing shared kit, so it is listed in `dependencies[]` (numpy,
scipy, pandas, autograd); the exclusive deps autograd-gamma, formulaic,
interface-meta, typing_extensions, and wrapt are bundled into `artifacts[]`.

### galpy &mdash; compiled Pyodide-built wheel (lockfile version)

galpy is a compiled C-extension package; the kit pins `1.10.2` &mdash; the version
in the Pyodide v0.28.0 lockfile &mdash; not the PyPI HEAD (1.11.2), which is not
built for this runtime. Shared deps numpy, scipy, packaging; matplotlib plotting
and optional astropy `Quantity` support are documented as out of scope.

### cvxpy &mdash; cvxpy-base + bundled CLARABEL solver

cvxpy pins `cvxpy-base 1.6.3` (the core without optional solver extras) and bundles
`clarabel 0.11.0` into `artifacts[]` (single-consumer exclusive dep). CLARABEL is
the only in-sandbox solver &mdash; osqp/ecos/scs are not in Pyodide and their
absence is documented (spec TR-010). Shared deps: numpy, scipy.

## Per-kit details

### arviz (Bayesian inference diagnostics)

- **Upstream**: [arviz](https://github.com/arviz-devs/arviz) v1.2.0
- **License**: Apache-2.0
- **Tags**: statistics, sampling, uncertainty
- **Mode**: loose (pyodide, import `arviz`)
- **Golden**: InferenceData posterior mean &rarr; `"3.0"`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), pandas (2.3.3), packaging (26.2)
- **Bundled deps**: arviz-base, arviz-stats, arviz-plots, xarray, lazy_loader,
  typing_extensions
- **Status**: `verified: true`

### cvxpy (disciplined convex optimization)

- **Upstream**: [cvxpy](https://github.com/cvxpy/cvxpy) cvxpy-base v1.6.3
- **License**: Apache-2.0
- **Tags**: optimization, math
- **Mode**: loose (pyodide, import `cvxpy`)
- **Golden**: minimize `sum_squares` with CLARABEL &rarr; `"1.00,2.00"`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Bundled deps**: clarabel (0.11.0)
- **Status**: `verified: true`

### galpy (galactic dynamics)

- **Upstream**: [galpy](https://github.com/jobovy/galpy) v1.10.2 (Pyodide lockfile)
- **License**: BSD-3-Clause
- **Tags**: astronomy, physics
- **Mode**: loose (pyodide, import `galpy`)
- **Golden**: MiyamotoNagaiPotential circular velocity &rarr; `"1.0"`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), packaging (26.2)
- **Status**: `verified: true`

### lifelines (survival analysis)

- **Upstream**: [lifelines](https://github.com/CamDavidsonPilon/lifelines) v0.30.3
- **License**: MIT
- **Tags**: statistics, fitting
- **Mode**: loose (pyodide, import `lifelines`)
- **Golden**: KaplanMeierFitter median survival &rarr; `"3.0"`
- **Shared deps**: numpy (2.2.5), scipy (1.14.1), pandas (2.3.3), autograd (1.8.0)
- **Bundled deps**: autograd-gamma, formulaic, interface-meta, typing_extensions,
  wrapt
- **Status**: `verified: true`

### gemmi (macromolecular crystallography)

- **Upstream**: [project-gemmi/wasm](https://github.com/project-gemmi/wasm) commit
  `075e2a01`, embedding gemmi `v0.6.7-115-g76f405ea`
- **License**: MPL-2.0 (dual MPL-2.0 OR LGPL-3.0; MPL-2.0 recorded, dual fact in
  `provenance.buildNote`)
- **Tags**: structure, chemistry
- **Mode**: callable (jswasm, single-threaded)
- **Artifacts**: `convert.js` (loader) + `convert.wasm` (binary, 893 KB)
- **Loader**: `{entry: artifacts/convert.js, moduleSystem: cjs, initStyle:
  default-init, wasmSupply: locateFile}`
- **scriptGolden**: `pdb2cif` a minimal PDB &rarr; read `_cell.length_a,b,c` &rarr;
  `"10,20,30"` (captured live in Node)
- **Descriptor**: `tooling/jswasm-vendor-data.mjs` (`JSWASM_KITS`)
- **Status**: `verified: true` &mdash; vendored from the official `convert` build

## Re-vendoring gemmi

The bytes are pinned by `sha256`; the source URL pins the upstream commit
(`075e2a01`). To refresh from a newer upstream build:

1. Download `convert/convert.js` + `convert/convert.wasm` from the desired
   project-gemmi/wasm commit into `temp/vendor/jswasm/gemmi/`.
2. Update the gemmi descriptor in `tooling/jswasm-vendor-data.mjs` (`ref`,
   `version`, `vendored[].url`, embedded version in `buildNote`).
3. Run `node tooling/vendor-jswasm.mjs gemmi` &mdash; recopies bytes, recomputes
   sha256, rewrites `kit.json` + `recipe.json`.
4. Re-capture `scriptGolden.expect` if the conversion output changed; run
   `npm run verify` + `npm run license-gate -- gemmi`.

## Related files

- Kit definitions: `kit/{arviz,cvxpy,galpy,lifelines,gemmi}/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 68, KNOWN_JSWASM: 12)
- Vendor descriptors: `tooling/import-data.mjs` (4 pyodide kits),
  `tooling/jswasm-vendor-data.mjs` (gemmi)

## Changelog

- **2026-06-22**: Batch-8 authored &mdash; 4 pyodide vendor kits (all loose,
  `verified: true`, real hashed bytes) + 1 jswasm callable kit (gemmi,
  `verified: true`). All five green on `npm run verify` (616 tests) +
  `npm run license-gate -- --all` (80 kits clear). arviz carries packaging as a 4th
  shared dependency (xarray runtime requirement, a justified research deviation).
  gemmi was completed in a follow-up session after the orchestrator's wave-2 gemmi
  phase and wave-3 consolidation were interrupted (an upstream content-filtering API
  error): the official single-threaded `convert` build was vendored from
  project-gemmi/wasm (commit `075e2a01`, embedded gemmi `v0.6.7-115-g76f405ea`),
  confirmed to load and run in Node, with the `"10,20,30"` golden captured live.
  Version reconciled to the embedded `0.6.7` (bytes are the source of truth, not the
  spec's assumed `0.7.5`).

# Batch-6 scientific kits

## Summary

This batch adds five new kits (65 &rarr; 70), filling verified capability gaps in
sequence alignment, thermophysical properties, positional astronomy, diffraction
simulation, and paraxial optics. Three are pyodide vendor kits (skyfield,
diffraction, raytracing), one is a jswasm vendor kit (coolprop), and one is a
wasi build kit (edlib).

This batch also introduces the third wasi build pipeline (`build/edlib/`),
following the `build/z3/` and `build/spglib/` precedents.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| coolprop | 7.2.0-1.0.0 | jswasm | callable | Reference thermophysical fluid properties via multiparameter EOS (PropsSI). |
| diffraction | 3.4.0 | pyodide | loose | X-ray and neutron diffraction simulation (d-spacings, powder patterns). |
| edlib | 1.2.7 | wasi | strict | Fast edit-distance and alignment (Levenshtein, CIGAR) between sequences. |
| raytracing | 1.4.7 | pyodide | loose | Paraxial ABCD ray-transfer matrix optics (lenses, mirrors, spaces). |
| skyfield | 1.54 | pyodide | loose | High-precision positional astronomy with bundled JPL DE421 ephemeris. |

### Catalogue impact

- **Pyodide**: 51 &rarr; 54 (+ skyfield, diffraction, raytracing)
- **WASI**: 4 &rarr; 5 (+ edlib)
- **jswasm**: 10 &rarr; 11 (+ coolprop)
- **Total**: 65 &rarr; 70 kits

### Publish status

The three pyodide vendor kits and coolprop are authored and verified
(`verified: true`). edlib is `verified: false` &mdash; the WASI cross-compile is
a maintainer hand-off (see `build/edlib/README.md`). None are published yet; each
requires a `<id>@<ver>` tag push through the standard pipeline (see
[publish.md](../../.claude/rules/publish.md)):

- `edlib@1.2.7`
- `coolprop@7.2.0-1.0.0`
- `skyfield@1.54`
- `diffraction@3.4.0`
- `raytracing@1.4.7`

## Notable design decisions

### edlib as a wasi build kit

edlib has no `py3-none-any` wheel (only compiled `cpXX` wheels) and no published
WASM distribution. A thin C driver (`build/edlib/edlib_cli.c`) was authored to
wrap the edlib C++ library, reading `<mode>\n<query>\n<target>` on stdin and
printing the result to stdout, matching the Foundation WASI I/O contract. The
build pipeline uses wasi-sdk clang++ (single-threaded, no pthreads) and follows
the `build/spglib/` precedent.

### coolprop as a jswasm vendor kit (Emscripten)

CoolProp publishes an official single-threaded Emscripten WASM build on
SourceForge. The two prebuilt files (`coolprop.js` + `coolprop.wasm`) are
vendored directly. The manifest uses `callable` mode with `scriptable: true` and
no typed operations &mdash; the CoolProp surface (`PropsSI`/`HAPropsSI`) is
best expressed as free-form scripting against the loaded module handle.

### skyfield &mdash; bundled ephemeris + certifi

skyfield requires a JPL ephemeris file for positional computations. DE421
(~16 MB, US-gov public domain) is bundled as a data artifact to enable fully
offline, deterministic operation. The golden uses `load_file()` (no network).
`jplephem` (MIT, exclusive dep) and `certifi` (MPL-2.0, imported at module load)
are also bundled. Shared deps `numpy` and `sgp4` are listed in `dependencies[]`.

### diffraction &mdash; Dans_Diffraction import name

The kit id is `diffraction` (naming rule: single lowercase capability noun). The
upstream package `Dans_Diffraction` uses that as its import name. GUI/tkinter
features are excluded (unavailable in the Pyodide sandbox).

### Bundled dependencies

- **skyfield** bundles `jplephem` (MIT), `de421.bsp` (public domain), and
  `certifi` (MPL-2.0).
- **diffraction** and **raytracing** have no bundled deps (only shared `numpy`).
- **coolprop** and **edlib** have no dependencies.

## Per-kit details

### edlib (fast edit-distance/alignment)

- **Upstream**: [edlib](https://github.com/Martinsos/edlib) v1.2.7
- **License**: MIT
- **Tags**: sequences, genomics
- **Mode**: strict (wasi CLI, stdin&rarr;stdout)
- **Operations**: `distance` (edit distance), `align` (distance + CIGAR)
- **Golden**: `NW\nkitten\nsitting` &rarr; `3\n`
- **Build pipeline**: `build/edlib/` (wasi-sdk clang++, single-threaded)
- **Status**: `verified: false` &mdash; maintainer hand-off for wasi cross-compile

### coolprop (thermophysical fluid properties)

- **Upstream**: [CoolProp](https://github.com/CoolProp/CoolProp) v7.2.0
- **License**: MIT
- **Tags**: chemistry, physics
- **Mode**: callable (jswasm, Emscripten family)
- **Loader**: `coolprop.js` (ESM, factory init, locateFile wasmSupply)
- **Golden**: `PropsSI('D','T',298.15,'P',101325,'Water')` &rarr; density of water
- **Status**: `verified: true`

### skyfield (positional astronomy)

- **Upstream**: [skyfield](https://pypi.org/project/skyfield/) v1.54
- **License**: MIT
- **Tags**: astronomy, time
- **Mode**: loose (pyodide)
- **Golden**: loads DE421 via `load_file()`, computes a fixed astrometric position
- **Shared deps**: numpy, sgp4
- **Bundled deps**: jplephem, de421.bsp, certifi
- **Status**: `verified: true`

### diffraction (X-ray/neutron diffraction)

- **Upstream**: [Dans_Diffraction](https://pypi.org/project/Dans-Diffraction/) v3.4.0
- **License**: Apache-2.0
- **Tags**: structure, physics
- **Mode**: loose (pyodide, import `Dans_Diffraction`)
- **Golden**: d-spacing for cubic cell (a=4.0, reflection (1,1,0)) &rarr; 2.8284
- **Shared deps**: numpy
- **Status**: `verified: true`

### raytracing (paraxial optics)

- **Upstream**: [raytracing](https://pypi.org/project/raytracing/) v1.4.7
- **License**: MIT
- **Tags**: physics
- **Mode**: loose (pyodide)
- **Golden**: ABCD matrix of `Space(d=10) * Lens(f=5)`
- **Shared deps**: numpy
- **Status**: `verified: true`

## The `build/edlib/` pipeline

The third wasi build pipeline in the factory, modelled on `build/spglib/`:

| File | Role |
|---|---|
| `Dockerfile` | Pinned wasi-sdk / wasmtime / binaryen build environment |
| `build.sh` | Fetch source, compile edlib.cpp + edlib_cli.c, wasm-opt, smoke-test |
| `edlib_cli.c` | Thin C driver (stdin &rarr; stdout): reads `<mode>\n<query>\n<target>` |
| `README.md` | Build instructions and maintainer hand-off documentation |

The edlib driver reads a single stdin payload (`<mode>\n<query>\n<target>`) and
prints the result to stdout. Two modes are supported: `distance` (prints the
integer edit distance) and `align` (prints distance + CIGAR). The smoke-test step
compares `wasmtime` output against the manifest `distance` golden
(`kitten`/`sitting` &rarr; `3`).

### Maintainer hand-off

To produce `edlib.wasm`:

1. Run `docker build -t edlib-builder build/edlib/`
2. Run `docker run --rm -v $(pwd):/work edlib-builder`
3. Copy `edlib.wasm` to `kit/edlib/artifacts/`
4. Stamp the real sha256 in `kit.json`
5. Flip `verified: true`
6. Capture the `align` CIGAR golden from the built binary
7. Run `npm run verify` + `npm run license-gate -- edlib`

## Related files

- Kit definitions: `kit/{edlib,coolprop,skyfield,diffraction,raytracing}/`
- Build pipeline: `build/edlib/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 60, KNOWN_JSWASM: 11)
- Vendor descriptors: `tooling/import-data.mjs`, `tooling/jswasm-vendor-data.mjs`

## Changelog

- **2026-06-14**: Batch-6 authored &mdash; 3 pyodide kits (all loose) + 1 jswasm
  kit (callable) + 1 wasi build kit (strict), all green on verify + license-gate.
  4 vendor kits pass verify (`verified: true`); edlib awaits maintainer build.

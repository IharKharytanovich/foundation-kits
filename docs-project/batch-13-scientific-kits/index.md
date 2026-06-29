# Batch-13 scientific kits

## Summary

This batch adds four new kits (100 &rarr; 104), filling verified capability gaps in
electrochemical impedance spectroscopy, geodetic look-angle geometry, heavy-duty
number theory, and genome interval set-algebra. Two are pyodide vendor kits
(impedance, pymap3d) with `verified: true` and real hashed bytes. One (pari) is a
jswasm callable vendor kit with `verified: true`, vendored from the prebuilt npm
package `@sagemath/pari@1.0.5`. One (bedtools) is an honest `verified: false` WASI
skeleton &mdash; full metadata, a strict manifest with a natively-captured golden,
and a `wasi` build recipe, but **no artifact bytes**; the actual WASI compilation
is deferred to a follow-on spec.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| bedtools | 2.31.1 | wasi | strict | Genome interval set-algebra: intersect/merge/subtract/coverage/closest on BED/GFF/VCF (skeleton, .wasm build pending). |
| impedance | 1.7.1 | pyodide | loose | Electrochemical impedance spectroscopy: equivalent-circuit fitting (Randles/CPE/Warburg) and Kramers-Kronig validation. |
| pari | 2.13.2-1.0.0 | jswasm | callable | Number-theory CAS (PARI/GP): factorization, elliptic curves, modular forms, class groups, arbitrary precision. |
| pymap3d | 3.2.0 | pyodide | loose | Geodetic look-angle geometry: ECEF&harr;geodetic&harr;ENU/NED&harr;AER (azimuth/elevation/slant-range) local-tangent-plane transforms. |

### Catalogue impact

- **Pyodide**: 78 &rarr; 80 (+ impedance, pymap3d)
- **WASI**: 9 &rarr; 10 (+ bedtools &mdash; skeleton, build pending)
- **jswasm**: 13 &rarr; 14 (+ pari)
- **Total**: 100 &rarr; 104 kits
- **Published**: 90 (unchanged &mdash; none of the 4 new kits is published yet)
- **Pending first publish**: 10 &rarr; 14

**Backlog**: opencascade (jswasm OCCT B-rep kernel, 66 MB) was deferred to
batch-14 &mdash; a jswasm callable kit cannot be a cheap byte-less skeleton
(vendored sha256 + executed golden both required by the schema), so it warrants a
focused spec.

### Publish status

The two pyodide vendor kits and the jswasm callable kit are authored, verified
(`verified: true`), and publish-ready (`--dry-run` green). The WASI skeleton is
`verified: false` with empty `artifacts: []` and cannot be published until the
follow-on WASI build compiles its `.wasm` bytes. Each requires a `<id>@<ver>` tag
push through the standard pipeline (see [publish.md](../../.claude/rules/publish.md)):

- `impedance@1.7.1` (ready)
- `pymap3d@3.2.0` (ready)
- `pari@2.13.2-1.0.0` (ready)
- `bedtools@2.31.1` (awaits WASI build)

## Notable design decisions

### impedance &mdash; numpy+scipy core, no plotting

impedance provides electrochemical impedance spectroscopy: equivalent-circuit
fitting (Randles, CPE, Warburg elements) and Kramers-Kronig validation over
complex impedance spectra Z(f). matplotlib and altair are optional plotting
dependencies &mdash; excluded from `dependencies[]` and never imported by the
golden. Shared deps: numpy (2.2.5), scipy (1.14.1). License: MIT.
Tags: chemistry, fitting.

### pymap3d &mdash; zero dependencies, pure-Python math path

pymap3d provides geodetic look-angle geometry: ECEF&harr;geodetic&harr;ENU/NED&harr;AER
transforms for observer&rarr;target calculations. numpy, astropy, and pyproj are
all optional extras; the library works on its pure-Python math path with zero
third-party dependencies. `dependencies: []` in kit.json. License: BSD-2-Clause
(confirmed from the repo LICENSE file &mdash; clauses 1&ndash;2 only; PyPI shows
generic `BSD`). Tags: astronomy, physics.

### pari &mdash; jswasm callable (Emscripten, @sagemath/pari)

pari exposes the PARI/GP number-theory CAS via a callable jswasm module vendored
from `@sagemath/pari@1.0.5` (Emscripten family). The kit version is
`2.13.2-1.0.0` (PARI 2.13.2 bundled inside npm wrapper 1.0.5). The callable
manifest uses `scriptable: true` with a `scriptGolden` captured by running
`@sagemath/pari` in Node (`nextprime(10^9)` &rarr; `"%1 = 1000000007\n"`). The
npm-declared license is `GPL-3.0-or-later`; the upstream PARI license
(`GPL-2.0-or-later`) is recorded in `provenance.buildNote`. Tags: math, symbolic.

### bedtools &mdash; WASI skeleton (build pending)

bedtools provides genome interval set-algebra on BED/GFF/VCF files (intersect,
merge, subtract, coverage, closest). This batch delivers a `verified: false`
skeleton: full metadata, a strict manifest with one `intersect` operation, a
natively-captured golden (BED interval output), and a `wasi` build recipe pointing
to the intended `build/bedtools/Dockerfile`. No `.wasm` bytes &mdash; the actual
WASI compilation is deferred to a follow-on spec. The two-input (`-a`/`-b`) wiring
under the single-stdin WASI I/O contract is flagged as an open follow-on build
item. License: MIT. Tags: genomics, sequences.

## Per-kit details

### impedance (electrochemical impedance spectroscopy)

- **Upstream**: [impedance.py](https://github.com/ECSHackWeek/impedance.py) v1.7.1
- **License**: MIT
- **Tags**: chemistry, fitting
- **Mode**: loose (pyodide, import `impedance`)
- **Shared deps**: numpy (2.2.5), scipy (1.14.1)
- **Status**: `verified: true`

### pymap3d (geodetic look-angle geometry)

- **Upstream**: [pymap3d](https://github.com/geospace-code/pymap3d) v3.2.0
- **License**: BSD-2-Clause
- **Tags**: astronomy, physics
- **Mode**: loose (pyodide, import `pymap3d`)
- **Shared deps**: none
- **Status**: `verified: true`

### pari (number-theory CAS)

- **Upstream**: [@sagemath/pari](https://github.com/sagemathinc/sagejs) (npm), PARI/GP 2.13.2
- **License**: GPL-3.0-or-later
- **Tags**: math, symbolic
- **Mode**: callable (jswasm, scriptable, Emscripten family)
- **Shared deps**: none
- **Status**: `verified: true`

### bedtools (genome interval set-algebra)

- **Upstream**: [bedtools2](https://github.com/arq5x/bedtools2) v2.31.1
- **License**: MIT
- **Tags**: genomics, sequences
- **Mode**: strict (wasi, 1 operation: `intersect`)
- **Status**: `verified: false` &mdash; skeleton, .wasm build pending

## Related files

- Kit definitions: `kit/{bedtools,impedance,pari,pymap3d}/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 90, KNOWN_JSWASM: 14)

## Changelog

- **2026-06-29**: Batch-13 authored &mdash; 2 pyodide vendor kits (impedance,
  pymap3d), both loose, `verified: true`, real hashed bytes; 1 jswasm callable
  vendor kit (pari), `verified: true`; 1 WASI skeleton (bedtools), strict,
  `verified: false`, no bytes. All green on `npm run verify` + `npm run
  license-gate`. The 3 verified kits pass `publish-kit --dry-run`; the WASI
  skeleton awaits a follow-on build spec. opencascade deferred to batch-14.

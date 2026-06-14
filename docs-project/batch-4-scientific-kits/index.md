# Batch-4 scientific kits

## Summary

This batch adds five new pyodide kits (56 &rarr; 61), filling verified
capability gaps in mesh geometry, particle physics, materials chemistry,
genomics, and interval data structures.

## New kits

| Kit | Version | Runtime | Mode | Description |
|---|---|---|---|---|
| ase | 3.28.0 | pyodide | loose | Atomic structures: molecules, crystals, CIF/XYZ/POSCAR I/O, bulk builders (ASE). |
| intervaltree | 3.2.1 | pyodide | loose | Self-balancing interval tree for efficient overlap queries. |
| particle | 0.26.2 | pyodide | loose | PDG particle database: mass, width, charge, spin, lifetime, PDGID, MC codes. |
| pyfaidx | 0.9.0.4 | pyodide | strict | Indexed FASTA random access: region extraction, reverse complement, sequence length. |
| trimesh | 4.12.2 | pyodide | loose | Mesh I/O + mass properties: load STL/PLY/OBJ/GLTF, volume, inertia, watertightness. |

### Catalogue impact

- **Pyodide**: 43 &rarr; 48 (+ ase, intervaltree, particle, pyfaidx, trimesh)
- **WASI**: 3 (unchanged)
- **jswasm**: 10 (unchanged)
- **Total**: 56 &rarr; 61 kits

### Publish status

All five kits are authored and verified (`verified: true`). None are published
yet &mdash; each requires a `<id>@<ver>` tag push through the standard pipeline
(see [publish.md](../../.claude/rules/publish.md) and
[PUBLISH.md](../../specs/batch-4-scientific-kits/PUBLISH.md)).

## Notable design decisions

### pyfaidx as a strict kit

pyfaidx is the first **pyodide strict** kit in the catalogue. Its finite,
typed region-access surface (subsequence, reverse complement, length) fits the
strict manifest model. An additive branch was added to `import-kit.mjs` so that
pyodide descriptors with `mode: 'strict'` + `operations[]` emit a strict
manifest instead of the default loose manifest.

### Bundled dependencies

- **particle** bundles `hepunits` and `attrs` (exclusive deps, single consumer).
- **intervaltree** bundles `sortedcontainers` (exclusive dep, single consumer).
- All other dependencies are shared kits already in the catalogue (numpy, scipy,
  packaging).

## Per-kit details

### trimesh (mesh I/O + mass properties)

- **Upstream**: [trimesh](https://pypi.org/project/trimesh/) v4.12.2
- **License**: MIT
- **Tags**: math, structure
- **Golden**: box mesh &rarr; `(8.0, True, 12)` (volume, watertight, face count)
- **Shared deps**: numpy

### particle (PDG particle database)

- **Upstream**: [particle](https://pypi.org/project/particle/) v0.26.2
- **License**: BSD-3-Clause
- **Tags**: physics
- **Golden**: &pi;+ &rarr; `('pi+', 139.57039, 1.0)` (name, mass, charge)
- **Bundled deps**: hepunits, attrs

### ase (atomic structures)

- **Upstream**: [ase](https://pypi.org/project/ase/) v3.28.0
- **License**: LGPL-2.1-or-later
- **Tags**: chemistry, structure
- **Golden**: FCC Cu unit cell volume &rarr; `11.664`
- **Shared deps**: numpy, scipy
- **Limitation**: matplotlib unavailable in sandbox (plotting unreachable)

### pyfaidx (indexed FASTA random access)

- **Upstream**: [pyfaidx](https://pypi.org/project/pyfaidx/) v0.9.0.4
- **License**: BSD-3-Clause
- **Tags**: biology, sequences
- **Mode**: strict (3 typed operations: subsequence, reverse_complement, length)
- **Golden**: `chr1:3-6` of `ACGTACGTACGT` &rarr; `GTAC`
- **Shared deps**: packaging

### intervaltree (interval-overlap queries)

- **Upstream**: [intervaltree](https://pypi.org/project/intervaltree/) v3.2.1
- **License**: Apache-2.0
- **Tags**: genomics, util
- **Golden**: overlap query &rarr; `['A', 'B']`
- **Bundled deps**: sortedcontainers

## Related files

- Kit definitions: `kit/{ase,intervaltree,particle,pyfaidx,trimesh}/`
- Registry: `kit/REGISTRY.md`
- Test allow-lists: `tests/kits.test.mjs` (KNOWN_PYODIDE_WASI: 51, KNOWN_JSWASM: 10)
- Vendor descriptors: `tooling/import-data.mjs`
- Publish runbook: `specs/batch-4-scientific-kits/PUBLISH.md`

## Changelog

- **2026-06-14**: Batch-4 authored &mdash; 5 pyodide kits (4 loose + 1 strict),
  importer strict-pyodide branch, all green on verify + license-gate +
  publish-kit --dry-run.

# Diffraction (Dans_Diffraction)

Dans_Diffraction is a pure-Python X-ray and neutron diffraction simulation
library. It computes structure factors, Bragg intensities, d-spacings, powder
patterns, and single-crystal scattering from unit-cell definitions. The import
name is `Dans_Diffraction`.

## When to Use

- Computing d-spacings for a crystal lattice given Miller indices (h, k, l)
- Calculating X-ray or neutron structure factors and Bragg intensities
- Simulating powder diffraction patterns (2-theta vs intensity)
- Building unit cells from lattice parameters, space groups, and atomic positions
- Reading/writing CIF (Crystallographic Information File) structures
- Indexing reflections and determining systematic absences

## When NOT to Use

- Atomic structure file I/O or manipulation without diffraction (use **ase** —
  it handles POSCAR, XYZ, trajectory formats)
- Space-group symmetry operations and Wyckoff positions (use **spglib**)
- Electronic structure / DFT calculations (not covered)
- GUI/plotting (matplotlib/tkinter features are excluded from the sandbox)

## Capabilities

| Area | Key API |
|---|---|
| Crystal creation | `dd.Crystal()` — blank; set `.Cell.a/.b/.c/.alpha/.beta/.gamma` |
| CIF loading | `dd.Crystal('file.cif')` — load from CIF |
| d-spacing | `xtl.Cell.dspace([h, k, l])` — interplanar spacing in Angstroms |
| Structure factors (X-ray) | `xtl.Scatter.x_ray(hkl)` — X-ray scattering intensity |
| Structure factors (neutron) | `xtl.Scatter.neutron(hkl)` — neutron scattering intensity |
| Powder pattern | `xtl.Scatter.powder('x-ray')` / `powder('neutron')` — 2-theta, intensity arrays |
| Symmetry | `xtl.Symmetry` — space group operations |
| Q-magnitude | `xtl.Cell.Qmag([h, k, l])` — reciprocal space magnitude |

**Note:** Set lattice parameters individually (`xtl.Cell.a = 4.0`, etc.), not
via direct assignment to `xtl.Cell.latt`.

## Worked Example

D-spacing of the (1,1,0) reflection for a cubic crystal with a = 4.0 Angstrom:

```python
import Dans_Diffraction as dd

xtl = dd.Crystal()
xtl.Cell.a = 4.0
xtl.Cell.b = 4.0
xtl.Cell.c = 4.0
d = xtl.Cell.dspace([1, 1, 0])
str(round(float(d[0]), 4))
# => "2.8284"
```

This equals a / sqrt(h^2 + k^2 + l^2) = 4.0 / sqrt(2) for cubic symmetry.

# vector

vector is a Python library for 2D, 3D, and Lorentz four-vector algebra,
designed for high-energy physics (HEP) and special relativity. It supports
object-oriented, NumPy-backed, and dictionary-based vector construction, with
operations including boosts, rotations, invariant mass, transverse momentum
(pt), pseudorapidity (eta), azimuthal angle (phi), rapidity, and angular
separation (deltaR). vector depends on numpy and packaging at runtime, both
provided as shared kit dependencies. The Python import name is `vector`.

## When to Use

- Computing Lorentz-invariant quantities (invariant mass, rapidity, gamma/beta)
  from four-momentum components (px, py, pz, E) or (pt, eta, phi, mass)
- Boosting four-vectors between reference frames for relativistic kinematics
- Computing angular separations (deltaR in eta-phi space) between particle
  jets or tracks
- Performing 2D/3D spatial vector operations (rotations, dot products, cross
  products) with physics-oriented coordinate systems
- Vectorised four-vector algebra over NumPy arrays for batch processing of
  particle collision data

## When NOT to Use

- Looking up particle properties like mass, width, or PDG ID (use **particle**)
- Unit conversions between energy, length, and time (use **pint** for general
  units, or **astropy** for astronomical units)
- Symbolic physics calculations or analytical mechanics (use **sympy**)
- Orbital mechanics, ephemeris, or celestial coordinate frames (use **astropy**
  or **skyfield**)
- Fitting experimental data or statistical analysis (use **scipy**, **iminuit**,
  or **lmfit**)

## Capabilities

| Area | Key API |
|---|---|
| Object vector | `vector.obj(px=..., py=..., pz=..., E=...)` |
| Momentum coords | `.pt`, `.eta`, `.phi`, `.mass`, `.rapidity` |
| Lorentz | `.boost(beta)`, `.boost_p4(p4)`, `.gamma_beta`, `.beta` |
| Invariant mass | `.mass` (alias `.tau`) — `sqrt(E**2 - p**2)` |
| Angular separation | `.deltaR(other)`, `.deltaphi(other)`, `.deltaeta(other)` |
| 3D spatial | `vector.obj(x=..., y=..., z=...)` → `.cross`, `.dot`, `.mag` |
| NumPy arrays | `vector.array({'px': arr, 'py': arr, ...})` — vectorised |

## Worked Example

Compute the invariant mass of a four-vector with components (px=1, py=2, pz=3,
E=4):

```python
import vector

str(vector.obj(px=1, py=2, pz=3, E=4).mass)
# -> "1.4142135623730951"
```

The invariant mass is sqrt(E^2 - px^2 - py^2 - pz^2) = sqrt(16 - 14) =
sqrt(2) ~ 1.414. For batch processing with NumPy arrays:

```python
import numpy as np
import vector

p = vector.array({'px': np.array([1, 10]), 'py': np.array([2, 20]),
                  'pz': np.array([3, 30]), 'E': np.array([4, 40])})
p.mass  # array of invariant masses
```

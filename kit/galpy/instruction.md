# galpy

galpy is a Python package for galactic dynamics. It provides tools for orbit
integration, gravitational potential evaluation, action-angle analysis, and
distribution-function modelling in arbitrary galactic potentials. galpy includes a
library of standard potentials (Miyamoto-Nagai, NFW, logarithmic, disk, bulge)
and composites (MWPotential2014), plus utilities for coordinate conversion and
circular-velocity curves. The Python import name is `galpy`. It requires NumPy,
SciPy, and packaging at runtime.

## Limitations in this kit

matplotlib is an unconditional upstream dependency but cannot be provided in this
Pyodide environment (native/heavy). Plotting functions (`galpy.potential.plotPotentials`,
`Orbit.plot`, `plotRotcurve`) are unavailable. Extract numerical results from
orbit arrays and potential evaluations and format output programmatically instead.
astropy is an optional dependency for Quantity support and is not loaded by default.

## When to Use

- Integrating stellar orbits in a specified galactic gravitational potential
- Evaluating potentials, forces, and circular-velocity curves at given (R, z)
- Computing action-angle variables for orbits in axisymmetric potentials
- Modelling distribution functions (quasi-isothermal, Dehnen, Shu)
- Building composite potentials from standard components (disk + halo + bulge)
- Calculating escape velocities, epicycle frequencies, and vertical frequencies

## When NOT to Use

- Earth-orbit satellite propagation from TLE data (use **sgp4** — SGP4/SDP4
  orbital mechanics, not galactic dynamics)
- High-precision solar-system ephemeris (use **skyfield** with JPL ephemerides)
- N-body gravitational simulations with particle-particle interactions (galpy
  integrates test particles in fixed potentials, not self-gravitating N-body)
- General-purpose ODE integration (use **scipy** `solve_ivp`)
- Unit-aware physical calculations (use **astropy** units or **pint**)

## Capabilities

| Area | Key API |
|---|---|
| Potentials | `MiyamotoNagaiPotential`, `NFWPotential`, `LogarithmicHaloPotential`, `HernquistPotential` |
| Composite | `MWPotential2014` (Bovy 2015 Milky Way model) |
| Evaluation | `evaluatePotentials(Pot, R, z)`, `vcirc(Pot, R)`, `epifreq`, `verticalfreq` |
| Orbits | `Orbit(vxvv=...)`, `o.integrate(ts, pot)`, `o.R(t)`, `o.z(t)`, `o.vR(t)` |
| Action-angle | `actionAngleStaeckel`, `actionAngleAdiabatic`, `actionAngleIsochrone` |
| Distribution | `quasiisothermaldf`, `dehnendf`, `shudf` |
| Coordinates | `galpy.util.coords` (Galactocentric ↔ heliocentric) |

## Worked Example

Evaluate the circular velocity at R = 1 (natural units) in a Miyamoto-Nagai
potential normalized so that v_c(R=1) = 1:

```python
from galpy.potential import MiyamotoNagaiPotential, vcirc

p = MiyamotoNagaiPotential(a=0.5, b=0.0375, normalize=1.)
'%.1f' % float(vcirc(p, 1.))
# -> "1.0"
```

With `normalize=1.`, the potential is scaled so the circular velocity at R = 1
equals 1.0 in natural units. To convert to physical units, set `ro` (distance
scale in kpc) and `vo` (velocity scale in km/s) when constructing the potential.

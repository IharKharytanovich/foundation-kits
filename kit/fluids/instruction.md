# fluids

fluids is a Python library for fluid dynamics and hydraulics calculations. It
covers friction factor correlations (Colebrook, Churchill, Moody), Reynolds number
computation, pipe flow sizing, pump curves, compressible gas flow, drag
coefficients for particles and bodies, two-phase flow correlations, control valve
sizing (ISA/IEC), open-channel flow, packed beds and columns, flow meters, and
atmospheric property models. It depends on NumPy and SciPy at runtime.

## When to Use

- Computing Reynolds number, friction factors (Colebrook, Churchill, Moody), or
  Darcy/Fanning friction loss in pipes
- Sizing pipes, fittings, and valves — pressure drop across fittings (Crane K
  method, Hooper 2-K, Darby 3-K) and control valves (ISA/IEC liquid + gas)
- Drag coefficient calculations for spheres, cylinders, disks, and irregular
  particles
- Compressible gas flow — isothermal, adiabatic, isentropic nozzles, choked flow
- Two-phase flow correlations (Lockhart-Martinelli, Baker, Taitel-Dukler)
- Packed-bed and packed-tower pressure drop (Ergun, Stichlmair)
- Flow meter sizing (orifice, venturi, wedge, cone, nozzle)
- Atmospheric property models (US Standard Atmosphere 1976, ICAO)
- Open-channel flow (Manning, weirs, rectangular/trapezoidal channels)

## When NOT to Use

- Thermodynamic properties of pure substances and mixtures (enthalpy, entropy,
  phase equilibria) — use **thermo** or **coolprop**
- Pure unit conversion without any fluid-dynamics calculation — use **pint**
- Computational fluid dynamics (CFD), mesh generation, or solving the
  Navier-Stokes equations on a grid — use **scikit-fem** or an external solver
- Chemical reaction kinetics or equilibrium — use **chempy**
- Symbolic derivation of flow equations — use **sympy**

## Capabilities

| Area | Key API |
|---|---|
| Reynolds number | `fluids.Reynolds(V, D, rho, mu)` |
| Friction factors | `fluids.friction_factor(Re, eD)`, `fluids.friction.Colebrook(Re, eD)` |
| Pipe pressure drop | `fluids.nearest_pipe(Di)`, fitting K-methods |
| Control valves | `fluids.control_valve` module (Cv/Kv sizing, ISA/IEC) |
| Drag | `fluids.drag.drag_sphere(Re)`, `fluids.drag.drag_sphere_methods` |
| Compressible flow | `fluids.compressible` (isothermal, adiabatic, isentropic) |
| Two-phase flow | `fluids.two_phase` (Lockhart-Martinelli, Baker, etc.) |
| Packed beds | `fluids.packed_bed.dP_packed_bed(...)` |
| Flow meters | `fluids.flow_meter` (orifice, venturi, nozzle, wedge, cone) |
| Atmosphere | `fluids.atmosphere.ATMOSPHERE_1976(Z)` |
| Open channel | `fluids.open_flow` (Manning, weirs) |

## Worked Example

Compute the Reynolds number for water (rho=1000 kg/m3, mu=1e-3 Pa.s) flowing at
2.5 m/s through a 0.25 m diameter pipe:

```python
import fluids
str(fluids.Reynolds(V=2.5, D=0.25, rho=1000, mu=1e-3))
# -> "625000.0"
```

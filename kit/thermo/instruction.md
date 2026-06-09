# thermo

thermo is a Python library for chemical engineering thermodynamics. It provides
temperature- and pressure-dependent thermophysical property estimation for pure
compounds and mixtures, including heat capacity, density, viscosity, vapour
pressure, and enthalpy of vaporisation. thermo builds on its companion libraries
fluids (fluid dynamics correlations) and chemicals (pure-component data for
70 000+ substances) and requires NumPy, SciPy, and pandas at runtime. The Python
import name is `thermo`.

## When to Use

- Estimating thermophysical properties of pure compounds at specified temperature
  and pressure (heat capacity, density, viscosity, thermal conductivity, vapour
  pressure, surface tension, enthalpy of vaporisation)
- Looking up critical-point constants, acentric factors, and reference data for
  chemical species by name, CAS number, or formula
- Performing VLE (vapour-liquid equilibrium) flash calculations for mixtures
  using activity-coefficient or equation-of-state models
- Computing mixture properties (mixing rules, excess Gibbs energy models)
- Phase-envelope and bubble/dew-point calculations for multicomponent systems
- Experiment design requiring transport or thermodynamic properties at many
  state points (vectorised over T/P grids via NumPy arrays)

## When NOT to Use

- Molecular-weight or molar-mass calculation from a chemical formula (use
  **molmass** -- it parses formulas directly without a property database)
- Symbolic algebra, equation solving, or calculus (use **sympy**)
- Reaction stoichiometry balancing or chemical kinetics modelling (use
  **chempy** -- thermo covers properties, not reactions)
- General-purpose numerical optimisation or curve fitting (use **scipy**)
- Physical-constant lookup with units (use **periodictable** for element data or
  **pint** for unit-aware quantities)
- Orbital mechanics or astronomical calculations (use **sgp4** or **astropy**)

## Capabilities

| Area | Key API |
|---|---|
| Pure compound | `Chemical(ID, T=, P=)` -- full property set at a state point |
| Property access | `.Cp`, `.rho`, `.mu`, `.Psat`, `.Hvap`, `.k`, `.sigma` |
| Identification | Name, CAS, formula, SMILES accepted as ID |
| Mixture | `Mixture(['water','ethanol'], ws=[0.5,0.5], T=300, P=1e5)` |
| Flash | `Flash`, `FlashVL`, `FlashVLN` -- TP/PH/PS/TV flash |
| EOS models | `PR`, `SRK`, `PRMIX`, `SRKMIX` -- cubic equations of state |
| Activity models | `NRTL`, `UNIQUAC`, `Wilson`, `RegularSolution` |
| Data | `chemicals.CAS_from_any`, `chemicals.Tb`, `chemicals.Tc` |

## Worked Example

Look up the isobaric heat capacity of liquid water at 300 K and 101 325 Pa:

```python
from thermo import Chemical

c = Chemical('water', T=300, P=101325)
'%.6f' % c.Cp
# -> "4180.633831"
```

The result is in SI units (J/(kg K)). All properties follow the same pattern:
construct a `Chemical` at a state point, then read the property attribute.

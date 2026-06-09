# chempy

chempy is a Python library for chemistry: stoichiometry, reaction balancing,
chemical kinetics, and equilibrium modelling. It represents substances as
formula-aware objects, balances arbitrary reaction equations symbolically, and
can integrate ODE-based kinetics systems. chempy requires NumPy, SciPy, SymPy,
and pyparsing at runtime. The Python import name is `chempy`.

## When to Use

- Balancing chemical reaction equations from reactant and product formulas
  (arbitrary complexity, including redox and multi-step reactions)
- Computing molar masses and elemental composition from chemical formulas
- Modelling reaction kinetics as ODE systems (rate laws, Arrhenius parameters,
  integrated rate expressions)
- Chemical equilibrium calculations for solution-phase or gas-phase systems
- Representing and manipulating chemical substances, reactions, and reaction
  systems as first-class Python objects
- Electrochemistry: Nernst equation, electrode potentials

## When NOT to Use

- Symbolic algebra, equation solving, or calculus not specific to chemistry (use
  **sympy** -- chempy delegates its symbolic backend to SymPy)
- Thermophysical property estimation (heat capacity, density, vapour pressure)
  at given T/P (use **thermo** -- chempy models reactions, thermo models
  properties)
- Molecular-weight calculation from a formula when you do not need reaction
  balancing (use **molmass** -- lighter, no symbolic dependency)
- Element lookup by atomic number, isotope data, or periodic-table constants
  (use **periodictable** or **mendeleev**)
- General-purpose numerical optimisation or interpolation (use **scipy**)
- Numerical array computation without chemistry semantics (use **numpy**)

## Capabilities

| Area | Key API |
|---|---|
| Balancing | `balance_stoichiometry(reactants, products)` -- returns coefficient dicts |
| Substance | `Substance.from_formula('H2SO4')` -- `.mass`, `.composition` |
| Reaction | `Reaction({'Fe':4,'O2':3}, {'Fe2O3':2})` -- stoichiometric object |
| Kinetics | `ReactionSystem(rxns, substances)` -- ODE integration of rate laws |
| Equilibrium | `Equilibrium(eq_const, reactants, products)` |
| Parsing | Formula parsing with automatic element counting |

## Worked Example

Balance the combustion of ethane (C2H6 + O2 -> CO2 + H2O):

```python
from chempy import balance_stoichiometry

r, p = balance_stoichiometry({'C2H6', 'O2'}, {'CO2', 'H2O'})
str(dict(sorted(r.items()))) + ' -> ' + str(dict(sorted(p.items())))
# -> "{'C2H6': 2, 'O2': 7} -> {'CO2': 4, 'H2O': 6}"
```

This means 2 C2H6 + 7 O2 -> 4 CO2 + 6 H2O. The function returns two
dictionaries mapping each species to its stoichiometric coefficient. Results are
always in the smallest integer ratio.

# periodictable

periodictable provides a comprehensive database of the elements and their
isotopes, including atomic mass, density, crystal structure, neutron/X-ray
scattering lengths, and many other physical properties. Values are drawn from
authoritative sources (NIST, IAEA, IUCr) and are accessible via simple
attribute lookup on element objects. The library also includes a formula parser
for computing molecular mass and chemical composition from string formulas like
`"H2O"` or `"CaCO3"`. periodictable requires NumPy at runtime and uses
pyparsing internally for formula parsing (bundled).

## When to Use

- Looking up physical constants for elements: atomic mass, density, number,
  symbol, ionic radius, crystal structure, thermal neutron cross-sections
- Computing molecular mass or isotopic mass from a chemical formula string
- Accessing neutron scattering length density (SLD) data for reflectometry or
  small-angle scattering studies
- Building composition tables — iterating over elements by number or symbol
- Isotope-specific queries: natural abundance, half-life, decay modes

## When NOT to Use

- Calculating molecular mass from an empirical formula without needing element
  property lookups (use **molmass** — lighter, formula-only, no NumPy)
- Looking up detailed electronic or thermodynamic properties of elements such
  as ionisation energy series, electron configuration, or electronegativity
  (use **mendeleev** — richer per-element metadata from a relational dataset)
- Performing chemical reaction balancing or stoichiometry (use **chempy**)
- Symbolic algebra on chemical equations (use **sympy**)
- Unit-aware physical calculations (use **pint** or **astropy.units**)

## Capabilities

| Area | Key API |
|---|---|
| Element lookup | `periodictable.Fe`, `periodictable.elements[26]` |
| Atomic mass | `element.mass` (standard atomic weight, amu) |
| Density | `element.density` (g/cm^3) |
| Crystal structure | `element.crystal_structure` |
| Isotopes | `element[56]` (Fe-56), `.abundance`, `.mass` |
| Neutron scattering | `element.neutron.coherent`, `.incoherent`, `.absorption` |
| X-ray scattering | `element.xray.sftable` |
| Formula parser | `periodictable.formula('CaCO3')`, `.mass`, `.atoms` |
| Iteration | `for el in periodictable.elements: ...` |

## Worked Example

Look up the standard atomic weight of iron:

```python
import periodictable
'%.4f'%periodictable.Fe.mass
# -> "55.8450"
```

A common workflow computes molecular mass from a formula string:

```python
import periodictable
f = periodictable.formula('H2O')
f.mass        # 18.01528
f.atoms       # {Element(H): 2, Element(O): 1}
```

Always use `element.mass` for standard atomic weight and `element[A].mass` for
a specific isotope's mass. Formula strings follow Hill notation.

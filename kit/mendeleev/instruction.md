# mendeleev

A comprehensive database of element, ion, and isotope properties backed by a
curated SQLite dataset. Mendeleev exposes rich physical and chemical data —
electronegativity scales (Pauling, Allen, Mulliken, Allred-Rochow, and more),
atomic/ionic/van-der-Waals radii, ionization energies, electron affinities,
electron configurations, oxidation states, and phase-transition temperatures —
for every element in the periodic table plus their common ions and isotopes.

## When to Use

- You need detailed **element properties** beyond mass and symbol — e.g.
  electronegativity on a specific scale, covalent radius, or electron
  configuration.
- You need **ionic data**: ionic radii by charge and coordination number,
  ionization energies by level.
- You need **isotope properties**: mass, abundance, half-life, decay modes.
- You need to **compare or tabulate** properties across many elements (the
  `fetch_table` helper returns a pandas DataFrame of any database table).
- You need **electronegativity calculations** on scales not available as simple
  look-ups (Li-Xue, Martynov-Batsanov, Sanderson, Gordy, Nagle).

## When NOT to Use

- For **molecular mass from a formula** (e.g. "H₂SO₄ → 98.079") → use
  **molmass** instead; mendeleev has element masses, not a formula parser.
- For **basic element lookup by symbol only** (mass, atomic number) with no need
  for radii, electronegativity, or ions → **periodictable** is lighter weight.
- For **chemical reaction balancing or stoichiometry** → use **chempy**.
- For **thermodynamic property estimation** (Cp, Psat, mixture flash) → use
  **thermo**.
- For **molecular structure or substructure search** → use **rdkit**.

## Capabilities

| Capability | API |
|---|---|
| Element by symbol/name/Z | `element('Fe')`, `element(26)`, `element('Iron')` |
| Batch element list | `get_all_elements()` |
| Attribute across elements | `get_attribute_for_all_elements('atomic_weight')` |
| Ion object | `from mendeleev import ion; ion.Ion('Fe', q=3)` |
| Isotope by A | `from mendeleev import isotope; isotope('Fe', 56)` |
| Electronegativity scales | `e.electronegativity('pauling')`, `e.electronegativity('allred-rochow')` |
| Ionic radii | `e.ionic_radii` (list by charge and coordination) |
| Ionization energies | `e.ionization_energies` |
| Electron configuration | `e.econf`, `e.ec.to_str()` |
| Tabular dump | `from mendeleev.fetch import fetch_table; fetch_table('elements')` |

## Worked Example

```python
from mendeleev import element
fe = element('Fe')
str(fe.atomic_weight)
# → 55.845
```

# Molmass

Molmass calculates molecular masses, isotopic compositions, and mass
distributions from chemical formulas. It parses Hill notation and common chemical
formula strings, providing average molecular mass, monoisotopic (exact) mass,
and per-element breakdowns. Molmass is a pure-Python library with no external
dependencies.

## When to Use

- Computing the average molecular mass of a compound from its chemical formula
  (e.g. H2O, C6H12O6, NaCl)
- Determining the monoisotopic (exact) mass for mass-spectrometry reference
- Obtaining elemental composition and mass fractions of a compound
- Validating or normalizing chemical formula strings
- Looking up atomic masses and isotopic data for individual elements

## When NOT to Use

- Encoding or decoding molecular structures as strings (use **selfies** — it
  provides robust SMILES-to-SELFIES conversion for molecular generative models)
- Manipulating biological sequences (DNA, RNA, protein) (use **biopython**)
- Symbolic algebra or equation solving (use **sympy**)
- Statistical analysis or numerical computation (use **numpy** or **scipy**)
- Predicting RNA secondary structure (use **viennarna**)

## Capabilities

| Area | Key API |
|---|---|
| Formula parsing | `molmass.Formula('H2O')`, `Formula('C6H12O6')`, `Formula('Ca(OH)2')` |
| Average mass | `Formula.mass` — standard average molecular mass (Da) |
| Monoisotopic mass | `Formula.monoisotopic_mass` — exact mass of lightest-isotope species |
| Composition | `Formula.composition()` — per-element count, mass, and mass fraction |
| Isotope distribution | `Formula.spectrum()` — isotopic mass distribution |
| Hill notation | `Formula.formula` — canonical Hill-order formula string |
| Elements database | `molmass.ELEMENTS` — periodic table with atomic masses and isotopes |

## Worked Example

Calculate the molecular mass of water:

```python
from molmass import Formula

water = Formula('H2O')
mass = round(water.mass, 3)
str(mass)
# → "18.015"
```

The `Formula` class accepts standard chemical notation including parenthesized
groups (e.g. `Ca(OH)2`), hydrates (e.g. `CuSO4.5H2O`), and charge notation.
Use `Formula.composition()` to see per-element breakdowns, or
`Formula.monoisotopic_mass` for exact mass-spectrometry reference values.

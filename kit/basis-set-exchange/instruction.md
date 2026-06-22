# basis-set-exchange

basis-set-exchange (BSE) is a Python library and bundled database for accessing,
converting, and comparing Gaussian-type basis sets used in quantum chemistry
calculations. It provides offline access to hundreds of basis sets (cc-pVDZ,
6-31G*, def2-TZVP, aug-cc-pVTZ, STO-3G, etc.) across all supported elements,
with output in over 20 quantum chemistry program formats (NWChem, Gaussian,
Psi4, ORCA, Molpro, JSON Schema, etc.). BSE is a data+format tool, NOT a
quantum chemistry engine — it does not perform SCF, DFT, or any electronic
structure calculation. All basis set data is bundled inside the wheel and
accessed offline with no network required. The Python import name is
`basis_set_exchange`. Exclusive bundled dependencies: jsonschema, argcomplete,
Unidecode, regex.

## When to Use

- Retrieving Gaussian basis set definitions for a set of elements in a specific
  quantum chemistry program format (e.g. cc-pVDZ for C, H, O in NWChem format)
- Comparing basis sets: listing available sets, checking element coverage,
  looking up references and descriptions
- Converting basis set data between quantum chemistry program formats
  (NWChem ↔ Gaussian ↔ Psi4 ↔ JSON ↔ etc.)
- Looking up basis set metadata: original references, family relationships,
  element availability, description
- Programmatic access to the EMSL/MolSSI Basis Set Exchange database without
  network access

## When NOT to Use

- Running quantum chemistry calculations (SCF, DFT, CCSD, MP2, etc.) — BSE
  provides only basis set definitions, not a computational engine
- Element property lookups like atomic mass, electronegativity, or electron
  configuration (use **mendeleev** or **periodictable**)
- Molecular structure building or cheminformatics (use **rdkit** or **ase**)
- Thermodynamic property calculations (use **thermo**)
- Stoichiometry or chemical equation balancing (use **chempy**)

## Capabilities

| Area | Key API |
|---|---|
| Get basis set | `bse.get_basis('cc-pvdz', elements=[6,1,8], fmt='nwchem')` |
| List all bases | `bse.get_all_basis_names()` |
| List formats | `bse.get_formats()` |
| Element coverage | `bse.get_basis('cc-pvdz')['elements']` |
| References | `bse.get_references('cc-pvdz', elements=[6])` |
| Metadata | `bse.get_basis_family('cc-pvdz')`, `bse.get_basis('cc-pvdz')['description']` |
| Lookup by role | `bse.get_role_completion('cc-pvdz', 'jkfit')` |

## Worked Example

Check that the STO-3G basis set for hydrogen (Z=1) in NWChem format contains
the expected exponent value:

```python
import basis_set_exchange as bse

str('3.42525091' in bse.get_basis('sto-3g', elements=[1], fmt='nwchem'))
# -> "True"
```

The STO-3G basis for hydrogen is a contraction of 3 Gaussian primitives; the
exponent 3.42525091 is one of the three primitive exponents. To get the full
basis set definition:

```python
import basis_set_exchange as bse

nwchem_text = bse.get_basis('cc-pvdz', elements=[6, 1, 8], fmt='nwchem')
# Returns the cc-pVDZ basis set for C, H, O in NWChem input format
```

# Pyteomics

Pyteomics is a pure-Python library for mass spectrometry and proteomics data
analysis. It computes peptide and protein molecular masses (monoisotopic and
average), fragment ion m/z values, and parses standard data formats (mzML, mzXML,
MGF, FASTA, pepXML, mzIdentML). Pyteomics has no compiled dependencies and works
entirely in Python.

## When to Use

- Computing the monoisotopic or average mass of a peptide from its amino acid
  sequence (e.g. `PEPTIDE`, `ACDEFGHIK`)
- Calculating theoretical fragment ion m/z values (b, y, a, c, z ions) for
  tandem mass spectrometry (MS/MS) analysis
- Parsing mass spectrometry data files: mzML, mzXML, MGF
- Reading and writing FASTA protein/peptide sequence files
- Parsing identification results: pepXML, mzIdentML
- Performing in-silico protein digestion (trypsin, chymotrypsin, etc.)
- Isotope distribution and mass defect calculations

## When NOT to Use

- Computing molecular masses from chemical formulas (not sequences) (use **molmass**)
- Manipulating DNA/RNA sequences or phylogenetics (use **biopython** or **dendropy**)
- General-purpose numerical computation (use **numpy** or **scipy**)
- Symbolic chemistry or stoichiometry (use **chempy**)
- Thermodynamic property lookup (use **thermo**)

## Capabilities

| Area | Key API |
|---|---|
| Peptide mass | `mass.calculate_mass(sequence='PEPTIDE')` — monoisotopic mass |
| Average mass | `mass.calculate_mass(sequence='PEPTIDE', average=True)` |
| Fragment m/z | `mass.fast_mass2(sequence, ion_type='b', charge=1)` |
| In-silico digestion | `parser.cleave(sequence, rule='trypsin')` |
| mzML parsing | `mzml.MzML('file.mzML')` — iterable of spectra |
| MGF parsing | `mgf.MGF('file.mgf')` — iterable of spectra |
| FASTA I/O | `fasta.read('file.fasta')` — iterable of (header, sequence) |
| Amino acid composition | `parser.amino_acid_composition(sequence)` |

## Worked Example

Calculate the monoisotopic mass of the hexapeptide PEPTIDE:

```python
from pyteomics import mass

m = mass.calculate_mass(sequence='PEPTIDE')
str(round(m, 4))
# → "799.36"
```

The `calculate_mass` function accepts standard one-letter amino acid sequences and
optional modifications. Use `average=True` for the average (not monoisotopic)
mass. Use `mass.fast_mass2` for fragment ion m/z at a given charge state.

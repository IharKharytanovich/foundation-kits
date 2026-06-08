# freesasa

freesasa provides Python bindings for the FreeSASA C library, which computes
solvent-accessible surface area (SASA) of protein structures. It implements
both the Lee-Richards (slicing) and Shrake-Rupley (sphere-point) algorithms
with built-in atom classifiers (ProtOr, NACCESS, OONS). The Python import name
is `freesasa`. It has no runtime dependencies.

## When to Use

- Computing solvent-accessible surface area of a protein from PDB coordinates
- Classifying atoms as polar or apolar using built-in or custom classifiers
  (ProtOr, NACCESS, OONS)
- Analysing per-residue, per-chain, or whole-structure SASA breakdowns
- Comparing buried vs exposed surface in protein-protein interfaces
- Selecting subsets of atoms for SASA analysis using FreeSASA's selection
  language

## When NOT to Use

- Molecular dynamics simulation or energy minimisation (freesasa is a static
  geometry tool, not a force-field engine)
- Molecular weight, formula, or isotope calculations (use **molmass**)
- Sequence alignment, phylogenetics, or gene finding (use **biopython**,
  **dendropy**, or **pyrodigal**)
- RNA secondary structure prediction (use **viennarna**)
- General-purpose numerical computation on arrays (use **numpy** or **scipy**)

## Capabilities

| Area | Key API |
|---|---|
| Calculation | `freesasa.calc(structure, parameters=None)` |
| Structure | `freesasa.Structure(path)`, `freesasa.structureFromBioPDB(model)` |
| Classifiers | `freesasa.Classifier` — built-in ProtOr, NACCESS, OONS |
| Parameters | `freesasa.Parameters({'algorithm': ...})` — LeeRichards / ShrakeRupley |
| Results | `result.totalArea()`, `result.atomArea(i)` |
| Node tree | `freesasa.Tree` — hierarchical structure → chain → residue → atom |
| Selection | `freesasa.selectArea('name, resn ALA', structure, result)` |

## Worked Example

Verify freesasa is available (the golden test uses a version-string smoke
because SASA computation requires protein structure input and no deterministic
no-input API is available):

```python
import freesasa

freesasa.__version__
# → "2.2.1"
```

A typical workflow loads a PDB structure, computes SASA, and inspects results:

```python
import freesasa

structure = freesasa.Structure("protein.pdb")
result = freesasa.calc(structure)
print(f"Total SASA: {result.totalArea():.1f} A^2")
```

Use `freesasa.Parameters({'algorithm': freesasa.ShrakeRupley})` to switch
algorithms, or pass a custom `freesasa.Classifier` for non-standard radii.

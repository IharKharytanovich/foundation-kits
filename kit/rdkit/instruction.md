# RDKit

RDKit is a cheminformatics toolkit for working with molecules represented as
SMILES strings. It runs as a JS-WASM callable library — you invoke declared
operations or write free JS against the loaded module handle.

## When to Use

- Validating SMILES strings (checking if a molecule is parseable)
- Computing molecular descriptors (molecular weight, LogP, TPSA, ring counts)
- Canonicalizing SMILES (converting to RDKit-canonical form)
- Computing Morgan (circular) fingerprints for similarity comparisons
- Any cheminformatics computation on molecular structures

## When NOT to Use

- Numerical or symbolic mathematics (use numpy, scipy, or sympy)
- Sequence analysis (use seqtk)
- 2D/3D coordinate generation or SVG rendering (non-deterministic, use scripting)

## Operations

| Operation | Summary |
|---|---|
| `validate_smiles` | Check whether a SMILES string encodes a valid molecule |
| `descriptors` | Compute molecular descriptors (MW, LogP, TPSA, ring counts, …) |
| `canonical_smiles` | Return the RDKit-canonical SMILES for a molecule |
| `morgan_fp` | Compute a Morgan fingerprint bit-vector as a binary string |

Pick an operation and supply its parameters. All operations accept a `smiles`
parameter. `morgan_fp` also needs `fp_params` — a JSON string like
`{"radius":2,"nBits":2048}`.

## Scripting

This kit supports free JS scripting against the module handle. The handle
exposes the full RDKit MinimalLib API:

- `handle.get_mol(smiles)` → `JSMol` (or `null` for invalid SMILES)
- `mol.is_valid()` → `boolean`
- `mol.get_descriptors()` → JSON string
- `mol.get_smiles()` → canonical SMILES string
- `mol.get_morgan_fp(jsonParams)` → bit-vector string
- **`mol.delete()` is mandatory** — call it in a `finally` block

### Worked Example

```js
const mol = handle.get_mol('c1ccccc1');
try {
  const desc = JSON.parse(mol.get_descriptors());
  return desc.amw;
} finally {
  mol.delete();
}
```

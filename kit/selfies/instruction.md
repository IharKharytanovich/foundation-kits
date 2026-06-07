# SELFIES

SELFIES (SELF-referencIng Embedded Strings) is a 100%-robust molecular string
representation. Unlike SMILES, every SELFIES string decodes to a valid molecule
— there are no syntax errors. This makes SELFIES ideal for generative models and
machine learning on molecular structures, where random mutations or interpolations
in string space must always produce chemically valid output. SELFIES is a
pure-Python library with no external dependencies.

## When to Use

- Converting SMILES strings to SELFIES representation for ML pipelines
- Decoding SELFIES strings back to SMILES for downstream chemistry tools
- Generating or mutating molecular strings with guaranteed validity (every
  SELFIES string is a valid molecule)
- Enumerating molecular fragments or building combinatorial molecular libraries
- Preprocessing molecular datasets for variational autoencoders, genetic
  algorithms, or reinforcement learning in drug discovery

## When NOT to Use

- Computing molecular masses or elemental composition from formulas (use
  **molmass** — it calculates mass from Hill notation without needing SMILES)
- Manipulating biological sequences such as DNA, RNA, or protein (use
  **biopython**)
- Numerical array computation or linear algebra (use **numpy**)
- General chemistry simulation or quantum calculations (outside this kit set)
- Phylogenetic analysis (use **dendropy**)

## Capabilities

| Area | Key API |
|---|---|
| Encoding | `selfies.encoder(smiles)` — convert a SMILES string to its SELFIES representation |
| Decoding | `selfies.decoder(selfies_str)` — convert a SELFIES string back to SMILES |
| Alphabet | `selfies.get_semantic_robust_alphabet()` — set of all valid SELFIES tokens |
| Constraints | `selfies.set_semantic_constraints(rule)` — adjust valence rules (`'default'`, `'hypervalent'`, `'octet_rule'`) |
| Length | `selfies.len_selfies(selfies_str)` — count tokens in a SELFIES string |
| Splitting | `selfies.split_selfies(selfies_str)` — iterate over individual SELFIES tokens |
| Label | `selfies.selfies_to_encoding(...)` — integer-encode a SELFIES string for ML models |

## Worked Example

Encode ethanol (SMILES `CCO`) as a SELFIES string:

```python
import selfies

encoded = selfies.encoder('CCO')
encoded
# → "[C][C][O]"
```

Each atom is wrapped in square brackets. The encoding is invertible:
`selfies.decoder('[C][C][O]')` returns `'CCO'`. Unlike SMILES, any random
sequence of valid SELFIES tokens (from `get_semantic_robust_alphabet()`) decodes
to a chemically valid molecule.

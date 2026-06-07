# ViennaRNA

ViennaRNA predicts RNA secondary structure by minimum free energy (MFE)
thermodynamic folding. It runs as a WASI binary — you select an operation and
fill in its parameters; the runtime handles invocation. The underlying algorithm
uses the Turner 2004 nearest-neighbor energy model to compute the most stable
base-pairing pattern for an RNA sequence, returning the structure in dot-bracket
notation along with the free energy in kcal/mol.

This kit exposes the `RNAfold` program from the ViennaRNA Package (version 2.7.2).
RNAfold reads one or more RNA sequences and computes the MFE secondary structure
for each.

## When to Use

- Predicting the minimum free energy (MFE) secondary structure of an RNA sequence
- Obtaining dot-bracket notation for RNA base pairing
- Computing the thermodynamic stability (free energy) of RNA folding
- Analyzing short to medium-length RNA sequences (tRNA, riboswitches, aptamers,
  small regulatory RNAs)

## When NOT to Use

- General DNA/RNA/protein sequence manipulation, format conversion, or translation
  (use **biopython** — it handles FASTA I/O, reverse complement, and sequence
  objects)
- Predicting protein-coding genes in prokaryotic genomes (use **pyrodigal**)
- Phylogenetic tree construction or comparison (use **dendropy**)
- Molecular mass or chemical formula calculations (use **molmass**)
- Protein structure prediction or analysis (outside this kit set)
- Sequence alignment or homology search (use **biopython** or external tools)

## Operations

| Operation | Summary |
|---|---|
| `fold` | Predict MFE secondary structure (dot-bracket + energy) |

Pick the `fold` operation and supply its parameters. Do not pass raw command-line
flags; the runtime maps parameters to the correct invocation.

### `fold` Parameters

| Parameter | Type | Description |
|---|---|---|
| `sequence` | string | The RNA sequence to fold (e.g. `GGGAAACCC`) |

The sequence is passed via stdin. The output contains two lines: the input
sequence echoed back, followed by the dot-bracket structure with the MFE energy
in parentheses.

### Dot-Bracket Notation

In the output, each character represents one nucleotide position:
- `(` — base is paired (opening / 5' side)
- `)` — base is paired (closing / 3' side)
- `.` — base is unpaired

The energy value in parentheses is the minimum free energy in kcal/mol (more
negative = more stable).

## Worked Example

Predict the MFE structure of a short hairpin sequence:

**Operation**: `fold`
**Parameters**: `{ "sequence": "GGGAAACCC" }`
**Output**:
```
GGGAAACCC
(((...)))  ( -1.20)
```

The three G's pair with the three C's to form a stem, and the three A's form the
loop — a classic hairpin. The MFE is -1.20 kcal/mol, indicating a moderately
stable structure.

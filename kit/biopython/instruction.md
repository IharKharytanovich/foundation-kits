# Biopython

Biopython is a comprehensive Python library for computational molecular biology.
It provides tools for sequence manipulation, file format parsing, alignment
processing, and structural biology. The Python import name is `Bio` (not
`biopython`). Biopython depends on NumPy for numerical operations on sequence
data and structural coordinates.

## When to Use

- Manipulating DNA, RNA, or protein sequences (reverse complement, transcription,
  translation, slicing)
- Parsing and writing bioinformatics file formats (FASTA, FASTQ, GenBank, PDB,
  EMBL, SwissProt, Clustal)
- Processing sequence alignments and computing alignment statistics
- Analyzing protein structures from PDB/mmCIF files
- Searching for sequence motifs or restriction sites
- Converting between nucleotide and amino-acid representations

## When NOT to Use

- Numerical array computations or linear algebra (use **numpy**)
- Predicting genes in prokaryotic genomes (use **pyrodigal** — it wraps Prodigal
  and is purpose-built for ORF calling)
- Phylogenetic tree construction, comparison, or manipulation (use **dendropy** —
  Biopython's `Bio.Phylo` is limited; DendroPy provides Robinson-Foulds metrics,
  consensus trees, and richer tree operations)
- Predicting RNA secondary structure (use **viennarna** — its MFE folding is far
  more accurate than any Biopython heuristic)
- Calculating molecular masses from chemical formulas (use **molmass**)
- Statistical modelling, curve fitting, or optimisation (use **scipy**)

## Capabilities

| Area | Key Functions |
|---|---|
| Sequences | `Bio.Seq.Seq`, `Seq.reverse_complement`, `Seq.translate`, `Seq.transcribe` |
| Sequence records | `Bio.SeqRecord.SeqRecord`, annotations, features |
| File I/O | `Bio.SeqIO.parse`, `Bio.SeqIO.read`, `Bio.SeqIO.write` (FASTA, GenBank, FASTQ, EMBL) |
| Alignments | `Bio.Align.PairwiseAligner`, `Bio.AlignIO.parse`, `Bio.AlignIO.write` |
| Protein structure | `Bio.PDB.PDBParser`, `Bio.PDB.MMCIFParser`, atom coordinates, DSSP |
| Motifs | `Bio.motifs`, position-weight matrices, JASPAR |
| Restriction enzymes | `Bio.Restriction`, enzyme search over sequences |
| Utilities | `Bio.SeqUtils.gc_fraction`, `Bio.SeqUtils.molecular_weight` |

## Worked Example

Compute the reverse complement of a short DNA sequence:

```python
from Bio.Seq import Seq

seq = Seq('ATGC')
rc = seq.reverse_complement()
str(rc)
# → "GCAT"
```

The `Seq` object supports slicing, concatenation, and all standard sequence
operations. Use `Seq.translate()` to convert a coding DNA sequence to its
amino-acid translation, or `Seq.transcribe()` to obtain the mRNA equivalent.

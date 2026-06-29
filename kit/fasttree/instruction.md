# fasttree

FastTree infers approximately-maximum-likelihood phylogenetic trees from
multiple sequence alignments. It handles both nucleotide and protein
alignments, producing a Newick-format tree on stdout.

## When to Use

- You have a **multiple sequence alignment** (FASTA or Phylip interleaved) and
  need a de-novo phylogenetic tree.
- You need a fast ML-approximate tree for moderate to large alignments
  (hundreds to millions of sequences).
- Nucleotide alignments: pass `-nt`; protein alignments: default (JTT model) or
  `-wag`.

## When NOT to Use

- **Tree manipulation or comparison** (re-rooting, topology distances, clade
  extraction) → use `dendropy`.
- **Multiple sequence alignment itself** (you need to align raw sequences first)
  → use `kalign`.
- **Read mapping / alignment to a reference genome** → use `minimap2`.
- **Bayesian phylogenetics or dated trees** — FastTree produces
  point-estimate ML trees, not posterior distributions.

## Worked example

Input (nucleotide FASTA alignment via stdin):

```
>seqA
ATGCATGCATGCATGC
>seqB
ATGCATGCATGCATGA
>seqC
ATGGATGCATGCATGC
>seqD
TTGCATGCATGCATGC
```

Command: `FastTree -nt < alignment.fa`

Output (Newick tree on stdout):

```
(seqC:0.065683200,seqD:0.065683200,(seqA:0.000000005,seqB:0.065683200)0.000:0.000000005);
```

## Notes

- FastTree writes progress/diagnostics to **stderr**; only the Newick tree goes
  to **stdout** (matches the WASI I/O contract: stdout-only results).
- The default path (no `-seed`) is deterministic for a given input alignment.
- Branch support values are SH-like local support (0–1), printed at internal
  nodes in the Newick string.
- For genome-scale alignments, consider `-fastest` for speed at the cost of
  some accuracy.

# minimap2

minimap2 is a fast, general-purpose aligner for nucleotide sequences. It maps
long noisy reads (Oxford Nanopore, PacBio), short reads, spliced reads (RNA-seq),
and assembly contigs against a reference genome or set of sequences, producing
PAF (Pairwise mApping Format) or SAM output with CIGAR strings.

## When to Use

- **Long-read mapping** — align Oxford Nanopore or PacBio reads to a reference
  genome (presets `map-ont`, `map-pb`, `map-hifi`).
- **Short-read mapping** — align Illumina reads (`sr` preset).
- **Spliced alignment** — map RNA-seq reads with intron-aware alignment (`splice`
  preset).
- **Assembly-to-assembly** — align contigs or scaffolds for comparison (`asm5`,
  `asm10`, `asm20` presets).
- **Overlap detection** — find read-to-read overlaps for de-novo assembly (`ava-ont`,
  `ava-pb` presets).

## When NOT to Use

- **Pairwise edit distance / alignment score between two strings** — use `edlib`
  (exact edit distance, Levenshtein, CIGAR from two sequences).
- **Multiple sequence alignment** — use `kalign` (aligns 3+ sequences
  simultaneously).
- **Phylogenetic tree inference** — use `fasttree` (infers trees from a
  multiple-sequence alignment).
- **SAM post-processing** (filtering, sorting, statistics) — use `samtools`.

## Two-input wiring

minimap2 takes TWO inputs: a reference and a query. Under the Foundation WASI
runtime they are wired as: the `reference` param is materialized as a file in the
preopened dir and its path fills the `{reference}` placeholder in the operation's
`argsTemplate`; the `query` is streamed on stdin (`stdinParam: query`), with
minimap2's `-` token telling it to read the query from stdin. The resulting argv
is `-x map-ont -t 1 <reference-file> -`. The WASI build produces PAF identical to
the native binary (the golden below matches it byte-for-byte).

## Presets

| Preset | Use case |
|--------|----------|
| `map-ont` | Oxford Nanopore reads |
| `map-pb` | PacBio CLR reads |
| `map-hifi` | PacBio HiFi/CCS reads |
| `sr` | Short (Illumina) reads |
| `splice` | Long-read RNA-seq (spliced) |
| `asm5` | Assembly-to-reference, ≤5% divergence |
| `asm10` | Assembly-to-reference, ≤10% divergence |
| `asm20` | Assembly-to-reference, ≤20% divergence |
| `ava-ont` | ONT read-to-read overlap |
| `ava-pb` | PacBio read-to-read overlap |

## Output format

PAF (Pairwise mApping Format) — tab-separated columns:

```
qname qlen qstart qend strand tname tlen tstart tend matches alnlen mapq [tags...]
```

## Worked example

Reference (`ref.fa`):
```
>chrT
GATCAAGTTTCAGTTCGATCCTAAGCTTGACTTACCGATATGCATCAGCGATCGATCTTAAGCTGGATTCAACTGGTCAAGCTTACCGATCGATCCTAAGTTT
```

Query (`query.fa`):
```
>read1
CAGTTCGATCCTAAGCTTGACTTACCGATATGCATCAGCGATCGATCTTAAGCTGG
```

Command (query on stdin, as the runtime wires it): `minimap2 -x map-ont -t 1 ref.fa - < query.fa`

Output (PAF):
```
read1	56	5	52	+	chrT	103	15	62	47	47	10	tp:A:P	cm:i:7	s1:i:47	s2:i:0	dv:f:0.0089	rl:i:0
```

This maps `read1` (56 bp, positions 5–52 used) to `chrT` (103 bp, positions
15–62) on the + strand, with 47 matching residues, alignment length 47, and
mapping quality 10.

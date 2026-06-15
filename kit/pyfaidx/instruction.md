# pyfaidx

pyfaidx provides efficient, pythonic random access to FASTA subsequences. It
implements `samtools faidx`-style indexing in pure Python, enabling fast region
extraction from large FASTA files without loading the entire file into memory.
You write Python against the `pyfaidx` API in the sandbox — index a FASTA, then
slice records by coordinate, retrieve reverse complements, or query lengths.

## When to Use

- Extracting specific genomic regions from a FASTA file by coordinates
- Retrieving reverse-complement sequences for a given region
- Querying the length of a named sequence (chromosome, contig, scaffold)
- Random access into large reference genomes without full-file loading

## When NOT to Use

- Streaming or batch-processing all sequences in a FASTA/FASTQ file (use
  **seqtk** -- it handles format conversion, subsampling, and full-file
  iteration)
- Computational molecular biology tasks like alignments, phylogenetics, or
  structure parsing (use **biopython**)
- Prokaryotic gene prediction or ORF finding (use **pyrodigal**)
- Numerical array operations on sequence-derived data (use **numpy**)

## Capabilities

| Area | Key API |
|---|---|
| Open / index | `Fasta(path)` — builds a `.fai` index, returns a mapping of name → record |
| Coordinate slicing | `fasta['chr1'][start:end]` — 0-based half-open slice, returns a `Sequence` |
| Region string | `fasta['chr1'][start-1:end]` for 1-based inclusive `chr:start-end` regions |
| Reverse complement | `(-fasta['chr1'][start:end])` or `seq.reverse.complement` |
| Length | `len(fasta['chr1'])` — length of a named record |
| Sequence value | `str(seq)` — the nucleotide string of a `Sequence` |

`pyfaidx` reads from a file path, so write FASTA text to a file (e.g. under
`/tmp`) before indexing.

## Worked Example

Extract a subsequence from a short FASTA input:

```python
from pyfaidx import Fasta
open('/tmp/pf.fa', 'w').write('>chr1\nACGTACGTACGT\n')
str(Fasta('/tmp/pf.fa')['chr1'][2:6])
# → "GTAC"
```

Retrieve the reverse complement of a region, and query a record's length:

```python
from pyfaidx import Fasta
fasta = Fasta('/tmp/pf.fa')
str(-fasta['chr1'][0:3])   # reverse complement of "ACG" → "CGT"
len(fasta['chr1'])          # → 12
```

# pyfaidx

pyfaidx provides efficient, pythonic random access to FASTA subsequences. It
implements `samtools faidx`-style indexing in pure Python, enabling fast region
extraction from large FASTA files without loading the entire file into memory.
pyfaidx supports subsequence extraction, reverse-complement retrieval, and
sequence-length queries using a typed operation interface.

## When to Use

- Extracting specific genomic regions from a FASTA file by coordinates
  (`chr:start-end`, 1-based inclusive)
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

## Operations

| Operation | Summary |
|---|---|
| `subsequence` | Extract a subsequence by region `chr:start-end` (1-based inclusive) |
| `reverse_complement` | Extract a subsequence and return its reverse complement |
| `length` | Return the length of a named sequence |

Pick an operation and supply its parameters. The runtime handles FASTA indexing
and invocation.

## Worked Example

Extract a subsequence from a short FASTA input:

**Operation**: `subsequence`
**Parameters**: `{ "fasta": ">chr1\nACGTACGTACGT", "region": "chr1:3-6" }`
**Output**: `GTAC`

Retrieve the reverse complement of a region:

**Operation**: `reverse_complement`
**Parameters**: `{ "fasta": ">chr1\nACGTACGTACGT", "region": "chr1:1-3" }`
**Output**: `CGT`

Query the length of a sequence record:

**Operation**: `length`
**Parameters**: `{ "fasta": ">chr1\nACGTACGTACGT", "name": "chr1" }`
**Output**: `12`

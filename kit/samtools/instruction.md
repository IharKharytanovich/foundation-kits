# samtools

samtools (version 1.21) is the reference toolkit for reading, writing, filtering,
and manipulating SAM/BAM/CRAM alignment files and VCF/BCF variant call files. It
runs as a single multiplexed WASI binary dispatching four htslib tools — you
select an operation and fill in its parameters; the runtime handles invocation.

This kit exposes `samtools` alignment filtering/counting operations. The
multiplexed binary also bundles `bgzip`, `tabix`, and `htsfile`, but those are
not exposed as operations: they emit binary output or require a co-present index
file, neither of which fits the stdin/stdout, single-shot WASI I/O contract. The
underlying htslib 1.21 provides the SAM/BAM/CRAM and bgzf codec.

## When to Use

- Counting reads with specific alignment flags (e.g. reverse-strand, unmapped,
  duplicate) from a SAM stream
- Filtering SAM records by FLAG, mapping quality, or region

## When NOT to Use

- FASTA/FASTQ sequence munging, trimming, or sub-sampling (use **seqtk**)
- Indexed random-access FASTA retrieval (use **pyfaidx**)
- RNA secondary structure prediction or folding (use **viennarna**)
- Sequence alignment, edit distance, or pairwise alignment (use **edlib** or
  **biopython**)
- Phylogenetic tree construction or manipulation (use **dendropy**)
- General DNA/protein sequence objects, translation, or format conversion (use
  **biopython**)
- Variant calling or genotyping (samtools mpileup/call are not exposed as
  operations in this kit)
- BAM sorting or indexing (file-based operations incompatible with the stdin/stdout
  WASI I/O contract)

## Operations

| Operation | Tool | Summary |
|---|---|---|
| `count-reverse` | samtools | Count reverse-strand alignment records (FLAG 16) in a SAM stream |
| `view` | samtools | Filter/convert SAM records (reverse-strand selection) |

Pick an operation and supply its parameters. Do not pass raw command-line flags;
the runtime maps parameters to the correct invocation.

## Worked Examples

### `count-reverse`

Count how many reads in a SAM stream are mapped to the reverse strand (FLAG 16):

**Operation**: `count-reverse`
**Parameters**: `{ "sam": "<SAM text with header + alignment records>" }`
**Output**:
```
1
```

Given a minimal SAM with two mapped reads (one forward, one reverse-strand FLAG
16), `samtools view -c -f 16 -` counts exactly the one reverse-strand record and
prints `1`.

### `view`

Emit the reverse-strand records from a SAM stream:

**Operation**: `view`
**Parameters**: `{ "sam": "<SAM text with header + alignment records>" }`
**Output**:
```
r2	16	ref	5	60	4M	*	0	0	TTGA	*
```

`samtools view -f 16 -` keeps exactly the reverse-strand record and writes it as
a headerless SAM line.

> **Note**: Both golden outputs are captured from real `samtools.wasm` runs at
> build time. The `count-reverse` golden (`1\n`) is additionally build-gated (the
> build aborts if it does not reproduce).

## Tools Present in the Multiplexed Binary

The multiplexed `samtools.wasm` dispatches `argv[1]` to four tools:

| Tool | Purpose | Exposed as operation? |
|---|---|---|
| `samtools` | SAM/BAM/CRAM read/filter/count | yes (`count-reverse`, `view`) |
| `tabix` | Indexed region queries on tab-delimited genomic data | no |
| `bgzip` | Block-gzip (bgzf) compression/decompression | no |
| `htsfile` | Identify the format of an htslib-supported file | no |

`tabix`, `bgzip`, and `htsfile` are present in the binary (and reachable should a
file-based runtime ever need them) but are not exposed as operations: `tabix -l`
requires a co-present `.tbi` index file, `bgzip` emits binary bgzf, and `htsfile`
is a diagnostic utility — none map cleanly onto the stdin/stdout, single-shot
WASI I/O contract.

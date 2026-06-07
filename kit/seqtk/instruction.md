# seqtk

seqtk is a fast, lightweight toolkit for processing FASTA and FASTQ sequences.
It runs as a WASI binary — you select an operation and fill in its parameters;
the runtime handles invocation.

## When to Use

- Counting sequences and total bases in FASTA/FASTQ input
- Computing per-sequence nucleotide composition (A, C, G, T counts)
- Subsampling or extracting subsequences from sequence data
- Converting between FASTA and FASTQ formats
- Quick quality checks on sequence data

## When NOT to Use

- Numerical or symbolic mathematics (use numpy, scipy, or sympy)
- Alignment, assembly, or variant calling (outside seqtk's scope)
- Working with non-sequence data

## Operations

| Operation | Summary |
|---|---|
| `size` | Count the number of sequences and total bases |
| `comp` | Per-sequence nucleotide composition (chr, length, #A, #C, #G, #T, ...) |
| `seq` | Format conversion (FASTA ↔ FASTQ, reverse complement) |
| `sample` | Random subsampling of sequences |
| `subseq` | Extract subsequences by name or region |
| `fqchk` | FASTQ quality check statistics |
| `mergepe` | Merge paired-end reads |
| `trimfq` | Quality-based trimming of FASTQ reads |

Pick an operation and supply its parameters. Do not pass raw command-line flags;
the runtime maps parameters to the correct invocation.

## Worked Example

Count sequences and bases in a short FASTA input:

**Operation**: `size`
**Parameters**: `{ "sequence": ">s\nACGTACGT" }`
**Output**: tab-separated count of sequences and bases

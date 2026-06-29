# bedtools

bedtools is the standard toolkit for genome interval set-algebra. It operates on
genomic coordinate files (BED, GFF/GTF, VCF) and performs interval arithmetic —
the "Swiss army knife" for genomic intervals. This kit is a single-threaded WASI
build (bedtools self-multiplexes on `argv[1]`).

The **verified, callable surface is single-input only** — operations that consume
one interval stream on stdin: `merge` and `sort`. See "Two-input operations"
below for why `intersect`/`subtract`/`closest` are not exposed.

## When to Use

- **Merge adjacent/overlapping intervals** — collapse a coordinate-sorted BED into
  non-overlapping regions (`merge`).
- **Coordinate-sort intervals** — sort a BED/GFF/VCF stream by chrom then start
  (`sort`).

## When NOT to Use

- **Two-set interval overlap / subtraction / nearest-feature** — `intersect`,
  `subtract`, `closest` need two input files; not callable under today's runtime
  (see below). For in-memory single-set overlap queries use `intervaltree`.
- **Read alignment / mapping** — use `minimap2` (reads → PAF/SAM).
- **SAM/BAM/CRAM post-processing** (filter, sort, stats, pileup) — use `samtools`.
- **Sequence manipulation** (subseq, trimming, FASTQ→FASTA) — use `seqtk`.
- **Variant calling or genotyping** — bedtools does interval arithmetic, not
  variant discovery.

## Two-input operations (requires multi-file runtime contract)

Many headline bedtools subcommands take **two** input files (`intersect -a -b`,
`subtract`, `closest`, `coverage`, `window`, `map`). Foundation's WASI runtime
supplies exactly **one** input — `stdin` — and preopens only `/tmp` (wiped after
the run); there is no mechanism to mount a second input file. These two-input ops
are therefore **not exposed** in the manifest. They are still compiled into the
binary, so the manifest can grow them with no rebuild once the runtime gains a
multi-file input contract.

## Worked Example

Operation `merge` — collapse overlapping intervals in one sorted BED stream
(piped on stdin):

```
# input on stdin (pre-sorted):
chr1	100	200
chr1	150	250

# bedtools merge -i -
# → "chr1\t100\t250\n"
```

The two overlapping intervals [100,200) and [150,250) collapse to the single
spanning interval [100,250).

`sort` coordinate-sorts a stream:

```
# stdin:  chr1 150 250 / chr1 100 200
# bedtools sort -i -
# → "chr1\t100\t200\nchr1\t150\t250\n"
```

## Notes

- bedtools writes results to **stdout** and diagnostics to **stderr** (matches the
  WASI I/O contract: stdout-only results).
- `merge` requires **coordinate-sorted** input; pipe through `sort` first if the
  source is unsorted.
- All coordinates are **0-based, half-open** (BED convention).
- Output is deterministic for a given input stream.
- Built with the WASM exception-handling proposal (bedtools throws/catches on
  normal paths); the Foundation wasi runtime enables WASM-EH (it already hosts
  `kit/z3`). Build details: `build/bedtools/`.

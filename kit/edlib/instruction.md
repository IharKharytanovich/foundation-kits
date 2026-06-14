# edlib

Fast edit-distance and alignment library based on the edlib C/C++ implementation.
Computes the Levenshtein (unit-cost) edit distance and an optimal alignment path
(CIGAR string) between two sequences using a banded algorithm — much faster than
a naive DP for large inputs.

## When to use

- You need the **edit distance** (Levenshtein) between two strings or biological
  sequences.
- You need an **alignment path** (CIGAR) showing insertions, deletions, and
  substitutions.
- You need one of the three alignment modes:
  - **NW** — global (Needleman–Wunsch): align the full query to the full target.
  - **HW** — infix (semi-global): find the best substring of the target that
    matches the query (query is fully aligned, target may be trimmed on both
    ends).
  - **SHW** — prefix (semi-global): align the full query to a prefix of the
    target.

## When NOT to use

- **FASTA/FASTQ format manipulation** (trimming, subsampling, format conversion) →
  use `seqtk`.
- **Scoring-matrix biological alignment** (BLOSUM, PAM, affine gap costs,
  Smith–Waterman with custom scores) → use `biopython`. edlib is unit-cost
  Levenshtein only.
- **Multiple sequence alignment** → not supported; edlib is pairwise only.

## Operations

### `distance` — edit distance

Reads `<mode>\n<query>\n<target>` on stdin, prints the integer edit distance to
stdout (newline-terminated).

**Example** (the golden):

```
Input (stdin):
NW
kitten
sitting

Output (stdout):
3
```

### `align` — edit distance + CIGAR

Reads `<mode>\n<query>\n<target>` on stdin, prints
`<distance>\t<cigar>` to stdout (newline-terminated). The CIGAR uses extended
operations (`=` match, `X` mismatch, `I` insertion, `D` deletion).

The `align` golden CIGAR is captured at maintainer build time (see
`build/edlib/README.md`) — the placeholder in `manifest.json` will be replaced
with the actual output once `edlib.wasm` is built.

## Build status

This kit ships `verified: false` until the maintainer runs the WASI build
(`build/edlib/`). The artifact `edlib.wasm` does not exist yet — it is produced
by the `build/edlib/build.sh` cross-compile and hand-off.

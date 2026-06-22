# kalign — multiple sequence alignment

## When to use
Use **kalign** when you need to align three or more DNA, RNA, or protein
sequences (multiple sequence alignment / MSA). kalign is fast and memory-efficient,
suitable for small to moderately large datasets.

## When NOT to use
- **Pairwise alignment only** — use `edlib` (edit distance / Needleman-Wunsch) or
  `seq-align` (Smith-Waterman / Needleman-Wunsch) instead.
- **Phylogenetic tree construction** — kalign produces alignments, not trees. Feed
  the alignment into a tree builder (e.g. `fasttree`).

## Surface
kalign is a CLI-style Emscripten WASM module. The runtime loads it as a callable
module; you invoke it via `handle.callMain([...argv...])` and interact with the
in-memory filesystem via `handle.FS`.

### Typical usage (scriptable)
```js
// Write input FASTA to the virtual filesystem
const fasta = '>seq1\nACGTACGTACGT\n>seq2\nACGTACGACGT\n>seq3\nACGTACGTCGT\n';
handle.FS.writeFile('/input.fasta', fasta);

// Run alignment — output written to /output.fasta
handle.callMain(['-i', '/input.fasta', '-o', '/output.fasta']);

// Read the aligned FASTA
const aligned = handle.FS.readFile('/output.fasta', { encoding: 'utf8' });
return aligned;
```

### Key flags
| Flag | Description |
|---|---|
| `-i <file>` | Input FASTA file (required) |
| `-o <file>` | Output file (default: stdout) |
| `-f fasta\|clustal\|msf` | Output format (default: fasta) |
| `--type dna\|rna\|protein` | Force sequence type (auto-detected by default) |

### Golden example
```js
const fasta = '>seq1\nACGTACGTACGT\n>seq2\nACGTACGACGT\n>seq3\nACGTACGTCGT\n';
handle.FS.writeFile('/input.fasta', fasta);
handle.callMain(['-i', '/input.fasta', '-o', '/output.fasta']);
return handle.FS.readFile('/output.fasta', { encoding: 'utf8' });
// => ">seq1\nACGTACGTACGT\n>seq2\nACGTACG-ACGT\n>seq3\nACGTACG-TCGT\n"
```

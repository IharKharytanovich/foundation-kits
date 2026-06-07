# Pyrodigal

Pyrodigal is a Python binding to Prodigal (PROkaryotic DYnamic programming
Gene-finding ALgorithm), the standard tool for predicting protein-coding genes in
bacterial and archaeal genomes. It identifies open reading frames (ORFs), start
codons, ribosome-binding sites (RBS), and translates predicted genes to protein
sequences. Pyrodigal is significantly faster than the original Prodigal C binary
and exposes results directly as Python objects.

## When to Use

- Predicting protein-coding genes in prokaryotic (bacterial / archaeal) genomes
- Finding ORFs with start/stop codon detection and RBS motif scoring
- Running gene prediction on metagenomic contigs (metagenome mode)
- Obtaining protein translations of predicted coding sequences
- Annotating draft genome assemblies prior to functional analysis

## When NOT to Use

- General DNA/RNA/protein sequence manipulation or format conversion (use
  **biopython** — it handles FASTA/GenBank I/O, reverse complement, translation
  of individual sequences)
- Eukaryotic gene prediction (Prodigal is prokaryote-only; eukaryotic genomes
  require splice-aware predictors outside this kit set)
- RNA secondary structure prediction (use **viennarna**)
- Phylogenetic tree construction or comparison (use **dendropy**)
- Molecular mass or chemical formula calculations (use **molmass**)
- Numerical computation or statistics (use **numpy** or **scipy**)

## Capabilities

| Area | Key API |
|---|---|
| Gene finder | `pyrodigal.GeneFinder(meta=False)` — train on a single genome, then predict |
| Metagenomic mode | `pyrodigal.GeneFinder(meta=True)` — pre-trained models, no training step needed |
| Training | `gf.train(sequence)` — learn codon usage, RBS motifs from a complete genome |
| Prediction | `gf.find_genes(sequence)` — returns `Genes` collection of predicted genes |
| Gene objects | `Gene.begin`, `Gene.end`, `Gene.strand`, `Gene.translate()`, `Gene.score` |
| Sequence input | Accepts `str`, `bytes`, or Biopython `Seq` objects |
| Output formats | `Genes.write_gff()`, `Genes.write_genes()`, `Genes.write_translations()` |

## Worked Example

Verify that Pyrodigal is available and check its version:

```python
import pyrodigal
pyrodigal.__version__
# → "3.7.0"
```

Gene prediction requires training on genomic data (or using `meta=True` for
pre-trained metagenomic models), so a minimal deterministic example uses the
version string. A typical workflow is:

```python
gf = pyrodigal.GeneFinder(meta=True)
genes = gf.find_genes(genome_sequence)
for gene in genes:
    print(gene.begin, gene.end, gene.strand, gene.translate())
```

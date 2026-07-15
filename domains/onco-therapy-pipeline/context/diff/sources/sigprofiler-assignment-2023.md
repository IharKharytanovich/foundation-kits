---
topic: SigProfilerAssignment — reference-signature refitting engine and its benchmark against four tools
keywords: [SigProfilerAssignment, mutational signatures, refitting, NNLS, COSMIC, signature attribution, SBS, sparse regression, overfitting, SigProfiler]
related: [../mutational-signatures.md]
epistemics: computable
source: "Díaz-Gay M, Vangara R, Barnes M, … Stratton MR, Alexandrov LB. Assigning mutational signatures to individual samples and individual somatic mutations with SigProfilerAssignment. bioRxiv 2023.07.10.548264 (peer-reviewed Bioinformatics 2023, PMC10746860). DOI:10.1101/2023.07.10.548264 (preprint verified; journal DOI 10.1093/bioinformatics/btad756 unverified)"
source_type: paper
asserted_at: "2026-07"
---

# SigProfilerAssignment — Signature Refitting Engine

The canonical *refitting* (attribution) tool that layers over an existing somatic callset — it does not extract signatures de novo. It takes a mutation vector (from VCF/MAF via SigProfilerMatrixGenerator) plus a reference matrix (default COSMIC v3.3 at publication; supports SBS, DBS, ID, and copy-number signature sets, plus custom/de-novo signatures) and solves for per-signature activities. It was the first tool to (a) probabilistically assign signatures to *individual* mutations and (b) support copy-number signatures.

## Method

The engine combines a custom **forward-stagewise (backward+forward stepwise) sparse regression** loop with **nonnegative least squares (Lawson–Hanson NNLS)**. Signatures are iteratively removed (error-increase threshold 0.01) and re-added (error-decrease threshold 0.05) until convergence — explicitly to fight the overfitting/"signature bleeding" that plagues naive NNLS refitting. Per-mutation probabilistic assignment requires an individual-mutation input (VCF), not a collapsed 96-channel vector.

## Benchmark (load-bearing)

Evaluated on **2,700 synthetic cancer genomes** (300 tumors × 9 cancer types) generated from **21 COSMIC reference signatures**, refitted against the full input of **79 COSMIC v3.3 SBS signatures**, at three noise levels (0%, 5%, 10%), versus deconstructSigs, MutationalPatterns, sigLASSO, SignatureToolsLib.

- SigProfilerAssignment **outperformed all four tools at every noise level**.
- At **10% noise it was the only tool with F1 > 0.90**.
- Runtime **9.6 min for 2,700 samples (0.21 s/sample)**; only MutationalPatterns "standard" mode ran faster, at a large precision cost (overfitting).
- Reconstruction metrics reported per sample: cosine similarity, KL divergence, Pearson, L1/L2 relative error.

Verbatim: *"For 10% random noise, only SigProfilerAssignment obtained an F1 score >0.90."* / *"SigProfilerAssignment processed the 2,700 samples within 9.6 minutes (0.21 seconds per sample)."*

## Limitations

Refitting cannot discover novel signatures; assignment quality depends entirely on the reference set supplied, and the stepwise thresholds only partially control overfitting. Minimum-mutation-count floors are not formally derived here (addressed by downstream tools such as MESiCA). Provenance note: the DOI-verified artifact is the bioRxiv preprint; a peer-reviewed *Bioinformatics* record exists (PMC10746860) but its journal DOI was not independently verified in this pass.

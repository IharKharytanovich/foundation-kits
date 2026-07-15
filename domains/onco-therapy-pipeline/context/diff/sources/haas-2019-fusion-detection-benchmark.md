---
topic: Haas 2019 — accuracy benchmark of 23 fusion-transcript detection methods (STAR-Fusion, Arriba lead)
keywords: [fusion detection, STAR-Fusion, Arriba, STAR-SEQR, benchmark, RNA-seq, sensitivity, precision, read length, cancer cell lines, FusionCatcher]
related: [../rna-and-noncanonical-neoantigens.md, wei-2019-fusion-neoantigens.md]
epistemics: empirical
source: "Haas BJ, Dobin A, Li B, Stransky N, Pochet N, Regev A. Accuracy assessment of fusion transcript detection via read-mapping and de novo fusion transcript assembly-based methods. Genome Biol 2019;20:213. DOI:10.1186/s13059-019-1842-9 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# Fusion-Detection Accuracy Benchmark

The reference benchmark that identifies which fusion-detection tools to trust — upstream of any fusion-neoantigen pipeline.

## Design (verified)

Benchmarked **23 fusion-detection methods** (incl. STAR-Fusion, Arriba, STAR-SEQR, FusionCatcher, deFuse, TrinityFusion, JAFFA variants, Pizzly) on **10 simulated datasets** (each 30M paired-end reads with **500 simulated fusions** across a broad expression range) and on **60 cancer cell lines** (real RNA-seq). Two read lengths — **50 bp vs 101 bp** — tested to isolate read-length effects. Metrics: precision (PPV) and recall (TPR) with F1 at optimal evidence threshold; a "wisdom-of-crowds" truth set requiring ≥N methods to agree.

## Results (verified qualitative + design)

- **STAR-Fusion, Arriba, and STAR-SEQR were the top performers** for combined accuracy and speed, on both simulated and real cancer transcriptomes.
- On simulated data, **accuracy was almost entirely driven by sensitivity — most top methods had few false positives (1–2 orders of magnitude below true positives).**
- **Read length materially affected sensitivity** — longer 101 bp reads improved detection.

Exact per-tool TPR/PPV values live in Figure 2 / Supplementary Figs and are dataset-dependent; single-point sensitivity/precision numbers are therefore not asserted here.

Verbatim: *"STAR-Fusion, Arriba, and STAR-SEQR are the most accurate and fastest for fusion detection on cancer transcriptomes."*

## Limitations

Simulation may not capture all real chimera artifacts; de novo assembly methods lagged read-mapping methods. Practical guidance: use STAR-Fusion or Arriba as the fusion caller feeding fusion-neoantigen prediction, and prefer ≥100 bp reads.

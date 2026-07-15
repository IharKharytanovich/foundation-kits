---
topic: Clonal architecture inference — the empirical weak link in the diff stage
keywords: [clonal architecture, subclone, PyClone-VI, DPClust, CCF, tumor evolution, algorithm dependence, PCAWG, concordance, VAF deconvolution]
related: [sources/clonal-inference-concordance.md, somatic-variant-calling.md, ../map.md]
defines:
  clonal-architecture-inference: "Reconstruction of tumor subclone structure from variant allele frequencies; 19-35% algorithm-dependent discordance (PCAWG); empirical — not reliably computable below 10% CCF or 30% purity"
kinds:
  clonal-architecture-inference: method
epistemics: empirical
source: "PCAWG Evolution & Heterogeneity Dentro 2021 Cell Syst; Gillis 2021 Nat Methods; TRACERx Jamal-Hanjani 2017 NEJM"
source_type: paper
asserted_at: "2026-07"
---

# Clonal Architecture Inference

[[clonal-architecture-inference]] attempts to decompose a tumor's mutation catalog into subpopulations (subclones) defined by shared cellular prevalence. It is the diff stage's empirical weak link: while variant calling is computable, clonality reconstruction carries 19-35% algorithm-dependent discordance on the same input data (PCAWG subclonal reconstruction challenge, Dentro 2021).

## Why It Matters for Therapy

Clonal neoantigens (present in all tumor cells) are better vaccine targets than subclonal ones — a patient's immune system cannot clear a tumor by attacking a subclone that comprises only 5% of cells. The classification of a mutation as "clonal" vs "subclonal" depends directly on clonal architecture inference, and the 19-35% method disagreement means patient-level neoantigen ranking changes with algorithm choice.

## Fundamental Limits

- Minimum tumor purity: 30% for any reliable subclone calling. Below 20%, VAF distributions collapse into noise.
- Sequencing depth: ≥100x for 2-3 subclone resolution; ≥300x for subclones at 5-10% CCF.
- Single-biopsy: captures spatial heterogeneity poorly (TRACERx shows subclones private to regions in 50-70% of NSCLC).
- Multi-region or longitudinal sampling improves concordance to 80-90% but multiplies cost and is not standard clinical practice.

## The method is gated by sample quality from the sampling stage — low-purity biopsies or degraded FFPE input make subclone calling unreliable:

gated-by:: [[somatic-variant-calling]]

## Clonal architecture feeds into the neoantigen prediction pipeline by labeling each mutation as clonal or subclonal, which determines prioritization for vaccine design targeting [[neoantigen-immunogenicity]]:

feeds-into:: [[neoantigen-prediction-pipeline]]

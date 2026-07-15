---
topic: DeepImmuno 2021 — CNN immunogenicity predictor strong on top-N recall, weak on discrimination
keywords: [DeepImmuno, CNN, immunogenicity, IEDB, neoantigen, GAN, top-N recall, COVID-19, T-cell, deep learning]
related: [../immunogenicity-prediction-models.md, itsndb-immunogenicity-benchmark-2023.md]
epistemics: empirical
source: "Li G, Iyer B, … Anderson KJ. DeepImmuno: deep learning-empowered prediction and generation of immunogenic peptides for T-cell immunity. Brief Bioinform 2021;22(6):bbab160. DOI:10.1093/bib/bbab160 (verified); PMC8135853"
source_type: paper
asserted_at: "2026-07"
---

# DeepImmuno — CNN Immunogenicity Predictor

A CNN trained on IEDB immunogenicity assays, notable for gains concentrated in **top-N recall of immunogenic candidates** rather than clean discrimination — a pattern typical of the whole immunogenicity-prediction field.

## Design

CNN trained on **>9,000 IEDB immunogenicity assays** (MHC-I, human, T-cell). A beta-binomial model weights each pMHC by experimental confidence; peptides encoded via AAindex-PCA + HLA paratope. A GAN (DeepImmuno-GAN) generates synthetic immunogenic peptides. A graph-CNN variant was abandoned for "shortcut learning" (outputs collapsing near 0.5). Comparators: DeepHLApan, IEDB.

## Results (load-bearing)

- 10-fold CV **auROC 0.85, auPR 0.81.**
- On a **608-antigen tumor neoantigen set**, DeepImmuno recovered **29/35 (83%)** immunogenic neoantigens vs IEDB 63% and DeepHLApan 34%; placed **4 immunogenic peptides in top-20 and 8 in top-50** (vs IEDB 1/4).
- COVID-19 validation: sensitivity **68% (convalescent) / 88% (unexposed)** vs IEDB 52% / 38%.

Verbatim: *"We chose the CNN as the best prediction model, based on its adaptivity for small and large datasets."*

## Limitations

Specificity not assessed on the neoantigen set (single-patient tests). As ITSNdb later showed, DeepImmuno's discrimination of immunogenic-vs-presented is near-random (AUC 0.52) with a high false-positive rate — the gains are in ranking recall, not in separating immunogenic from merely-presented peptides. (Related: Seq2Neo, Diao 2022 IJMS, DOI:10.3390/ijms231911624, adds TAP/binding features and similarly beats DeepHLApan/IEDB/DeepImmuno on top-N recovery.)

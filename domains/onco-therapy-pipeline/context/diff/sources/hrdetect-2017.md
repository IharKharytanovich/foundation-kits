---
topic: HRDetect — mutational-signature classifier of BRCA1/BRCA2 (HR) deficiency at 98.7% sensitivity
keywords: [HRDetect, homologous recombination deficiency, HRD, BRCA1, BRCA2, mutational signatures, SBS3, PARP inhibitor, lasso, whole genome sequencing, genomic scar]
related: [../mutational-signatures.md, nlst-hrd-paola1-2023.md, hrprofiler-2025.md]
epistemics: empirical
source: "Davies H, Glodzik D, Morganella S, … Campbell PJ, Stratton MR, Nik-Zainal S. HRDetect is a predictor of BRCA1 and BRCA2 deficiency based on mutational signatures. Nat Med 2017;23(4):517-525. DOI:10.1038/nm.4292 (verified); PMID 28288110"
source_type: paper
asserted_at: "2026-07"
---

# HRDetect — Signature-Based HR-Deficiency Classifier

A supervised **lasso logistic regression** that detects BRCA1/BRCA2 (homologous-recombination) deficiency from whole-genome sequencing by integrating multiple mutational-signature classes — the landmark demonstration that signatures can identify functionally HR-deficient tumors that carry no detectable BRCA mutation.

## Design & Cohort

Training set: **311 breast cancers** (77 BRCA1/BRCA2-null + 234 HR-intact "quiescent" controls); an initial model trained on 22 known germline carriers was retrained after additional null tumors were found. Discovery cohort **560 breast cancers**; independent validation in breast (n=80), **ovarian (n=73)**, and **pancreatic (n=96)** cancers, plus low-coverage and WES retraining (371 breast samples).

## The Six Weighted Features (final model, decreasing lasso weight)

1. microhomology-mediated **deletions (2.398)**
2. base-substitution **Signature 3 / SBS3 (1.611)**
3. **rearrangement signature 3 (1.153)**
4. **rearrangement signature 5 (0.847)**
5. **HRD index (genomic-scar/LOH score) (0.667)**
6. base-substitution **Signature 8 (0.091)**

## Results (load-bearing)

- At a probability cut-off of **0.7**: **98.7% sensitivity, AUC 0.98** in the 560-tumor cohort.
- Far superior to the copy-number genomic-scar HRD score alone (**~60% sensitivity**); no single genomic parameter matched the six-feature model.
- Flagged **124 tumors** with score >70%, including **47 functionally HR-deficient tumors lacking any detectable BRCA1/BRCA2 mutation** (5/340 ER-positive vs 42/143 ER-negative), plus 33 newly found germline carriers and 22 somatic/methylation-driven null tumors.
- Ran on **low-coverage (10×)** genomes and on **WES** (with retrained weights).
- Net effect: expands the PARP-inhibitor-eligible fraction of breast cancer to **~22%** (vs the classic ~1–5%).

Verbatim: *"HRDetect identifies BRCA1/BRCA2 deficient tumours with 98.7% sensitivity (AUC 0.98)."* / *"…up to 22%…that could have selective therapeutic sensitivity to PARP-inhibition."*

## Limitations

Requires WGS-quality data for the full feature set (rearrangement signatures need SV calls); the small-cohort first model missed 6 BRCA1-null samples (probabilities 0.006–0.64), motivating retraining; ER-status imbalance in the "functional HRD" group. The HRD probability is computable, but PARP/platinum *response* is the empirical, trial-measured endpoint it is meant to predict.

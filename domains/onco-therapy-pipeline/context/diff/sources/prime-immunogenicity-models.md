---
topic: PRIME and PRIME2.0 — TCR-recognition-propensity immunogenicity predictors and the data-starvation problem
keywords: [PRIME, immunogenicity prediction, TCR recognition, neo-epitope, MixMHCpred, Gfeller, immunoediting, training data, SARS-CoV-2, neural network]
related: [../immunogenicity-prediction-models.md, bigmhc-2023.md]
epistemics: empirical
source: "Schmidt J, … Gfeller D. Prediction of neo-epitope immunogenicity reveals TCR recognition determinants. Cell Rep Med 2021;2(2):100194. DOI:10.1016/j.xcrm.2021.100194 (verified). PRIME2.0: Gfeller D, et al. Cell Syst 2023;14(1):72-83.e5. DOI:10.1016/j.cels.2022.12.002 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# PRIME / PRIME2.0 — Immunogenicity Predictors

Immunogenicity predictors that combine predicted HLA-I presentation with a peptide-intrinsic **TCR-recognition propensity** (amino-acid frequencies at TCR-facing positions). The pair quantifies how data-starved the immunogenicity problem is.

## PRIME (2021)

Logistic regression over (−log %rank presentation, MixMHCpred2.1) + TCR-recognition propensity. Curated benchmark: **4,958 peptides** experimentally tested in humans — **1,153 immunogenic + 476 non-immunogenic** pathogen/cancer-testis peptides, plus **129 immunogenic + 3,200 non-immunogenic cancer neo-epitopes** (+2,800 random-proteome negatives). Evaluated by 10-fold, leave-one-study-out, and leave-one-allele-out CV. PRIME beat presentation-only predictors on AUC and PRAUC (exact decimals figure-only). Mechanistic finding: for weak HLA binders, TCR-facing amino-acid identity dominates recognition; TCGA analysis showed predicted-immunogenic recurrent mutations are depleted (immunoediting).

The load-bearing structural point: the positive neo-epitope set is **only 129 peptides** — 3–4 orders of magnitude smaller than the millions of presentation data points. Verbatim: *"the set of verified neo-epitopes used in our benchmarks (i.e., 129 positives)… is still limited."*

## PRIME2.0 (2023)

Upgraded from logistic regression to a **neural network**; trained on **70 neo-antigen studies → 596 verified immunogenic neo-epitopes + 6,084 non-immunogenic** tested peptides (~4.6× larger positive set). Improved immunogenicity predictions despite a benchmark biased toward NetMHCpan-preselected peptides. Prospectively validated a conserved SARS-CoV-2 CD8+ epitope (QYIKWPWYVW). Framing quote (preprint): *"In terms of HLA-I ligand predictions, a decent accuracy had already been reached… Much harder is the task of predicting TCR recognition, both because of the smaller size of the training data and… many other factors."*

## Limitations

Does not model central tolerance; immunogenicity training sets remain tiny (596 vs 384,070 presentation examples) and HLA-skewed. The asymmetry — abundant presentation labels, scarce immunogenicity labels — is why presentation is computable and immunogenicity is not.

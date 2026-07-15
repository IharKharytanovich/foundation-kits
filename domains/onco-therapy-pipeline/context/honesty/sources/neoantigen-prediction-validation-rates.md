---
topic: TESLA consortium neoantigen prediction validation — less than 6% of top predictions elicit T-cell responses
keywords: [TESLA, neoantigen, prediction, validation, immunogenicity, T-cell, MHC, HLA, computable, empirical, PPV, concordance]
related: [../computable-empirical-discipline.md]
epistemics: empirical
source: "Wells et al., Cell 2020 183(4):818-834, doi:10.1016/j.cell.2020.09.015; Müller et al., Nat Biotechnol 2023"
source_type: paper
asserted_at: "2026-07"
---

# Neoantigen Prediction Validation Rates

## The TESLA Consortium Findings

The Tumor Neoantigen Selection Alliance (TESLA) organized a blinded benchmark: 608 candidate neoantigens from melanoma patients were scored by multiple prediction pipelines, and the top predictions were tested for T-cell recognition experimentally. The result: **approximately 6% of the top-ranked predicted neoantigens actually elicited a measurable T-cell response**. Different pipelines agreed poorly on which neoantigens to prioritize — concordance between tools was low.

Wells et al. (Cell 2020) reported that the best-performing pipelines achieved a positive predictive value (PPV) under 10% when validated against experimental immunogenicity assays. The false-positive rate was high: the majority of computationally "immunogenic" neoantigens failed to activate patient T-cells.

## Tool Concordance (Müller et al. 2023)

Müller et al. (Nature Biotechnology 2023) extended the evaluation and found that immunogenicity prediction tools achieved concordance rates of 0.57–0.72 — modestly above random (0.50) for a binary classifier. The tools are useful for narrowing the candidate pool from thousands to hundreds, but they cannot be used as a substitute for experimental validation.

## Why This Matters for the Computable–Empirical Split

Neoantigen binding affinity to MHC-I is partly computable (structural modeling, sequence motifs, pMHC stability). But **immunogenicity** — whether a presented peptide actually triggers a T-cell response in a patient — depends on the T-cell repertoire, the tumor microenvironment, the antigen processing pathway, and immune suppression state. None of these are computable from sequence alone.

Presenting a predicted neoantigen as "immunogenic" without experimental validation conflates a computable prediction (binding) with an empirical outcome (immune response). In the DCC taxonomy, a binding prediction is `epistemics: computable`; an immunogenicity claim requires `epistemics: empirical` with an experimental `source`.

## Key Numbers

- **~6%**: PPV of top neoantigen predictions (TESLA)
- **<10%**: best-case validated immunogenicity across pipelines
- **0.57–0.72**: tool concordance for binary immunogenicity classification
- **~6% of 184**: in mouse models (Balachandran et al.)
- **608**: total candidate neoantigens evaluated in TESLA

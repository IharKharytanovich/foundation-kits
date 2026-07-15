---
topic: pMTnet 2021 — deep learning TCR-antigen binding prediction and its epitope-coverage dependence
keywords: [pMTnet, TCR, pMHC, binding specificity, CDR3, deep learning, neoantigen, immunotherapy biomarker, ROC AUC, T-cell]
related: [../immunogenicity-prediction-models.md, tcr-generalization-collapse.md]
epistemics: empirical
source: "Lu T, … Wang T. Deep learning-based prediction of the T cell receptor-antigen binding specificity. Nat Mach Intell 2021;3(10):864-875. DOI:10.1038/s42256-021-00383-2 (verified); PMC9396750"
source_type: paper
asserted_at: "2026-07"
---

# pMTnet — TCR–Antigen Binding Prediction

Predicts whether a class-I pMHC is bound by a given CDR3β TCR — the archetype of the TCR-recognition problem the immunogenicity field must solve, and an early example of the seen-vs-unseen epitope gap.

## Design

Training: **32,607 binding TCR–pMHC pairs across 130 class-I MHCs**; negatives by random mismatch ("differential" ranking loss). Architecture: LSTM pMHC embedding + CDR3β autoencoder + stacked classifier. Independent validation: **619 experimentally validated pairs** (fully out-of-training) vs 10× shuffled negatives.

## Results (load-bearing)

- **ROC-AUC 0.827, PR-AUC 0.565**; Pearson 0.781 vs binding strength.
- One dissimilar-TCR subset dropped to **AUC 0.726.**
- Neoantigens scored more immunogenic than self-antigens; a derived neoantigen-immunogenicity score outperformed neoantigen load and TCR diversity as an ICB biomarker.

Authors' own caveat: *"our training dataset collection has many common epitopes such as those well studied ones from CMV"* — the 0.827 is measured largely on **represented epitopes**, not truly novel ones. Framing: *"Predicting TCR–neoantigen/antigen pairs is one of the most daunting challenges in modern immunology."*

## Limitations

Performance is inflated by common/represented epitopes in training; generalization to genuinely novel neoantigen epitopes is far weaker (see the generalization-collapse literature). CDR3β-only; class I only.

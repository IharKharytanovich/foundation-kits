---
topic: ITSNdb 2023 — third-party benchmark pinning every immunogenicity predictor near random
keywords: [ITSNdb, immunogenicity benchmark, tumor-specific neoantigen, ROC AUC, false positive, DeepImmuno, DeepHLApan, PRIME, presented not immunogenic, prioritization]
related: [../immunogenicity-prediction-models.md, deepimmuno-2021.md]
epistemics: empirical
source: "Carri I, et al. Unraveling tumor specific neoantigen immunogenicity prediction: a comprehensive analysis. Front Immunol 2023;14:1094236. DOI:10.3389/fimmu.2023.1094236 (verified); PMC10411733"
source_type: paper
asserted_at: "2026-07"
---

# ITSNdb — The Immunogenicity-Prediction Ceiling

The single cleanest quantification of the **presented-but-not-immunogenic** wall: an independent benchmark showing every immunogenicity predictor performs near-random on peptides already known to bind MHC-I.

## Design

Built **ITSNdb**, a curated database of **199 tumor-specific neoantigens** with validated MHC-I presentation and positive/negative immune response, then evaluated **16 metrics** as immunogenicity predictors (NetMHCpan BA/rank/score, MixMHCpred, MHCflurry, PRIME, plus dedicated tools DeepHLApan, DeepImmuno, CIImm), re-tested them as prioritizers on **113 non-immunogenic + 7 immunogenic** neoantigen-HLA pairs, and evaluated as ICB-response biomarkers. (Predates BigMHC/Seq2Neo.)

## Results (load-bearing)

- **All methods clustered at ROC AUC 0.52–0.60** on ITSNdb — near-random discrimination of immunogenicity among peptides already known to bind MHC-I (DeepImmuno AUC 0.52).
- Extreme false-positive rates on a 297-peptide negative set for immunogenicity tools: **DeepHLApan 100% (297/297) FP, DeepImmuno 79% (234/297) FP** vs MixMHCpred-score 30% and NetMHCpan-rank 31%.
- In top-20 prioritization DeepImmuno recovered 6/7 and DeepHLApan 5/7 immunogenic neoantigens.
- Tumor neoantigen burden from any method did not beat existing ICB biomarkers.

Verbatim: *"the ROC Areas Under the Curves (AUCs) ranged between 0.52 and 0.60… suggesting a difficulty in distinguishing immunogenicity over TSNs known to bind to MHC-I for all methods."*

## Limitations

Small positive set (7 immunogenic in the prioritization test); predates the newest models. The core message stands: once presentation is controlled for, immunogenicity discrimination is near-random — the empirical wall that [[neoantigen-immunogenicity]] names.

---
topic: HRProfiler — 2025 ML HRD classifier that holds AUC above 0.90 on whole-exome data
keywords: [HRProfiler, HRD, homologous recombination deficiency, whole exome, WES, WGS, HRDetect, CHORD, SigMA, PARP inhibitor, machine learning, breast cancer, ovarian cancer]
related: [../mutational-signatures.md, hrdetect-2017.md]
epistemics: empirical
source: "Abbasi A, Bergstrom EN, … Alexandrov LB. HRProfiler Detects HRD in Breast and Ovarian Cancers Using WGS and WES Data. Cancer Res 2025;85(13):2504-2513. DOI:10.1158/0008-5472.CAN-24-2639 (verified); PMC12214882"
source_type: paper
asserted_at: "2026-07"
---

# HRProfiler — HRD Detection on Whole-Exome Data

A machine-learning HR-deficiency classifier ("Homologous Recombination Proficiency Profiler") using **six mutational features**. Its distinguishing contribution is holding accuracy on **whole-exome** data, where SV-dependent HRD tools degrade or cannot run.

## Design & Cohort

Trained on **1,043 breast + 182 ovarian** cancers; benchmarked on independent **417 breast + 115 ovarian** cancers, including a retrospective PARP-inhibitor trial cohort. Head-to-head vs **HRDetect, CHORD, and SigMA**. Ground-truth validation: **237 WGS TNBCs** (SCAN-B, NCT02306096), **71 TCGA** breast cancers with both WGS and WES, **109 MSK-IMPACT WES** breast cancers.

## Results (load-bearing)

- On **WGS**, all tools performed comparably (HRDetect and CHORD historically report **AUC > 0.90** on WGS).
- The differentiator is **WES: HRProfiler was the only tool with AUC > 0.90 across all WES breast and ovarian sets**, outperforming HRDetect and SigMA on exome data.
- **CHORD could not be applied to WES at all** — it needs SV/rearrangement signatures only available from WGS.
- Individual HRD-associated signatures alone (e.g., SBS3) *"did not consistently detect HRD or predict clinical response across datasets."*
- Retrospective analysis supported HRProfiler predicting HRD and PARP-inhibitor clinical response.

Verbatim: *"HRProfiler was the only approach that consistently identified HRD in whole-exome–sequenced breast and ovarian cancers."*

## Limitations

No prospective validation yet — the authors explicitly call for *"large-scale prospective clinical trials."* Clinicogenomic WGS datasets with treatment endpoints remain scarce; performance still depends on the panel/exome capturing enough of the mutational landscape. This is the WES-facing counterpart to WGS-native [[mutational-signature-analysis]] HRD tools.

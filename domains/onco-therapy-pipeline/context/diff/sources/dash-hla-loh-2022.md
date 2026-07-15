---
topic: DASH — ML successor to LOHHLA reveals widespread pan-cancer HLA loss of heterozygosity
keywords: [DASH, HLA-LOH, machine learning, subclonal sensitivity, pan-cancer, LOHHLA, Sequenza, digital PCR, neoantigen, immune escape, limit of detection]
related: [../copy-number-and-loh.md, lohhla-2017.md, mhc-hammer-2024.md]
epistemics: empirical
source: "Pyke RM, et al. A machine learning algorithm with subclonal sensitivity reveals widespread pan-cancer HLA loss of heterozygosity. Nat Commun 2022;13:1925. DOI:10.1038/s41467-022-29203-w (verified)"
source_type: paper
asserted_at: "2026-07"
---

# DASH — ML HLA-LOH Detection

**DASH** (Deletion of Allele-Specific HLAs): supervised ML using features plus tumor purity/ploidy from Sequenza, improving subclonal and low-purity sensitivity over LOHHLA. Validated by allele-specific digital PCR and cell-line dilution mixtures.

## Design & Cohort

Trained on 279 patients (720 het genes); validated by **allele-specific digital PCR** and **22 sequenced cell-line dilution mixtures**; applied pan-cancer to **610 patients across 15 tumor types** (468 with neoantigen data). Comparators: LOHHLA and generic Sequenza-based LOH.

## Results (load-bearing)

- **Accuracy (10-fold CV, purity ≥20%): DASH 98.7% specificity / 92.9% sensitivity** (F1=0.939) vs **LOHHLA 94.3% / 78.8%** (F1=0.777). With low-purity samples removed: **DASH 99.7% / 100%** vs LOHHLA 94.3% / 91.8%. Generic Sequenza: 92.9%/95.0% but **cannot identify which allele is lost.**
- **Limit of detection:** **>98% sensitivity at all purities >27%; >98% specificity across all purity levels;** accuracy drops ~0.06 from full to 100× depth.
- **Pan-cancer prevalence: 18% of patients have HLA LOH**; majority of tumor types ≥20% affected; **melanoma only 14%** despite high TMB; colorectal and HNSCC enriched.
- **Selection/immune link:** HLA-region LOH exceeds genome-wide LOH expectation in nearly all tumor types; neoantigen burden higher in LOH+ patients (p=0.02); more neoantigens predicted to bind the *lost* allele than its retained homolog (p=0.01); "middle-child" effect — intermediate-TMB tumors have the highest HLA-LOH rate.

Verbatim: *"Using DASH on 610 patients across 15 tumor types, we find that 18% of patients have HLA LOH… DASH reaches 98.7% specificity and 92.9% sensitivity while LOHHLA… only achieves 94.3% specificity and 78.8% sensitivity."*

## Limitations

Requires larger cohorts for scalable validation; does not capture all allelic-imbalance escape mechanisms (HLA amplification of one allele, expression loss); NSCLC LOH lower here than earlier reports (cohort/stage/treatment differences). The 18% pan-cancer figure is single-primary-source (direction corroborated).

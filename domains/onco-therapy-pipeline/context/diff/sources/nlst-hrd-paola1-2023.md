---
topic: Normalized LST (Geneva nLST) vs Myriad myChoice GIS — genomic-scar HRD scoring validated on PAOLA-1
keywords: [HRD score, normalized LST, nLST, Myriad myChoice, genomic instability score, GIS, LOH, TAI, LST, PAOLA-1, olaparib, ovarian cancer, companion diagnostic]
related: [../mutational-signatures.md, hrdetect-2017.md]
epistemics: empirical
source: "Christinat Y, Ho L, Clément S, … Tsantoulis P, McKee TA. Normalized LST Is an Efficient Biomarker for HRD and Olaparib Response in Ovarian Carcinoma. JCO Precis Oncol 2023;7:e2200555. DOI:10.1200/PO.22.00555 (verified); PMC10581603"
source_type: paper
asserted_at: "2026-07"
---

# Normalized LST (nLST) vs Myriad myChoice GIS

Develops the **normalized LST (nLST)** genomic-scar score — large-scale state transitions normalized by whole-genome-doubling events — and validates it against the FDA-approved **Myriad myChoice** companion diagnostic on a phase-III trial biobank. This is the empirical/regulatory anchor for HRD "scar" scoring, complementary to signature classifiers like [[mutational-signature-analysis]].

## The Two Scores

- **Myriad myChoice GIS** = **LOH + TAI (telomeric allelic imbalance) + LST**; HRD-positive threshold **GIS ≥ 42** (or BRCA-mutant). FDA companion diagnostic for olaparib±bevacizumab and niraparib in ovarian cancer.
- **Geneva test** = Affymetrix **OncoScan** array + nLST.

## Design & Cohort

**469 tumors from PAOLA-1/ENGOT-ov25** (olaparib+bevacizumab vs placebo+bevacizumab maintenance in advanced ovarian cancer). Endpoint: progression-free survival by arm.

## Results (load-bearing)

- In HRD-positive patients: Geneva nLST **HR 0.40 (95% CI 0.28–0.57)** vs Myriad **HR 0.37** (BRCAm or GIS+) — essentially equivalent PARP-benefit stratification.
- **Lower assay failure rate: 27/469 (nLST) vs 59/469 (Myriad).**
- Concordance with GIS at default **nLST threshold 15**: Cohen's κ **0.80**, positive agreement **98% (204/209)**, negative agreement **81% (158/194)**; nLST-15 captured nearly all GIS-positive samples plus 36 extra GIS-negative patients.
- Threshold calibration: **GIS 42 ≡ nLST 18**, and **nLST 15 ≡ GIS 38**.
- In BRCA-wild-type patients the test surfaced a subgroup with favorable **1-year PFS (85%)** but poor **2-year PFS (30%)** on olaparib+bev.

## Limitations

Array-based scar scores are a *static* readout — they cannot distinguish current HRD from a reverted (platinum/PARP-resistant) tumor that still carries the historical scar. Thresholds are not interchangeable between assays. Retrospective, single-trial validation. Corroboration: Myriad myChoice GIS ≥ 42 threshold is independently confirmed (Ngoi & Tan review, PMC8141874).

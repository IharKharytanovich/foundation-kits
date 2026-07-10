---
topic: Liquid biopsy and ctDNA fraction — the empirical accessibility bottleneck of the sampling stage spanning four orders of magnitude from metastatic to MRD
keywords: [liquid biopsy, ctDNA, circulating tumor DNA, cell-free DNA, cfDNA, tumor fraction, MRD, minimal residual disease, CHIP, limit of detection, DYNAMIC, TRACERx, GALAXY, Signatera, Guardant]
related: [sources/ctdna-clinical-trials-2024.md, sources/chip-false-positives.md, ../diff/index.md]
defines:
  liquid-biopsy-ctdna: "The ctDNA fraction in cell-free DNA — spanning ~4 orders of magnitude (30%+ metastatic to 0.001% MRD) — that sets the information-theoretic floor for all downstream variant calling; CHIP contamination (5.2% of patients affected without matched WBC) is the dominant biological false-positive source"
kinds:
  liquid-biopsy-ctdna: stage
epistemics: empirical
source: "Tie 2022 NEJM (DYNAMIC); Abbosh 2023 NEJM (TRACERx 421); Kotani 2023 Nat Med (GALAXY); Razavi 2019 Nat Med (CHIP); Ptashkin 2023 JCO PO"
source_type: clinical-trial
asserted_at: "2026-07"
---

# Liquid Biopsy and ctDNA Fraction

[[liquid-biopsy-ctdna]] is the first empirical gate of the sampling stage. Tumors shed DNA fragments (~140–180 bp, nucleosomal periodicity) into circulation; the fraction of cell-free DNA that is tumor-derived (ctDNA fraction / tumor fraction) determines what downstream analysis can see.

## The Four-Order-of-Magnitude Range

| Setting | Typical ctDNA fraction | Implication |
|---|---|---|
| Metastatic, high burden | 1–30%+ | Standard panels (Guardant360, F1LCDx) work at LOD ≥0.3% |
| Metastatic, first-line | ~5–10% | Panel sequencing reliable |
| Localized / early-stage | 0.01–0.5% | Near or below standard panel LOD |
| Post-surgical MRD | 0.001–0.01% | Requires tumor-informed multi-locus assays (Signatera, PhasED-Seq) |

This range is the central engineering challenge: the same patient's ctDNA fraction can cross the LOD boundary between actionable and undetectable depending on disease stage and tumor type. Low-shedding cancers (glioma, renal, thyroid) are detectable in <50% of advanced cases (Bettegowda 2014).

## Clinical Utility — the Evidence Base (2022–2025)

DYNAMIC (stage II colon, Tie 2022 NEJM) showed ctDNA-guided adjuvant therapy reduced chemotherapy use by 50% with non-inferior RFS; ctDNA-negative patients spared chemotherapy had 5-year RFS ~93%. GALAXY (stage II–III CRC, Kotani 2023 Nat Med, n=1,039) showed ctDNA clearance with chemotherapy 68% vs 7% observation, HR 0.15. TRACERx 421 (NSCLC, Abbosh 2023 NEJM) demonstrated median lead time of 212 days from ctDNA positivity to clinical recurrence, with specificity >99%.

## CHIP — the Biological False-Positive Floor

Clonal hematopoiesis variants (DNMT3A, TET2, ASXL1, TP53, KRAS) contaminate cfDNA because WBC-derived cfDNA dominates plasma. Without matched WBC subtraction, 5.2% of patients would receive ≥1 false CHIP call as tumor-derived (Ptashkin 2023); 14.4% of TP53 cfDNA variants are attributable to CHIP (Hu 2018). All major CDx platforms (Guardant360 CDx, F1LCDx) now include matched WBC sequencing. Tumor-informed MRD assays (Signatera) avoid CHIP by design — they track only patient-specific tumor mutations identified from tissue.

## Sampling Feeds the Diff Stage

The ctDNA fraction and the tissue purity together determine whether [[somatic-variant-calling]] can reliably distinguish tumor mutations from noise. Insufficient ctDNA fraction or tumor purity degrades every downstream step — from variant calling through [[neoantigen-prediction-pipeline]] to therapy selection.

feeds-into:: [[somatic-variant-calling]]

The sampling stage precedes and directly feeds into the diff stage: no reliable variant catalog without adequate biomaterial.

precedes:: [[somatic-variant-calling]]
cites:: doi:10.1056/NEJMoa2200075
cites:: doi:10.1056/NEJMoa2307592
cites:: doi:10.1038/s41591-022-02115-4

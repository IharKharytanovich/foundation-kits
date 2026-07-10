---
topic: Clonal hematopoiesis (CHIP) as the dominant source of biological false positives in ctDNA analysis — prevalence, impact, and mitigation via matched WBC sequencing
keywords: [CHIP, clonal hematopoiesis, false positive, cfDNA, DNMT3A, TET2, TP53, matched WBC, buffy coat, somatic filtering, liquid biopsy, ctDNA specificity]
related: [../liquid-biopsy-ctdna.md]
source: "Razavi 2019 Nat Med (DOI: 10.1038/s41591-019-0405-4); Ptashkin 2023 JCO Precis Oncol PO.23.00132; Hu 2018 JCO (DOI: 10.1200/JCO.2017.76.2983)"
source_type: paper
epistemics: empirical
asserted_at: "2026-07"
---

# CHIP as the Dominant Biological False-Positive Source in ctDNA

## The Problem

Clonal hematopoiesis of indeterminate potential (CHIP): somatic mutations in hematopoietic stem cells (most common: DNMT3A, TET2, ASXL1, also TP53, JAK2, SF3B1, IDH1/2, KRAS) that contaminate cfDNA because WBC-derived cfDNA is the dominant fraction of plasma cell-free DNA. These overlap with actionable cancer driver genes.

## Key Evidence

### Razavi et al. 2019 (MSK/Grail)

Razavi P, Li BT, Brown DN, et al. High-intensity sequencing reveals the sources of plasma circulating cell-free DNA variants. Nat Med. 2019;25:1928-1937. DOI: 10.1038/s41591-019-0405-4.

- n=124 metastatic cancer patients, matched plasma cfDNA + WBC sequencing.
- In tumor-only cfDNA analysis (no matched WBC), the majority of low-VAF (<1%) mutations were attributable to CHIP or germline, not tumor.
- After WBC filtering, true somatic variant detection specificity improved dramatically.
- Established the standard: cfDNA panels must sequence matched WBC to subtract CHIP.

### Ptashkin et al. 2023 (MSK)

Ptashkin RN, et al. Clonal hematopoiesis: updates and implications at the solid tumor-immune interface. JCO Precision Oncology. 2023; PO.23.00132.

- 5.2% of advanced-cancer patients would have ≥1 CH variant called as tumor-derived without matched blood filtering.
- 49.7% of CH variants classified as oncogenic/likely-oncogenic.
- 3.2% associated with approved/investigational therapies (IDH1/2, KRAS G12C).
- Impact: without matched normal, ~1 in 20 patients could receive an inappropriate targeted therapy recommendation.

### Hu et al. 2018 (Guardant)

Hu Y, Ulrich BC, et al. False-positive mutations in commercially available cfDNA panels due to clonal hematopoiesis. J Clin Oncol. 2018;36(21):2190-2198. DOI: 10.1200/JCO.2017.76.2983.

- n=10,593 cfDNA profiles.
- 14.4% of TP53 variants attributable to CHIP.
- 4.5% of all reported variants attributable to CHIP.
- Highest-impact genes: DNMT3A, TET2, TP53, SF3B1.

## Current Mitigation (2024–2025)

- All major ctDNA CDx platforms (Guardant360 CDx, F1LCDx) include matched WBC sequencing or computational WBC subtraction.
- Signatera avoids CHIP by design: bespoke panel tracks patient-specific tumor mutations from tissue; CHIP variants in blood are not in the panel.
- Computational CHIP filters: variant-level annotation against known CHIP genes + VAF stability across serial draws (CHIP VAF stable; ctDNA VAF varies with tumor dynamics).
- CHIP gene list: DNMT3A, TET2, ASXL1, PPM1D, TP53, JAK2, SF3B1, SRSF2, IDH1, IDH2, CBL, KRAS.

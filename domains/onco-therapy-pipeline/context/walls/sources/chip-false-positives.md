---
topic: Clonal hematopoiesis of indeterminate potential (CHIP) as a dominant biological false-positive source in cancer sequencing
keywords: [CHIP, clonal hematopoiesis, false positive, cfDNA, ctDNA, somatic mutation, germline contamination, liquid biopsy, white blood cell, matched WBC]
related: [../diff-quality.md, ../../sampling/liquid-biopsy-ctdna.md]
source: "Razavi et al. 2019 Nat Med 25:744 doi:10.1038/s41591-019-0405-7; Ptashkin et al. 2023 JCO Precis Oncol doi:10.1200/PO.22.00555; Jaiswal et al. 2014 NEJM 371:2488 doi:10.1056/NEJMoa1408617; Bolton et al. 2020 Nat Genet 52:1219 doi:10.1038/s41588-020-00707-1"
source_type: paper
epistemics: empirical
asserted_at: "2026-07"
---

# CHIP as a False-Positive Source in Cancer Genomics

Clonal hematopoiesis of indeterminate potential (CHIP) is the expansion of hematopoietic stem cell clones carrying somatic mutations (most commonly DNMT3A, TET2, ASXL1, TP53, JAK2) in the absence of a hematologic malignancy. CHIP prevalence increases with age: ~10% at age 70, ~20% at age 80 (Jaiswal et al. 2014).

**Impact on cfDNA-based cancer detection:** Razavi et al. 2019 analyzed matched cfDNA and white blood cell (WBC) sequencing in 124 metastatic cancer patients. They found that 5.2% of patients had CHIP-derived mutations in cfDNA that would be called as tumor-derived somatic variants without matched WBC filtering. CHIP variants comprised up to 53% of all cfDNA variants at VAF <1% in some patients. The affected genes overlap heavily with cancer driver genes (TP53, KRAS), making CHIP the dominant biological false-positive source in liquid biopsy.

**Scale and mitigation:** Bolton et al. 2020 characterized CHIP in 97,691 individuals, identifying CHIP in ~10% of those over 65. Ptashkin et al. 2023 demonstrated that matched WBC sequencing reduces false-positive rates by 40-60% in clinical cfDNA panels, but adds cost and turnaround time. Without matched WBC, the false-call rate for actionable mutations at VAF <0.5% is unacceptable for clinical decision-making.

**Residual risk:** Even with matched WBC filtering, CHIP mosaicism below the WBC panel's detection limit (typically VAF ~1%) can still produce false calls. This sets a biological floor on liquid biopsy specificity that is not addressable by computational improvements alone.

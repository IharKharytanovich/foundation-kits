---
topic: TMB harmonization and FDA companion diagnostics — standardizing a computable biomarker
keywords: [TMB, tumor mutational burden, MSI, microsatellite instability, FDA, companion diagnostic, harmonization, pembrolizumab, FoundationOne, panel]
related: [../tumor-mutational-burden.md]
epistemics: empirical
source: "Merino 2020 J Immunother Cancer Friends of Cancer Research TMB harmonization doi:10.1136/jitc-2019-000147; Marabelle 2020 Ann Oncol KEYNOTE-158 doi:10.1016/j.annonc.2020.10.474; FDA 2020 FoundationOne CDx TMB approval"
source_type: regulatory
asserted_at: "2026-07"
---

# TMB Harmonization and Regulatory Standards (2024-2026)

## FDA TMB Companion Diagnostic

**FoundationOne CDx (June 2020):**
- First FDA-approved companion diagnostic for pan-tumor TMB assessment.
- Threshold: TMB-High ≥10 mutations/megabase (mut/Mb) for pembrolizumab (KEYNOTE-158 basket trial).
- Panel: 324 genes, ~1.1 Mb coding region sequenced.
- Validation: correlation R²=0.90 with WES-derived TMB on matched samples.

**KEYNOTE-158 Results (Marabelle et al. 2020):**
- TMB-H (≥10 mut/Mb) patients: ORR 29% (vs 6% TMB-Low).
- Agnostic across 10 tumor types; response rates varied by histology.
- TMB-H prevalence: 13% across all tumors; highest in melanoma (45%), NSCLC (30%), bladder (25%).

## The Harmonization Problem

**Friends of Cancer Research (FoCR) TMB Harmonization Project:**
- Phase I (Merino et al. 2020): 5 panels + WES tested on 29 reference samples.
- Panel-to-panel concordance: TMB values differ by 1.5-2.5x depending on panel, gene content, and bioinformatics.
- WES vs panel: systematic offset (panels report ~20% lower TMB due to coding-only capture).
- Germline filtering: including/excluding germline variants changes TMB by 0-50% depending on patient ancestry and variant database completeness.

**Phase II (2022-2024):**
- Reference standards (Horizon Discovery synthetic TMB controls) enable cross-platform calibration.
- Recommendation: report TMB per panel-specific validated cutoff, not a universal number.
- Panel size matters: <0.5 Mb panels unreliable for TMB estimation (wide confidence intervals); ≥1 Mb recommended.
- Blood-based TMB (ctDNA panels): correlation R²=0.6-0.7 with tissue TMB; FDA not yet approved for bTMB as CDx.

## TMB Computation Pipeline

1. Somatic variant calling (Mutect2 or panel-specific pipeline).
2. Filter: remove germline (gnomAD ≥0.01% AF), known drivers (to avoid bias), synonymous variants (some panels include, some exclude).
3. Count remaining nonsynonymous somatic mutations.
4. Divide by panel footprint in megabases → TMB (mut/Mb).

**Challenges:**
- No consensus on inclusion/exclusion of: synonymous mutations, indels, splice-site variants.
- Low tumor purity (<20%): sensitivity for mutations drops → TMB underestimated.
- Germline subtraction: patients from underrepresented populations have more novel germline variants misclassified as somatic → TMB overestimated.
- FFPE artifacts (deamination C>T): inflate TMB by 2-5 mut/Mb without proper filtering.

## MSI as Complementary Biomarker

- MSI-High: FDA-approved pan-tumor biomarker for pembrolizumab (2017, first tissue-agnostic approval).
- MSI testing: PCR (Bethesda markers), IHC (MMR proteins), NGS-based (MSIsensor, MANTIS, MSIseq).
- NGS-based MSI: concordance >99% with PCR/IHC on validated panels (MSK-IMPACT, FoundationOne).
- Overlap: ~80% of MSI-H tumors are TMB-H, but ~40% of TMB-H are not MSI-H (different biology).
- Combined TMB + MSI: complementary predictive value; both computable from the same WES/panel data.

## 2024-2025 Developments

- **TMB as continuous variable**: emerging evidence that response correlates continuously with TMB, not just above/below 10; some trials exploring TMB-adjusted dosing.
- **Clonal TMB**: clonal mutations (present in all cells) may be more predictive than total TMB (includes subclonal noise); computational separation requires clonality inference.
- **RNA-based neoantigen load**: complementary to DNA TMB; counts only expressed neoantigens with predicted binding.

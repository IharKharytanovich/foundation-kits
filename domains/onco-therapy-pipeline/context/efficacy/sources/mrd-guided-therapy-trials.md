---
topic: MRD/ctDNA-guided therapy trials in solid tumors — DYNAMIC, CIRCULATE-Japan, c-TRAK TN, and the measurement gap for in-vivo editing
keywords: [MRD, minimal residual disease, ctDNA-guided, DYNAMIC, CIRCULATE, c-TRAK, adjuvant, de-escalation, escalation, colorectal, triple-negative breast, in-vivo editing, measurement gap, delivery metrics, action metrics]
related: [../efficacy-surrogacy-gap.md]
epistemics: empirical
source: "Tie 2022 NEJM 386:2261 (DYNAMIC); Kotani 2024 ESMO (CIRCULATE-Japan); Parsons 2023 Lancet Oncol c-TRAK TN; Weber 2024 Lancet mRNA-4157/V940 KEYNOTE-942"
source_type: clinical-trial
asserted_at: "2026-07"
---

# MRD-Guided Therapy Trials and the Measurement Gap

## ctDNA-Guided De-escalation Trials

### DYNAMIC (Tie et al, NEJM 2022)
- **Design**: Randomized phase II, stage II colon cancer, N=455
- **Intervention**: ctDNA-guided adjuvant chemotherapy — ctDNA+ patients receive fluoropyrimidine±oxaliplatin; ctDNA− patients observed
- **Key result**: ctDNA-guided management reduced chemotherapy use from 28% to 15% (absolute reduction 13%) with non-inferior 2-year recurrence-free survival (93.5% guided vs 92.4% standard, HR 0.82, 95% CI 0.42–1.60)
- **Implication**: ctDNA can safely de-escalate adjuvant therapy in a specific population. Does NOT validate ctDNA as a surrogate — it validates ctDNA as a decision-making biomarker within a trial design
- **Metric class**: action metric (ctDNA clearance/persistence), empirical link to outcome

### CIRCULATE-Japan (Kotani et al, ESMO 2024)
- **Design**: Umbrella platform trial, stage II–III CRC, ctDNA-guided adjuvant
- **VEGA substudy**: ctDNA-negative stage II CRC patients randomized to observation vs capecitabine — preliminary data showed no DFS benefit from chemotherapy in ctDNA-negative patients (HR ~1.0), supporting de-escalation
- **ALTAIR substudy**: ctDNA-positive patients randomized to standard-of-care ± additional intervention
- **Metric class**: action metric, empirical

### c-TRAK TN (Parsons et al, Lancet Oncology 2023)
- **Design**: Phase II, triple-negative breast cancer, ctDNA-triggered intervention
- **Intervention**: Patients with detectable ctDNA post-neoadjuvant chemotherapy + surgery received pembrolizumab
- **Key result**: ctDNA clearance rate with pembrolizumab was 64% (9/14 patients); too small for survival conclusions but demonstrates the "ctDNA-triggered escalation" paradigm
- **Metric class**: action metric (ctDNA clearance), empirical

## The In-Vivo Editing Measurement Gap

For gene-editing therapies targeting solid tumors, the delivery-to-efficacy metrics chain is:

1. **Delivery metrics** (computable from assay):
   - % on-target editing (measured by NGS of biopsied tissue)
   - Biodistribution (% injected dose reaching target organ)
   - Expression level (mRNA payload: protein expression by ELISA/flow)

2. **Action metrics** (clinical observation):
   - RECIST 1.1 (imaging-based tumor response)
   - Pathological complete response (pCR, surgery-based)
   - ctDNA dynamics (liquid biopsy-based)

3. **The gap**: For in-vivo gene editing in solid tumors, there is no validated way to measure editing efficiency in the tumor without a biopsy. Unlike liver (where Verve Therapeutics measured PCSK9 knockdown via circulating protein), solid tumors lack a circulating readout of on-target editing. The editing % from a biopsy sample does not represent the whole tumor (spatial heterogeneity). This makes the delivery metric → action metric link aspirational for solid tumors.

## mRNA-4157/V940 (KEYNOTE-942) — The Neoantigen Vaccine Benchmark

**Weber et al (Lancet 2024)**: Phase IIb, V940 (personalized neoantigen mRNA vaccine) + pembrolizumab vs pembrolizumab alone in resected stage III/IV melanoma.
- **Primary endpoint**: Recurrence-free survival (RFS), NOT ctDNA or molecular response
- **Key result**: 18-month RFS 78.6% (V940+pembro) vs 62.2% (pembro alone), HR 0.561 (95% CI 0.309–1.017)
- **Delivery metric**: mRNA-encoded neoantigens — expression confirmed by T-cell response assays (IFN-γ ELISpot), not by direct in-vivo measurement of mRNA payload distribution
- **Gap**: Even in this landmark trial, efficacy is measured by clinical outcome (RFS) and immune correlate (T-cell response), not by a direct metric of payload delivery to antigen-presenting cells

## Quantitative Metric Benchmarks (2024–2025)

| Metric | Typical Range | Metric Class | Epistemics |
|--------|--------------|--------------|------------|
| On-target editing (ex vivo, CAR-T manufacturing) | 80–98% (CD19 CAR-T) | Delivery | Computable |
| On-target editing (in vivo, liver, base editing) | 37–48% PCSK9 (Verve HEART-1) | Delivery | Computable |
| On-target editing (in vivo, solid tumor) | No validated data | Delivery | Aspirational |
| %CAR+ T cells (leukapheresis product) | 5–50% (varies by manufacturing) | Delivery | Computable |
| RECIST ORR (CAR-T, solid tumors) | 5–30% (varied, mostly phase I) | Action | Empirical |
| ctDNA clearance rate (post-treatment) | 40–80% (indication-dependent) | Action | Empirical |
| ctDNA → OS/DFS surrogacy | NOT VALIDATED | Surrogate | Empirical, unsettled |

---
topic: Neoantigen vaccine clinical trials 2024-2025 — mRNA-4157 and individualized approaches
keywords: [neoantigen vaccine, mRNA-4157, V940, KEYNOTE-942, INTerpath, autogene cevumeran, personalized cancer vaccine, clinical trial, adjuvant]
related: [../neoantigen-prediction-pipeline.md, ../../landscape/modalities.md]
epistemics: empirical
source: "Weber 2024 Lancet mRNA-4157 KEYNOTE-942 doi:10.1016/S0140-6736(24)00588-6; Rojas 2023 Nature autogene cevumeran doi:10.1038/s41586-023-06063-y; Ott 2024 Nature 633:149-157 doi:10.1038/s41586-024-07981-3"
source_type: clinical-trial
asserted_at: "2026-07"
---

# Neoantigen Vaccine Clinical Results (2024-2025)

## mRNA-4157/V940 (Moderna + Merck) — KEYNOTE-942 / INTerpath-001

**KEYNOTE-942 Phase 2b (Weber et al. 2024, Lancet):**
- Indication: adjuvant high-risk melanoma (Stage III/IV resected) + pembrolizumab.
- Design: mRNA encoding up to 34 patient-specific neoepitopes + pembrolizumab vs pembrolizumab alone.
- Primary endpoint: recurrence-free survival (RFS).
- Results: 44% reduction in recurrence/death risk (HR 0.561, 95% CI 0.309-1.017 at initial analysis; updated HR 0.623 at 3-year follow-up).
- 18-month RFS: 78.6% (combo) vs 62.2% (pembro alone).
- Distant-metastasis-free survival: HR 0.347 (65% risk reduction).
- Safety: Grade ≥3 treatment-related AEs 25% (combo) vs 18% (pembro); no new safety signals.

**INTerpath-001 Phase 3 (ongoing, started 2024):**
- ~1,000 patients, adjuvant melanoma.
- Primary endpoint: RFS. First pivotal randomized trial for a personalized cancer vaccine.
- Expected readout: 2026.

**Manufacturing for mRNA-4157:**
- Tumor WES + matched normal → neoantigen prediction pipeline → mRNA construct design → GMP synthesis.
- Vial-to-patient: reported ~6-8 weeks (from biopsy to first dose).
- Up to 34 neoepitopes per construct (concatenated mRNA with linkers).
- Uses Moderna's lipid nanoparticle delivery platform.

## Autogene Cevumeran (BioNTech/Genentech) — Pancreatic Cancer

**Rojas et al. 2023, Nature:**
- Indication: adjuvant resected pancreatic ductal adenocarcinoma (PDAC).
- Design: individualized mRNA encoding up to 20 neoepitopes, with atezolizumab and mFOLFIRINOX.
- Phase 1 results (n=16): 8/16 patients showed neoantigen-specific T-cell responses ("responders").
- Responders: 0/8 recurrences at median 18 months.
- Non-responders: 7/8 recurred.
- Correlation between T-cell response and clinical benefit strongly suggestive but underpowered.
- Manufacturing: ~9 weeks tumor-to-dose.

## The Pipeline Bottleneck: Prediction Accuracy

Both trials rely on computational neoantigen prediction → neoepitope ranking → construct design. The pipeline's accuracy determines which epitopes enter the vaccine:

- Selection algorithms typically pick top-ranked 20-34 neoantigens by predicted binding affinity + clonality + expression.
- Post-hoc analysis of responders: T-cell responses target only 1-5 of the included neoantigens (not all 20-34).
- Implication: current prediction over-includes non-immunogenic peptides but compensates by including enough that ≥1 is functional.
- The immunogenicity prediction gap (~6% positive predictive value for top predictions) means most predicted neoantigens in the vaccine are immunologically inert "passengers."

## Other Programs (2024-2025)

- **Nuvaxovid individualized** (Novavax): protein-based personalized neoantigen approach, Phase 1.
- **GRANITE** (Gritstone): self-amplifying RNA (SAM) encoding shared + personalized neoantigens; Phase 2 CRC, with ipilimumab + nivolumab.
- **GEN-009** (Genocea): adjuvanted peptide neoantigen vaccine; discontinued 2023 (company closure).
- **NeoVax** (Dana-Farber): long-peptide vaccine; Phase 1 melanoma (Ott et al. 2017) showed T-cell responses; no Phase 3 planned.

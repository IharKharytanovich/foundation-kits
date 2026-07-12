---
topic: IRIS 2023 — big-data discovery of splicing-derived immunotherapy targets validated for TCR and CAR-T
keywords: [IRIS, alternative splicing, immunotherapy target, neuroendocrine prostate cancer, TCR, CAR-T, immunopeptidomics, tumor specificity, splice antigen, GTEx]
related: [../rna-and-noncanonical-neoantigens.md, kahles-2018-splicing-landscape.md]
epistemics: empirical
source: "Pan Y, Phillips JW, Zhang BD, … Witte ON, Xing Y. IRIS: Discovery of cancer immunotherapy targets arising from pre-mRNA alternative splicing. PNAS 2023;120(21):e2221116120. DOI:10.1073/pnas.2221116120 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# IRIS — Splicing Immunotherapy Target Discovery

A computational platform that screens tumor alternative-splicing events against large normal references to nominate tumor-associated, tumor-specific, and recurrent splice antigens, then validates them functionally — establishing that splice antigens are actionable for **TCR- and CAR-based cell therapy**, not just vaccines.

## Design & Method

Three-tiered screen: (1) tumor-association vs GTEx, (2) tumor-specificity vs an expanded normal panel, (3) tumor-recurrence; then HLA-I presentation prediction; then validation via paired RNA-seq + immunopeptidomics, in-vitro T-cell priming with single-cell TCR-seq, and CAR-T targeting of AS-derived extracellular epitopes. Large normal panels (GTEx and TCGA-normal, on the order of ~9,000+ RNA-seq samples each) define the "normal" splicing baseline. Focus disease: neuroendocrine prostate cancer (NEPC) plus pan-cancer screening.

## Results

IRIS screened a very large AS-event space (reported on the order of ~270,000 events) down to a focused candidate list (reported ~100–200 targets), a subset validated as HLA-presented, with **experimental TCR and CAR-T validation of AS-derived epitopes** showing potent, specific tumor killing. (Exact intermediate counts — e.g. 164 targets / 48 presented / 7 CAR-T — are automated-extraction approximate and flagged as not verified against the figures.)

Verbatim: *"IRIS represents a systematic and generalizable strategy for exploiting AS as a source of cancer immunotherapy targets"*; *"antigen-reactive TCRs can target IRIS-predicted AS-derived epitopes with high potency and specificity."*

## Limitations

Short-read RNA-seq under-resolves full-length isoforms; lacks single-cell heterogeneity; target expression variability.

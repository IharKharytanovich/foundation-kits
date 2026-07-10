---
topic: Tumor mutational burden — a computable biomarker derived from variant calling
keywords: [TMB, tumor mutational burden, MSI, microsatellite instability, biomarker, pembrolizumab, FDA, FoundationOne, companion diagnostic, mut/Mb]
related: [sources/tmb-harmonization-standards.md, somatic-variant-calling.md, ../map.md]
defines:
  tumor-mutational-burden: "Count of somatic nonsynonymous mutations per megabase of coding sequence; FDA-approved companion diagnostic at ≥10 mut/Mb for pembrolizumab; fully computable from panel/WES data but sensitive to germline filtering and panel size"
kinds:
  tumor-mutational-burden: metric
epistemics: computable
source: "Merino 2020 J Immunother Cancer FoCR harmonization; Marabelle 2020 Ann Oncol KEYNOTE-158; FDA 2020 FoundationOne CDx TMB approval"
source_type: regulatory
asserted_at: "2026-07"
---

# Tumor Mutational Burden

[[tumor-mutational-burden]] is the quantitative measure of somatic mutations per megabase that serves as a pan-tumor immunotherapy biomarker. It is fully computable from WES or panel sequencing data: given a somatic variant callset, TMB is a deterministic count. The FDA approved FoundationOne CDx as the first TMB companion diagnostic (2020) with a threshold of ≥10 mut/Mb for pembrolizumab across solid tumors.

## Computation

TMB = (nonsynonymous somatic mutations after germline subtraction) / (panel footprint in Mb). The computation depends directly on [[somatic-variant-calling]] quality: missed variants undercount TMB, and FFPE artifacts or incomplete germline subtraction inflate it by 2-5 mut/Mb.

## TMB is measured by the somatic variant calling stage — it is a derived metric, not an independent measurement:

measured-by:: [[somatic-variant-calling]]

## The Harmonization Gap

Panel-to-panel concordance remains imperfect (values differ 1.5-2.5x across platforms) due to gene content, inclusion/exclusion rules, and germline database completeness. The Friends of Cancer Research harmonization project established reference standards and recommends panel-specific validated cutoffs rather than a universal number. Panel size ≥1 Mb is required for reliable estimation.

## Clinical Relevance

TMB-High (≥10 mut/Mb) predicts immunotherapy response across tumor types (KEYNOTE-158: ORR 29% vs 6% TMB-Low). Prevalence of TMB-H varies: melanoma ~45%, NSCLC ~30%, bladder ~25%, median across all tumors ~13%. Emerging evidence suggests TMB as a continuous predictor rather than binary, and that **clonal TMB** (mutations present in all tumor cells) is more predictive than total TMB — connecting this metric back to clonal architecture inference.

## TMB feeds into the personalized therapy throughput as a stratification gate — only TMB-H patients are candidates for certain immunotherapy regimens:

feeds-into:: [[personalized-therapy-throughput]]

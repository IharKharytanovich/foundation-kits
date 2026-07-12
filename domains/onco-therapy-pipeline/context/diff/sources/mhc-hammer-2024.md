---
topic: MHC Hammer 2024 — genetic and non-genetic HLA disruption; DNA-only pipelines under-count antigen loss
keywords: [MHC Hammer, HLA-LOH, transcriptional repression, alternative splicing, TRACERx, NSCLC, neoantigen, antigen presentation, RNA-seq, immune escape]
related: [../copy-number-and-loh.md, lohhla-2017.md, ../neoantigen-prediction-pipeline.md]
epistemics: empirical
source: "Puttick C, … Swanton C; TRACERx Consortium. MHC Hammer reveals genetic and non-genetic HLA disruption in cancer evolution. Nat Genet 2024;56(10):2121-2131. DOI:10.1038/s41588-024-01883-8 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# MHC Hammer — Genetic + Non-Genetic HLA Disruption

Extends LOHHLA to jointly call class-I HLA **allele-specific mutation, LOH, allelic expression/repression, and alternative splicing** from WES + RNA-seq. Its central lesson: **DNA-only HLA-LOH under-counts antigen-presentation loss** because transcriptional and splicing mechanisms silence alleles that remain genomically intact.

## Design & Cohort

Nextflow pipeline applied to **TRACERx421 (421 multiregion NSCLC)**, **945 NSCLC + 972 breast TCGA**, and GTEx normal tissue.

## Results (load-bearing)

- **HLA LOH in 40% of NSCLC** (concordant with McGranahan 2017); more frequent in **metastasis-seeding regions**; LUAD primary regions that seed a metastasis had **lower effective neoantigen burden**.
- **Non-genetic disruption (the new finding):** class-I **transcriptional repression** in **61% LUAD, 76% LUSC, 35% ER+ breast**; **tumor-enriched alternative splicing** in **31% LUAD, 11% LUSC, 15% ER+**.
- Combining mechanisms, **only 13/49 (27%) LUAD, 2/29 (7%) LUSC, 19/34 (56%) ER+** tumors had *no* class-I LOH/repression/mutation. Biallelic repression: **56% LUAD, 69% LUSC, 28% ER+**. Repression associated with reduced tumor/normal *NLRC5*, *CIITA*, *IFNG* and methylation changes.
- **Neoantigen impact:** accounting for LOH + repression, a substantial fraction of predicted neoantigens bind *exclusively* to silenced/lost alleles — i.e., not truly presented.

Verbatim: *"in lung TRACERx and lung and breast TCGA cohorts, 61% of lung adenocarcinoma (LUAD), 76% of lung squamous cell carcinoma (LUSC) and 35% of estrogen receptor-positive (ER+) cancers harbored class I HLA transcriptional repression."*

## Limitations

Requires paired RNA-seq; repression/splicing calls need normal-tissue baselines (heterogeneous HLA expression); cohorts weighted to lung/breast. Consequence for the diff: a WGS/WES-only stage systematically overestimates presentable neoantigen dosage — the RNA layer is needed to catch expression-level immune escape.

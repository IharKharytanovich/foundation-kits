---
topic: SNAF 2024 — splicing neoantigen finder revealing shared targets, with immunopeptidomic validation
keywords: [SNAF, splicing neoantigen, neojunction, DeepImmuno, BayesTS, tumor specificity, melanoma, ovarian, immunopeptidomics, shared neoantigen, T-cell reactivity]
related: [../rna-and-noncanonical-neoantigens.md, kahles-2018-splicing-landscape.md, iris-splicing-targets-2023.md]
epistemics: empirical
source: "Li G, Mahajan S, Ma S, … Salomonis N. Splicing neoantigen discovery with SNAF reveals shared targets for cancer immunotherapy. Sci Transl Med 2024;16(730):eade2886. DOI:10.1126/scitranslmed.ade2886 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# SNAF — Splicing Neo-Antigen Finder

A pipeline that extracts tumor splice junctions from BAM, filters against a GTEx+TCGA normal reference (BayesTS tumor-specificity score), and predicts both T-cell (MHC-bound) and B-cell (extracellular transmembrane) neo-epitopes — with unusually broad orthogonal validation.

## Design & Cohort

Development + application to **472 TCGA samples** (melanoma and ovarian) plus the Van Allen melanoma-immunotherapy cohort. Validation across immunopeptidomics, targeted/spike-in MS, peptide–MHC stabilization, T-cell reactivity, single-cell genomics, long-read isoform sequencing, and transmembrane localization. SNAF-T uses NetMHCpan/MHCflurry binding → **DeepImmuno** immunogenicity; SNAF-B finds altered-extracellular-domain transmembrane neo-epitopes.

## Results (load-bearing, verified from full text)

- **528 tumor-specific neojunctions per patient on average (range 28–1,549)** in the 472-sample cohort.
- **~1,090 predicted MHC-bound peptides per patient (range 75–2,981).**
- **108 junctions shared in >15% of patients** (public neoantigens); shared splicing neoantigens occurred in **up to 90% of melanoma patients** and correlated with overall survival.
- Immunopeptidomics validation (ovarian): **46 MS-supported splicing neoantigens per sample on average (range 12–160).**
- Of **36 synthesized candidate peptides**, spike-in MS gave **11 spectral matches, 7 high-scoring**; T-cell reactivity confirmed for select candidates.

Verbatim: SNAF is *"unique in its inclusion of probabilistic modeling to quantify immunogenicity and tumor specificity,"* revealing *"potential shared targets for therapy in heterogeneous cancers."*

## Limitations

Melanoma/ovarian focus; retrospective; MS depth and immunogenicity assays cover only a fraction of predictions — the recurring theme that computational nomination outruns experimental validation.

---
topic: Xu et al. 2024 — tumor-intrinsic EZH2 creates the CD8-desert phenotype by depositing H3K27me3 on the CXCL9 promoter; EZH2 inhibition restores CXCL9 and CD8 migration
keywords: [EZH2, H3K27me3, CXCL9, immune desert, esophageal squamous carcinoma, DNMT3A, GSK126, NF-kB, CD8 migration, Communications Biology]
related: [../chemokine-axis-mismatch.md]
epistemics: empirical
source: "Xu Y, Wang J, et al. EZH2 inhibits CD8+ T cell infiltration by epigenetically silencing CXCL9 in esophageal squamous cell carcinoma. Commun Biol. 2024;7:1607. DOI:10.1038/s42003-024-07341-9"
source_type: paper
asserted_at: "2026-07"
---

# Xu 2024 — EZH2 Silences CXCL9 to Create Immune Deserts

Mechanistic evidence that a single epigenetic enzyme, EZH2, produces the CD8-desert phenotype by silencing the key effector-T-cell recruiting chemokine.

## Design & Cohort

Human esophageal squamous cell carcinoma (ESCC) immunophenotyping by CD8 spatial classification plus TCGA correlation, in-vitro knockdown/inhibitor work (KYSE150/KYSE510 human lines, mouse mEC-01-3), ChIP-seq/ChIP-PCR, and transwell migration. **n=109 ESCC** classified by CD8 spatial distribution; separate n=15 transcriptomic subset.

## Quantitative & Mechanistic Results

- **Immunophenotype distribution (n=109):** infiltrated 22.94% (25), immune-excluded 61.46% (67), immune-desert 15.60% (17) → cold (excluded + desert) = **77.06%**.
- In TCGA ESCC, EZH2 and DNMT3A expression correlated **inversely** with CD8 enrichment; IHC confirmed EZH2/DNMT3A elevated in excluded/desert versus infiltrated tumors.
- Among chemokines, CXCL9/CCL4/CXCL13/CXCL5 were downregulated in desert tumors; CXCL9/CCL4/CXCL13 are expressed by immune cells, not malignant cells.
- **Mechanism:** EZH2 deposits **H3K27me3 at the CXCL9 promoter** (ChIP-PCR confirmed), silencing transcription; NF-κB (p50) drives CXCL9, and EZH2 blocks this activation.
- **GSK126** (EZH2 inhibitor, optimal 2.4 µM) lowered H3K27me3 and markedly increased CXCL9 (not the other chemokines); adding an NF-κB inhibitor abolished the CXCL9 rise.
- EZH2 knockdown → increased CXCL9 → **enhanced CD8 transwell migration**; an anti-CXCL9 antibody abrogated the migration gain.
- Parallel axis: EZH2 activates VEGFC, suppressing dendritic-cell maturation.

## Limitations

Single tumor type (ESCC); in-vivo T-cell infiltration mostly inferred from in-vitro migration; small transcriptomic subset (desert n=3 vs excluded n=7).

## Conclusion

Tumor-intrinsic EZH2 creates the CD8-desert phenotype by H3K27me3-silencing CXCL9 and inducing VEGFC, and EZH2 inhibition reverses both — a druggable epigenetic mechanism of chemokine-axis mismatch, consistent with the ovarian and colon EZH2/DNMT findings (Peng 2015; Nagarsheth).

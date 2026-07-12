---
topic: Sequenza — cellularity/ploidy and allele-specific copy number from tumor exome/WGS
keywords: [Sequenza, cellularity, ploidy, allele-specific copy number, tumor purity, exome, admixture simulation, ASCAT concordance, ABSOLUTE, low cellularity]
related: [../copy-number-and-loh.md, ascat-allele-specific-cn.md]
epistemics: empirical
source: "Favero F, Joshi T, Marquard AM, … Eklund AC. Sequenza: allele-specific copy number and mutation profiles from tumor sequencing data. Ann Oncol 2015;26(1):64-70. DOI:10.1093/annonc/mdu479 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# Sequenza — Cellularity/Ploidy from Exome/WGS

A grid-based maximum-a-posteriori method that jointly fits depth-ratio and BAF per segment to infer global cellularity, ploidy, and allele-specific integer CN directly from tumor-normal exome or WGS. R package + Python preprocessing (`sequenza-utils`), on CRAN; widely reused as the purity/ploidy feature source inside downstream tools (e.g. DASH).

## Design & Cohort

Validated on TCGA matched tumor/normal exomes — **10 ovarian + 20 renal clear-cell carcinoma** patients (deliberately spanning high-cellularity/CNA-rich ovarian and low-cellularity/CNA-sparse RCC) — plus **simulated normal-tumor admixtures** from cell lines HCC1143 and HCC1954 (30× WGS) at tumor content **20%, 40%, 60%, 80%**. Comparators: ASCAT (on matched SNP arrays), ABSOLUTE, absCN-seq.

## Results (load-bearing)

Correlation with ASCAT: **cellularity Pearson r = 0.90**; **ploidy r = 0.42**, rising to **r = 0.94 after manual inspection of alternative solutions** (ploidy discordance driven by a few low-cellularity outliers). From the concordance table (cellularity / ploidy, raw → curated):

- **Sequenza 0.90 / 0.42 → 0.91 / 0.94**
- **ABSOLUTE 0.19 / 0.13 → 0.61 / 0.50**
- **absCN-seq 0.46 / −0.26 → 0.65 / 0.46**

Median fraction of genome with CN identical to ASCAT: **0.69** (Sequenza) vs 0.08 (ABSOLUTE) vs 0.02 (absCN-seq). On simulated admixtures, **Sequenza recovered the correct ploidy down to 30% tumor content**.

Verbatim: *"in artificial data simulating normal-tumor admixtures, Sequenza detected the correct ploidy in samples with tumor content as low as 30%."*

## Limitations

"There is no tumor gold standard" — validation is against ASCAT, not ground truth; ploidy estimation degrades and needs manual curation of alternative solutions at low cellularity; breakpoint positions differ from array-based ASCAT even when CN state agrees.

---
topic: 2025 systematic benchmark of ploidy/purity callers — PURPLE leads bulk WGS, all fail on long reads
keywords: [PURPLE, ploidy benchmark, purity, ASCAT, ABSOLUTE, Accucopy, TitanCNA, SEQC2, HCC1395, tumor-only, coverage, RMSE, long read]
related: [../copy-number-and-loh.md, ascat-allele-specific-cn.md]
epistemics: empirical
source: "Li Y, et al. Benchmarking Ploidy Estimation Methods for Bulk and Single-Cell Whole Genome Sequencing. Adv Sci (Weinh) 2025;12(45):e07839. DOI:10.1002/advs.202507839 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# 2025 Ploidy/Purity Caller Benchmark

The first systematic head-to-head benchmark of **11 bulk-WGS** and **8 single-cell-WGS** ploidy/purity tools. Bulk set includes **ASCAT, PURPLE, ABSOLUTE, Accucopy, absCN-seq, CNAnorm, TitanCNA, PyLOH, Sclust**. Ground truth from **SEQC2** cell lines: polyploid breast cancer **HCC1395 (2.8n)** vs matched diploid **HCC1395BL**. Five datasets: experimental mixtures + simulated platform (Illumina/PacBio/Nanopore), purity, and coverage (2×–100×) series. Accuracy = RMSE (ploidy "reliable" if RMSE < 0.2; purity "accurate" if RMSE < 2%) and Pearson r.

## Results (load-bearing)

- **PURPLE is the top bulk performer** — highest accuracy, top-tier stability, resource-efficient; *"outperforms other methods when tumor purity exceeded 30%, regardless of sequencing coverage or platform."*
- **Purity-threshold hierarchy:** at **≤20% purity** most tools fail; **Accucopy and PURPLE** accurate at **20%**; **PyLOH** reliable at **10–20%**. At **≥30%**, ASCAT and PURPLE lead. **ASCAT** robust at **≥50%** but with **systematic ploidy over-estimation ≈ +0.24**. PURPLE stable even at **10× coverage**.
- **Coverage:** Accucopy needed **>50×**; PURPLE stable from 10×. **ASCAT fastest CPU; TitanCNA lowest RAM;** ABSOLUTE unstable across replicate runs.
- **Tumor-only mode:** only ASCAT and PURPLE offer it; both lose accuracy vs paired, but **PURPLE still reliable at 50% and 75% purity** → recommended when no matched normal.
- **Hard failures for all tools:** euploid samples with tetraploid/octoploid mixtures (RMSE ≫ 0.2), and **long-read data — no tool analyzed Nanopore successfully; PacBio poor even for ASCAT.** Single-cell: **SeCNV** best.

Verbatim: *"PURPLE outperforms other methods when tumor purity exceeded 30%… However, all existing tools performed poorly applied to euploid samples or long-read sequencing data."*

## Limitations

RMSE is outlier-sensitive (inflates apparent error); ground truth limited to one cell-line pair; euploid/WGD detection and long-read purity/ploidy remain unsolved.

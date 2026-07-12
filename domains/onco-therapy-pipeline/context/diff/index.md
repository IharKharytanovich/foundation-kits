# Diff

The tumor-normal difference across nine analytical layers: (pre)alignment → somatic variant calling (SNV/indel/CNV/SV) → copy number/ploidy/WGD + HLA-LOH → clonality → TMB/MSI + mutational signatures/HRD → HLA typing → neoantigen prediction → non-canonical (splicing/fusion/ERV) discovery → immunogenicity modelling. Computable: alignment, calling, TMB/MSI, HLA, CN/purity/ploidy, signature attribution, MHC-binding/presentation (PPV≈0.83). Empirical / not computable de novo: neoantigen immunogenicity and TCR recognition (near-random AUC 0.52–0.60; see [walls/index.md](../walls/index.md)); unstable: SV calling, subclone inference; purity-gated: all copy-number calls. Feeds [design/index.md](../design/index.md).

Key concepts: somatic-variant-calling (stage, computable, SNV F1 >0.96), read-alignment-preprocessing (stage — pipeline choice swings FP 36×; duplex error floor ~2.5–5e-9), copy-number-loh-analysis (method — WGD ~28–36%, HLA-LOH ~40% NSCLC), tumor-mutational-burden (metric, FDA CDx ≥10 mut/Mb), mutational-signature-analysis (method — COSMIC v3.4 86 SBS, HRDetect AUC 0.98), clonal-architecture-inference (method, empirical, 19-35% algorithm-dependent), neoantigen-prediction-pipeline (stage, hybrid), noncanonical-neoantigen-discovery (method — splicing/fusion/ERV widen the space; ~1 in >500 immunogenic), immunogenicity-prediction-model (method — presentation computable, immunogenicity/TCR not). Sources span SEQC2/GIAB/CASTLE benchmarks, DRAGEN vs GATK, duplex sequencing, ASCAT/FACETS/PURPLE, WGD prognosis, LOHHLA/DASH/MHC Hammer, SigProfiler/HRDetect, SNAF/IRIS/Kahles splicing, indel/fusion/ERV antigens, immunopeptidomics, and NetMHCpan/BigMHC/PRIME/pMTnet/TESLA (2015–2025, ~42 primary sources).

<!-- BEGIN GENERATED — DO NOT EDIT below this line -->

> ⚠️ **AUTO-GENERATED** — DO NOT EDIT. Changes will be overwritten on next write.

### Subfolders

- [sources/](sources/index.md): Raw research material on the tumor-normal difference pipeline: somatic variant calling, clonality inference, TMB/MSI, HLA typing, and neoantigen prediction. 2024-2026 state. (49 files)

### Files

- [alignment-and-preprocessing.md](alignment-and-preprocessing.md) — Read alignment, low-VAF error suppression, and somatic truth sets — the first computable block of the diff
- [clonal-architecture-inference.md](clonal-architecture-inference.md) — Clonal architecture inference — the empirical weak link in the diff stage
- [copy-number-and-loh.md](copy-number-and-loh.md) — Allele-specific copy number, ploidy/whole-genome doubling, and HLA-LOH — the copy-number arm of the diff
- [immunogenicity-prediction-models.md](immunogenicity-prediction-models.md) — Immunogenicity prediction models — presentation is computable, T-cell recognition is not
- [mutational-signatures.md](mutational-signatures.md) — Mutational signature analysis and HRD scoring — the interpretive layer over the somatic callset
- [neoantigen-prediction-pipeline.md](neoantigen-prediction-pipeline.md) — Neoantigen prediction pipeline — HLA typing through peptide-MHC binding to immunogenicity ranking
- [rna-and-noncanonical-neoantigens.md](rna-and-noncanonical-neoantigens.md) — The RNA layer and non-canonical neoantigen discovery — antigens beyond SNV point neoepitopes
- [somatic-variant-calling.md](somatic-variant-calling.md) — Somatic variant calling — the computational core of the diff stage
- [tumor-mutational-burden.md](tumor-mutational-burden.md) — Tumor mutational burden — a computable biomarker derived from variant calling

<!-- END GENERATED -->

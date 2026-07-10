# Diff

The tumor-normal difference: alignment → somatic variant calling (SNV/indel/CNV) → clonality → TMB/MSI → HLA typing → neoantigen prediction. Computable: alignment, calling, TMB/MSI, HLA, MHC-binding. Empirical / not computable de novo: neoantigen immunogenicity (see [walls/index.md](../walls/index.md)); unstable: SV calling, subclone inference. Feeds [design/index.md](../design/index.md).

Key concepts: somatic-variant-calling (stage, computable, SNV F1 >0.96), tumor-mutational-burden (metric, FDA CDx ≥10 mut/Mb), clonal-architecture-inference (method, empirical, 19-35% algorithm-dependent), neoantigen-prediction-pipeline (stage, hybrid — binding computable but immunogenicity empirical). Sources cover SEQC2 benchmarks, deep-learning callers, SV precision limits, PCAWG clonality, HLA typing accuracy, and neoantigen vaccine clinical trials (2024-2025).

<!-- BEGIN GENERATED — DO NOT EDIT below this line -->

> ⚠️ **AUTO-GENERATED** — DO NOT EDIT. Changes will be overwritten on next write.

### Subfolders

- [sources/](sources/index.md): Raw research material on the tumor-normal difference pipeline: somatic variant calling, clonality inference, TMB/MSI, HLA typing, and neoantigen prediction. 2024-2026 state. (7 files)

### Files

- [clonal-architecture-inference.md](clonal-architecture-inference.md) — Clonal architecture inference — the empirical weak link in the diff stage
- [neoantigen-prediction-pipeline.md](neoantigen-prediction-pipeline.md) — Neoantigen prediction pipeline — HLA typing through peptide-MHC binding to immunogenicity ranking
- [somatic-variant-calling.md](somatic-variant-calling.md) — Somatic variant calling — the computational core of the diff stage
- [tumor-mutational-burden.md](tumor-mutational-burden.md) — Tumor mutational burden — a computable biomarker derived from variant calling

<!-- END GENERATED -->

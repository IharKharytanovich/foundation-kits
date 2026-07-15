# Sampling

Getting the biomaterial: tissue biopsy vs liquid biopsy (ctDNA/CTC), nucleic-acid extraction, and tumor-normal pairing. Computable here: FFPE-artifact filtering, purity estimate, required depth/LOD, somatic-vs-germline logic. Empirical: lesion accessibility, real yield/degradation, ctDNA fraction, CHIP status. Feeds [diff/index.md](../diff/index.md).

Key concepts: ctDNA fraction spans ~4 orders of magnitude (30%+ metastatic to 0.001% MRD); tumor purity estimation gates all downstream variant calling (≥10% for SNV, ≥20% for CNV); FFPE artifact filtering (80–90% FP reduction via Bayesian orientation-bias models); CHIP contamination affects 5.2% of patients without matched WBC subtraction.

<!-- BEGIN GENERATED — DO NOT EDIT below this line -->

> ⚠️ **AUTO-GENERATED** — DO NOT EDIT. Changes will be overwritten on next write.

### Subfolders

- [sources/](sources/index.md): Raw research material on the sampling stage of the personalized cancer therapy pipeline: liquid biopsy, ctDNA clinical trials, CHIP contamination, FFPE artifacts, and tumor purity estimation methods (2024–2026). (4 files)

### Files

- [ffpe-artifact-filtering.md](ffpe-artifact-filtering.md) — FFPE deamination artifact filtering — computational removal of formalin-fixation artifacts (C>T/G>A at low VAF) that mimic somatic mutations in tissue sequencing
- [liquid-biopsy-ctdna.md](liquid-biopsy-ctdna.md) — Liquid biopsy and ctDNA fraction — the empirical accessibility bottleneck of the sampling stage spanning four orders of magnitude from metastatic to MRD
- [tumor-purity-estimation.md](tumor-purity-estimation.md) — Computational tumor purity and tumor fraction estimation — the computable gatekeeper that determines whether variant calling is reliable

<!-- END GENERATED -->

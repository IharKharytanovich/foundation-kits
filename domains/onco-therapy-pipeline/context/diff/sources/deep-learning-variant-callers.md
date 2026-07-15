---
topic: Deep learning approaches to somatic variant calling — DeepSomatic and successors
keywords: [DeepSomatic, DeepVariant, deep learning, somatic calling, CNN, transformer, tumor-normal, variant calling, Google Health]
related: [../somatic-variant-calling.md, seqc2-somatic-benchmarks.md]
epistemics: empirical
source: "Sahraeian 2022 Nat Methods doi:10.1038/s41592-022-01542-8; Luo 2024 bioRxiv DeepSomatic preprint; Poplin 2018 Nat Biotechnol 36:983-987 doi:10.1038/nbt.4235"
source_type: preprint
asserted_at: "2026-07"
---

# Deep Learning Variant Callers (2024-2026)

## DeepSomatic (Google, 2024)

Extension of DeepVariant to somatic (tumor-normal) calling. Uses CNN-based pileup image classification, trained on synthetic tumor-normal mixtures and validated on SEQC2 truth sets.

**Performance claims:**
- SNV F1: 0.975 (vs Mutect2 0.962) on SEQC2 WGS at 60x tumor.
- Indel F1: 0.918 (vs Mutect2 0.891) — notably improved on complex indels.
- Runtime: ~4.5 hours for 60x WGS on 64 CPU cores (vs Mutect2 ~8 hours).
- GPU-accelerated mode: ~45 minutes on A100.

**Key architectural features:**
- Pileup tensor encoding: ref, alt, mapping quality, base quality, strand, read position → 7-channel image per candidate site.
- Trained on mixtures at controlled VAFs (1%, 2%, 5%, 10%, 20%, 50%) to learn VAF-specific patterns.
- Separate models for WGS, WES, and targeted panels.

## Limitations acknowledged:

- Requires matched normal (no tumor-only mode as of 2025).
- Performance on multi-allelic sites and clustered mutations (kataegis) not benchmarked.
- SV calling not addressed — DeepSV (separate effort) remains experimental.
- Training bias toward cell-line-derived truth sets; performance on primary tumors with high heterogeneity less characterized.

## Other DL approaches (2024-2025):

- **NeuSomatic 2.0** (UCSF): resolution-aware network, ~0.96 F1 SNV on DREAM challenge.
- **Clairvoyante/Clair3** (HKU): adapted for somatic with Clair3-Tumor (2024), long-read (ONT/PacBio) native.
- **DRAGEN** (Illumina): hardware-accelerated pipeline with ML-enhanced calling; claims F1 parity with DeepSomatic at 3x faster wall-clock on DRAGEN server hardware.
- **Octopus** (Oxford): haplotype-aware Bayesian caller with neural network error model, strong on indels in repetitive contexts.

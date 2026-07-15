---
topic: Somatic variant calling — the computational core of the diff stage
keywords: [somatic variant calling, Mutect2, DeepSomatic, SNV, indel, CNV, structural variant, tumor-normal, sensitivity, VAF, SEQC2]
related: [sources/seqc2-somatic-benchmarks.md, sources/deep-learning-variant-callers.md, sources/sv-calling-precision-challenge.md, ../map.md]
defines:
  somatic-variant-calling: "Computational detection of tumor-specific mutations (SNV, indel, CNV, SV) from paired tumor-normal sequencing; SNV F1 >0.96, indel ~0.89, SV precision 3-10% raw — the computable core of the diff stage"
kinds:
  somatic-variant-calling: stage
epistemics: computable
source: "SEQC2 Fang 2021 Nat Biotechnol; Xiao 2024 Nat Biotechnol; PCAWG 2020 Nature 578:82; DeepSomatic 2024"
source_type: paper
asserted_at: "2026-07"
---

# Somatic Variant Calling

[[somatic-variant-calling]] is the computational engine that turns raw sequencing reads into a catalog of tumor-specific mutations. It is the first computable step after alignment and the gate through which all downstream stages (clonality, TMB, HLA, neoantigen prediction) must pass.

## Performance Envelope (2024-2026)

**SNV/indel (solved for clinical use):**
- Best-in-class callers (Mutect2, DeepSomatic) achieve F1 >0.96 for SNVs at VAF ≥10% on WGS ≥60x. Indels lag at F1 ~0.89-0.92. Complex indels (>10bp) remain at ~0.65. These are computable: given sufficient depth and purity, sensitivity is a function of algorithm, not biology.

**Structural variants (not solved):**
- Single-caller SV precision: 3-10% raw (i.e., 90-97% false positives before filtering). Ensemble approaches (GRIDSS2 + Manta + Delly2, majority vote) reach 30-60% precision at 40-70% sensitivity for events >1kb. The fundamental limit is short-read length vs event size; long-read callers (Severus, Sniffles2) achieve F1 ~0.7 but at 3-5x cost.

**Copy number (mature but purity-dependent):**
- FACETS, ASCAT: allele-specific CN calling reliable above 30% tumor purity. Below 20% purity, all CN callers degrade and downstream CCF estimates become unreliable.

## The Diff Stage Precedes Design

Somatic variant calling produces the mutation catalog that feeds tumor mutational burden quantification, clonality inference, and neoantigen prediction — all downstream steps in the diff-to-design pipeline:

precedes:: [[tumor-mutational-burden]]
precedes:: [[neoantigen-prediction-pipeline]]

## Feeds the End-to-End Timeline

The calling step contributes a fixed compute-time component (~4-8 hours for WGS at 60x) to the pipeline's end-to-end timeline, compressible by hardware (GPU, FPGA) to under 1 hour:

feeds-into:: [[end-to-end-timeline]]

---
topic: Computational tumor purity and tumor fraction estimation — the computable gatekeeper that determines whether variant calling is reliable
keywords: [tumor purity, tumor fraction, cellularity, FACETS, PURPLE, ichorCNA, PureCN, Griffin, purity threshold, copy number, allele frequency, VAF, low-pass WGS, cfDNA triage]
related: [sources/tumor-purity-methods.md, liquid-biopsy-ctdna.md, ../diff/index.md]
defines:
  tumor-purity-estimation: "Computational estimation of neoplastic cellularity (tissue) or ctDNA tumor fraction (cfDNA) from sequencing data — the gatekeeper that determines whether downstream variant calling is reliable; minimum thresholds: ≥10% purity for SNV, ≥20% for CNV, ≥3% TF for lpWGS triage (ichorCNA)"
kinds:
  tumor-purity-estimation: method
epistemics: hybrid
source: "Shen 2016 NAR (FACETS, DOI: 10.1093/nar/gkw520); Adalsteinsson 2017 Nat Commun (ichorCNA, DOI: 10.1038/s41467-017-00965-y); Riester 2016 SCBM (PureCN, DOI: 10.1186/s13029-016-0060-z); Doebley 2023 Nat Commun (Griffin, DOI: 10.1038/s41467-023-42604-z)"
source_type: paper
asserted_at: "2026-07"
---

# Tumor Purity Estimation

[[tumor-purity-estimation]] is the computable gatekeeper between the sampling stage and reliable downstream analysis. A heterozygous SNV in a diploid region at purity p has expected VAF = p/2; at 10% purity, the expected VAF is 5%, which is near the sensitivity floor of standard callers (Mutect2, Strelka2) at 150–200× depth. Below this threshold, somatic variants are indistinguishable from sequencing errors without specialized error suppression.

## The Methods Landscape

**Tissue (paired NGS):** FACETS (Shen 2016) performs joint purity/ploidy estimation via EM on allele-specific copy number segments. It is the MSK-IMPACT clinical standard; requires purity ≥20% for CNV calling. PURPLE (Hartwig, validated on >6,000 metastatic cancers) takes WGS input and applies the same ≥20% threshold. PureCN (Riester 2016) extends this to targeted panels (~300 genes), reliable at ≥15–20%.

**cfDNA (tumor fraction):** ichorCNA (Adalsteinsson 2017) estimates tumor fraction from low-pass WGS (0.1×) via an HMM over binned read counts. LOD is ≥3% TF at 0.1× depth — below 3%, the copy number signal is indistinguishable from noise (information-theoretic limit). Griffin (Doebley 2023) uses fragmentomic nucleosome-occupancy patterns for improved sensitivity at low TF.

## The Chicken-and-Egg Problem

The actual purity of a given sample cannot be known before sequencing — it must be estimated computationally from the sequencing data itself. This creates a circular dependency: you sequence, then estimate purity, then assess whether your calls are reliable. What *is* computable: the expected VAF at a given purity/ploidy (formula), the minimum depth required for target sensitivity (binomial power calculation), and the posterior probability that an observed signal is real vs noise given the estimated purity. What is *not* computable: the true purity/TF of an unsequenced sample.

## Purity Gates Somatic Variant Calling

[[tumor-purity-estimation]] directly determines whether [[somatic-variant-calling]] can produce a reliable variant catalog. Below the purity floor, calls degrade from high-confidence somatic variants into noise — and every downstream step (TMB, clonality, neoantigen prediction) degrades with it.

gated-by:: [[liquid-biopsy-ctdna]]
feeds-into:: [[somatic-variant-calling]]
measured-by:: [[tumor-mutational-burden]]
cites:: doi:10.1093/nar/gkw520
cites:: doi:10.1038/s41467-017-00965-y

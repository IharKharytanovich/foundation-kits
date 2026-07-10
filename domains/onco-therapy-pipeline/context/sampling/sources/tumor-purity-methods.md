---
topic: Computational methods for tumor purity and tumor fraction estimation from NGS data — FACETS, PURPLE, ichorCNA, PureCN, Griffin — thresholds gating reliable variant calling
keywords: [tumor purity, tumor fraction, FACETS, PURPLE, ichorCNA, PureCN, Griffin, copy number, allele frequency, low-pass WGS, cfDNA, cellularity, ploidy, fragmentomics, purity estimation]
related: [../tumor-purity-estimation.md]
source: "Shen 2016 NAR (DOI: 10.1093/nar/gkw520); Adalsteinsson 2017 Nat Commun (DOI: 10.1038/s41467-017-00965-y); Riester 2016 Source Code Biol Med (DOI: 10.1186/s13029-016-0060-z); Doebley 2023 Nat Commun (DOI: 10.1038/s41467-023-42604-z)"
source_type: paper
epistemics: hybrid
asserted_at: "2026-07"
---

# Tumor Purity / Tumor Fraction Estimation Methods

## Why Purity Gates Variant Calling

Tumor purity determines expected VAF: a heterozygous SNV in a diploid region at purity p has expected VAF = p/2. Standard callers (Mutect2, Strelka2) lose reliable recall below ~5% VAF (150–200× depth), corresponding to ~10% purity. For ctDNA at TF=0.5%, a heterozygous variant appears at 0.25% VAF, requiring 10,000×+ depth and UMI error correction.

## FACETS

Shen R, Seshan VE. FACETS: allele-specific copy number and clonal heterogeneity analysis tool for high-throughput DNA sequencing. Nucleic Acids Res. 2016;44(16):e131. DOI: 10.1093/nar/gkw520.

- Joint segmentation of log-ratio and allele-specific log-odds-ratio from tumor-normal paired NGS.
- Estimates purity and ploidy simultaneously via expectation-maximization.
- Input: tumor + matched normal BAMs (WES or WGS).
- MSK-IMPACT clinical pipeline requires FACETS-estimated purity ≥20% for reliable CNV calling; SNV practical limit ~10%.
- Remains the standard at MSK (no major algorithmic revision 2024–2025).

## PURPLE (Hartwig Medical Foundation)

Cameron DL, et al. GRIDSS2: comprehensive characterisation of somatic structural variation. Genome Biol. 2021;22:202.

- Fits purity and ploidy from B-allele frequency and read depth ratio across the genome (WGS).
- Uses AMBER (BAF) + COBALT (read depth ratio) as inputs; joint optimization over purity/ploidy grid.
- Input: WGS tumor + normal (30×/100×).
- Validated on >6,000 metastatic cancers (Hartwig). Samples with PURPLE purity <20% flagged as low-confidence.
- Part of open-source hmftools suite; v4.0 released 2024.

## ichorCNA (cfDNA Tumor Fraction)

Adalsteinsson VA, Ha G, Freeman SS, et al. Scalable whole-genome sequencing of cell-free DNA for tumor fraction profiling. Nat Commun. 2017;8:1324. DOI: 10.1038/s41467-017-00965-y.

- Low-pass WGS (0.1–1×) of cfDNA; HMM fits binned read counts to estimate copy number → tumor fraction.
- LOD: reliably estimates TF ≥3% at 0.1× depth. Below 3%, estimates unreliable (information-theoretic limit).
- Clinical use: triage before expensive deep sequencing. If TF ≥5–10%, proceed to deep panel/WES.
- At 1× depth, sensitivity extends to ~1% TF; deeper lpWGS (5–10×) pushes to <1% but defeats cost advantage.

## PureCN (Targeted Panels)

Riester M, Singh AP, Brannon AR, et al. PureCN: copy number calling and SNV classification using targeted short read sequencing. Source Code Biol Med. 2016;11:13. DOI: 10.1186/s13029-016-0060-z.

- Designed for targeted panel data (works with ~300 genes where FACETS/PURPLE need WES/WGS).
- Uses on-target and off-target reads for purity, ploidy, allele-specific copy number.
- Can use panel-of-normals instead of matched normal.
- Reliable at purity ≥15–20%; below this, purity/ploidy solutions become degenerate.
- Used in NCI-MATCH and AACR GENIE pipeline implementations.

## Griffin (Fragmentomics, 2023)

Doebley AL, Ko M, Liao H, et al. Griffin: framework for profiling nucleosome protection in cell-free DNA. Nat Commun. 2023;14:6834. DOI: 10.1038/s41467-023-42604-z.

- Fragmentomic approach: nucleosome occupancy patterns from cfDNA fragment coverage.
- Improved sensitivity at low TF vs ichorCNA alone (does not rely solely on copy number signal).
- Complementary to copy-number-based methods; uses gene-level nucleosome footprints.

## Critical Thresholds Summary

| Analysis | Min purity/TF | Rationale |
|---|---|---|
| SNV calling (tissue WES, Mutect2) | ≥10% | Het SNV VAF=5% at this purity; below, sensitivity drops steeply at 150–200× |
| CNV calling (tissue WES) | ≥20% | Copy number signal-to-noise too low below this for FACETS/ASCAT |
| SV calling (tissue WGS) | ≥15–20% | Breakpoint reads diluted below detection |
| ctDNA targeted panel (Guardant/FMI) | ≥0.3–0.5% TF | Platform analytical validation LOD |
| ctDNA MRD (Signatera-class) | ≥0.01%/locus (~0.001% integrated) | Tumor-informed multi-locus integration |
| ichorCNA (0.1× lpWGS) | ≥3% TF | HMM cannot distinguish signal from noise below this |

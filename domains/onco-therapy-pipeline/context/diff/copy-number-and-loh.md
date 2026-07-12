---
topic: Allele-specific copy number, ploidy/whole-genome doubling, and HLA-LOH — the copy-number arm of the diff
keywords: [copy number, allele-specific, ASCAT, FACETS, Sequenza, PURPLE, purity, ploidy, whole-genome doubling, WGD, HLA-LOH, LOHHLA, DASH, immune escape, neoantigen dosage]
related: [sources/ascat-allele-specific-cn.md, sources/facets-2016.md, sources/sequenza-2015.md, sources/purple-ploidy-benchmark-2025.md, sources/bielski-2018-wgd-prognosis.md, sources/quinton-2021-wgd-vulnerabilities.md, sources/lohhla-2017.md, sources/dash-hla-loh-2022.md, sources/mhc-hammer-2024.md, clonal-architecture-inference.md, neoantigen-prediction-pipeline.md]
defines:
  copy-number-loh-analysis: "Allele-specific copy-number calling (ASCAT/FACETS/Sequenza/PURPLE) with joint tumor purity/ploidy estimation, whole-genome-doubling detection, and HLA loss-of-heterozygosity (LOHHLA/DASH/MHC Hammer); computable from tumor-normal WGS/WES but purity-gated, and it sets the copy state that clonality and neoantigen dosage depend on"
kinds:
  copy-number-loh-analysis: method
epistemics: hybrid
source: "Van Loo 2010 PNAS / Ross 2021 (ASCAT); Shen 2016 NAR (FACETS); Li 2025 Adv Sci (PURPLE benchmark); Bielski 2018 Nat Genet (WGD); McGranahan 2017 Cell (LOHHLA); Pyke 2022 Nat Commun (DASH)"
source_type: paper
asserted_at: "2026-07"
---

# Copy Number, Ploidy/WGD, and HLA-LOH

[[copy-number-loh-analysis]] is the copy-number arm of the diff: a distinct computable track that reads the tumor's dosage landscape (integer major/minor allele copy number, tumor purity, ploidy) from the same tumor-normal data as variant calling, and extends into two therapy-relevant calls — whole-genome doubling and HLA loss of heterozygosity.

## Allele-Specific CN and Purity/Ploidy (computable, purity-gated)

Allele-specific callers jointly fit depth-ratio (logR) and B-allele frequency (BAF) at germline-heterozygous SNPs to infer, per segment, integer major/minor copy number plus global purity and ploidy. Accuracy is purity-gated and tool-dependent (2025 SEQC2 benchmark, HCC1395):

- **PURPLE** — most robust bulk caller; accurate to ~20–30% purity, stable at 10× coverage, best in tumor-only mode.
- **ASCAT** — fastest, reliable at ≥50% purity, but a systematic **ploidy over-estimation ≈ +0.24**.
- **Sequenza** — validated to 30% tumor content (cellularity r=0.90 vs ASCAT).
- **FACETS** — the clinical WES/panel workhorse; purity/ploidy >90% concordant with ABSOLUTE on >10 Mb segments.
- All tools fail on euploid mixtures and on long-read data.

## Whole-Genome Doubling

WGD is *computed* downstream of purity-corrected allele-specific CN and is empirically present in **~28–36%** of tumors (Bielski 28.2% / TCGA 31%; Quinton ~36%). It is an independent adverse prognostic factor (pan-cancer HR ~1.2–1.3; up to ~3 in subtypes), a functional liability (WGD+ cells depend on **KIF18A**), and correlates with reduced immune infiltration. Because CCF/clonality math conditions on integer copy state and mutation multiplicity, a caller that mis-scales ploidy flips WGD calls and corrupts mutation timing:

feeds-into:: [[clonal-architecture-inference]]

## HLA-LOH — Gating Neoantigen Dosage

Generic CN callers cannot resolve the polymorphic HLA locus; dedicated allele-specific tools name *which* HLA allele is lost: **LOHHLA → DASH → MHC Hammer**. HLA-LOH occurs in **~40% of NSCLC** and **~18% pan-cancer** (DASH), is frequently subclonal and positively selected, and is enriched in metastasis-seeding regions. A neoantigen bound only by a lost (or, per MHC Hammer, transcriptionally repressed) allele is not truly presented, so HLA-LOH must down-weight neoantigen dosage before target selection:

feeds-into:: [[neoantigen-prediction-pipeline]]

## Honest Limits

Purity <20–30% degrades every caller; ploidy is often non-identifiable with multiple near-equal solutions needing manual curation; long-read purity/ploidy is unsolved. Critically, **DNA-only HLA-LOH under-counts antigen-presentation loss** — MHC Hammer shows transcriptional repression (35–76% of tumors) and alternative splicing require paired RNA-seq to capture, so a WGS/WES-only diff systematically overestimates presentable neoantigen dosage.

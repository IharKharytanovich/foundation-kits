---
topic: FFPE deamination artifact filtering — computational removal of formalin-fixation artifacts (C>T/G>A at low VAF) that mimic somatic mutations in tissue sequencing
keywords: [FFPE, formalin fixation, deamination, C>T artifact, strand orientation bias, FilterByOrientationBias, FFPErase, Mutect2, GATK, SOBDetector, PCAWG, DKFZ, DIN, artifact]
related: [sources/ffpe-wgs-artifacts-2025.md, liquid-biopsy-ctdna.md, ../diff/index.md]
defines:
  ffpe-artifact-filtering: "Computational removal of formalin-fixation deamination artifacts (C>T/G>A transitions at low VAF) that mimic somatic mutations — Bayesian strand-orientation-bias models (FilterByOrientationBias) remove 80–90% of artifacts with <2% true-positive loss; FFPE blocks >4 years have ~50% NGS failure rate"
kinds:
  ffpe-artifact-filtering: method
epistemics: computable
source: "Nat Commun 2025 (DOI: 10.1038/s41467-025-65654-7); Benjamin 2019 bioRxiv (DOI: 10.1101/861054); PCAWG 2020 Nature (DOI: 10.1038/s41586-020-1969-6); Costello 2013 NAR (DOI: 10.1093/nar/gks1443)"
source_type: paper
asserted_at: "2026-07"
---

# FFPE Artifact Filtering

[[ffpe-artifact-filtering]] is a computable pre-processing step that removes formalin-fixation deamination artifacts before somatic variant calling. Formalin fixation causes cytosine deamination (C>U, read as C>T after PCR; complementary G>A), producing low-VAF transitions that overlap with real somatic mutations — many cancer drivers (TP53, PIK3CA hotspots) are C>T transitions. The artifact rate is empirical (depends on fixation conditions, block age, tissue type), but the *detection and removal* of artifacts is computable through Bayesian strand-orientation-bias models.

## Quantitative Benchmarks

FFPE introduces a median 20× artifact enrichment over fresh-frozen across mutation classes (56 matched FF/FFPE pairs, Nat Commun 2025). At DIN <3 (heavily degraded), artifact rates reach 10–30 per Mb vs <0.5/Mb in fresh-frozen. FFPE blocks >4 years old have ~50% NGS success rate and ~11% amplifiable DNA fraction.

## The Computational Filters

**FilterByOrientationBias (GATK/Mutect2)** learns per-trinucleotide-context artifact priors from the sample's own read orientation data via `LearnReadOrientationModel`, then applies them as Bayesian priors in `FilterMutectCalls`. This handles both FFPE (C>T/G>A) and oxoG (G>T/C>A) artifacts in a unified framework. Performance: ~80–90% false-positive reduction on FFPE DIN 2–4, with <2% true-positive loss at VAF >5%.

**FFPErase (Nat Commun 2025)** is an ML framework using strand orientation bias, trinucleotide context, VAF, local sequencing quality, and fragment size distribution. On 56 matched pairs, it brought FFPE WGS quality to within clinical-grade thresholds — consensus calling alone was insufficient for SNV/indel artifacts.

**PCAWG pipeline** achieved 1.3/Mb FDR across 2,658 tumors (including FFPE) using multi-caller consensus + DKFZ strand/PCR/panel-of-normals filters (Nature 2020).

## FFPE Filtering Feeds Variant Calling

Without FFPE artifact removal, tissue-based [[somatic-variant-calling]] is corrupted by false C>T/G>A calls at low VAF. The artifact signature is learned empirically but applied as a computable Bayesian prior — the posterior probability that a given variant is artifact vs real is fully computable given the learned model.

feeds-into:: [[somatic-variant-calling]]
cites:: doi:10.1038/s41467-025-65654-7
cites:: doi:10.1101/861054
cites:: doi:10.1038/s41586-020-1969-6

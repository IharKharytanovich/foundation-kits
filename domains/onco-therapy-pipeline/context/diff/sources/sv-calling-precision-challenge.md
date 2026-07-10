---
topic: Structural variant calling in cancer — precision remains at 3-10% and the unsolved challenge
keywords: [structural variant, SV calling, GRIDSS2, Manta, Delly, precision, PCAWG, breakpoint, translocation, chromothripsis, sensitivity]
related: [../somatic-variant-calling.md, clonal-inference-concordance.md]
epistemics: empirical
source: "PCAWG Consortium 2020 Nature 578:82-93 doi:10.1038/s41586-019-1913-9; Cameron 2021 Nat Commun GRIDSS2 doi:10.1038/s41467-021-25348-w; Wenger 2019 Nat Biotechnol HiFi; Chaisson 2019 Nat Commun multi-platform SV"
source_type: paper
asserted_at: "2026-07"
---

# Structural Variant Calling — The Precision Challenge

## PCAWG SV Results (2020)

The Pan-Cancer Analysis of Whole Genomes (PCAWG) consortium characterized SVs across 2,658 cancers:
- Median 90 somatic SVs per genome (range 0 to >5000 in chromothripsis cases).
- No single caller achieved both >50% sensitivity AND >50% precision on multi-caller truth sets.
- Ensemble union-intersection approach required; PCAWG used ≥2/4 callers agreeing.

**SV caller concordance (PCAWG):**
- Pairwise concordance between callers (GRIDSS, Manta, SvABA, Delly): 25-45%.
- Three-way intersection: ~20% of total SV calls.
- Imprecision in breakpoint coordinates (±50bp) a major contributor to false discordance.

## Caller-Specific Performance (2021-2025 benchmarks)

**GRIDSS2 (2021, Cameron et al.):**
- Assembly-based caller; best precision on short-read data (~0.6-0.7 for deletions >50bp).
- Handles complex rearrangements (chromoplexy, chromothripsis) better than split-read-only callers.
- Runtime: ~6 hours for 60x WGS pair.

**Manta (Illumina):**
- Fast (1-2 hours), good sensitivity for deletions and inversions (>70% at size >1kb).
- Poor on insertions and duplications (<40% sensitivity).
- Does not detect breakends (BND) as well as GRIDSS.

**Delly2:**
- Balanced precision/recall for simple SVs (del/dup/inv).
- Struggles with clustered breakpoints and interchromosomal translocations.

**SvABA:**
- Local assembly approach; strong on indels 20-300bp (the "twilight zone" between indel callers and SV callers).
- Computationally expensive (~12 hours for 60x pair).

## Why SV Calling Is Fundamentally Harder

1. **No ground truth**: Unlike SNVs (cell-line mixtures, synthetic data), SV truth sets are incomplete. Long-read validation covers only a fraction.
2. **Representation problem**: Same SV can be represented differently (left-aligned vs right-aligned breakpoints, reciprocal notation).
3. **Short-read limitations**: Reads (150bp) cannot span events >insert size (~300-500bp) without split reads; complex nested events invisible.
4. **Tumor heterogeneity**: SVs at low CCF (<20%) nearly undetectable by short reads (requires >200x depth).

## Long-Read Promise (2024-2025)

- PacBio HiFi + ONT ultralong: SV sensitivity >85% (vs <50% short-read) for events >50bp.
- Severus (2024) and Sniffles2 (2023): long-read somatic SV callers achieving F1 ~0.7 on validated sets.
- Cost still 3-5x WGS short-read; not yet standard in clinical cancer genomics.
- Hybrid approaches (short-read WGS + targeted long-read of breakpoint regions) emerging.

## Precision Estimate

Conservative estimate of end-to-end SV calling precision (short-read, single caller, no filtering): **3-10%** (i.e., 90-97% of raw SV calls are false positives before filtering). After ensemble + manual review: **30-60%** precision, **40-70%** sensitivity for events >1kb.

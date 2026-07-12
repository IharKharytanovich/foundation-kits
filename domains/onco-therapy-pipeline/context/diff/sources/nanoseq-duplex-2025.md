---
topic: NanoSeq 2025 — duplex sequencing at <5 errors per billion bp, compatible with exome and panels
keywords: [NanoSeq, duplex sequencing, error rate, single molecule, somatic mutation, TwinsUK, oral epithelium, positive selection, error floor, low VAF]
related: [../alignment-and-preprocessing.md, udseq-2025.md]
epistemics: empirical
source: "Lawson ARJ, Abascal F, … Martincorena I. Somatic mutation and selection at population/epidemiological scale. Nature 2025. DOI:10.1038/s41586-025-09584-w; preprint medRxiv 2024, DOI:10.1101/2024.10.30.24316422 (verified). Original NanoSeq: Abascal 2021 Nature 593:405"
source_type: paper
asserted_at: "2026-07"
---

# NanoSeq — Duplex Sequencing Error Floor

The method that defines the achievable single-molecule accuracy floor for somatic detection, and extends duplex sequencing from WGS to **whole-exome and targeted gene panels.**

## Design & Cohort

Introduces a new version of NanoSeq (nanorate duplex sequencing) compatible with exome/panel capture; applied to a **TwinsUK cohort: 1,042 non-invasive oral-epithelium samples and 371 blood samples.** Builds on the original NanoSeq (Abascal 2021 Nature 593:405). Duplex consensus over both strands of each original molecule; mutational-signature and dN/dS-style selection analysis; multivariate exposure regression.

## Results (load-bearing)

- **Error rate < 5 errors per billion base pairs (< 5 × 10⁻⁹ per bp)** — the defining accuracy figure, enabling detection of mutations present in small numbers of cells *without clonal expansion*: sensitivity is set by molecular coverage, not a fixed VAF floor.
- In oral epithelium: **49 genes under significant positive selection**, **>62,000 driver mutations** catalogued, plus evidence of negative selection — described as "in vivo saturation mutagenesis."
- Enables simultaneous measurement of somatic mutation *rate*, *signatures*, and *driver frequencies* in polyclonal tissue.

Verbatim: *"…a duplex sequencing method with error rates <5 errors per billion base pairs, which is compatible with whole-exome and targeted gene sequencing."*

## Limitations

Duplex recovery consumes reads (single-molecule sensitivity trades throughput); targeted/exome rather than genome-wide at population scale; managed-access data; authors co-found Quotient Therapeutics (competing interest). The error floor is the enabling technology for ctDNA-like and normal-tissue detection where somatic signal is below conventional VAF limits.

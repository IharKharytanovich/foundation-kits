---
topic: Moon 2025 — pipeline choice alone swings targeted-NGS false-positive rate up to 36-fold
keywords: [DRAGEN, BWA, GATK, Mutect2, false positive, targeted NGS, pipeline, reference standard, low VAF, sensitivity, specificity, recurrent artifact]
related: [../alignment-and-preprocessing.md]
epistemics: empirical
source: "Moon Y, Kim Y-H, … Hong K-M. Evaluation of false positive and false negative errors in targeted next generation sequencing. Genome Biol 2025;26:409. DOI:10.1186/s13059-025-03882-2 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# Pipeline Choice and False-Positive Rate

A National Cancer Center Korea study showing that the *bioinformatics pipeline*, independent of the wet lab, is a dominant driver of targeted-NGS false positives — the on-topic evidence that preprocessing/calling choices set downstream precision.

## Design

Assessed targeted-NGS analytical performance using **reference-standard DNA mixtures of homozygous hydatidiform mole and heterozygous blood DNA** blended at varying ratios to create defined low-VAF ground truth, run through multiple **certified commercial NGS providers**. Raw data (SRA PRJNA1134909) were reanalyzed with **Illumina DRAGEN**, a **Geninus in-house pipeline**, and conventional **BWA + GATK Mutect2** on identical reads to isolate the software contribution.

## Results (load-bearing)

- Across certified providers, **analytical sensitivity varied up to 13.9-fold** and **false-positive error rates varied up to 615-fold.**
- On *identical raw data*, **DRAGEN and the in-house pipeline differed by up to 36.3-fold in FP error rate** — the pipeline alone drove a >30× swing.
- Compared with DRAGEN, **conventional BWA + GATK Mutect2 maintained equivalent sensitivity but produced a 4-fold increase in FP errors**, enriched for recurrent FP-prone alleles.
- **Moderately recurrent FP-prone alleles were only 5.37% of FP sites but contributed 36.7% of total FP errors.**
- Of **22 discordant calls**, **>half were not confirmed by single-base-extension assays** (likely false positives).
- Illumina's developer restatement of the same study reports FP dropping from **209.46 → 5.77 per Mb (~96.7% reduction)** and a 95% detection threshold as low as **~1–1.6% VAF at median depth 800–1000×** — flagged as industry-restated but consistent with the peer-reviewed 36.3× / 4× claims.

Verbatim: *"For identical raw data, DRAGEN and the in-house pipeline differ by up to 36.3-fold in FP error rates."*

## Limitations

Uses engineered HM/blood mixtures, not real tumors; provider identities partly blinded; no runtime benchmarking; findings concern pipeline *specificity*, not caller ML architecture per se.

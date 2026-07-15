---
topic: CASTLE 2025 — a multi-platform tumor-normal reference panel with VAF-stratified structure
keywords: [CASTLE, benchmark, tumor-normal, cell line, long read, PacBio, Nanopore, Illumina, structural variant, allele fraction, reference material, Severus]
related: [../alignment-and-preprocessing.md, giab-hg002-subclonal-2025.md]
epistemics: empirical
source: "Keskus AG, et al. Severus detects somatic structural variation / CASTLE panel. Nat Biotechnol 2025;44(2):247-257. DOI:10.1038/s41587-025-02618-8 (verified); PMC12483193"
source_type: paper
asserted_at: "2026-07"
---

# CASTLE — Cross-Platform Tumor-Normal Panel

The "Cancer Standards Long-read Evaluation" (CASTLE) panel: a truth-set/reference-material resource that adds cross-platform (short + two long-read) matched tumor-normal data on public cell lines, complementing SEQC2's short-read-centric SNV/indel focus.

## Design

**Six tumor-normal cell-line pairs** (HCC1954, H2009, HCC1937, H1437, Hs578T, HCC1395 — two lung, three breast + one additional), each sequenced across **three platforms from identical DNA extracts**: **Illumina ~100×, Oxford Nanopore R10, PacBio HiFi ~60×.** Confident calls required **≥2 of 3 technologies AND ≥4 of 11 callers** (Severus, SAVANA, nanomonsv, Sniffles2, SvABA, GRIPSS, Manta…), harmonized via Minda. Somatic SV counts 200–1,300 per line.

## Results (load-bearing)

- Median SV **F1 by platform**: Severus ONT 0.86 / PacBio 0.86 (range 0.79–0.90); nanomonsv 0.76 / 0.79; SAVANA 0.76 / 0.77.
- **VAF/allele-fraction structure documented:** most lines show SV allele fractions evenly distributed 0–0.5 (subclonality + aneuploidy); **HCC1954 and Hs578T carry elevated subclonal burden (<0.25 VAF)** — usable for VAF-stratified evaluation.

Verbatim: *"This represents a tradeoff between the completeness of the benchmark and the practicality of its generation."*

## Limitations

The ensemble-of-callers truth strategy *"may miss rare variants or variants with unusual patterns"* (authors). Value beyond SEQC2: cross-platform matched tumor-normal reference data on public cell lines with a documented VAF structure for stratified benchmarking.

---
topic: SEQC2 consortium multi-center somatic variant calling benchmarks
keywords: [SEQC2, somatic variant calling, Mutect2, benchmarking, SNV, indel, sensitivity, specificity, reproducibility, multi-center]
related: [../somatic-variant-calling.md]
epistemics: empirical
source: "Fang 2021 Nat Biotechnol 39(9):1151-1160 doi:10.1038/s41587-021-00993-6; Xiao 2024 Nat Biotechnol 42:1343-1354 doi:10.1038/s41587-023-01817-x"
source_type: paper
asserted_at: "2026-07"
---

# SEQC2 Somatic Variant Calling Benchmarks

The FDA-led Sequencing Quality Control 2 (SEQC2) consortium established reference tumor-normal pairs (derived from well-characterized cell lines) and benchmarked somatic variant calling across multiple centers, sequencing platforms, and bioinformatics pipelines.

## Key Findings (2021-2024)

**SNV calling performance:**
- Best-in-class callers (Mutect2, Strelka2, SomaticSniper ensemble) achieve sensitivity >95% for SNVs at VAF ≥10% with WGS at ≥60x tumor depth.
- At low VAF (<5%), sensitivity drops sharply: ~70-80% for SNVs, ~55-65% for indels.
- Precision (positive predictive value) ranges 95-99% for SNVs when tumor purity >40%.

**Indel calling:**
- Indel sensitivity systematically lower: ~85-92% for indels 1-10bp at VAF ≥10%.
- Complex indels (>10bp) detected at ~60-75% sensitivity.
- Homopolymer-context indels remain problematic (false positive rate 2-5x higher).

**Cross-center reproducibility:**
- Concordance across centers 89-94% for SNVs (same pipeline, different sequencing).
- Different pipeline choices on same data: concordance drops to 78-85%.
- Depth normalisation and variant allele frequency thresholds are the main drivers of discordance.

**Sequencing depth requirements (SEQC2 recommendations):**
- ≥80x tumor, ≥40x normal for reliable detection at VAF ≥5%.
- ≥200x tumor for subclonal variants at VAF 2-5%.
- Panel sequencing (targeted, ~500 genes) achieves >500x and enables TMB estimation but misses noncoding and structural events.

## SEQC2 Phase II (2024 update)

Expanded benchmarking to FFPE samples and ctDNA-like dilutions:
- FFPE-induced artefacts (C>T deamination) increase false positives 3-8x without dedicated filters (OxoG/FFPE filter in GATK).
- At 1% VAF (ctDNA-like), sensitivity falls to 20-40% for SNVs; UMI-based error correction recovers to ~60-70%.
- Multi-caller ensemble (union of 3+ callers with intersection voting) improves F1 by 3-7% over any single caller.

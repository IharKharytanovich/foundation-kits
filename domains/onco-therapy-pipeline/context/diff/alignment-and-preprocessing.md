---
topic: Read alignment, low-VAF error suppression, and somatic truth sets — the first computable block of the diff
keywords: [alignment, preprocessing, BWA-MEM2, DRAGEN, BQSR, UMI, duplex sequencing, NanoSeq, FFPE, deamination, error floor, truth set, GIAB, CASTLE, low VAF]
related: [sources/moon-2025-dragen-fp.md, sources/nanoseq-duplex-2025.md, sources/udseq-2025.md, sources/steiert-2023-ffpe-artifacts.md, sources/giab-hg002-subclonal-2025.md, sources/castle-tumor-normal-benchmark-2025.md, sources/guille-2025-caller-ensemble-benchmark.md, somatic-variant-calling.md]
defines:
  read-alignment-preprocessing: "Alignment (BWA-MEM2/DRAGEN/minimap2) plus duplicate marking, BQSR, UMI/duplex consensus and FFPE-artifact filtering that precede somatic calling; computable and mature on speed, but the pipeline choice itself swings false-positive rate up to 36-fold and the sub-5% VAF error floor (~2.5–5e-9 with duplex) is the binding constraint on ground truth"
kinds:
  read-alignment-preprocessing: stage
epistemics: computable
source: "Moon 2025 Genome Biol (DRAGEN vs BWA+GATK FP); Lawson 2025 Nature (NanoSeq); Steiert 2023 NAR (FFPE); Daniels 2025 Cell Genomics (GIAB HG002 subclonal)"
source_type: paper
asserted_at: "2026-07"
---

# Alignment, Low-VAF Suppression, and Truth Sets

[[read-alignment-preprocessing]] is the first computable block of the diff, and by 2024–2026 it is a solved-speed / bounded-accuracy problem where the frontier has shifted to the *error floor* and to benchmark ground truth at the lowest VAFs. It sits strictly ahead of somatic calling and now materially *sets* downstream precision:

precedes:: [[somatic-variant-calling]]

## Pipeline Choice Sets False-Positive Rate

Hardware/optimized pipelines (DRAGEN, Parabricks; BWA-MEM2 as an output-equivalent, architecture-aware BWA-MEM replacement) collapse whole-genome secondary analysis to hours-to-minutes. Crucially, the *pipeline itself* — not just the wet lab — moves false positives by up to **36.3-fold on identical reads** (Moon 2025), and a conventional BWA+GATK-Mutect2 pipeline produces **~4× more FPs than DRAGEN at equivalent sensitivity**. Preprocessing is therefore the first cost/latency block and a precision determinant:

feeds-into:: [[end-to-end-timeline]]

## The Low-VAF Error Floor

Duplex methods now reach **~2.5–5 × 10⁻⁹ errors/bp** genome-wide (NanoSeq <5×10⁻⁹, corroborated by UDSeq ≈2.5×10⁻⁹; older panel duplex sat at ~1–2×10⁻⁷). This pushes the detection limit below somatic signal *without* clonal expansion — the enabling technology for ctDNA-like and normal-tissue detection — at the cost of heavy read consumption and no large-SV visibility.

## FFPE — The Honest Weak Point

Formalin deamination inflates C>T/G>A artifacts (~7× vs fresh-frozen; single-source multiple) to allele fractions **>10%** that mimic true low-VAF calls, only partly rescued by orientation-bias/FilterMutectCalls (~98% / 58-fold alone; 250–400-fold with 5–10% VAF filters), UMI-consensus at 5,000–7,500×, and enzymatic repair.

## Truth Sets Beyond SEQC2

2023–2025 delivered concrete new resources — GIAB's HG002 subclonal benchmark (**85 SNVs at AF>5% over 2.45 Gbp**, validated by 8 groups) and CASTLE's **six cross-platform tumor-normal cell-line pairs** — but both are explicitly incomplete: floored at ~5% VAF, SNV/SV-focused, cell-line-biased, and subject to clonal-drift VAF discrepancies. The binding constraint is ground truth precisely in the sub-5% VAF / indel / FFPE regime that clinical ctDNA most needs; no load-bearing foundation-model result touching alignment/calling surfaced for 2024–2026.

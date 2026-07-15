---
topic: UDSeq 2025 — universal duplex sequencing and a cross-method duplex error-floor comparison
keywords: [UDSeq, duplex sequencing, error rate, UMI, whole genome, exome, panel, NanoSeq, CODEC, minimal input, somatic mutation]
related: [../alignment-and-preprocessing.md, nanoseq-duplex-2025.md]
epistemics: empirical
source: "Nandi SP, Cheng Y, Al-Azzam S, et al. A Universal Duplex Sequencing Approach for Accurate Detection of Somatic Mutations. bioRxiv 2025.09.14.676103. DOI:10.1101/2025.09.14.676103 (preprint — not peer-reviewed)"
source_type: preprint
asserted_at: "2026-07"
---

# UDSeq — Universal Duplex Sequencing

A duplex protocol combining random fragmentation + efficient UMI ligation + quantitative input control for WGS, exome, and panel somatic detection from minimal input. Included here mainly for its **cross-method error-floor comparison table**, which anchors the achievable duplex accuracy across the field. Flag: preprint, not peer-reviewed.

## Design

Validated on human sperm (n=8, ages 19–70), carcinogen-exposed cell lines (4NQO, aristolochic acid-I, NNK, UVR), in-vivo mouse/rat models, multi-species samples, and a 70-year-old donor's tissues.

## Results (load-bearing)

- **Error rate ≈ 2.5 × 10⁻⁹ per bp** (≈2.5 errors/billion), in the same regime as NanoSeqV2.
- **Minimum input 100 pg; ≥95% genome/exome coverage; ~90× WGS from 0.2 fmol input at 15 PCR cycles; up to 4-fold more usable library than NanoSeqV2** from equal input (p=0.00022).
- Cross-method error-floor table (the central contribution): **DupSeq 2×10⁻⁷; BotSeqS 2×10⁻⁷; NanoSeqV1/V2 5×10⁻⁹; HiDEF-seq 4.3×10⁻⁹; CODEC 1×10⁻⁷; UDSeq 2.5×10⁻⁹** — anchoring genome-wide duplex at **~2.5–5×10⁻⁹** vs **~1–2×10⁻⁷** for older panel duplex (~40–80× spread).
- Signature concordance: aristolochic-acid cosine 0.98; sperm aging SBS1/SBS5 cosine 0.92; sperm accumulation 1.58 SBS/year.

Verbatim: *"UDSeq uniquely enables ultra-accurate, single-molecule somatic mutation detection across species, with support for whole-genome coverage or targeted panels—even from limited input material."*

## Limitations

Cannot detect large SVs/CNAs/rearrangements (short-read duplex constraint); preprint; VAF floor not stated explicitly (sensitivity governed by duplex depth, not a fixed VAF).

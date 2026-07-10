---
topic: PCAWG and SEQC2 benchmarking of somatic variant calling — structural variant precision and subclonal discordance
keywords: [PCAWG, SEQC2, structural variant, SV, precision, recall, subclone, discordance, benchmark, somatic, DeepSomatic, variant calling, WGS]
related: [../diff-quality.md, ../../diff/somatic-variant-calling.md, ../../diff/clonal-architecture-inference.md]
source: "PCAWG Campbell et al. 2020 Nature 578:82 doi:10.1038/s41586-019-1913-9; Dentro et al. 2021 Cell Syst 12:120 doi:10.1016/j.cels.2020.11.008; SEQC2 Fang et al. 2021 Nat Biotechnol 39:1151 doi:10.1038/s41587-021-00993-6; Xiao et al. 2024 Nat Biotechnol (DeepSomatic)"
source_type: paper
epistemics: empirical
asserted_at: "2026-07"
---

# PCAWG and SEQC2 Somatic Variant Benchmarks

The PCAWG pan-cancer analysis (Campbell et al. 2020, 2658 tumors across 38 cancer types) established the first large-scale truth set for somatic variant calling. Key findings relevant to the diff-quality wall:

**Structural variants (SVs):** Raw SV caller precision is 3-10% across callers (PCAWG 2020). Even after ensemble filtering, false-discovery rates remain high for complex SVs (chromothripsis, breakage-fusion-bridge). The SEQC2 consortium (Fang et al. 2021) confirmed SNV F1 >0.96 and indel F1 ~0.89, but SV detection remains the weakest link in the somatic pipeline.

**Subclonal architecture discordance:** Dentro et al. 2021 (PCAWG subclonal reconstruction) showed 19-35% algorithm-dependent discordance in subclonal architecture across 11 callers on the same tumors. The number of subclones, their cellular prevalence, and the assignment of mutations to subclones all varied substantially. At <10% cancer cell fraction (CCF) or <30% tumor purity, subclonal inference becomes unreliable.

**DeepSomatic (2024):** Xiao et al. 2024 introduced a deep-learning somatic caller that improved indel sensitivity by ~15% over Mutect2 in difficult regions (low-complexity, tandem repeats), but SV precision gains were modest. The fundamental limit is that SVs span multiple reads and require long-read or linked-read data for breakpoint-level resolution.

These benchmarks define the analytical floor of the diff stage: SNVs are reliably computable, but SVs and subclonal architecture remain empirical bottlenecks with algorithm-dependent results.

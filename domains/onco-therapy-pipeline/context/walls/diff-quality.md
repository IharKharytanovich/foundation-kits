---
topic: The diff-quality wall — analytical precision limits that gate the entire downstream pipeline
keywords: [diff quality, structural variant, SV precision, subclone, discordance, CHIP, FFPE, false positive, variant calling, analytical floor, ctDNA, VAF]
related: [sources/pcawg-sv-benchmarks.md, sources/chip-false-positives.md, ../diff/somatic-variant-calling.md, ../diff/clonal-architecture-inference.md, ../sampling/liquid-biopsy-ctdna.md]
defines:
  diff-quality-wall: "The analytical precision floor of the diff stage — SV precision 3-10%, subclonal architecture 19-35% algorithm-dependent, ctDNA detection limited to 0.01-0.1% VAF, FFPE artifacts and CHIP false positives — that propagates uncertainty into every downstream design and efficacy decision"
kinds:
  diff-quality-wall: constraint
epistemics: empirical
source: "PCAWG Campbell 2020 Nature; Dentro 2021 Cell Syst; SEQC2 Fang 2021 Nat Biotechnol; Razavi 2019 Nat Med (CHIP 5.2%)"
source_type: paper
asserted_at: "2026-07"
---

# The Diff-Quality Wall

The diff stage is the computational core of the pipeline, but its analytical precision sets a floor that propagates into every downstream decision. [[diff-quality-wall]] is a compound constraint: SNV calling is reliable (F1 >0.96), but three classes of variant — structural variants, subclonal architecture, and low-VAF ctDNA variants — remain empirically unreliable.

**Structural variant precision** is 3-10% raw across callers (PCAWG 2020). Complex SVs (chromothripsis, BFB cycles) that drive many solid tumors are the worst-detected class. [[somatic-variant-calling]] handles SNVs computably, but SV detection remains the weakest analytical link.

**Subclonal architecture discordance** reaches 19-35% across algorithms on the same tumors (Dentro et al. 2021). [[clonal-architecture-inference]] below 10% cancer cell fraction or 30% purity is unreliable, yet these subclones carry the resistant variants that drive relapse.

**ctDNA detection limits** (0.01-0.1% VAF) and **CHIP contamination** (5.2% of patients affected without matched WBC filtering; Razavi 2019) set a biological false-positive floor that cannot be addressed computationally. [[liquid-biopsy-ctdna]] at low tumor fractions is dominated by CHIP-derived variants that overlap with cancer driver genes.

The diff-quality wall gates the design stage because uncertain variant calls produce uncertain neoantigen candidates or editing targets:

blocks:: [[neoantigen-prediction-pipeline]]
blocks:: [[genetic-targeting-design]]
rate-limits:: [[personalized-therapy-throughput]]

The wall is partially bypassed by orthogonal validation (RNA-seq expression confirmation, phased long-read sequencing) but not broken — the fundamental precision limits of short-read WGS for SVs and subclonal inference are physics, not software.

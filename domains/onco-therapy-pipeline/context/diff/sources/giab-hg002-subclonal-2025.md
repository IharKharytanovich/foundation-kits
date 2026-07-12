---
topic: GIAB HG002 subclonal benchmark 2025 — a somatic/mosaic truth set beyond SEQC2
keywords: [GIAB, HG002, subclonal, mosaic, benchmark, truth set, NIST, Strelka2, allele fraction, reference material, somatic SNV]
related: [../alignment-and-preprocessing.md, castle-tumor-normal-benchmark-2025.md]
epistemics: empirical
source: "Daniels CA, … Zook JM, Olson ND. Characterization of subclonal variants in HG002 Genome in a Bottle reference material as a resource for benchmarking variant callers. Cell Genomics 2025;6(4):101104 (PMID 41421359); preprint bioRxiv 2024.12.02.625685. DOI:10.1016/j.xgen.2025.101104 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# GIAB HG002 Subclonal Benchmark

The first GIAB somatic/mosaic benchmark on the widely used HG002 reference material — a NIST-grade truth set for low-VAF SNV calling, complementary to SEQC2.

## Design

Treated HG002 (son) as "tumor" and combined parental HG003+HG004 as "normal," ran **Strelka2** on **300× short-read WGS** of the Ashkenazi Jewish trio, then filtered/curated/validated across orthogonal platforms. Depth by platform: Illumina 300×; BGI 100×; Element 136×; PacBio HiFi 106×. Initial 366,728 candidates → heuristics → manual curation (135 assessed).

## Results (load-bearing)

- Final benchmark: **85 high-confidence subclonal SNVs with allele fraction > 5%**, over a **2.45 Gbp benchmark region (89.5% of GRCh38 autosomes).** Lowest VAF stratum = **5%** (assay-limited). Indels excluded.
- External validation by **8 independent somatic-calling groups: ≥87% of benchmark variants detected** in high-coverage short/long-read callsets.
- Clinical relevance: 13/85 (~15%) in medically relevant genes; regions cover >90% of bases in 3,871 such genes.
- Key caveat quantified: **VAFs of the same mosaic variants differ between NIST RM (RM 8391) and Coriell non-RM (NA24385)** batches (clonal drift) — reference-material DNA is essential.

Verbatim: *"…a benchmark set with 85 high-confidence subclonal single-nucleotide variants (SNVs) (allele frequency > 5%) and a benchmark region covering 2.45 Gbp of the autosomes."*

## Limitations

Variants <5% VAF excluded (assay sensitivity); SNV-only; one true mosaic variant missed (coincided with paternal germline). A related GIAB effort (McDaniel 2024, bioRxiv) is building a broadly-consented matched tumor-normal pair. The gap remains ground truth below 5% VAF — exactly the ctDNA regime.

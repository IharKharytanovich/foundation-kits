---
topic: HLA typing from next-generation sequencing — tool accuracy and clinical-grade performance
keywords: [HLA typing, OptiType, HLA-HD, T1K, arcasHLA, HLA-LA, MHC, class I, class II, neoantigen, NGS, accuracy]
related: [../neoantigen-prediction-pipeline.md]
epistemics: empirical
source: "Szolek 2014 Bioinformatics OptiType doi:10.1093/bioinformatics/btu548; Kawaguchi 2017 Hum Mutat HLA-HD doi:10.1002/humu.23230; Bauer 2023 Genome Med T1K doi:10.1186/s13073-023-01208-6; Orenbuch 2020 Bioinformatics arcasHLA doi:10.1093/bioinformatics/btz474"
source_type: paper
asserted_at: "2026-07"
---

# HLA Typing from NGS Data (2024-2026)

## Tool Landscape

HLA typing is a prerequisite for peptide-MHC binding prediction and neoantigen prioritization. Current tools infer HLA alleles from WGS/WES/RNA-seq reads aligned to the MHC region.

**Leading tools and accuracy (4-digit resolution, Class I):**

| Tool | Input | Class I Accuracy | Class II Accuracy | Runtime |
|------|-------|-----------------|-------------------|---------|
| OptiType | WGS/WES/RNA | 99.2-99.7% | Not supported | ~5 min |
| HLA-HD | WGS/WES | 99.0-99.5% | 95-97% | ~15 min |
| T1K (2023) | WGS/WES/RNA/scRNA | 99.5-99.8% | 97-99% | ~3 min |
| arcasHLA | RNA-seq | 98.5-99.3% | 94-96% | ~8 min |
| HLA-LA | WGS (graph) | 98.8-99.4% | 96-98% | ~60 min |

**Key points:**
- Class I (HLA-A, -B, -C) typing is effectively solved: all tools >98.5% at 4-digit (protein-level) resolution on standard WES/WGS.
- Class II (HLA-DR, -DP, -DQ) harder due to polymorphism complexity and pseudogene homology; accuracy 94-99% depending on tool and locus.
- RNA-seq-based typing captures only expressed alleles; loss-of-heterozygosity (LOH) at HLA detectable from WGS/WES but not RNA.

## Clinical Grade Requirements

- FDA/CAP requires concordance with PCR-SSO or Sanger as orthogonal validation for clinical HLA typing.
- 6-digit (allele-level) resolution needed for some applications (transplant); 4-digit sufficient for neoantigen prediction.
- IPD-IMGT/HLA database (v3.54, 2024): >36,000 HLA alleles; tools must update reference databases regularly.

## T1K (2023) — Current State of the Art

- Kmer-based approach; does not require alignment to a single reference.
- Handles novel alleles (not in database) by reporting closest known + variant.
- Validated on 1000 Genomes + HapMap (n=1,267): 99.7% Class I, 98.6% Class II concordance with clinical typing.
- Uniquely supports single-cell RNA-seq (10x Genomics) for per-cell HLA typing.

## Tumor-Specific Considerations

- Somatic HLA LOH in 15-40% of tumors (McGranahan 2017 Cell): reduces neoantigen presentation capacity.
- HLA somatic mutations (missense, frameshift) in ~3-5% of tumors: can abolish antigen presentation on affected allele.
- LOHHLA tool (McGranahan 2017) detects allele-specific LOH from tumor WES; integrates into neoantigen pipelines.
- Tumor HLA genotype = germline genotype minus LOH/mutations; clinical pipelines must check both.

## Impact on Neoantigen Prediction

- HLA typing error propagates multiplicatively: wrong HLA allele → wrong binding predictions for all peptides on that allele.
- At 99.5% accuracy for 6 Class I alleles: ~3% chance of ≥1 allele error per patient → 3% of patients get partially wrong neoantigen rankings.
- Consensus approach (OptiType + HLA-HD agree → high confidence) used in clinical-grade pipelines (pVACseq default).

---
topic: LOHHLA — allele-specific HLA loss and immune escape in lung cancer evolution
keywords: [LOHHLA, HLA-LOH, loss of heterozygosity, immune escape, TRACERx, NSCLC, neoantigen, subclonal, APOBEC, PD-L1, allele-specific]
related: [../copy-number-and-loh.md, dash-hla-loh-2022.md, mhc-hammer-2024.md, ../neoantigen-prediction-pipeline.md]
epistemics: empirical
source: "McGranahan N, … Swanton C; TRACERx Consortium. Allele-Specific HLA Loss and Immune Escape in Lung Cancer Evolution. Cell 2017;171(6):1259-1271.e11. DOI:10.1016/j.cell.2017.10.001 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# LOHHLA — Allele-Specific HLA Loss

The tool that made HLA loss-of-heterozygosity measurable from NGS, and the study establishing it as a common, selected immune-escape event. Generic CN callers cannot resolve the polymorphic HLA locus; LOHHLA builds a patient-specific HLA reference and infers haplotype-specific copy number, naming *which* allele is lost.

## Method

Five steps: extract HLA-mapping reads → build patient-specific HLA reference from typed alleles → map reads to allele-specific references → compute allele-specific logR and BAF against the germline → infer haplotype-specific integer CN.

## Design & Cohort

**288 tumor regions from 96 TRACERx NSCLC patients** (multiregion WES) plus **37 NSCLC primary + matched brain-metastasis pairs** (Brastianos). Comparator: ASCAT.

## Results (load-bearing)

- **HLA LOH in 40% of NSCLC.**
- LOHHLA vs ASCAT: minor/major-allele CN highly correlated (**Spearman ρ=0.70, p=1.36×10⁻¹¹⁵**); **concordant allelic imbalance in 246/288 regions**; LOHHLA uncovered additional imbalance ASCAT missed and names the lost allele.
- **Frequently subclonal/late:** e.g. 13/17 cases in one analysis; brain-met cohort **17/37 (46%)** with LOH, subclonal in **11/17 (65%)**. Metastasis enrichment: HLA LOH rose **from 27% (primary) to 43% (brain metastasis)** (p=0.08, McNemar).
- **Positive selection:** focal HLA LOH significantly more frequent than simulation expectation.
- **Immune correlates:** HLA LOH associated with high subclonal neoantigen burden, APOBEC mutagenesis, elevated cytolytic activity, and PD-L1 positivity.

Verbatim: *"Using LOHHLA, we find that HLA LOH occurs in 40% of non-small-cell lung cancers (NSCLCs) and is associated with a high subclonal neoantigen burden, APOBEC-mediated mutagenesis, upregulation of cytolytic activity, and PD-L1 positivity."*

## Limitations

No orthogonal gold standard for haplotype-specific HLA CN (ASCAT cannot resolve the locus); requires adequate HLA-region coverage; brain-met trend not significant (small n). Therapeutic consequence: a neoantigen bound only by a lost allele is not truly presented — HLA-LOH must refine neoantigen prediction.

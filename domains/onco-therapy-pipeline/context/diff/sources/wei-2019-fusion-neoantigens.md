---
topic: Wei 2019 — pan-cancer landscape of gene-fusion neoantigens, abundant but individually weak
keywords: [fusion neoantigen, gene fusion, novel ORF, pan-cancer, TCGA, MHC binding, immunogenic potential, personalized vaccine, breakpoint]
related: [../rna-and-noncanonical-neoantigens.md, haas-2019-fusion-detection-benchmark.md]
epistemics: empirical
source: "Wei Z, Zhou C, Zhang Z, Guan M, Zhang C, Liu Z, Liu Q. The Landscape of Tumor Fusion Neoantigens: A Pan-Cancer Analysis. iScience 2019;21:249-260. DOI:10.1016/j.isci.2019.10.028 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# Fusion Neoantigen Landscape

A pan-cancer TCGA analysis of gene-fusion-derived neoantigens with a quantitative scoring scheme, comparing fusion vs SNV/indel neoantigen properties.

## Method

Fusion calls → fusion ORF reconstruction → junction-spanning peptides (9–11mers) → MHC-I binding/immunogenicity scoring, across ~6,500 TCGA samples.

## Results

- Fusions generate **novel ORFs that produce more candidate neoantigens per event than SNV/indel mutations** (multiple neo-peptides per breakpoint), broadly distributed across cancers.
- However, **most recurrent fusion neoantigens have low individual immunogenic potential.**

(Specific totals from automated extraction — e.g. "67,502 fusions," "3,161 patients / 48.2%," "25 fusions/sample" — are flagged as approximate and were not independently reverified against the text/figures.)

Verbatim: *"fusions are able to create novel open reading frames, generating more candidate neoantigens than SNV&indel mutations"*; but *"they usually have extremely low immunogenic potentials, suggesting that vaccination-based cancer immunotherapy must be personalized."*

## Limitations

Only 9–11mers considered; fusion expression level not modeled; in-silico only. Net: fusions widen the antigen pool but demand per-patient prioritization — abundance without per-event potency.

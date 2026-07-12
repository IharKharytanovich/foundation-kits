---
topic: NetMHCpan-4.1 — near-ceiling MHC-I antigen presentation prediction
keywords: [NetMHCpan, MHC-I presentation, eluted ligand, mass spec, FRANK, PPV, NNAlign_MA, epitope ranking, binding affinity, HLA]
related: [../immunogenicity-prediction-models.md, mhcflurry-2-0-presentation.md]
epistemics: empirical
source: "Reynisson B, Alvarez B, Paul S, Peters B, Nielsen M. NetMHCpan-4.1 and NetMHCIIpan-4.0. Nucleic Acids Res 2020;48(W1):W449-W454. DOI:10.1093/nar/gkaa379 (verified); PMID 32406916"
source_type: paper
asserted_at: "2026-07"
---

# NetMHCpan-4.1 — MHC-I Presentation

The reference pan-specific MHC-I presentation predictor and the anchor for the claim that antigen presentation is essentially solved.

## Design

Training set: **13,245,212 data points across 250 MHC-I molecules**, integrating binding-affinity (BA) and mass-spec eluted-ligand (EL) data, including multi-allele peptidomes deconvoluted by the **NNAlign_MA** neural framework. Output is an ensemble-ANN %Rank score. Two held-out benchmarks: a CD8+ epitope benchmark scored by FRANK (fraction of source-protein peptides ranked above the true epitope; 0 = perfect, 0.5 = random) and an MS EL single-allele benchmark scored by AUC/PPV. Comparators: NetMHCpan-4.0, MixMHCpred, MHCflurry, MHCflurry_EL.

## Results (load-bearing)

- Median **FRANK = 0.00220** (v4.1) vs 0.00230 (v4.0), 0.00264 (MixMHCpred), 0.00383 (MHCflurry) — the true epitope typically ranks within the top ~0.2% of source-protein peptides.
- On MS presentation, median **PPV = 0.8291** (v4.1) vs 0.7940 (v4.0), 0.7911 (MixMHCpred), 0.7256 (MHCflurry).
- MHC-II companion (NetMHCIIpan-4.0): median FRANK 0.0351.

Verbatim: *"Both methods exploit tailored machine learning strategies to integrate different training data types, resulting in state-of-the-art performance and outperforming their competitors."*

## Limitations

Performance depends on per-allele EL/MS coverage; rare alleles rely on pan-specific extrapolation; **predicts presentation, not TCR recognition/immunogenicity** — the paper's own boundary. This is the necessary-but-not-sufficient upstream step before immunogenicity.

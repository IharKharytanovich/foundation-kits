---
topic: MHCflurry 2.0 — antigen-processing-aware MHC-I presentation prediction
keywords: [MHCflurry, MHC-I presentation, antigen processing, eluted ligand, PPV, monoallelic, cleavage, binding affinity, mass spec, HLA]
related: [../immunogenicity-prediction-models.md, netmhcpan-4-1-presentation.md]
epistemics: empirical
source: "O'Donnell TJ, Rubinsteyn A, Laserson U. MHCflurry 2.0: Improved Pan-Allele Prediction of MHC Class I-Presented Peptides by Incorporating Antigen Processing. Cell Syst 2020;11(1):42-48.e7. DOI:10.1016/j.cels.2020.06.010 (verified); PMID 32711842"
source_type: paper
asserted_at: "2026-07"
---

# MHCflurry 2.0 — Processing-Aware Presentation

Combines a binding-affinity predictor with a novel **allele-independent antigen-processing (AP)** predictor that learns residual N-/C-terminal cleavage signals from MS ligands after controlling for binding, combined into a **presentation score (PS)**. Demonstrates that presentation is a mature, incrementally-improving problem.

## Design

Two neural nets combined by logistic regression. Benchmarks: a MULTIALLELIC set and a MONOALLELIC set of **100 single-allele MS experiments** (92 from Sarkizova 2020 + 8 from Abelin 2019). Comparators: NetMHCpan-4.0 BA/EL, MixMHCpred 2.0.2. PPV computed over n hits + 99n decoys (random baseline PPV 0.01).

## Results (load-bearing)

- BA predictor reached **AUC ≥ 0.90 on 214/236 alleles (91%).**
- The integrated PS lifted PPV by **+120% (65–184) over NetMHCpan-4.0 BA; +56% (22–95) over NetMHCpan-4.0 EL; +41% (22–64) over MixMHCpred 2.0.2; +51% (29–78) over MHCflurry BA.**
- Flanking sequences added a further +2.1%.

Verbatim (abstract): *"at least a 40% increase in positive predictive value (PPV) for all comparisons."*

## Limitations

Models presentation only (MS-defined); no immunogenicity/TCR modeling; depends on MS training coverage. Together with NetMHCpan-4.1, establishes that antigen presentation is mature and incrementally improving — the upstream half that the immunogenicity models depend on.

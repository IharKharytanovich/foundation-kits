---
topic: Immunogenicity prediction models — presentation is computable, T-cell recognition is not
keywords: [immunogenicity prediction, NetMHCpan, MHCflurry, PRIME, BigMHC, DeepImmuno, pMTnet, NetTCR, TITAN, TCR recognition, presentation, TESLA, neoantigen ranking]
related: [sources/netmhcpan-4-1-presentation.md, sources/mhcflurry-2-0-presentation.md, sources/prime-immunogenicity-models.md, sources/bigmhc-2023.md, sources/deepimmuno-2021.md, sources/itsndb-immunogenicity-benchmark-2023.md, sources/pmtnet-tcr-2021.md, sources/tcr-generalization-collapse.md, sources/tesla-2020-neoantigen-validation.md, sources/parkhurst-2019-neoantigen-rate.md, neoantigen-prediction-pipeline.md]
defines:
  immunogenicity-prediction-model: "Computational models attacking the gap between predicted MHC presentation (solved, PPV≈0.83) and actual T-cell immunogenicity (near-random, AUC 0.52-0.60); presentation predictors and immunogenicity/TCR-recognition predictors, the latter collapsing to ~0.5 AUC on unseen epitopes — they refine neoantigen ranking but do not close the immunogenicity wall"
kinds:
  immunogenicity-prediction-model: method
epistemics: hybrid
source: "Reynisson 2020 NAR (NetMHCpan-4.1); Albert 2023 Nat Mach Intell (BigMHC); Gfeller 2023 Cell Syst (PRIME2.0); Wells 2020 Cell (TESLA); Grazioli 2022 Front Immunol (TCR generalization)"
source_type: paper
asserted_at: "2026-07"
---

# Immunogenicity Prediction Models

[[immunogenicity-prediction-model]] research has hardened into a clear asymmetry: **MHC-I antigen presentation is computationally mature, but T-cell immunogenicity and TCR recognition remain largely empirical.** These models refine the ranking inside the neoantigen pipeline but do not solve the wall:

refines:: [[neoantigen-prediction-pipeline]]

## Presentation — The Well-Solved Half

Presentation predictors train on millions of mass-spec data points (NetMHCpan-4.1: 13.2M points / 250 alleles; BigMHC: ~288k eluted ligands) and reach near-ceiling accuracy — median **PPV ≈ 0.83** and epitope-ranking FRANK ≈ 0.002 for NetMHCpan-4.1, AUROC 0.9733 for BigMHC. "Will this peptide be displayed on HLA" is effectively solved and now only incrementally improved (MHCflurry's +40–120% PPV from modeling antigen processing).

## Immunogenicity — Data-Starved and Near-Random

The immunogenicity half is starved of data by 3–4 orders of magnitude: PRIME2.0 trained on 596 verified immunogenic neo-epitopes vs 384,070 presentation examples. The field's own honest benchmark (ITSNdb) pins **every** immunogenicity predictor at **AUC 0.52–0.60** when asked to separate immunogenic from merely-presented peptides — near-random. The models deliver a *refinement of ranking precision at the top of the list* (BigMHC lifts neoepitope PPV from ~0.26 to 0.44, ~1.66×; top-9 all immunogenic), not a solution. This wall is empirical:

gated-by:: [[neoantigen-immunogenicity]]

## TCR Recognition — The Generalization Collapse

TCR–pMHC predictors (pMTnet, NetTCR-2.0, TITAN, ERGO) post AUCs of 0.85–0.98 on *seen* epitopes but collapse to **AUROC ≈ 0.50–0.62 (near-random) on unseen epitopes** — reproduced by Grazioli (2022), Moris (2021), Deng (2023), Dens (2023) and traced to CDR3 memorization, epitope leakage, and synthetic-negative bias. Recognition of a genuinely novel neoantigen is not yet computable.

## The Empirical Anchor

Only a small single-digit fraction of predicted neoantigens are T-cell–reactive: TESLA's **6% (37/608)** of top-ranked tested candidates, Parkhurst's **1.6%** over all screened mutations, and Müller/Ketelaars's ≤0.5% figures. **Net for the diff:** trust presentation as a computable filter; treat immunogenicity ranking as probabilistic re-prioritization; settle TCR-level recognition of novel neoantigens by wet-lab multimer/functional screening.

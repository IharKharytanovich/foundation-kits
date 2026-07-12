---
topic: BigMHC 2023 — deep-net presentation predictor with transfer-learned neoepitope immunogenicity
keywords: [BigMHC, deep learning, MHC-I presentation, transfer learning, neoepitope, immunogenicity, PPV, TESLA, MANAFEST, positive predictive value]
related: [../immunogenicity-prediction-models.md, prime-immunogenicity-models.md, tesla-2020-neoantigen-validation.md]
epistemics: empirical
source: "Albert BA, … Karchin R. Deep neural networks predict class I MHC epitope presentation and transfer learn neoepitope immunogenicity. Nat Mach Intell 2023;5(8):861-872. DOI:10.1038/s42256-023-00694-6 (verified); PMC10569228"
source_type: paper
asserted_at: "2026-07"
---

# BigMHC — Presentation + Transfer-Learned Immunogenicity

An ensemble of **seven pan-allelic deep nets (>87M parameters)** with an interpretable MHC-attention mechanism, demonstrating both state-of-the-art presentation and the best current neoepitope-immunogenicity ranking via transfer learning — while illustrating how far short of "solved" immunogenicity remains.

## Design

- **Presentation task:** trained on 288,032 eluted-ligand + 16.7M random-negative instances across 149 alleles; tested on **45,409 EL among 900,592 negatives across 36 alleles** (NetMHCpan-4.1 test set).
- **Immunogenicity task:** base models **transfer-learned** on PRIME data (1,580 pos / 5,293 neg) → **BigMHC IM**. Two independent immunogenicity sets: a neoepitope set (NEPdb + Neopepsee + **TESLA** + new MANAFEST NSCLC; **198 immunogenic / 739 non-immunogenic**) and an infectious-disease set (1,701 / 644). Comparators: seven SOTA models.

## Results (load-bearing)

- **Presentation: AUROC 0.9733 / AUPRC 0.8779** vs best prior NetMHCpan-4.1 0.9496 / 0.8329; median PPVn 0.8617 vs 0.8279.
- **Immunogenicity (the gap-closing claim):** on neoepitopes BigMHC IM's **top nine predictions were all immunogenic**; mean **PPVn = 0.4375 (95% CI 0.4108–0.4642)** vs best prior HLAthena 0.2638 — **~1.66× precision improvement**; transfer learning alone drove it (pre-transfer BigMHC EL = 0.2704; random baseline 0.2113).
- On infectious-disease antigens BigMHC IM (0.7999) merely tied PRIME-2.0 (0.7991) — the advantage is neoepitope-specific.

Scope note: the paper reports **no standalone TESLA-only fold-enrichment** — TESLA is pooled into the neoepitope set, so the hit-rate improvement is the neoepitope PPVn result above.

Verbatim: *"After transfer learning on immunogenicity data, BigMHC yields significantly higher precision than seven state-of-the-art models in identifying immunogenic neoepitopes."*

## Limitations

Random (not verified-non-presented) negatives; MHC-I only; new alleles need full retraining; **no dataset exists to test whether IM separates immunogenic from presented-but-non-immunogenic peptides; all evaluations retrospective.**

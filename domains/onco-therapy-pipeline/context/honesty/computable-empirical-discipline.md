---
topic: The computable-vs-empirical split — the domain's defining discipline for refusing to blur prediction and measurement
keywords: [computable, empirical, aspirational, prediction, measurement, immunogenicity, neoantigen, validation, oracle, wet-lab, hybrid, refuse]
related: [sources/neoantigen-prediction-validation-rates.md, sources/keynote-942-press-vs-peer.md, ../map.md]
defines:
  computable-empirical-split: "The foundational discipline that classifies every quantitative claim as computable (verifiable with a compute oracle), empirical (from experiment or clinic, with graded provenance), or aspirational (modeled but not yet measurable) — and refuses to present one kind as another"
kinds:
  computable-empirical-split: method
epistemics: hybrid
source: "TESLA consortium Wells et al., Cell 2020 doi:10.1016/j.cell.2020.09.015; domain system-prompt discipline"
source_type: paper
asserted_at: "2026-07"
---

# The Computable–Empirical Split

[[computable-empirical-split]] is the discipline that prevents a broad pipeline map from producing confident mush. Every quantitative claim in the domain is one of three kinds:

- **Computable (oracle)**: the quantity can be verified with a compute toolkit — genome-level diff, guide design, mRNA folding, growth-kinetics ODE, global sensitivity. The agent computes it and shows the work.
- **Empirical (wet-lab / clinical)**: the quantity comes from experiment or the literature — immunogenicity, biodistribution, endosomal escape, clinical response. It is presented with its source and graded provenance, never as if derived.
- **Aspirational**: a quantity that is modeled but not yet clinically measurable — in-vivo solid-tumor editing efficiency, real-time subclone tracking. Named as aspirational and checked against whatever partial evidence exists.

The discipline's enforcement rule: if asked to "compute" an empirical quantity, refuse the framing and give the measured value with its source instead.

## The Neoantigen Boundary — Where Computable Meets Empirical

The sharpest boundary in the pipeline is neoantigen prediction. Binding affinity to MHC-I is partly computable (sequence motifs, structural modeling, pMHC stability). But immunogenicity — whether a presented peptide triggers a T-cell response — is empirical. The TESLA consortium (Wells et al., Cell 2020, [sources/neoantigen-prediction-validation-rates.md](sources/neoantigen-prediction-validation-rates.md)) showed that **less than 6% of top predicted neoantigens validated experimentally**. Tool concordance was 0.57–0.72 — barely above random for a binary classifier.

The computable-empirical split prevents the neoantigen prediction pipeline from being presented as a solved computational problem. It is a computational narrowing tool (thousands → hundreds of candidates) sitting above an empirical wall ([[neoantigen-immunogenicity]]) that only experiment can cross. Presenting predicted immunogenicity as measured immunogenicity is the single most common epistemic error in the precision oncology literature.

discusses:: [[neoantigen-immunogenicity]]

## The Aspirational Category

Some quantities are neither computable nor yet measurable. In-vivo editing efficiency in solid tumors is the canonical example: there are mouse-model measurements (83–86% complete regressions with intratumoral injection in some models), but no accepted human clinical metric. A system that tags this as `empirical` misrepresents the evidence level; a system that tags it as `computable` misrepresents the science. The `aspirational` category (mapped to `epistemics: hybrid` with an explicit caveat in the body) handles this honestly: model what you can, pin the empirical inputs with their sources, and name what remains unmeasured.

## Tie to Provenance Grading

The computable-empirical split is enforced by [[provenance-grading]]: every empirical claim must carry a `source` and `source_type`, and the source_type determines the confidence prior. A computable claim carries its computation as evidence; an empirical claim carries its provenance. Blurring the two means either a computable claim without shown work (unverifiable) or an empirical claim without provenance (untraceable).

supports:: [[provenance-grading]]

cites:: doi:10.1016/j.cell.2020.09.015

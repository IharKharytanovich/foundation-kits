---
topic: Manufacturing throughput — the rate ceiling of therapeutic production, modeled but empirically bounded
keywords: [manufacturing, throughput, bioreactor, titre, yield, particles, growth kinetics, QC, release, scale-up]
related: [../speed/timeline.md, ../map.md, models.md, ../walls/cmc.md, sources/hong-2024-bioprocess-modeling.md, sources/levine-2017-car-t-manufacturing.md]
anchors:
  the-numbers: [titre, particles, 10^12, 10^14, dose, yield]
  modeling: [growth kinetics, Monod, logistic, throughput, sensitivity]
defines:
  manufacturing-throughput: "The rate at which therapeutic-dose product can be produced, set by titre, run time, and purification/QC yield — a contributing floor, not the pipeline's binding constraint (that is delivery)"
kinds:
  manufacturing-throughput: metric
epistemics: hybrid
source: "research/onco stages 04/08; therapeutic dose 10^12–10^14 particles and titres are empirical/literature, not computed here"
source_type: paper
asserted_at: "2026-07"
---

# Manufacturing Throughput

This is a hard CMC floor — **not** the pipeline's binding constraint (that is delivery, [[solid-tumor-delivery]]) — and it is **empirical territory**: the domain models it, but real titres and yields come from experiment.

<!-- @anchor: the-numbers -->
## The Numbers

A therapeutic dose is ~10¹²–10¹⁴ particles (empirical). mRNA/LNP is cell-free and the only truly N-of-1-scalable platform; viral vectors and cell products are bioculture, where [[vector-yield]] and batch outcome are empirical and batch failure is a real risk. These figures are cited with provenance, never presented as computed.

<!-- @anchor: modeling -->
## What the Domain Can Actually Compute

[[manufacturing-throughput]] can be *modelled* from producer-cell kinetics even when true titres are empirical — the honest computable layer beneath figures that must ultimately be measured:

measured-by:: [[growth-kinetics-model]]
contradicts:: [[thirty-minute-target]]

Fit a logistic / Monod curve, integrate product formation over the run in `scipy`/`lmfit`, run a `salib` sensitivity to find which parameter binds throughput, and propagate empirical titre error with `uncertainties` + `pint`.

---
topic: Manufacturing model concepts — vector yield and the growth-kinetics model
keywords: [vector yield, growth kinetics, Monod, logistic, producer cell, titre, purification, run time, model]
related: [bioreactor.md]
defines:
  vector-yield: "Usable therapeutic particles recovered per bioreactor run after purification and QC — sets how many runs a dose needs, and the time/cost floor"
  growth-kinetics-model: "A producer-cell growth and product-formation model (e.g. logistic / Monod) used to estimate run time, titre trajectory, and runs per dose — the computable layer under empirical titres"
kinds:
  vector-yield: metric
  growth-kinetics-model: method
epistemics: hybrid
source: "research/onco stages 04/05; titres ~10^8–10^9 TU/mL (LV), ~8×10^10 TU/L (perfusion)"
source_type: paper
asserted_at: "2026-07"
---

# Manufacturing Model Concepts

[[vector-yield]] — usable particles per run after purification and QC — and the [[growth-kinetics-model]] are the computable scaffolding under empirical manufacturing figures. The model estimates run time and titre trajectory; the absolute numbers remain measured, not derived.

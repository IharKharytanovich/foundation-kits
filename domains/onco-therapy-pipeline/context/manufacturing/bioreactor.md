---
topic: Bioreactor production of therapeutic vectors — titre, yield, and throughput modeling
keywords: [bioreactor, viral vector, titre, yield, particles, growth kinetics, purification, QC, scale-up, throughput]
related: [../speed/timeline.md, ../pipeline/stages.md]
anchors:
  the-numbers: [titre, particles, 10^12, 10^14, dose, yield]
  modeling: [growth kinetics, Monod, logistic, throughput, DOE]
defines:
  manufacturing-throughput: "The rate at which therapeutic-dose vector can be produced, set by bioreactor titre, run time, and purification/QC yield"
  vector-yield: "Usable therapeutic particles recovered per bioreactor run after purification and QC"
  growth-kinetics-model: "A model of producer-cell growth and product formation (e.g. logistic / Monod) used to estimate run time and titre"
kinds:
  manufacturing-throughput: metric
  vector-yield: metric
  growth-kinetics-model: method
source: "Conversation analysis, 2026-07 — therapeutic dose 10^12-10^14 particles is an empirical/literature figure, not computed here"
source_type: agent-inference
asserted_at: "2026-07"
---

# Bioreactor Manufacturing

This is the pipeline's binding constraint, and it is **empirical territory** — the domain models it, but real titres and yields come from experiment, not from the model.

<!-- @anchor: the-numbers -->
## The Numbers

A therapeutic dose is on the order of 10¹²–10¹⁴ particles (empirical, literature). [[vector-yield]] — usable particles per run after purification and QC — sets how many runs a dose needs, and therefore the time and cost floor. These figures are cited with provenance, never presented as computed.

<!-- @anchor: modeling -->
## What the Domain Can Actually Compute

[[manufacturing-throughput]] can be *modelled* from producer-cell kinetics even when true titres are empirical:

manufacturing-throughput measured-by:: [[growth-kinetics-model]]

[[growth-kinetics-model]]: fit or assume a logistic / Monod growth curve, integrate product formation over the run in `scipy`, and estimate run time, titre trajectory, and the number of runs per dose. This is the honest computable layer — a sensitivity analysis over assumed parameters — sitting beneath figures that must ultimately be measured.

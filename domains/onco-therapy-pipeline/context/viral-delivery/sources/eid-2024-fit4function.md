---
topic: Eid et al. 2024 — Fit4Function machine-learning AAV capsid engineering co-optimizes multiple clinical traits and predicts cross-species (macaque) biodistribution from mouse plus human-in-vitro data
keywords: [Fit4Function, machine learning, AAV capsid, directed evolution, multi-trait, liver, cross-species, macaque, Deverman, Nature Communications]
related: [../retargeted-viral-vectors.md]
epistemics: empirical
source: "Eid F-E, Chen AT, Chan KY, et al. Systematic multi-trait AAV capsid engineering for efficient gene delivery. Nat Commun. 2024;15:6602. DOI:10.1038/s41467-024-50555-y; PMC11297966"
source_type: paper
asserted_at: "2026-07"
---

# Eid 2024 — Fit4Function ML Capsid Engineering

Shows machine learning can co-optimize several clinical AAV-capsid traits at once (manufacturability + cross-species tropism), beyond single-trait directed evolution.

## Design & Methods

Built a "Fit4Function" library of 240,000 capsid variants (7-mer insertions between VP1 residues 588–589; theoretical space 1.28 billion), trained trait-specific ML models (two-layer LSTM) on production fitness plus multiple functional screens, then designed a "MultiFunction" library of 30,000 liver-targeted variants predicted across six traits. Data: mouse in vivo + human in vitro; cross-species validation in macaque.

## Quantitative Results

- Production-fitness model test correlation **r = 0.924 ± 0.001** (held-out); trained on 24,000 variants.
- **88% (abstract; 88.4% in scrape) of MultiFunction variants met all six predetermined criteria**; Fit4Function-space hit rate 7.0% versus ~2.6% for uniform sequence space.
- Human hepatocyte transduction: individual variants **10–1000× more effective than AAV9**.
- **Cross-species prediction:** models trained only on mouse-in-vivo + human-in-vitro data accurately predicted variant biodistribution in macaque; 6 of 7 MultiFunction variants improved on AAV9 in rhesus liver and showed reduced brain/spinal-cord/kidney targeting.
- Production yields comparable to AAV9. Doses: mice 1×10¹² vg; cynomolgus 4.6×10¹² vg/kg IV; rhesus 1×10¹³ vg/kg.

## Limitations

Optimized here toward liver (the CNS payoff is de-targeting, not transduction); single-animal NHP cohorts; human data in vitro; library-size figures partly scrape-sourced.

## Conclusion

A single manufacturable-space capsid library, screened for many functions in parallel with ML, yields multi-trait, cross-species winners — and models trained on cheaper mouse + human-in-vitro data predict expensive macaque biodistribution. This is the machine-learning frontier of retargeted-vector engineering, complementing DARPin/nanobody display with data-driven capsid design. Related: Ogden 2019 showed ML raised the multi-mutation functional-variant hit rate ~100× over random mutagenesis.

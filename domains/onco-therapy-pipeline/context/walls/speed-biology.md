---
topic: The speed-biology wall — tumor evolution outpaces the treatment manufacturing cycle
keywords: [speed, tumor evolution, subclone, doubling time, treatment cycle, manufacturing, mRNA vaccine, TRACERx, resistance, antigen loss, timing, drift]
related: [sources/tumor-evolution-dynamics.md, sources/resistance-escape-mechanisms.md, ../efficacy/resistance-evolution-loop.md, ../speed/timeline.md]
defines:
  speed-biology-wall: "The constraint that tumor subclones evolve (doubling time 2-4 weeks) within the current personalized treatment manufacturing cycle (~4 weeks for mRNA vaccines, 6-12 weeks for CAR-T), causing the target landscape to drift between biopsy and dosing — the biological timing limit that cannot be broken by faster manufacturing alone"
kinds:
  speed-biology-wall: constraint
epistemics: empirical
source: "TRACERx Jamal-Hanjani 2017 NEJM; Abbosh 2023 NEJM (TRACERx 421); Majzner & Mackall 2018 Cancer Discov (30-60% antigen-neg relapse)"
source_type: paper
asserted_at: "2026-07"
---

# The Speed-Biology Wall

[[speed-biology-wall]] is the timing mismatch between tumor evolution and the personalized treatment cycle. The tumor does not wait for the treatment to be manufactured.

**The numbers:** TRACERx data (Jamal-Hanjani 2017, Abbosh 2023) show that subclonal diversity increases measurably between biopsy and surgery (median 12 weeks), with new subclones detectable in 15-25% of patients. Median subclone doubling time in aggressive tumors is 2-4 weeks. A personalized mRNA neoantigen vaccine cycle is ~4 weeks from diff to dose; CAR-T manufacturing is 2-4 weeks for autologous, longer for quality-controlled release.

**Pre-existing resistance:** The [[resistance-evolution-loop]] compounds the timing wall: antigen-negative subclones exist at 0.003-1.8% VAF before therapy (Orlando et al. 2018) and are selected by treatment. 30-60% of CAR-T relapses are antigen-negative. The therapy does not create resistance — it selects for pre-existing variants. Even if the manufacturing cycle were instantaneous, the resistant subpopulation is already present at biopsy.

**What the wall blocks:** The speed-biology wall rate-limits [[end-to-end-timeline]] and [[personalized-therapy-throughput]] not by adding manufacturing time but by degrading the relevance of the manufactured product. A vaccine targeting neoantigens that were clonal at biopsy may find them subclonal at dosing.

rate-limits:: [[end-to-end-timeline]]
rate-limits:: [[personalized-therapy-throughput]]

**Bypasses route around, not through:** Multi-antigen targeting (5-20 neoantigens per vaccine) hedges against single-antigen drift. Clonality-weighted neoantigen selection prioritizes trunk mutations over branch mutations. Serial re-sequencing (ctDNA monitoring between cycles) updates the target landscape. None of these breaks the wall — they reduce the probability that evolution renders the treatment irrelevant within one cycle.

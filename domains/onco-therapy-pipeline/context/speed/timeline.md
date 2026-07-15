---
topic: The realistic end-to-end timeline of a personalized therapy versus the optimistic target
keywords: [timeline, speed, tumor-normal calling, vector assembly, QC, manufacturing, weeks, compressible, hard floor]
related: [../map.md, ../manufacturing/bioreactor.md, targets.md]
anchors:
  where-time-goes: [calling, assembly, packaging, purification, QC, dose]
  compressible-vs-floor: [compressible, hard floor, biology, quality control]
defines:
  end-to-end-timeline: "The wall-clock time to produce a personalized therapy for one patient, from diff to dose"
kinds:
  end-to-end-timeline: metric
epistemics: hybrid
source: "research/onco stage 08; personalized mRNA vaccine ~9 weeks → <4 weeks (literature, empirical)"
source_type: paper
asserted_at: "2026-07"
---

# The Timeline Reality

<!-- @anchor: where-time-goes -->
## Where the Time Actually Goes

The [[end-to-end-timeline]] is dominated by the back of the pipeline, not the front:

- Tumour-normal calling: **hours to days** (empirical).
- Vector assembly, packaging, purification, QC: **days to weeks** (empirical).
- Therapeutic-dose manufacture: **days** (empirical).
- Today's personalised mRNA vaccines: **~4 weeks** per patient (down from ~9), already considered fast.

measured-by:: [[stage-time-model]]

<!-- @anchor: compressible-vs-floor -->
## Compressible Versus Hard Floor

The optimistic sub-hour loop ([[thirty-minute-target]]) compresses the *front* stages, which were never the bottleneck. The binding constraint is delivery; manufacturing throughput and QC are near-hard floors set by cell-culture biology. Honest speed work attacks vector production and QC or changes modality (cell-free / synthetic manufacture) — not the sequencing step. And a real biological cost of any delay: the tumor evolves during the interval.

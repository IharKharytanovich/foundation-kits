---
topic: The realistic end-to-end timeline of a personalized therapy versus the optimistic target
keywords: [timeline, speed, tumor-normal calling, vector assembly, QC, manufacturing, weeks, compressible, hard floor]
related: [../pipeline/stages.md, ../manufacturing/bioreactor.md]
anchors:
  where-time-goes: [calling, assembly, packaging, purification, QC, dose]
  compressible-vs-floor: [compressible, hard floor, biology, quality control]
defines:
  end-to-end-timeline: "The wall-clock time to produce a personalized therapy for one patient, from diff to dose"
  stage-time-model: "A per-stage time model summed along the pipeline to estimate the end-to-end timeline"
  thirty-minute-target: "The aspirational goal of a sub-hour diff-to-dose loop — a target, not a current capability"
kinds:
  end-to-end-timeline: metric
  stage-time-model: method
  thirty-minute-target: claim
source: "Conversation analysis, 2026-07; personalized mRNA vaccine timelines ~4-8 weeks/patient (literature figure, empirical)"
source_type: agent-inference
asserted_at: "2026-07"
---

# The Timeline Reality

<!-- @anchor: where-time-goes -->
## Where the Time Actually Goes

The [[end-to-end-timeline]] is dominated by the back of the pipeline, not the front:

- Tumour-normal calling: **hours to days** (empirical).
- Vector assembly, packaging, purification, QC: **days to weeks** (empirical).
- Therapeutic-dose manufacture (10¹²–10¹⁴ particles): **days** (empirical).
- Today's personalised mRNA vaccines: **~4–8 weeks per patient**, already considered fast (literature figure).

end-to-end-timeline measured-by:: [[stage-time-model]]

<!-- @anchor: compressible-vs-floor -->
## Compressible Versus Hard Floor

The optimistic "30 min / 2 h / 1 h" loop — the [[thirty-minute-target]] — compresses the *front* stages, which were never the bottleneck. The binding constraint is manufacturing throughput, which is a near-hard floor set by cell-culture biology and mandatory QC:

manufacturing-throughput contradicts:: [[thirty-minute-target]]

Honest speed work therefore attacks vector production and QC, or changes the modality (e.g. cell-free / synthetic manufacture), not the sequencing step.

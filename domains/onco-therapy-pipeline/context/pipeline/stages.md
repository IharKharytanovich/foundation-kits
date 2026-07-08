---
topic: The stages of the personalized therapy pipeline and where whole-loop throughput is decided
keywords: [pipeline, stages, diff, target, guide, construct, delivery, manufacturing, bottleneck, throughput, dependency]
related: [../speed/timeline.md, ../manufacturing/bioreactor.md]
anchors:
  the-stages: [diff, target, guide, construct, delivery, manufacture, QC, dose]
  bottleneck: [bottleneck, slowest stage, throughput, binding constraint]
defines:
  personalized-therapy-throughput: "The rate at which a full personalized therapy can be produced per patient, set by the slowest stage in the pipeline"
kinds:
  personalized-therapy-throughput: claim
source_type: agent-inference
asserted_at: "2026-07"
---

# Pipeline Stages and the Binding Constraint

<!-- @anchor: the-stages -->
## The Stages

The loop, in order: **tumour-normal diff → targetable mutation → guide (gRNA/retron) → payload construct → vector / delivery → bioreactor manufacture → QC → dose.** The front stages are sequence work with compute oracles; the back stages are wet-lab and manufacturing engineering.

<!-- @anchor: bottleneck -->
## Throughput Is Set by the Slowest Stage

[[personalized-therapy-throughput]] is not the sum of the stages and not the fastest one — it is governed by the **slowest** stage in the chain. Speeding up target-ID from hours to minutes buys nothing if vector manufacture and QC still take weeks.

personalized-therapy-throughput derived-from:: [[manufacturing-throughput]]
personalized-therapy-throughput derived-from:: [[end-to-end-timeline]]

The map's purpose is to keep attention on that binding constraint rather than on the stage that is easiest to optimise.

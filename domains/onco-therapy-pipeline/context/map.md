---
topic: The living map of the personalized onco-therapy pipeline — stages, flow, branches, and the binding constraint
keywords: [pipeline, map, stages, flow, cycle, branch, immune, genetic, bottleneck, binding constraint, throughput, delivery]
related: [delivery/delivery-wall.md, manufacturing/bioreactor.md, speed/timeline.md, walls/index.md]
anchors:
  the-flow: [sampling, diff, design, manufacture, delivery, efficacy, order]
  two-branches: [immune, genetic, neoantigen, vaccine, CRISPR, oncolytic, ex vivo]
  the-cycle: [feedback, tumor evolution, resistance, subclone, re-diff]
  binding-constraint: [bottleneck, slowest stage, throughput, delivery wall, solid tumor]
defines:
  personalized-therapy-throughput: "The rate at which a full personalized therapy can be produced per patient, governed by the slowest (binding) stage in the pipeline"
kinds:
  personalized-therapy-throughput: metric
epistemics: hybrid
source: "research/onco FINAL.md, 2026-07 (8 stage reports, 110 sources)"
source_type: agent-inference
asserted_at: "2026-07"
---

# The Pipeline Map

This file is the **living shape** of the process. It changes as the research develops — the folders are just topics; the flow, the branches, and the binding constraint live here.

<!-- @anchor: the-flow -->
## The Flow

```
sampling → diff → design → manufacture → delivery → efficacy
```

- **sampling** — biopsy / liquid biopsy + normal, tumor-normal pairing, extraction.
- **diff** — WGS/WES/RNA-seq → somatic calling → clonality → HLA + neoantigen prediction.
- **design** — two branches (below).
- **manufacture** — mRNA/LNP · viral vector · cell product · plasmid → QC/release.
- **delivery** — LNP/AAV/virion/cells → biodistribution → TME penetration.
- **efficacy** — delivery metrics + action metrics + resistance/evolution → feeds back to a new diff.

Front stages are sequence work with compute oracles; back stages are wet-lab and manufacturing engineering.

<!-- @anchor: two-branches -->
## Two Branches

- **Immune** (fastest personalized loop today, <4 weeks): neoantigen mRNA/peptide vaccines, CAR-T/TCR-T/TIL, BiTE/ICI.
- **Genetic** (point drivers, mostly ex vivo): oncolytic virus, CRISPR/base/prime, ASO/siRNA. Guide oracle delegated to **onco-target-design**; construct oracle to **mrna-design**.

<!-- @anchor: the-cycle -->
## It Is a Cycle, Not a Line

Efficacy feeds back into a new diff: the tumor evolves faster than one treatment cycle (antigen-negative subclones exist before therapy), so the sequenced target landscape can drift before dosing.

<!-- @anchor: binding-constraint -->
## Throughput Is Set by the Slowest Stage

[[personalized-therapy-throughput]] is governed by the **slowest** stage, not the sum and not the fastest. Today that binding stage is delivery into the solid tumor ([[solid-tumor-delivery]]) — not manufacturing and not sequencing. Manufacturing throughput and the end-to-end timeline are contributing floors:

derived-from:: [[manufacturing-throughput]]
derived-from:: [[end-to-end-timeline]]

The map's purpose is to keep attention on the binding constraint of the modality in question, not on the stage that is easiest to optimise.

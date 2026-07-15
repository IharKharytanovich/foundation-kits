---
topic: The solid-tumor delivery wall — the pipeline's binding constraint
keywords: [delivery, LNP, AAV, biodistribution, liver tropism, endosomal escape, EPR, tumor microenvironment, binding constraint, in-vivo editing]
related: [../map.md, barriers.md, bypass.md, ../walls/index.md]
anchors:
  the-wall: [0.7%, endosomal escape, EPR, AAV NAb, liver tropism]
defines:
  solid-tumor-delivery: "Getting a therapeutic payload into cells of a solid tumor in vivo — the pipeline's binding wall; median 0.7% of injected NP dose reaches the tumor, EPR is unreal in humans"
kinds:
  solid-tumor-delivery: constraint
epistemics: empirical
source: "research/onco stage 06; Wilhelm 2016 Nat Rev Mater (0.7%); Dalabehera 2025 (1–2% escape); Chhabra 2024 (AAV NAb 55–95%)"
source_type: paper
asserted_at: "2026-07"
---

# The Solid-Tumor Delivery Wall

<!-- @anchor: the-wall -->
## The Wall

[[solid-tumor-delivery]] is the binding constraint of the whole pipeline. Median **0.7%** of an injected nanoparticle dose reaches a solid tumor (Wilhelm 2016); EPR is largely unreal in humans (organ blood flow ~800× slower than mouse). [[endosomal-escape]] caps cytoplasmic delivery at **1–2%** (Dalabehera 2025). AAV carries pre-existing neutralizing antibodies in **55–95%** of adults (Chhabra 2024). LNP now leads AAV for editor cargo but **defaults to the liver** (ApoE→LDLR).

Because of this wall, [[in-vivo-genetic-editing]] of solid-tumor cells is not clinically achieved, and it sets the throughput ceiling of the whole loop:

blocks:: [[in-vivo-genetic-editing]]
rate-limits:: [[personalized-therapy-throughput]]

Reason about ionizable-lipid chemistry (pKa ~6.2–6.6, size 100–200 nm) in `rdkit`; the physicochemistry is partly computable, but biodistribution and endosomal escape are empirical — never present them as computed. Wins route around the wall rather than through it — see [[delivery-bypass]].

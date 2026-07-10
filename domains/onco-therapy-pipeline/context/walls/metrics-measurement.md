---
topic: The metrics-measurement wall — efficacy endpoints are either unvalidated surrogates or unmeasurable in vivo
keywords: [metrics, measurement, ctDNA, surrogate, endpoint, OS, DFS, editing efficiency, in vivo, solid tumor, biomarker, DYNAMIC, FDA, RECIST, aspiration]
related: [sources/ctdna-surrogate-status.md, ../efficacy/efficacy-surrogacy-gap.md, ../efficacy/resistance-evolution-loop.md]
defines:
  metrics-measurement-wall: "The constraint that the pipeline's key efficacy metrics — in-vivo editing efficiency in solid tumors and ctDNA as a surrogate for OS/DFS — are either unmeasurable or unvalidated, preventing the efficacy feedback loop from closing with quantitative confidence"
kinds:
  metrics-measurement-wall: constraint
epistemics: empirical
source: "Tie 2022 NEJM (DYNAMIC); Henriksen 2024 JAMA Oncol; FDA 2022 draft guidance ctDNA; Verve HEART-1 2024"
source_type: paper
asserted_at: "2026-07"
---

# The Metrics-Measurement Wall

[[metrics-measurement-wall]] is the constraint that the pipeline cannot close its efficacy feedback loop because the metrics it needs are either unmeasurable or unvalidated as regulatory endpoints. The [[efficacy-surrogacy-gap]] documents what is missing; this wall documents why it cannot yet be filled.

**ctDNA is prognostic but not an accepted surrogate:** The DYNAMIC trial (Tie et al. 2022, 455 stage II colon cancer patients) demonstrated clinical utility of ctDNA-guided therapy, and Henriksen et al. 2024 (meta-analysis, 12,000+ patients) confirmed strong prognostic value (HR 3.1-5.2 for OS). But the FDA's 2022 draft guidance explicitly states that ctDNA clearance is not validated as a surrogate endpoint for OS or DFS. The relationship between ctDNA dynamics and survival varies by tumor type and treatment, preventing universal surrogacy. Regulatory approval decisions cannot yet be based on ctDNA response.

**In-vivo editing measurement is aspirational:** For gene editing therapies targeting solid tumors, measuring the fraction of cells successfully edited in vivo has no validated approach. Liver editing is the exception: Verve's HEART-1 trial (2024) measured PCSK9 protein reduction as a proxy for editing efficiency. But for dispersed solid tumor cells, the only options are pre/post biopsy (invasive, sampling bias) or circulating biomarker proxies (target-specific, not generalizable). There is no solid-tumor equivalent of the liver's measurable protein output.

**What the wall blocks:** Without validated efficacy metrics, the pipeline cannot distinguish between a therapy that failed because of biology (the drug didn't work) and one that failed because of delivery (the drug didn't reach the target). This ambiguity blocks the feedback loop that should connect efficacy back to design.

blocks:: [[personalized-therapy-throughput]]

The measurement wall compounds with the [[resistance-evolution-loop]]: if you cannot measure editing efficiency and cannot measure whether the target landscape shifted during treatment, you cannot determine which wall stopped the therapy.

discusses:: [[efficacy-surrogacy-gap]]

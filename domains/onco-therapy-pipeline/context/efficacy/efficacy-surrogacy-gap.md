---
topic: The efficacy surrogacy gap — measurable metrics without validated surrogates
keywords: [surrogacy, ctDNA, MRD, surrogate endpoint, overall survival, delivery metrics, action metrics, RECIST, editing efficiency, measurement gap, computable, empirical, Prentice, validation]
related: [../map.md, sources/ctdna-surrogacy-landscape.md, sources/mrd-guided-therapy-trials.md, ../delivery/delivery-wall.md, ../walls/index.md]
defines:
  efficacy-surrogacy-gap: "The structural gap between measurable efficacy metrics (delivery: editing %, %CAR+, expression; action: RECIST, ctDNA clearance) and validated surrogate endpoints for OS/DFS — ctDNA is prognostic but not an accepted surrogate; in-vivo editing measurement in solid tumors is aspirational; the gap is empirical and unsettled"
kinds:
  efficacy-surrogacy-gap: constraint
epistemics: empirical
source: "Tie 2022 NEJM (DYNAMIC); Henriksen 2024 JAMA Oncol; FDA 2022 draft guidance ctDNA; Weber 2024 Lancet (KEYNOTE-942); Verve HEART-1 2024"
source_type: paper
asserted_at: "2026-07"
---

# The Efficacy Surrogacy Gap

[[efficacy-surrogacy-gap]] is a constraint that sits between the pipeline's measurable outputs and clinical proof of benefit. The pipeline produces two classes of metric — delivery metrics and action metrics — but neither class has a validated surrogate link to survival in the personalized therapy setting.

## Two Classes of Metric

**Delivery metrics** are computable from assay data: on-target editing percentage (NGS), %CAR+ cells (flow cytometry), mRNA expression level (ELISA). These tell you whether the payload arrived and is functional. In ex-vivo manufacturing (CAR-T, adoptive cell therapy), delivery metrics are well-characterized (80–98% editing efficiency, 5–50% CAR+ transduction). In in-vivo delivery to solid tumors, no validated editing-efficiency assay exists — the metric is aspirational.

**Action metrics** are clinical observations: RECIST 1.1 tumor response, pathological complete response (pCR), and molecular response (ctDNA clearance/MRD negativity). These tell you whether the disease responded. ctDNA clearance is strongly prognostic (HR for recurrence 5.0–11.0, Henriksen 2024), and ctDNA-guided trials (DYNAMIC, CIRCULATE-Japan) show it can safely guide treatment decisions — but prognostic value is not surrogacy.

## Why ctDNA Is Not a Surrogate

The [[efficacy-surrogacy-gap]] between ctDNA dynamics and OS/DFS remains open because:
1. Assay heterogeneity — tumor-informed vs tumor-agnostic panels detect different ctDNA fractions at different sensitivities (LOD 0.01% vs 0.1% VAF)
2. Shedding biology — low-shedding tumors (MSS CRC, low-grade glioma, RCC) have sensitivity below 50% in early stage
3. No trial-level surrogacy — the Buyse R² at the trial level remains below 0.7 for any tumor type
4. Clearance definition — timepoint and threshold are not standardized

The FDA 2022 draft guidance acknowledges ctDNA as a prognostic biomarker but explicitly does not validate it as a surrogate endpoint.

## The Solid-Tumor Measurement Gap

For in-vivo gene editing in solid tumors, the [[efficacy-surrogacy-gap]] is compounded by the inability to even measure the delivery metric in situ. Unlike liver targets (where Verve HEART-1 measured 37–48% PCSK9 editing via circulating protein), solid tumors lack a circulating readout of on-target editing. A biopsy measures one spatial sample and cannot represent whole-tumor editing efficiency. This means the pipeline's efficacy stage cannot produce a computable delivery metric for in-vivo solid-tumor editing — it must rely entirely on action metrics (RECIST, ctDNA), which themselves lack validated surrogate status.

The [[efficacy-surrogacy-gap]] is gated by the delivery wall because without reliable delivery to the tumor, the efficacy metrics question does not arise — you cannot measure what was not delivered.

gated-by:: [[solid-tumor-delivery]]

The gap rate-limits the pace at which personalized therapies can prove clinical benefit, because without surrogate endpoints, every trial must wait for OS/DFS maturation.

rate-limits:: [[personalized-therapy-throughput]]

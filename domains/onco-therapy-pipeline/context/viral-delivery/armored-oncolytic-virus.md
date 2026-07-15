---
topic: Armored (transgene-loaded) oncolytic viruses — the arming arms race that converts cold tumors hot, and why the delta over the unarmed backbone is immune-mediated not oncolytic
keywords: [armored oncolytic virus, transgene, arming, payload, cold to hot, CD8 dependent, immunogenic cell death, backbone, in-situ vaccination]
related: [../landscape/oncolytic-virotherapy.md, ov-local-payload-secretion.md, cytokine-arming.md, bite-arming.md, checkpoint-arming.md, chemokine-flt3l-arming.md]
defines:
  armored-oncolytic-virus: "An oncolytic virus engineered to express one or more therapeutic transgenes (cytokine, T-cell engager, checkpoint antibody, chemokine/FLT3L) that remodel the tumor microenvironment or recruit immunity — the delta over the unarmed backbone is almost entirely immune-mediated and CD8-dependent, not improved oncolysis"
kinds:
  armored-oncolytic-virus: modality
epistemics: empirical
source: "Reviews Shalhout Nat Rev Clin Oncol 2023 (arming improves preclinical efficacy 2–10×); AZD4820 (CR 6/10 vs 0/10 unarmed); vvDD-IL15Rα (80% cured vs 0%); consistent CD8-depletion-collapses-benefit result"
source_type: paper
asserted_at: "2026-07"
---

# Armored Oncolytic Viruses

[[armored-oncolytic-virus]] extends [[oncolytic-virotherapy]] by loading the tumor-selective replicating backbone with transgenes that recruit or amplify anti-tumor immunity. The field has fragmented into a payload "arming arms race" over four main classes — [[cytokine-arming]], [[bite-arming]], [[checkpoint-arming]], and [[chemokine-flt3l-arming]] — plus costimulation (CD40L/4-1BBL) and multi-transgene combinations.

## The Central Quantitative Truth: The Delta Is Immune, Not Oncolytic

Across essentially every paired armed-vs-unarmed experiment, the armed and unarmed virus **replicate and lyse tumor cells identically in vitro** — sometimes the unarmed backbone replicates slightly better, because the transgene imposes a small fitness cost. The entire benefit of arming is immune-mediated:

- **CD8-dependence is universal.** In every study that tested it (VSV-GP-IL12, vvDD-IL15Rα, oAd-CXCL11), depleting CD8 T cells collapses the armed virus's benefit back to the unarmed level; depleting NK cells usually does not.
- **The delta shows up in cure/complete-response rate, not median survival.** AZD4820 (vaccinia-IL12): complete responses 6/10 (armed) vs 0/10 (unarmed). vvDD-IL15-Rα: 80% long-term cured vs 0% (tumor progression) for unarmed vvDD. Preclinical oHSV:IL-12 in glioblastoma: 17–30% long-term survivors vs 0%. Median-survival deltas, by contrast, are often only a few days.
- **Reviews put the aggregate preclinical gain at 2–10×** on survival/regression endpoints (Shalhout, Nat Rev Clin Oncol 2023), but **injectable-OV monotherapy clinical ORR stays ~7–33%** — durable benefit needs checkpoint combination and the abscopal / in-situ-vaccination effect.

## Why Arming Works Where Systemic Drug Fails

The mechanism is [[ov-local-payload-secretion]]: the virus manufactures an otherwise-toxic immune agonist inside the tumor. And because armed viruses are almost always injected intratumorally, they inherit the delivery advantage of [[ov-route-dependence]] — they bypass the solid-tumor delivery wall by being placed directly in the lesion, then rely on the immune response for systemic (abscopal) reach.

A structural caveat for the knowledge base: **no armed-OV clinical trial has an unarmed control arm.** Clinical "armed vs backbone" comparisons are only inferable via the GM-CSF-armed comparator class (T-VEC's OPTiM, RP1's IGNYTE); the clean armed-vs-unarmed deltas are all preclinical.

derived-from:: [[oncolytic-virotherapy]]
bypasses:: [[solid-tumor-delivery]]

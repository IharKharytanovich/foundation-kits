---
topic: Neutralizing antibodies against oncolytic viruses — the dominant blocker of systemic viral delivery and the cap on repeat dosing
keywords: [neutralizing antibody, NAb, NARA, seroprevalence, seroconversion, anti-vaccinia, anti-measles, anti-reovirus, repeat dosing, humoral immunity]
related: [systemic-ov-delivery.md, ov-cell-carrier-bypass.md, sources/roulstone-2021-nab-kinetics.md, sources/moehler-2019-traverse-iv.md]
defines:
  ov-neutralizing-antibody: "Pre-existing and treatment-induced neutralizing antibodies against an oncolytic virus — the dominant immunological blocker of intravenous delivery; near-universal seroconversion within 1–3 weeks caps repeat systemic dosing, though carrier cells can shield virus from it"
kinds:
  ov-neutralizing-antibody: constraint
epistemics: empirical
source: "Roulstone 2021 (NARA onset 5–8 d, peak ~15 d, IgG1-dominant, >50-fold rise); Dispenzieri 2017 (measles 27/27 seroconvert); Rudin 2011 (SVV all <2 wk); Frontiers Immunol 2024 (>97% retain anti-vaccinia titers)"
source_type: clinical-trial
asserted_at: "2026-07"
---

# The Neutralizing-Antibody Wall

[[ov-neutralizing-antibody]] is the reason intravenous oncolytic virotherapy is so much harder than the intratumoral kind. It has two components:

## Pre-Existing Immunity

Oncolytic backbones are often viruses the population has already met. Reovirus is a ubiquitous commensal — baseline anti-reovirus (NARA) seropositivity in cancer cohorts ranges from ~37% to >90%. Anti-vaccinia immunity persists for life in the smallpox-vaccinated: **>97% of historically vaccinated donors retain neutralizing titers ≥1:32 decades later**, so much of the older population is primed against oncolytic vaccinia before the first dose. Only anti-measles-seronegative patients showed the strongest single-agent responses to IV MV-NIS (Russell 2014).

## Treatment-Induced Seroconversion

Even in seronegative patients, the first IV dose triggers rapid seroconversion. Roulstone 2021 quantified the kinetics for reovirus: NARA titers rise **5–8 days** after the first infusion, peak around **day 15**, are **IgG1-dominant**, and rise **>50-fold in nearly all patients** — with gemcitabine attenuating the peak by 1–2 logs. Measles (27/27 patients, Dispenzieri 2017) and Seneca Valley virus (all patients within 2 weeks, Rudin 2011) show the same near-universal seroconversion. This is what caps **repeat** systemic dosing: the second dose meets a wall the first dose built.

## The Nuance — Antibody Is Not Always Fatal

Two findings complicate the simple "NAb blocks everything" story. First, carrier cells shield virus from antibody ([[ov-cell-carrier-delivery]]): monocytes internalize even antibody-bound reovirus and still deliver replicative virus to tumor (Ilett/Berkeley 2018). Second, for CAN-3110 (oncolytic HSV retaining γ34.5), HSV-1-**seropositive** glioma patients survived longer than seronegative ones (14.2 vs 7.8 months, p=0.007) — pre-existing immunity acted as a beneficial priming signal, not only a barrier.

This constraint blocks the systemic route and rate-limits how often a virus can be re-dosed, but the field's answer is to shield or sidestep it rather than defeat it.

blocks:: [[systemic-ov-delivery]]

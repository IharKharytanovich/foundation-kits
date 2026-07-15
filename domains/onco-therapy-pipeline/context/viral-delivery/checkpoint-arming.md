---
topic: Checkpoint-antibody-armed oncolytic viruses — local intratumoral secretion of anti-PD-1/PD-L1/CTLA-4 that blocks the checkpoint without systemic immune toxicity
keywords: [checkpoint arming, anti-PD-1, anti-PD-L1, anti-CTLA-4, minibody, scFv, nanobody, VHH, T3011, BT-001, RP2, local secretion, irAE]
related: [armored-oncolytic-virus.md, ov-local-payload-secretion.md, sources/tanoue-2017-cadvec-minibody.md]
defines:
  checkpoint-arming: "Arming an oncolytic virus with a checkpoint-blocking payload (anti-PD-1/PD-L1/CTLA-4 as full antibody, scFv, minibody, or nanobody, or a receptor-Fc trap/peptide) expressed intratumorally — combining oncolysis-driven PD-L1 upregulation with local checkpoint blockade while sparing systemic immune-related toxicity"
kinds:
  checkpoint-arming: method
epistemics: empirical
source: "Tanoue 2017 (PD-L1 minibody local 110 d vs systemic IgG 59 d); vaccinia-PD-L1 GBM 2026 (47.5→71.5 d, CD8/Treg 19.8:1); NDV+checkpoint+IL-12 (CR 70–77% vs 0% unarmed); T3011/RP2/BT-001 clinical"
source_type: paper
asserted_at: "2026-07"
---

# Checkpoint Arming

[[checkpoint-arming]] puts a checkpoint blocker (anti-PD-1, anti-PD-L1, or anti-CTLA-4) into the oncolytic virus so it is secreted inside the tumor. The logic is doubly synergistic: oncolysis already upregulates PD-L1 (the reason to add checkpoint blockade at all), and local secretion delivers the blocker exactly where the newly-recruited T cells are — the purest expression of [[ov-local-payload-secretion]].

## Local vs Systemic Is the Whole Point (Tanoue 2017)

An oncolytic adenovirus secreting an anti-PD-L1 minibody put the antibody in tumor but left it undetectable in serum, and gave 110-day median survival versus 59 days for virus + the same antibody given systemically — direct evidence that *where* the checkpoint blocker is delivered, not just that it is present, drives the outcome. BT-001 (vaccinia encoding anti-CTLA-4) made the same case clinically: the antibody was biopsy-detectable but positive in 0 of 350 blood samples, avoiding systemic anti-CTLA-4 toxicity.

## Preclinical Deltas

- **Vaccinia encoding a PD-L1 inhibitor** in orthotopic glioblastoma: monotherapy doubled median survival (47.5 vs 22.5 days, 30% long-term survivors); adding systemic anti-PD-1 reached 71.5 days and 60% survival, with the CD8/Treg ratio shifting to 19.8:1 versus 1.7:1 in controls.
- **NDV encoding a checkpoint antibody + IL-12** produced complete responses in 70–77% of treated tumors versus 0% for unarmed NDV + systemic anti-CTLA-4, with abscopal CR in 50–62% of untreated flanks.
- **Measles encoding anti-PD-L1** prolonged survival and shifted CD8/Treg, though in xenografts the armed virus was no better than unarmed at pure tumor-volume control — the benefit is immune, not oncolytic.

## Clinical Assets

T3011 (oHSV co-expressing IL-12 + a full anti-PD-1 antibody) is the cleanest dual-armed clinical example, reaching monotherapy ORR 6.8–12.5% with increased CD8 infiltration and PD-L1 conversion; RP2 (oHSV encoding anti-CTLA-4) reported ~29–33% ORR in uveal melanoma at conference level. As throughout the arming literature, no unarmed control arm exists, and few studies report absolute intratumoral versus serum antibody concentration.

supports:: [[ov-local-payload-secretion]]
supports:: [[armored-oncolytic-virus]]

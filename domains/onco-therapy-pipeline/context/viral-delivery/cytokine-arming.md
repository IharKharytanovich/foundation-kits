---
topic: Cytokine-armed oncolytic viruses (IL-12, IL-15 superagonist, IL-2/TNFα, GM-CSF) — payload class with the sharpest cure-rate delta over unarmed backbones
keywords: [IL-12, IL-15, IL-2, TNF-alpha, GM-CSF, cytokine arming, fusion IL-12, superagonist, TILT-123, AZD4820, vvDD-IL15, systemic toxicity]
related: [armored-oncolytic-virus.md, ov-local-payload-secretion.md, sources/kowalsky-2018-vvdd-il15.md, sources/block-2025-tilt123-prota.md]
defines:
  cytokine-arming: "Arming an oncolytic virus with an immunostimulatory cytokine (IL-12, IL-15/IL-15Rα superagonist, IL-2+TNFα, GM-CSF) so it is produced intratumorally rather than systemically — the payload class with the largest complete-response delta over unarmed backbones, entirely CD8-dependent"
kinds:
  cytokine-arming: method
epistemics: empirical
source: "AZD4820 vaccinia-IL12 (CR 6/10 vs 0/10); G47Δ fusion-IL12 (intratumoral 2590 vs 228 pg/mL); vvDD-IL15-Rα (80% cured vs 0%); TILT-123 PROTA (IL-2+TNFα, DCR 64%)"
source_type: paper
asserted_at: "2026-07"
---

# Cytokine Arming

[[cytokine-arming]] is the oldest and best-quantified arm of [[armored-oncolytic-virus]]. Its whole rationale is [[ov-local-payload-secretion]]: IL-12 and IL-2 are too toxic to give systemically at active doses, so the virus makes them where they are needed.

## IL-12 — Highest-Value, Format Matters

IL-12 drives an IFN-γ / Th1 / anti-angiogenic program. Two engineering lessons stand out:
- **Format changes payload by an order of magnitude.** A single-chain fusion IL-12 in G47Δ produced intratumoral IL-12 of 2590 ± 1450 pg/mL versus 228 ± 115 pg/mL for an IRES-subunit format (~11×) — and correspondingly better tumor control.
- **The delta is a cure-rate delta.** AZD4820 (vaccinia surrogate IL-12) gave complete responses in 6/10 CT26 tumors versus 0/10 for the unarmed backbone; IL-12 and IFN-γ were detectable only in armed-treated animals. Preclinical oHSV:IL-12 doubled long-term survival (17–30% vs 0%) with in-vitro killing unchanged.
- **Clinically,** IL-12-armed viruses reach the tumor without systemic IL-12 toxicity (T3011 co-expresses IL-12 + anti-PD-1; monotherapy ORR 6.8–12.5%).

## IL-15 Superagonist — Cures via Memory CD8/NK

vvDD-IL15-Rα (an IL-15/IL-15Rα fusion) gave 80% long-term cures in MC38 versus 0% for unarmed vvDD; adding anti-PD-1 gave 100% survival past 200 days. The CD8 percentage rose identically for armed and unarmed virus (oncolysis-driven), but tumor-specific function (IFN-γ ELISPOT) was dramatically higher with the cytokine — and CD8 depletion collapsed the benefit.

## IL-2 + TNFα (TILT-123)

TILT-123 (adenovirus co-arming hTNFα + hIL-2) reached the clinic: with pembrolizumab in platinum-resistant ovarian cancer (PROTA phase 1a), disease control was 64% (9/14), median OS 190 days; with TIL therapy in checkpoint-resistant melanoma, ORR 11.7% and median OS 620 days. As with all armed OVs, these are single-arm.

## GM-CSF — The Approved but Modest Baseline

GM-CSF (T-VEC, JX-594, CG0070) recruits and matures dendritic cells and is the only cytokine-armed class with approvals — but GM-CSF arming alone is modest, and the vaccinia-GM-CSF program (pexa-vec) failed its randomized phase 3.

supports:: [[armored-oncolytic-virus]]

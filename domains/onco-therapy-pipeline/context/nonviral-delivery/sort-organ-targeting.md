---
topic: SORT (selective organ targeting) lipids — a single charged excipient reprograms LNP tropism from liver to lung or spleen, enabling extrahepatic mRNA and CRISPR delivery
keywords: [SORT, selective organ targeting, DOTAP, 18PA, DODAP, lung, spleen, protein corona, charge, mRNA, CRISPR, Siegwart]
related: [lnp-liver-default.md, conjugated-lnp-targeting.md, ../delivery/ionizable-lipid-chemistry.md, sources/cheng-2020-sort.md]
defines:
  sort-organ-targeting: "Adding a fifth charged 'SORT' lipid to a base LNP to reprogram its protein corona and predictably redirect tropism by charge class — cationic lipids to spleen (~10–15%) or lung (~50%), anionic lipids to spleen — enabling tissue-specific mRNA delivery and CRISPR editing outside the liver"
kinds:
  sort-organ-targeting: method
epistemics: empirical
source: "Cheng 2020 Nat Nanotechnol (charge rule, Cre transfection liver 93%/lung 40%epi+65%endo/spleen ~10%, CRISPR indels lung 15.1%/liver 13.9%); Lung-SORT HDR Nat Commun 2023 (CFTR correction)"
source_type: paper
asserted_at: "2026-07"
---

# SORT — Charge-Programmed Organ Targeting

[[sort-organ-targeting]] is the formulation route out of the [[lnp-liver-default]]: a single supplemental charged lipid rewrites the particle's protein corona and moves its destination organ, without any antibody. It is the charge-based counterpart to the affinity-based [[conjugated-lnp-targeting]], and an extension of the [[delivery-bypass]] logic to non-viral gene delivery.

## The Charge Rule (Cheng 2020)

Adding a fifth "SORT" lipid to an optimized base LNP shifts tropism predictably by charge class:

- **Base (no SORT):** liver (hepatocyte-optimized default).
- **Permanently cationic** (DOTAP, DDAB, EPC): ~10–15% → spleen; ~50% → lung.
- **Anionic** (18PA, 14PA, 18BMP): 10–40% → spleen, exclusively (no expression in any other organ).
- **Ionizable cationic** (DODAP) ~20% → liver, enhanced >10×.

As DOTAP is titrated from 0 to 50%, luciferase expression moves progressively liver → spleen → lung. Cell-type transfection with Cre mRNA (~0.3 mg/kg) reached ~93% of hepatocytes (liver), ~40% epithelial + ~65% endothelial cells (lung), and ~10–12% of B and T lymphocytes (spleen).

## It Works for CRISPR, Not Just Expression

SORT LNPs delivered functional CRISPR: lung-SORT (50% DOTAP) gave ~15.1% indels, liver-SORT (20% DODAP) ~13.9%, and PCSK9 editing in liver reached ~60% indels → near-complete serum protein knockdown over three doses. A follow-up lung-SORT formulation co-delivered Cas9 mRNA + sgRNA + an ssDNA donor for precise homology-directed repair, correcting CFTR mutations in patient-derived airway cells (~16% HDR, restoring chloride transport) — though absolute in-vivo lung correction remained low (2.34%), below the therapeutic threshold.

## Limits

SORT is mouse-validated and primate translation is unproven; high-DOTAP lung formulations carry dose-dependent toxicity; and the strong wins are lung and spleen — direct systemic solid-tumor-parenchyma targeting by SORT is not yet a landmark result. Still, SORT established the field's foundational principle: organ tropism is programmable by one charged excipient.

bypasses:: [[lnp-liver-default]]
supports:: [[delivery-bypass]]

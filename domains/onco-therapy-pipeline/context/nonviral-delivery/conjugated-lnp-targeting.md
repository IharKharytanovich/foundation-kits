---
topic: Ligand-conjugated LNPs — antibody/DARPin-decorated lipid nanoparticles that redirect mRNA to T cells, hematopoietic stem cells, or endothelium, the LNP route to in-vivo CAR-T
keywords: [targeted LNP, antibody conjugation, DARPin, anti-CD5, anti-CD8, anti-CD4, anti-CD117, anti-PECAM, in-vivo CAR-T, HSC editing, ApoE competition]
related: [lnp-liver-default.md, sort-organ-targeting.md, ../viral-delivery/in-vivo-cart-lentivirus.md, sources/rurik-2022-cd5-cart.md, sources/breda-2023-cd117-hsc.md]
defines:
  conjugated-lnp-targeting: "Decorating an LNP surface with a targeting ligand (antibody, DARPin, or receptor-fusion) so an affinity interaction outcompetes ApoE-LDLR and redirects mRNA to a chosen cell type — programming endogenous T cells into CAR-T, editing hematopoietic stem cells, or hitting endothelium in vivo from a single injection"
kinds:
  conjugated-lnp-targeting: method
epistemics: empirical
source: "Rurik/Epstein 2022 Science (anti-CD5 in-vivo FAP-CAR-T, 17.5–24.7% splenic T); Tombácz 2021 (anti-CD4 ~60%); Billingsley 2023 (anti-CD3 15–17%, 90% B-depletion); Breda 2023 Science (anti-CD117 95% HSC editing, 76–79% liver off-target); Parhiz 2018 (anti-PECAM ~200× lung)"
source_type: paper
asserted_at: "2026-07"
---

# Ligand-Conjugated LNPs

[[conjugated-lnp-targeting]] is the affinity route out of the [[lnp-liver-default]]: a targeting ligand on the particle surface makes a cell-specific interaction outcompete the ApoE-LDLR default. It is the LNP counterpart to the lentiviral [[in-vivo-cart-generation]] work — both program endogenous cells inside the body from one injection.

## In-Vivo CAR-T from an mRNA-LNP (Rurik 2022)

The landmark: an anti-CD5-conjugated LNP carrying FAP-CAR mRNA reprogrammed endogenous T cells into functional CAR-T in vivo — 83% of T cells CAR⁺ in vitro (versus ~7% for non-targeted IgG-LNP), and 17.5–24.7% CAR⁺ splenic T cells in vivo at 48 hours from a 10 µg dose, reversing cardiac fibrosis in 5 of 12 animals. Because the mRNA is transient and non-integrating, the CAR-T is self-limiting — a safety feature. This is the direct LNP analogue of anti-CD8 DARPin-LNP in-vivo CAR-T against cancer.

## The Marker-Choice Data (T cells)

Different pan-T markers give different efficiency: anti-CD4-LNP recombined ~60% of splenic CD4 T cells in vivo (33-fold luciferase selectivity over IgG); anti-CD3-LNP gave 15–17% CAR⁺ blood T cells at 12 hours and depleted circulating B cells 90% (high dose), outperforming anti-CD7 (5–6%); expression is transient, peaking at 12–24 hours and clearing by 60–72 hours. An intrinsically spleen-biased ionizable lipid (C14-4) gives the antibody a head start over the clinical MC3 lipid.

## Editing Stem Cells and Endothelium

Beyond T cells, anti-CD117 (c-kit) LNPs edited 95% of long-term hematopoietic stem cells in vivo (adenine base editing up to 88%), even enabling non-genotoxic conditioning — replicated independently at ~90% HSPC transfection with the clinical ALC-0315 lipid. Anti-PECAM-1 LNPs redirected mRNA to pulmonary endothelium with ~200-fold higher delivery and a ~200-fold lung-to-liver ratio.

## The Honest Limits

Ligand conjugation reduces but does not eliminate hepatic uptake — anti-CD117 LNPs still edited 76–79% of liver cells. Nearly all results are mouse; expression is transient (a durability limitation for oncology); the ligand format is shifting from full antibodies toward smaller, cheaper DARPins and ApoE2-fusion ligands (the anti-CD8 DARPin-LNP is the frontier signal, though its efficacy numbers are conference-level). And, as with SORT, direct systemic solid-tumor targeting lags behind immune-cell and stem-cell targeting.

bypasses:: [[lnp-liver-default]]
supports:: [[in-vivo-cart-generation]]

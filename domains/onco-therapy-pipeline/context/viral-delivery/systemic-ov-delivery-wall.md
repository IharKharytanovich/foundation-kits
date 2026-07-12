---
topic: Systemic (intravenous) delivery of a replication-competent oncolytic virus — the second delivery wall, parallel to the nanoparticle solid-tumor wall
keywords: [systemic delivery, intravenous, oncolytic virus, biodistribution, neutralizing antibody, complement, sequestration, Kupffer, spleen, IV delivery wall]
related: [ov-neutralizing-antibody.md, ov-route-dependence.md, ov-cell-carrier-bypass.md, ov-virion-shielding-bypass.md, ../delivery/delivery-wall.md, sources/khare-2011-kupffer-sequestration.md, sources/evgin-2015-complement.md]
defines:
  systemic-ov-delivery: "Delivering a replication-competent oncolytic virus intravenously so it survives the bloodstream and reaches disseminated or visceral tumor — the viral analogue of the solid-tumor delivery wall, gated by neutralizing antibodies, complement/natural-IgM, blood-cell trapping, and hepatosplenic sequestration (~90% Kupffer loss, ~16–20 min half-life)"
kinds:
  systemic-ov-delivery: stage
epistemics: empirical
source: "Khare 2011 (~90% Kupffer loss); Stone 2007 (>95% Ad on platelets in 5 min); Evgin 2015 (vaccinia 99% complement-dependent); Tesfay 2014 (VSV 4-log by IgM+complement/h); Carlisle 2009 (90% Ad on human RBC); Machiels 2019 EVOLVE (half-life 16.7 min); Garcia-Carbonero 2017 (EnAd 11/12 vs vvDD 2/8 biopsies)"
source_type: clinical-trial
asserted_at: "2026-07"
---

# The Systemic Oncolytic-Virus Delivery Wall

[[systemic-ov-delivery]] is the viral counterpart to the nanoparticle [[solid-tumor-delivery]] wall. A nanoparticle loses ~99% of its dose to biodistribution and endosomal degradation; a replication-competent virus loses its dose to the **immune system and the reticuloendothelial system** before it can amplify inside tumor. Three empirical barriers stack:

## Neutralizing Antibodies

Pre-existing and rapidly-induced neutralizing antibodies are the dominant blocker — see [[ov-neutralizing-antibody]]. For a virus most adults have met (reovirus, measles, vaccinia via smallpox vaccination), a fraction of the population is seropositive at baseline, and essentially every patient seroconverts within 1–3 weeks of the first IV dose, capping repeat systemic dosing.

## Complement, Coagulation, and Blood-Cell Trapping — the Pre-Adaptive Barrier

The barrier precedes any adaptive antibody. Even a low-seroprevalence virus is knocked down by **natural IgM + complement**: VSV loses ~4 log₁₀ of infectious titer in the first hour in non-immune human serum (Tesfay 2014). For vaccinia, **complement — not antibody — is the dominant inactivator**: vaccinated human plasma kills up to 99% of infectivity, most of it complement-dependent, and complement inhibition (compstatin/CP40) raises recovered titer up to 52-fold in immune hosts (Evgin 2015). Blood cells trap virus too — in whole human blood, ~90% of adenovirus binds erythrocytes via CAR + complement-receptor-1, and >95% of blood-cell-bound Ad5 rides platelets into hepatic microthrombi (Carlisle 2009; Stone 2007). Critically, **this erythrocyte and complement trapping is largely human-specific and absent in mice**, so mouse potency data systematically overstate IV delivery.

## Hepatosplenic Sequestration

Kupffer cells in the liver and splenic macrophages scavenge circulating virions — the same reticuloendothelial sink that sends IV nanoparticles to the liver. **Up to ~90% of an intravenous adenovirus dose is absorbed and destroyed by Kupffer cells** (Khare 2011), and the blood half-life of an IV oncolytic virus is only **~16–20 minutes** (enadenotucirev EVOLVE 16.7 min; Garcia-Carbonero ~20 min). The clinical consequence is measured as biopsy positivity, not percent-of-dose: after IV dosing, tumor genomes appear in 11/12 patients for the blood-stable group-B adenovirus enadenotucirev but only 2/8 for double-deleted vaccinia — delivery is real but grossly inefficient and highly chassis-dependent.

The consequence is the domain's recurring shape: [[ov-route-dependence]] — intratumoral and other local routes work, IV largely fails — and the wins are bypasses ([[ov-cell-carrier-delivery]], [[ov-virion-shielding]], and local injection), not a breaking of the wall.

gated-by:: [[ov-neutralizing-antibody]]

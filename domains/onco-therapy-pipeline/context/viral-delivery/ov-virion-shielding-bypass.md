---
topic: Virion shielding and nucleic-acid delivery — coating or replacing the oncolytic-virus surface to evade neutralizing antibodies, complement, and liver sequestration
keywords: [PEGylation, polymer coating, extracellular vesicle, protein corona, synthetic RNA virus, cloaking, shielding, liver de-targeting, repeat dosing, capsid modification]
related: [systemic-ov-delivery-wall.md, ov-neutralizing-antibody.md, ov-cell-carrier-bypass.md, sources/doronin-2009-peg-adenovirus.md, sources/kennedy-2022-synthetic-rna-virus.md]
defines:
  ov-virion-shielding: "Coating the oncolytic virion (PEG, polymer, extracellular-vesicle membrane, or replaced protein corona) or delivering its genome as synthetic RNA in a lipid nanoparticle — evading neutralizing antibodies, complement, and Kupffer/erythrocyte trapping to prolong circulation and enable repeat intravenous dosing"
kinds:
  ov-virion-shielding: method
epistemics: empirical
source: "Doronin 2009 PEG-20K (57–90× lower liver transduction); Zhang 2020 EV-mimetic (~14.8× NAb protection, cure 71.4% vs 28.5%); Huang 2023 corona-replacement (>30× circulation, >10× tumor); Kennedy 2022 synthetic SVV RNA (repeat IV, capsid-NAb-independent); Francini 2019 polyHPMA on clinical EnAd (>99% neutralization blockade)"
source_type: paper
asserted_at: "2026-07"
---

# Virion Shielding and Nucleic-Acid Delivery

[[ov-virion-shielding]] attacks the [[systemic-ov-delivery]] wall by changing the virion's surface — the thing antibodies, complement, and scavenger cells recognize — rather than changing where it is injected. It is the third bypass alongside [[ov-cell-carrier-delivery]] and local injection, and the only one that credibly enables **repeat** intravenous dosing.

## Polymer and PEG Coating — De-Target the Liver, Block Neutralization

High-molecular-weight PEG (20 kDa) reduced adenovirus liver transduction 57-fold at day 1 and 90-fold at day 3 without hepatotoxicity, and improved efficacy against Hep3B tumors (Doronin 2009). Crucially, shielding works on viruses already in human trials: a polyHPMA diazonium coat on the clinical oncolytic adenovirus enadenotucirev achieved >99% neutralization blockade while preserving replicative activity — the reduced activity in antibody was from delayed unpackaging, not permanent inactivation (Francini 2019).

## Extracellular-Vesicle and Corona Cloaking

Wrapping the virion in a membrane hides its capsid. An EV-mimetic (VSV-G) encapsulation gave ~14.8-fold neutralizing-antibody protection (83.7% vs 5.7% infection retained in anti-Ad5 serum) and raised the survival cure rate to 71.4% versus 28.5% for naked virus (Zhang 2020). Replacing the virus's plasma **protein corona** prolonged circulation >30-fold and increased tumor viral distribution >10-fold — more effective than targeting antibodies or complement directly (Huang 2023). The approach is not universal: a capsid-free EV form that left viral surface proteins exposed lost cytotoxicity under antibody (Saari 2020), so shielding only helps when the recognized surface is actually covered.

## Nucleic-Acid Delivery — Sidestep the Capsid Entirely

The most complete escape is to not inject a virion at all. Delivering the oncolytic genome as synthetic RNA in a lipid nanoparticle (synthetic Seneca Valley virus, Kennedy 2022) retained full potency under neutralizing antisera that completely abrogated native virions, and enabled up to 4 weekly IV doses in mice and 3 biweekly doses in primates — true repeat systemic dosing, because there is no capsid for antibody to recognize on the first injection. This is the convergence point between oncolytic virotherapy and the LNP/mRNA delivery platform.

## The Residual Limit

Shielding buys circulation time and antibody evasion but does not by itself solve tumor **penetration** — the shielded virion still has to reach and enter tumor cells. And capsid engineering that defeats IgM, complement, and Kupffer uptake simultaneously (e.g. an engineered triple-mutant adenovirus) still remains sensitive to high-titer pre-existing anti-capsid antibodies. Shielding is a strong circulation/repeat-dosing bypass, not a universal delivery solution.

bypasses:: [[ov-neutralizing-antibody]]
bypasses:: [[systemic-ov-delivery]]

---
topic: Exosome / extracellular-vesicle delivery — CD47-shielded, macropinocytosis-exploiting carriers for RNAi to tumor, safe and target-engaging in humans but without monotherapy responses
keywords: [exosome, extracellular vesicle, iExosome, KRAS G12D, siRNA, CD47, macropinocytosis, pancreatic cancer, iEXPLORE, Kalluri]
related: [../delivery/bypass.md, membrane-coated-nanoparticle.md, sources/kamerkar-2017-iexosome.md, sources/kalluri-2025-iexplore.md]
defines:
  exosome-delivery: "Using exosomes / extracellular vesicles as delivery vehicles — native CD47 shielding prolongs circulation and KRAS-driven macropinocytosis pulls the vesicle into cancer cells; the iExosome KRAS-G12D-siRNA program reached first-in-human trial (safe, target-engaging, no objective responses as monotherapy)"
kinds:
  exosome-delivery: method
epistemics: empirical
source: "Kamerkar 2017 Nature (iExosome KRAS-G12D siRNA, CD47-dependent, Panc-1 all alive d87 vs all control dead); Kalluri 2025 Nat Commun iEXPLORE Phase I NCT03608631 (no DLT, target engagement, 0 objective responses)"
source_type: paper
asserted_at: "2026-07"
---

# Exosome / EV Delivery

[[exosome-delivery]] uses the body's own vesicles as a carrier, exploiting two properties synthetic nanoparticles struggle to mimic: native immune shielding and a cancer-cell-specific uptake route. It is the most clinically mature biological carrier, and a form of [[delivery-bypass]].

## The iExosome Mechanism (Kamerkar 2017)

Mesenchymal/fibroblast-derived exosomes electroporated with siRNA against KRAS-G12D ("iExosomes") outperformed liposomes carrying the same siRNA in pancreatic cancer. Two mechanisms matter:

- **CD47 shielding.** Native surface CD47 is a "don't-eat-me" signal that prolongs circulation by evading monocyte capture; CD47-knockout exosomes lost both retention and efficacy — the benefit is CD47-dependent.
- **Macropinocytosis entry.** KRAS-driven tumors have high macropinocytosis, which pulls the vesicle in; a macropinocytosis inhibitor blocked exosome (but not liposome) uptake.

The efficacy was striking in mice: in the Panc-1 orthotopic model, all iExosome-treated animals were alive at day 87 (all controls dead), with tumors "nearly undetectable" past 200 days, and survival extended across multiple pancreatic models including immunocompetent ones.

## The Clinical Reality (Kalluri 2025, iEXPLORE)

The first-in-human trial (NCT03608631) in metastatic pancreatic cancer established that iExosomes are **safe** (no dose-limiting toxicities, no maximum tolerated dose up to 4.8 mg siRNA) and **target-engaging** (reduced KRAS-G12D mutant allele fraction, lower phospho-ERK, increased intratumoral CD8 T cells) — but produced **no objective responses**, only stable disease in a heavily pretreated population. Preclinically, the approach synergized with anti-CTLA-4 (not anti-PD-1), pointing to a checkpoint-combination path.

## Significance

iExosomes are a genuine milestone — a CD47-shielded, macropinocytosis-exploiting RNAi carrier that reached humans safely with measurable target engagement. But like the [[membrane-coated-nanoparticle]] class, they remain diffusion-limited (they do not solve tumor penetration or hypoxia), and monotherapy activity in humans is absent. The value is as a delivery chassis for combination regimens, not a standalone systemic-delivery solution.

supports:: [[delivery-bypass]]

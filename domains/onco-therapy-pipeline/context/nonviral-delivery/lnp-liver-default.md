---
topic: The LNP liver-default — untargeted lipid nanoparticles send ~90% of an intravenous dose to the liver via ApoE adsorption and LDL-receptor uptake, the barrier all extrahepatic targeting must overcome
keywords: [LNP, liver default, ApoE, LDL receptor, LDLR, hepatocyte, biodistribution, ionizable lipid, pKa, extrahepatic delivery]
related: [sort-organ-targeting.md, conjugated-lnp-targeting.md, ../delivery/lnp-vs-aav.md, ../delivery/delivery-wall.md]
defines:
  lnp-liver-default: "The default biodistribution of an untargeted lipid nanoparticle after intravenous injection: ~90% of the dose goes to the liver because the particle adsorbs serum apolipoprotein E, whose ligand is the hepatocyte LDL receptor — the barrier that SORT and ligand-conjugated LNPs must overcome for extrahepatic and tumor delivery"
kinds:
  lnp-liver-default: constraint
epistemics: empirical
source: "Cheng 2020 Nat Nanotechnol (base LNP hepatocyte-optimized); mechanism ApoE→LDLR (Hou 2021 Nat Rev Mater); consistent ~90% liver clearance reviews"
source_type: paper
asserted_at: "2026-07"
---

# The LNP Liver-Default

[[lnp-liver-default]] is the specific reason systemic lipid nanoparticles are a liver-delivery platform, not a tumor-delivery platform — the molecular basis of the LNP side of the [[solid-tumor-delivery]] wall and the sharpest expression of the biodistribution problem noted in [[lnp-vs-aav-tradeoffs]].

## The Mechanism (ApoE → LDLR)

After intravenous injection, an ionizable or neutral LNP adsorbs serum **apolipoprotein E (ApoE)** onto its surface, forming a protein corona. ApoE is the natural ligand for the hepatocyte **LDL receptor (LDLR)**, so the particle is taken into hepatocytes by receptor-mediated endocytosis within about an hour of injection. The result is that **~90% of an untargeted LNP dose is cleared through the liver**. This is why NTLA-2001 (a liver target) works so well and why the LNP platform succeeded first for hepatic indications.

## Why pKa Optimization Does Not Fix It

The ionizable lipid's pKa (~6.2–6.6) is tuned for endosomal escape — the [[endosomal-escape]] bottleneck — not for organ tropism, and adjusting it does not redirect the particle away from the liver. Helper-lipid and ionizable-lipid identity govern how much ApoE binds and therefore the degree of liver tropism, but the default destination remains hepatocytes.

## The Two Ways Out

Extrahepatic delivery requires defeating the ApoE/LDLR default, and there are two routes: rewrite the protein corona with a charged excipient ([[sort-organ-targeting]]), or bolt a targeting ligand onto the surface so an antibody/DARPin/receptor interaction outcompetes ApoE-LDLR ([[conjugated-lnp-targeting]]). Both are covered in this cluster. Notably, even antibody conjugation reduces but does not fully eliminate hepatic uptake (anti-CD117 LNPs still edit 76–79% of liver cells), so the liver-default is a barrier that is mitigated, not erased.

blocks:: [[solid-tumor-delivery]]

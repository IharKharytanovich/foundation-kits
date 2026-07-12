---
topic: Retargeted / engineered viral vectors beyond default AAV — capsid and envelope engineering that redirects tropism to a chosen cell type and de-targets the liver
keywords: [retargeting, capsid engineering, AAV, DARPin, nanobody, directed evolution, machine learning capsid, DART-AAV, FAP, tropism, liver de-targeting, Fit4Function]
related: [engineered-vlp-editor-delivery.md, in-vivo-cart-lentivirus.md, ../delivery/lnp-vs-aav.md, sources/demircan-2024-dart-aav.md, sources/eid-2024-fit4function.md, sources/olarewaju-2024-fap-aav.md]
defines:
  retargeted-viral-vector: "A viral vector (AAV or lentivirus) whose capsid or envelope has been engineered — by directed evolution, machine-learning design, or displayed DARPin/nanobody — to redirect tropism to a chosen cell type (a T-cell subset, tumor stroma) and de-target the liver, converting the vector's default biodistribution into a delivery bypass"
kinds:
  retargeted-viral-vector: method
epistemics: empirical
source: "Demircan 2024 DART-AAV (up to 80% CD8+ T cells, near-absolute selectivity, liver de-targeting); Eid 2024 Fit4Function (88% multi-trait, up to 1000× hepatocyte); Olarewaju 2024 αFAP-AAV (>5× tumor / 8.8× fewer liver); Ogden 2019 (ML 25.6% vs 0.2% functional)"
source_type: paper
asserted_at: "2026-07"
---

# Retargeted Viral Vectors

[[retargeted-viral-vector]] engineering attacks the same problem as ionizable-lipid chemistry does for LNPs: a vector's **default biodistribution goes to the liver**, and retargeting redirects it. Where [[lnp-vs-aav-tradeoffs]] notes AAV defaults to hepatocytes, capsid/envelope engineering turns that default into a chosen destination — making the vector itself a form of [[delivery-bypass]].

## Machine-Learning and Directed-Evolution Capsids

Random mutagenesis rarely yields viable multi-mutation capsids; ML-guided design does. Ogden 2019 showed that at ≥4 mutations, 25.6% of ML-designed AAV2 variants were functional versus 0.2% of random ones (~100× hit rate). Eid 2024's Fit4Function pipeline trained trait-specific models on a 240,000-variant library and produced a multi-trait library where 88% of variants met all six criteria, with up to 1000× higher human-hepatocyte transduction than AAV9 and models that predicted macaque biodistribution from mouse + human-in-vitro data.

## Receptor Retargeting to Immune Cells and Tumor Stroma

Displaying a DARPin or nanobody on an ablated-tropism capsid gives near-absolute cell-type selectivity:
- **DART-AAV** (CD8 DARPin in AAV2/AAV6): up to 80% of activated CD8⁺ T cells transduced from a single injection, selectivity "close to absolute," with exceptional liver de-targeting — an alternative to lentivirus for in-vivo T-cell engineering.
- **αFAP-nanobody AAV2** (tumor stroma): 23–80× more selective transduction of FAP⁺ cells in vitro and, in vivo, >5× more tumor genomes with 8.8× fewer liver genomes — an AAV redirected to the tumor microenvironment.

## The Cargo Constraint Retargeting Cannot Fix

Retargeting changes *where* an AAV goes, not *how much* it can carry. AAV's ~4.7 kb ceiling means SpCas9 barely fits and base/prime editors exceed it, forcing dual-AAV split-intein strategies that lower efficiency and prolong expression — which is precisely why [[engineered-vlp-delivery]] and other transient formats are preferred for editors. Retargeted AAV is strongest for cargo that fits and benefits from durable expression; for editors, transient delivery wins on off-target safety.

supports:: [[delivery-bypass]]

---
topic: The CMC wall — manufacturing quality deficiencies as the dominant regulatory barrier for cell and gene therapies
keywords: [CMC, quality, FDA, CRL, complete response letter, manufacturing deficiency, process validation, potency, analytical, stability, regulatory barrier]
related: [bioreactor.md, models.md, ../walls/cmc.md, sources/cmc-deficiency-analysis-2024.md, sources/fda-2024-cgt-cmc-guidance.md]
defines:
  cmc-wall: "The structural quality/manufacturing barrier where ~74% of FDA CRLs for cell/gene therapy cite CMC deficiencies — per-patient lot release, process validation, and potency assay requirements that scale linearly with patient volume"
kinds:
  cmc-wall: constraint
epistemics: empirical
source: "FDA CRL analysis 2020-2024 (RAPS/OTAT data); FDA CMC guidance for gene therapy INDs 2020/2024; Levine 2017 manufacturing characterization"
source_type: paper
asserted_at: "2026-07"
---

# The CMC Wall

[[cmc-wall]] is the structural regulatory barrier arising from manufacturing quality requirements applied to personalized therapeutics. Unlike conventional biologics where one validated process serves millions of doses, each personalized therapy is an individual lot — every patient batch requires independent lot release testing, chain-of-identity documentation, and process validation evidence.

Approximately 74% of FDA Complete Response Letters for cell and gene therapy BLAs (2020–2024) cite at least one CMC deficiency. The most common sub-categories are manufacturing process validation (~55%), analytical method validation (~45%), stability data (~35%), and comparability (~30%). This makes manufacturing quality — not clinical efficacy — the dominant regulatory barrier to approval.

The per-patient quality burden drives cost above $100,000/patient for autologous cell therapies. Each batch is a distinct product with its own release specification test results. This is structurally different from the CMC challenges of conventional manufacturing, where process validation is amortized across commercial-scale batches. The [[cmc-wall]] is a constraint on [[manufacturing-throughput]] — it does not merely slow production, it imposes a linear quality cost per patient that no process optimization eliminates:

rate-limits:: [[manufacturing-throughput]]

The relationship between the CMC wall and the overall pipeline is indirect: [[manufacturing-throughput]] is already a contributing floor to [[personalized-therapy-throughput]], not the binding constraint (that is delivery). But within manufacturing, the CMC wall is what makes personalized products structurally more expensive and slower to approve than conventional biologics — and it applies regardless of platform (mRNA, viral vector, cell product).

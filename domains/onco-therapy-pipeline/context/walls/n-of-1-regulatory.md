---
topic: The N-of-1 regulatory and access wall — no standard pathway and majority of eligible patients do not receive precision therapy
keywords: [N-of-1, regulatory, FDA, IND, access, precision oncology, utilization, cost, health equity, molecular testing, NSCLC, individualized therapy, Right to Try]
related: [sources/precision-oncology-access.md, ../practice/end-to-end-case-method.md, ../manufacturing/qc-release.md]
defines:
  n-of-1-regulatory-wall: "The systemic constraint that no standardized FDA regulatory pathway exists for truly individualized (N-of-1) cancer therapies, compounded by the fact that ~64% of eligible advanced-NSCLC patients do not receive matched precision therapy due to testing gaps, access delays, cost barriers, and insurance coverage limitations"
kinds:
  n-of-1-regulatory-wall: constraint
epistemics: empirical
source: "Kris 2014 JAMA (64% NSCLC); Marquart 2018 BMC Med (8.3% eligibility); FDA CBER 2024 ASO guidance; Flaherty 2023 Nat Med (NCI-MATCH)"
source_type: paper
asserted_at: "2026-07"
---

# The N-of-1 Regulatory and Access Wall

[[n-of-1-regulatory-wall]] is the systemic constraint: even when the biology, the diff, and the manufacturing work, most patients do not receive personalized therapy because the regulatory, economic, and logistic infrastructure does not support it at scale.

**The access gap:** Kris et al. 2014 (1007 advanced NSCLC patients) found that ~64% of patients with actionable mutations did not receive a matched targeted therapy. Marquart et al. 2018 estimated only 8.3% of US cancer patients overall are eligible for an FDA-approved genome-targeted therapy. The NCI-MATCH trial (Flaherty et al. 2023) demonstrated that molecular matching is feasible at scale but achieved only 10-15% objective response rates across arms.

**Regulatory pathway absence:** The existing IND framework requires per-product submissions. For a truly individualized therapy (each patient's mRNA vaccine is a unique sequence, each patient-specific CAR-T is a unique product), each treatment is technically a new drug. FDA CBER's 2024 draft guidance on individualized ASOs is the first framework addressing N-of-1 therapies, but it covers only antisense oligonucleotides and requires single-patient INDs. No analogous pathway exists for individualized mRNA vaccines, patient-specific editing constructs, or autologous cell products outside clinical trials.

**Cost and logistics:** Personalized cell therapies cost $373,000-$500,000+ per patient; personalized mRNA vaccines are estimated at $100,000-$300,000 in trial settings. Manufacturing is centralized at a handful of facilities. The [[qc-release-bottleneck]] adds per-patient lot release cost and time. These economics are incompatible with broad population access.

The wall does not block the biology — it blocks the deployment. It rate-limits the real-world throughput of the pipeline independently of how fast the science advances:

rate-limits:: [[personalized-therapy-throughput]]

**Partial bypasses:** Platform trials (umbrella/basket designs) amortize regulatory overhead across patients. BioNTech's individualized neoantigen vaccine (autogene cevumeran) is advancing through a standard randomized Phase 2 design (KEYNOTE-942), which may establish a regulatory precedent for the class. The Right to Try Act (2018) provides a narrow access route for terminally ill patients outside trials but without the safety monitoring of an IND.

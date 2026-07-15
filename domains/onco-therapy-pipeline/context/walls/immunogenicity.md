---
topic: Neoantigen immunogenicity — the immune branch's rate limit, not computable de novo
keywords: [neoantigen, immunogenicity, TCR, T-cell, HLA binding, prediction, validation, immune branch, rate limit]
related: [../map.md, ../design/immune/index.md]
defines:
  neoantigen-immunogenicity: "Whether a predicted neoantigen actually triggers a T-cell response — not computable de novo; <60% of predictions are immunogenic, ~6% of top predictions validate"
kinds:
  neoantigen-immunogenicity: constraint
epistemics: empirical
source: "research/onco stages 02/03; <60% immunogenic; ~6% top predictions validate; <10% of 184 in mice"
source_type: paper
asserted_at: "2026-07"
---

# Neoantigen Immunogenicity

Peptide-HLA binding predicts well, but TCR recognition does not: [[neoantigen-immunogenicity]] is not computable de novo. <60% of predicted neoantigens are immunogenic; ~6% of top predictions validate; <10% of 184 in mice. It is the biological floor of the immune branch — the reason synthesis speed is not the loop's binding constraint.

rate-limits:: [[personalized-therapy-throughput]]

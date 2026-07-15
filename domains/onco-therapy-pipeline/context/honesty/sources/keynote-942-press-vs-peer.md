---
topic: KEYNOTE-942 mRNA-4157/V940 — press-release framing vs peer-reviewed publication in melanoma RFS
keywords: [KEYNOTE-942, mRNA-4157, V940, Moderna, Merck, melanoma, RFS, press release, peer review, confidence interval, interim analysis]
related: [../provenance-grading-method.md]
epistemics: empirical
source: "Moderna/Merck press release 2022-12-14; Weber et al., Lancet 2024, doi:10.1016/S0140-6736(24)00169-6"
source_type: corporate-pr
asserted_at: "2026-07"
---

# KEYNOTE-942: Press Release vs Peer-Reviewed Publication

## The Press Release (December 2022)

Moderna and Merck jointly announced phase 2b results of mRNA-4157 (V940) combined with pembrolizumab in resected stage III/IV melanoma. The headline number: **44% reduction in the risk of recurrence or death** (HR 0.561, one-sided p = 0.0266) compared to pembrolizumab alone. The release described this as a "statistically significant and clinically meaningful" improvement. The trial enrolled 157 patients (107 combo, 50 pembro alone) — a small, randomized phase 2b.

The press release did not foreground the confidence interval width, the small sample size, or the interim nature of the analysis. Media coverage widely amplified the 44% figure as established efficacy.

## The Peer-Reviewed Publication (Lancet 2024)

Weber et al. published the full KEYNOTE-942 data in the Lancet. The HR of 0.561 was confirmed, but the publication reported the 95% CI as 0.309–1.017 — **crossing 1.0**, meaning by conventional two-sided testing the result was not statistically significant. The one-sided p-value (0.0266) was pre-specified, and the trial was not powered for a two-sided test at this sample size, but the CI width makes the point estimate far less certain than the press release implied.

The 3-year recurrence-free survival rates (74.8% combo vs 55.6% pembro) are clinically interesting but the absolute patient numbers in the tail are very small (single digits), making the Kaplan-Meier curves fragile.

## What This Illustrates

This is a textbook case of `corporate-pr` → `paper` confidence decay. The headline number (44% reduction) is technically correct but the uncertainty around it — which only the peer-reviewed publication forced into view — makes the number far less actionable than the press release framing suggests.

In the DCC source-weight taxonomy, the press-release version carries a prior of **0.55** (`corporate-pr`); the Lancet publication carries **0.95** (`paper`). A knowledge system that indexed the press release at paper confidence would have inflated the evidence for personalized mRNA vaccines in melanoma by ~73% (0.95/0.55).

## Key Numbers

| Metric | Press Release (2022) | Lancet (2024) |
|--------|---------------------|---------------|
| HR for RFS | 0.561 | 0.561 |
| 95% CI | not foregrounded | 0.309–1.017 |
| p-value framing | one-sided 0.0266, "significant" | one-sided 0.0266, CI crosses 1.0 |
| n (combo / control) | 107 / 50 | 107 / 50 |
| 3-year RFS | not reported | 74.8% vs 55.6% |

---
topic: Route-dependence of oncolytic virus activity — intratumoral and local delivery work where the same virus given intravenously fails
keywords: [route dependence, intratumoral, intravesical, intraperitoneal, intravenous, local delivery, abscopal, CVA21, STORM, CLEVER, delivery route]
related: [systemic-ov-delivery.md, ov-neutralizing-antibody.md, ../landscape/oncolytic-virotherapy.md, sources/andtbacka-2021-calm-cva21.md]
defines:
  ov-route-dependence: "The empirical rule that oncolytic-virus activity depends on delivery route: intratumoral / intravesical / intraperitoneal injection produces responses, while the same virus given intravenously usually fails — because the local route sidesteps the systemic delivery wall"
kinds:
  ov-route-dependence: claim
epistemics: empirical
source: "CVA21: CALM/CAPRA/CANON (local) vs STORM/CLEVER (IV, 0–9% ORR); measles IP vs IV; T-VEC/RP1 intratumoral abscopal"
source_type: clinical-trial
asserted_at: "2026-07"
---

# Route Decides Activity

[[ov-route-dependence]] is one of the most reproducible facts in the field: the same oncolytic virus is active injected locally and inert given intravenously, because the local route never has to survive the [[systemic-ov-delivery]] gauntlet. The cleanest natural experiment is coxsackievirus A21 (CVA21/V937):

- **Local routes work.** Intratumoral CALM in melanoma reached ORR 28–39% with a 6-month immune-PFS of 38.6%; intratumoral CVA21 + pembrolizumab (CAPRA) reached ORR 47%, CR 22%, median OS 30.9 months; intravesical CVA21 (CANON) produced a histologic complete response in bladder cancer with tumor-selective replication.
- **The same virus IV fails.** Intravenous CVA21 in STORM/KEYNOTE-200 gave ORR 6% (monotherapy) to 20% (urothelial) — no better than pembrolizumab alone, with 86% of intratumoral virus undetectable by day 15. Intravenous CVA21 + ipilimumab in uveal melanoma (CLEVER) gave ORR 0%.

The pattern generalizes: measles is active intraperitoneally in ovarian cancer (median OS 26.5 months, MV-NIS) but limited IV by anti-measles immunity; T-VEC and RP1 are injected intratumorally yet still drive **abscopal** shrinkage of non-injected lesions (RP1: ≥30% reduction in 79% of non-injected lesions) — the systemic benefit rides the immune response the local lysis provokes, not the virus travelling through blood.

The practical reading: for a solid tumor you can reach a needle to, inject it; for disseminated disease, the answer is a bypass ([[ov-cell-carrier-delivery]]) or an entirely different (non-viral, retargeted) vector, not a higher IV dose of naked virus.

gated-by:: [[systemic-ov-delivery]]

---
topic: Chemokine- and FLT3L-armed oncolytic viruses — arming to recruit effector T cells (CXCL9/10/11) and cross-presenting cDC1 (FLT3L, XCL1) into the tumor
keywords: [CXCL9, CXCL10, CXCL11, CCL5, FLT3L, XCL1, cDC1, dendritic cell recruitment, T-cell trafficking, CXCR3, OH2-FLT3L, abscopal, chemokine arming]
related: [armored-oncolytic-virus.md, ../landscape/oncolytic-virotherapy.md]
defines:
  chemokine-flt3l-arming: "Arming an oncolytic virus with chemokines (CXCL9/10/11, CCL5) to recruit CXCR3+ effector T cells, and/or FLT3L / XCL1 to recruit and expand cross-presenting cDC1 dendritic cells — converting a T-cell-excluded tumor into an infiltrated one and enabling abscopal control"
kinds:
  chemokine-flt3l-arming: method
epistemics: empirical
source: "Zhang 2025 OH2-FLT3L (abscopal: unarmed fails distant tumor, armed succeeds); Senecavirus CXCL11+vXCL1 2026 (75% rechallenge protection); Ad5/3 CXCL9/10/IL-15 RCC 2024; oAd-CXCL11+B7H3.CAR-T 2023 (CD8-dependent)"
source_type: paper
asserted_at: "2026-07"
---

# Chemokine and FLT3L Arming

[[chemokine-flt3l-arming]] targets the trafficking half of the immune problem: an oncolytic virus armed with the right chemokine pulls effector T cells (and, with FLT3L/XCL1, the cross-presenting dendritic cells that prime them) into a tumor they would otherwise be excluded from. It is the arm of [[armored-oncolytic-virus]] that most directly addresses immune exclusion, and it complements the barriers covered in the trafficking cluster.

## FLT3L — Recruiting the Priming Cell (OH2-FLT3L, 2025)

OH2 (clinical oncolytic HSV-2) armed with FLT3L significantly out-infiltrated the unarmed virus on CD3/CD4/CD8/CD11c⁺ DC (all p<0.01 or better). The clearest armed-vs-unarmed signal was abscopal: unarmed OH2 suppressed only the injected tumor and **failed** on the distant tumor, while OH2-FLT3L significantly inhibited **both** — recruiting DCs let the local response become systemic.

## Separating T-Cell Quantity from Quality (Senecavirus CXCL11 + vXCL1, 2026)

A dual-armed Senecavirus A expressing CXCL11 (CXCR3 ligand → effector T/NK recruitment) plus vXCL1 (a high-activity XCL1 variant → XCR1⁺ cDC1 recruitment) made an explicit mechanistic point: CXCL11 alone maximized T-cell **number**, adding vXCL1 maximized T-cell **function**. Parental virus killed the mice within ~20 days; the combination produced durable regression and 75% protection on rechallenge, shifting the cDC1/cDC2 and M1/M2 ratios toward cross-presentation and away from suppression.

## Chemokine Arming for CAR-T and Effector Recruitment

- Ad5/3-Δ24 arming CXCL9, CXCL10, or IL-15 (renal cell carcinoma, 2024): the unarmed backbone attracted the fewest T cells; CXCL9/CXCL10 outperformed IL-15 for CD3/CD4 recruitment, IL-15 favored NK.
- oAd-CXCL11 + B7H3.CAR-T (glioblastoma, 2023): CXCL11 was the strongest CXCR3-ligand chemoattractant for CAR-T (whose baseline infiltration into flank tumors is <1% by day 5); the combination reprogrammed the TME (↑CD8/NK/M1, ↓MDSC/Treg/M2) and its efficacy was abolished by CD8 depletion but not NK depletion.

CCL5/RANTES arming works too but is disfavored because CCL5 also recruits regulatory T cells and can be pro-tumorigenic — a reminder that chemokine choice determines which cells arrive.

This is the direct oncolytic-virus answer to the [[chemokine-axis-mismatch]] barrier: where the tumor epigenetically silences or nitrates its CXCR3-ligand chemokines, an armed virus manufactures them in place, restoring the gradient effector T cells need to enter.

supports:: [[armored-oncolytic-virus]]
bypasses:: [[chemokine-axis-mismatch]]

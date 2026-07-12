---
topic: TME immunosuppression — regulatory T cells, myeloid-derived suppressor cells, and M2 tumor-associated macrophages that actively disable T cells inside the tumor
keywords: [immunosuppression, regulatory T cell, Treg, FoxP3, MDSC, arginase, iNOS, tumor-associated macrophage, TAM, M2, CD163, TGF-beta, IL-10]
related: [solid-tumor-immune-response.md, metabolic-hostility.md, sources/shang-2015-treg-meta.md]
defines:
  tme-immunosuppression: "The suppressive cell populations inside a solid tumor — regulatory T cells (often >50% of tumor T cells), myeloid-derived suppressor cells, and M2 tumor-associated macrophages — that actively neutralize effector T cells through arginase, iNOS/NO, peroxynitrite, IL-10, TGF-β, and adenosine"
kinds:
  tme-immunosuppression: constraint
epistemics: empirical
source: "Shang 2015 Sci Rep meta (FoxP3 Treg high → OS OR 1.46, up to 5.11 cervical); MDSC review Mol Cancer 2024 (ARG1→TCR-ζ, iNOS→JAK3/STAT5); Xue 2021 (CD163 TAM CRC HR ~0.18)"
source_type: paper
asserted_at: "2026-07"
---

# TME Immunosuppression — Active Neutralization

[[tme-immunosuppression]] is the cellular arm of the function gate: three suppressive populations that do not merely fail to help but actively disable effector T cells after they arrive, blocking [[solid-tumor-immune-response]].

## Regulatory T Cells

Intratumoral Tregs often exceed 50% of all tumor T cells (roughly 10× their blood frequency). A meta-analysis of 76 studies and 15,512 patients found high FoxP3⁺ Treg density associated with worse 5-year survival (pooled OR 1.46, 95% CI 1.19–1.78) — strongest in cervical (OR 5.11), renal (4.26), and melanoma (2.15). The effect is **tumor-context-dependent**: in colorectal (OR 0.71), head-and-neck (0.69), and esophageal (0.51) cancers, Tregs are prognostically favorable because they suppress tumor-promoting inflammation. A high CD8/Treg ratio predicts the inflamed, responsive phenotype.

## Myeloid-Derived Suppressor Cells

MDSCs disable T cells through several enzymatic mechanisms: secreted **arginase-1** depletes L-arginine, downregulating the T-cell-receptor ζ chain and linking to [[metabolic-hostility]]; **inducible nitric oxide synthase** produces NO that inhibits JAK3/STAT5 signaling and reduces MHC-II; and **peroxynitrite/ROS** nitrate the T-cell receptor and chemokines (the mechanism behind CCL2 nitration in [[chemokine-axis-mismatch]]). MDSCs also expand Tregs via IL-10 and TGF-β, polarize macrophages to M2, and impair NK cells by reducing NKG2D.

## Tumor-Associated Macrophages

TAMs are often the most abundant immune population in solid tumors, and the immunosuppressive M2 phenotype (CD163⁺/CD204⁺/CD206⁺) correlates with progression and worse prognosis — in a 209-patient colorectal cohort, high CD163⁺ TAM density independently predicted shorter OS (hazard ratio ~0.18 for low-vs-high). TAM reprogramming toward M1 and CSF1R blockade are the leading translational levers, but no practice-changing solid-tumor survival benefit exists yet.

Depleting or reprogramming these populations is an active but largely preclinical/early-phase countermeasure; armored CAR-T that resists their signals (for example dominant-negative TGF-βRII) is the dominant engineering response.

blocks:: [[solid-tumor-immune-response]]

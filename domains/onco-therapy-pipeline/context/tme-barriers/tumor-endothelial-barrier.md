---
topic: The tumor endothelial barrier — anergic vessels that downregulate adhesion molecules and a FasL/ETBR death-and-exclusion barrier that kills effector CD8 while sparing Treg
keywords: [endothelial anergy, ICAM-1, VCAM-1, FasL, endothelin-B receptor, ETBR, extravasation, Treg, c-FLIP, tumor vasculature, T-cell exclusion]
related: [solid-tumor-immune-response.md, vascular-normalization-hev.md, sources/motz-2014-endothelial-fasl.md, sources/allen-2017-hev-ltbr.md]
defines:
  tumor-endothelial-barrier: "The tumor vasculature as a selective immune barrier: anergic endothelium that fails to upregulate ICAM-1/VCAM-1 (blocking T-cell extravasation), plus a FasL death barrier and endothelin-B-receptor signaling that selectively kill or exclude effector CD8 T cells while sparing Tregs"
kinds:
  tumor-endothelial-barrier: constraint
epistemics: empirical
source: "Motz 2014 Nat Med (endothelial FasL kills effector CD8, spares Treg via c-FLIP); Buckanovich 2008 Nat Med (ETBR suppresses ICAM-1 via NO); endothelial-anergy review PMC11427519"
source_type: paper
asserted_at: "2026-07"
---

# The Tumor Endothelial Barrier

[[tumor-endothelial-barrier]] is the second gate to infiltration: even if a T cell reaches a tumor vessel, the endothelium won't let it through — and may kill it. The tumor vasculature is not a passive conduit but a selective immune gatekeeper, blocking [[solid-tumor-immune-response]] at the extravasation step.

## Endothelial Anergy — No Adhesion

Tumor endothelial cells become **anergic**: unresponsive to the inflammatory signals (TNFα, IL-1) that normally upregulate the adhesion molecules ICAM-1, ICAM-2, VCAM-1, and E-selectin. VEGF and angiogenic signaling drive this downregulation, so circulating T cells cannot firmly adhere and extravasate. VEGF blockade restores adhesion-molecule expression and leukocyte–endothelial interaction — the mechanistic rationale for [[vascular-normalization]].

## The FasL Death Barrier (Motz 2014)

More actively, tumor vessels selectively express **FasL** (absent from normal vasculature), induced by tumor-derived VEGF-A + IL-10 + PGE2. FasL⁺ vasculature correlates with scarce CD8 infiltration and a predominance of FoxP3⁺ Tregs across ovarian, colon, bladder, prostate, and renal cancers (breast is an exception). The selectivity is the striking part: endothelial FasL **kills effector CD8 and CD4⁺CD25⁻ T cells but spares regulatory T cells**, which resist apoptosis through higher anti-apoptotic c-FLIP. Disrupting Fas–FasL (genetically or with anti-VEGF + COX inhibition) markedly increases CD8 tumor-infiltrating lymphocytes, raises the CD8/Treg ratio, and shrinks tumors in a CD8-dependent way.

## The Endothelin-B Receptor Gate (Buckanovich 2008)

Independently, the endothelin-B receptor (ETBR) is overexpressed on tumor endothelium and suppresses ICAM-1 via nitric oxide, preventing T-cell adhesion. ETBR neutralization (BQ-788) increases T-cell homing in an ICAM-1-dependent manner and enables response to otherwise-ineffective immunotherapy.

Together, anergy, FasL, and ETBR make the tumor endothelium a wall that admits suppressors and excludes or kills effectors — reversible only by normalizing the vasculature and, better still, inducing high endothelial venules.

blocks:: [[solid-tumor-immune-response]]

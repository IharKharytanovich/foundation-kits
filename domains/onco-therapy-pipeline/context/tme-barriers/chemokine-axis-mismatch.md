---
topic: Chemokine-axis mismatch — tumors fail to display the CXCR3 ligands and constitutive CCL5 that recruit effector T cells, via epigenetic silencing and chemokine nitration
keywords: [chemokine, CXCR3, CXCL9, CXCL10, CXCL11, CCL5, CCL2 nitration, EZH2, DNMT, H3K27me3, T-cell recruitment, immune exclusion]
related: [solid-tumor-immune-response.md, tumor-endothelial-barrier.md, sources/dangaj-2019-ccl5-cxcl9.md, sources/molon-2011-ccl2-nitration.md, ../viral-delivery/chemokine-flt3l-arming.md]
defines:
  chemokine-axis-mismatch: "The failure of a tumor to produce the CXCR3-ligand chemokines (CXCL9/CXCL10/CXCL11) plus constitutive CCL5 that recruit effector CD8 T cells — via epigenetic silencing (EZH2/H3K27me3, DNMT methylation) or peroxynitrite nitration — so the tumor presents no gradient for effector T cells to follow and instead recruits suppressive myeloid cells"
kinds:
  chemokine-axis-mismatch: constraint
epistemics: empirical
source: "Dangaj 2019 Cancer Cell (CCL5+CXCL9 relay); Xu 2024 Commun Biol (EZH2 H3K27me3 silences CXCL9, ESCC 61% excluded); Molon 2011 JEM (CCL2 nitration); Qian 2019 Pancreatology (plasma CXCL9 OS 314 vs 136 d)"
source_type: paper
asserted_at: "2026-07"
---

# Chemokine-Axis Mismatch — No Gradient to Follow

[[chemokine-axis-mismatch]] is the first reason effector T cells never enter a solid tumor: there is no chemokine gradient to draw them in. Effector CD8 T cells home via the receptor CXCR3 to its three interferon-γ-inducible ligands CXCL9/CXCL10/CXCL11, amplified by tumor-cell-derived constitutive CCL5. Tumors defeat this axis in several ways, all of which block [[solid-tumor-immune-response]] at the infiltration gate.

## The Relay and Its Loss (Dangaj 2019)

CD8 infiltration requires a cooperative relay: constitutive tumor **CCL5** plus interferon-induced myeloid **CXCL9**. CCL5^hi CXCL9^hi tumors are the immunoreactive subset with prolonged survival and checkpoint-inhibitor response. Tumors lose CCL5 through DNA-methylation silencing, which desertifies the T-cell infiltrate; re-expressing CCL5 restores CXCL9 and T cells (interferon-γ-dependent).

## Epigenetic Silencing (Xu 2024; Peng 2015)

The polycomb methyltransferase **EZH2** deposits the repressive H3K27me3 mark on the CXCL9 promoter, silencing it. In esophageal squamous carcinoma, 61.5% of tumors were immune-excluded and 15.6% desert (77% cold), with EZH2/DNMT3A inversely correlated to CD8 density; the EZH2 inhibitor GSK126 restored CXCL9 and increased CD8 transwell migration, an effect abolished by an anti-CXCL9 antibody. The same EZH2/DNMT1 silencing of CXCL9/CXCL10 was shown in ovarian and colon cancer — this is why DNMT/EZH2 inhibitors can re-warm cold tumors.

## Chemical Nitration (Molon 2011)

Even when CCL2 is present, intratumoral peroxynitrite **nitrates** it, so it can no longer attract CD8 T cells (trapping them in the stroma) while myeloid cells — with far higher CCR2 (MFI 13.2 vs 2.3) — still respond. Nitration converts a T-cell chemoattractant into a myeloid/MDSC one.

## The Outcome Correlation

Higher CXCR3-ligand levels track with better survival: in pancreatic cancer, high plasma CXCL9 gave median OS 314 versus 136 days (HR 0.452) and CXCL10 374 versus 163 days. (Caveat: CXCR3 has a documented dual pro-tumor role via the CXCR3-B splice variant and Treg recruitment, so "more CXCL9" is not monotonically good.)

The oncolytic-virus answer to this barrier is [[chemokine-flt3l-arming]] — arming a virus to secrete CXCL9/10/11 (and FLT3L) directly in the tumor; CAR-T can also be engineered with matching chemokine receptors.

blocks:: [[solid-tumor-immune-response]]

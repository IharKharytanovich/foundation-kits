---
topic: In-vivo CAR-T generation via targeted lentivirus — programming T cells inside the patient, eliminating ex-vivo manufacturing and bypassing the solid-tumor delivery wall
keywords: [in-vivo CAR-T, lentivirus, VivoVec, cocal pseudotype, Nipah pseudotype, anti-CD3, anti-CD8, VSV-G mutant, Interius, Kelonia, Umoja, apheresis-free]
related: [retargeted-viral-vectors.md, ../delivery/in-vivo-car-t.md, ../delivery/bypass.md, sources/nicolai-2024-vivovec-nhp.md, sources/michels-2023-vivovec-poc.md]
defines:
  in-vivo-cart-generation: "Generating CAR-T cells inside the patient by injecting a T-cell-retargeted lentivirus (or targeted LNP) that transduces circulating T cells directly — no apheresis, no ex-vivo manufacturing, no lymphodepletion — bypassing both the CAR-T manufacturing wall and the solid-tumor delivery wall"
kinds:
  in-vivo-cart-generation: method
epistemics: empirical
source: "Nicolai 2024 Blood (VivoVec NHP, up to 65% circulating T cells CAR+, B-cell aplasia >10 wk, no hepatic transduction); Michels 2023 JITC (VivoVec POC); Pfeiffer 2018 (first in-vivo human CD19-CAR-T); Interius/Kelonia first-in-human 2024–25"
source_type: paper
asserted_at: "2026-07"
---

# In-Vivo CAR-T via Targeted Lentivirus

[[in-vivo-cart-generation]] is a double bypass. It sidesteps the CAR-T manufacturing wall (no leukapheresis, no ~2–4-week ex-vivo culture, no lymphodepletion) and it sidesteps the [[solid-tumor-delivery]] wall the same way the LNP in-vivo-CAR-T work does — by programming blood T cells that then traffic to tumor on their own, rather than delivering cargo into the tumor. It is the lentiviral sibling of the targeted-LNP approach and a concrete form of [[delivery-bypass]].

## Primate Proof (Nicolai 2024)

The strongest peer-reviewed dataset: a cocal-pseudotyped lentivirus displaying a CD58 + anti-CD3 scFv + CD80 multidomain fusion ligand, carrying an anti-CD20 CAR, given intranodally to 4 immunocompetent macaques **without lymphodepletion**. CAR-T reached up to 65% of circulating T cells by day 10 (absolute peaks 596–11,182 cells/µL), B cells were completely eliminated by day 7 and stayed undetectable for 56–76 days, and biodistribution at day 139 showed transgene only in injected and downstream nodes — **no hepatocyte transduction**. A 5-fold lower dose gave minimal response (a dose threshold).

## The Platform and Its Envelopes (Michels 2023; Pfeiffer 2018)

The proof-of-concept VivoVec (Michels 2023) generated functional anti-CD19 CAR-T from unstimulated PBMCs and used a rapamycin-activated cytokine receptor to selectively expand CAR⁺ cells. Two envelope strategies dominate: **cocal-pseudotyped LV + surface anti-CD3 scFv** (Umoja) and **VSV-G-mutant / measles / Nipah pseudotypes displaying a CD3-, CD7-, or CD8-binder** (Interius, Kelonia, Oxford Biomedica). The Buchholz-lineage CD8-LV (Nipah-pseudotyped + anti-CD8) was the first to make functional human CD19-CAR-T in vivo (Pfeiffer 2018). Nipah pseudotyping restricts off-target transduction ~25× versus VSV-G.

## Clinical State (flag: early, not peer-reviewed)

Interius INT2104 dosed the first-ever in-vivo CAR-T patient globally in October 2024 (now sponsored by Kite/Gilead); Kelonia KLN-1010 reported at ASH 2025 (company/press) 4/4 MRD-negative complete responses in myeloma with CAR-T up to ~85% of circulating T cells and no grade ≥3 CRS/ICANS. These are tiny, company-reported cohorts — the highest-confidence numbers remain the Umoja primate data and the academic proofs.

supports:: [[delivery-bypass]]
bypasses:: [[solid-tumor-delivery]]

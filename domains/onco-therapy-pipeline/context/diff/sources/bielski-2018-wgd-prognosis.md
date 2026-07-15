---
topic: Bielski 2018 — whole-genome doubling prevalence (~28%) and its independent adverse prognosis
keywords: [whole-genome doubling, WGD, ploidy, MSK-IMPACT, prognosis, overall survival, TP53, microsatellite stable, aneuploidy, tumor evolution]
related: [../copy-number-and-loh.md, quinton-2021-wgd-vulnerabilities.md]
epistemics: empirical
source: "Bielski CM, … Taylor BS. Genome doubling shapes the evolution and prognosis of advanced cancers. Nat Genet 2018. DOI:10.1038/s41588-018-0165-1 (verified; vol/pages 50(8):1189-1195 not independently verified)"
source_type: paper
asserted_at: "2026-07"
---

# Whole-Genome Doubling — Prevalence and Prognosis

The pan-cancer clinical study establishing that whole-genome doubling (WGD) is among the most common cancer events and an independent adverse prognostic factor. WGD is a downstream *call* from purity-corrected allele-specific copy number, so its accuracy depends on the upstream ploidy caller ([[copy-number-loh-analysis]]).

## Design & Cohort

**9,692 prospectively sequenced advanced-cancer patients** (MSK-IMPACT targeted panel); WGD inferred from purity-corrected genome-wide integer CN via a simulation-based metric distinguishing a single WGD from independent successive CNAs. Orthogonal validation: **149 patients** with matched WES; second cohort of **6,184 TCGA WES**.

## Results (load-bearing)

- **WGD prevalence 28.2%** (MSK); TCGA orthogonal cohort **31%**. WES-vs-panel WGD concordance **147/149 = 99%**.
- WGD is the **2nd most common event after TP53 mutation (39%)** — >2× more common than KRAS or TERT promoter (~13% each).
- **Median ploidy 3.3 (IQR 2.9–3.8) in WGD+ vs 2.1 (IQR 1.9–2.4) in WGD−** (p < 10⁻¹⁶). Of 73,545 arm/chromosome-length het losses in WGD+ tumors, **~70% arose after WGD**.
- **By lineage: 58% of germ-cell tumors vs ≤5% in NHL / GI-neuroendocrine.** **36% of colorectal** WGD but exclusively **microsatellite-stable** (essentially absent in MSI, p=4.2×10⁻¹³). **46% of WGD arose in TP53-wildtype** tumors. Rate correlates with proliferative index (Spearman ρ=0.65).
- **Prognosis:** WGD → worse OS pan-cancer, **HR 1.3 (95% CI 1.2–1.4; p=3.9×10⁻⁷)**; **HR 1.18 (1.08–1.32; p=0.0005)** adjusted. Subtype effects: KRAS-mutant CRC **HR 2.8 (1.5–5.2)**; TP53-wildtype ER+/HER2− breast **HR 2.0 (1.2–3.3)**; primary pancreatic adenocarcinoma **HR 3.1 (1.6–6.1)**. More prevalent in metastases than primaries.

Verbatim: *"we identified whole-genome doubling (WGD) in the tumors of nearly 30% of 9,692 prospectively sequenced advanced cancer patients… WGD predicted for increased risk of death… independent of established clinical prognostic factors."*

## Limitations

WGD inferred from targeted panels (mitigated by WES/TCGA concordance); OS mostly from metastatic tumors (confounding controlled). Volume/pages of the citation not independently verified — DOI is authoritative.

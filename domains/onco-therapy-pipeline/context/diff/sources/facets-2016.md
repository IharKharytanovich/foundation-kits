---
topic: FACETS — allele-specific copy number and clonal heterogeneity for NGS and clinical panels
keywords: [FACETS, allele-specific copy number, clonal heterogeneity, purity, ploidy, cellular fraction, MSK-IMPACT, targeted panel, WES, ABSOLUTE, aneuploidy]
related: [../copy-number-and-loh.md]
epistemics: empirical
source: "Shen R, Seshan VE. FACETS: allele-specific copy number and clonal heterogeneity analysis tool for high-throughput DNA sequencing. Nucleic Acids Res 2016;44(16):e131. DOI:10.1093/nar/gkw520 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# FACETS — Clinical Allele-Specific CN

The de-facto MSK clinical caller for allele-specific copy number on whole-exome and targeted-panel data. It jointly models **total-copy log-ratio (logR)** and **allelic log-odds-ratio (logOR)** at germline het SNPs via a bivariate circular binary segmentation, then a **Gaussian–non-central χ² mixture EM model** assigns per-segment-cluster integer major/minor CN and a **cellular fraction Φ** (purity × clonal frequency), splitting off subclones when a segment's Φ is ≥0.05 below the clonal estimate. Two modes: `cval` (purity/ploidy) and `hisens` (focal events).

## Design & Cohort

Validated on **286 TCGA lung adenocarcinoma whole-exome samples** (comparator: ABSOLUTE on SNP6.0 arrays) plus application to **MSK-IMPACT** targeted clinical panels. Uses tumor/normal paired data.

## Results (load-bearing)

- Purity and ploidy **"highly concordant"** with ABSOLUTE on the 286 LUADs.
- Segmentation **>90% concordant for segments > 10 Mb** (less for smaller segments — arrays vs WES).
- **Identified additional aneuploidy in ≈ 6% of tumors** by incorporating LOH into ploidy determination; cases where FACETS called lower ploidy than ABSOLUTE were lower-purity samples.
- High integer-CN concordance when restricted to concordant ploidy (Δploidy < 0.5), **purity > 30%**, segments > 10 Mb.
- Worked example TCGA-KL-8331 (chromophobe RCC): purity **0.89**, ploidy **1.6** (hypodiploid).
- Clinical panel example: *PPM1D* integer CN of **10** after purity/ploidy correction vs ~5 from raw logR (logR=1.3) — a clinically material difference for amplification calling.

Verbatim: *"purity and ploidy estimates are highly concordant between the two methods. FACETS identified additional cases of aneuploidy in about 6% of the tumors… by incorporating LOH pattern in determining ploidy."*

## Limitations

Small-segment concordance is limited; low-purity samples reduce sensitivity (het-SNP-only approach loses sensitivity first); samples lacking allelic-balance regions need manual review of the aneuploidy location-shift parameter λ.

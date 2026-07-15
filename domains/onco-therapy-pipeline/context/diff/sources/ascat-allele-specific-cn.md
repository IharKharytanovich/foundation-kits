---
topic: ASCAT — allele-specific copy number with joint purity/ploidy, and its multi-sample extension
keywords: [ASCAT, allele-specific copy number, purity, ploidy, aberrant cell fraction, BAF, logR, copy-neutral LOH, asmultipcf, multi-sample segmentation]
related: [../copy-number-and-loh.md, purple-ploidy-benchmark-2025.md]
epistemics: empirical
source: "Ross EM, Haase K, Van Loo P, Markowetz F. Allele-specific multi-sample copy number segmentation in ASCAT. Bioinformatics 2021;37(13):1909-1911. DOI:10.1093/bioinformatics/btaa538 (verified). Original: Van Loo P, et al. Allele-specific copy number analysis of tumors. PNAS 2010;107:16910-16915. DOI:10.1073/pnas.1009843107 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# ASCAT — Allele-Specific Copy Number

The canonical allele-specific copy-number (ASCN) framework and the reference other callers are validated against. The original (Van Loo 2010) takes germline-heterozygous logR (depth ratio) and BAF tracks and jointly infers, per segment, integer **major/minor allele copy number** plus two global parameters — **aberrant cell fraction (ACF ≈ tumor purity)** and **tumor ploidy** — selected via the characteristic "sunrise" goodness-of-fit grid over (purity, ploidy). It introduced the ability to call **copy-neutral LOH**, which generic total-CN tools cannot.

## The Multi-Sample Extension (2021)

`asmultipcf` extends ASCAT to **joint multi-sample segmentation** so phylogenetically related samples share breakpoint positions. It adapts the Nilsen 2012 `aspcf`/`multipcf` dynamic-programming segmentation into a weighted least-squares form that natively handles missing values (weight 0 for missing loci); exact algorithm is O(p²), reduced to O(pq) by pre-selecting breakpoints from overlapping 5,000-SNP windows (1,000 overlap). A tunable penalty γ controls sensitivity. Shipped in the ASCAT R package from **v2.5** onward (the "v3" lineage). WGS/WES wrapper is `ascatNgs` (DOI unverified).

## Results (load-bearing)

The 2021 note reports **no benchmark accuracy table** — its evidence is a case study on **181 samples from 10 patients with lethal metastatic breast cancer** (De Mattos-Arruda 2019), where joint segmentation "substantially improves" phylogenetic inference by preventing artificial inflation of heterogeneity from independent per-sample segmentation. Quantitative accuracy comes from external benchmarking: ASCAT gives robust purity/ploidy at **purity ≥ 50%**, but carries a **systematic ploidy over-estimation ≈ +0.24** vs truth, and is the **fastest** bulk tool. It is the standard other callers validate against (Sequenza cellularity r=0.90; LOHHLA ρ=0.70).

Verbatim: *"asmultipcf… infers private and shared segment boundaries of phylogenetically related samples. The output of this algorithm can directly be used for allele-specific copy number calling using ASCAT."*

## Limitations

Joint segmentation can *underestimate* heterogeneity (private CNAs shared by few samples are harder to detect) — mitigated by γ; single-sample ASCAT inflates heterogeneity. Purity/ploidy identifiability degrades at low purity.

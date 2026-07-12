---
topic: Quinton 2021 — whole-genome doubling creates a targetable KIF18A dependency and lowers immune infiltration
keywords: [whole-genome doubling, WGD, KIF18A, genetic vulnerability, DepMap, Project Achilles, tetraploid, spindle assembly checkpoint, tumor-infiltrating leukocytes, TP53]
related: [../copy-number-and-loh.md, bielski-2018-wgd-prognosis.md]
epistemics: empirical
source: "Quinton RJ, … Ganem NJ. Whole genome doubling confers unique genetic vulnerabilities on tumor cells. Nature 2021;590(7846):492-497. DOI:10.1038/s41586-020-03133-3 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# WGD Confers Targetable Vulnerabilities

The functional counterpart to the WGD prevalence/prognosis story: whole-genome doubling is a *shared, targetable liability*, and it correlates with reduced anti-tumor immunity — linking the ploidy and immune-escape arms of the diff.

## Design

TCGA WGD calls (**~9,700 primary tumors**, ploidy/WGD via ABSOLUTE) + gene-essentiality from **Project Achilles / DepMap (~20,000 genes across ~600 cancer cell lines)** + isogenic diploid/tetraploid HCT-116 and RPE-1 models + 10 breast cancer cell lines + live-cell imaging and animal studies.

## Results (load-bearing)

- **~36% of TCGA tumors underwent ≥1 WGD** (concordant with the ~30% literature; cross-checks Bielski).
- WGD+ tumors enriched for **TP53 and PPP2R1A** mutations (mutation-burden/type-corrected).
- **WGD negatively correlates with tumor-infiltrating leukocytes (TILs)** — diminished host immune response, paralleling highly aneuploid tumors (relevant to immune escape).
- WGD+ cells are **preferentially dependent on the spindle-assembly checkpoint, DNA-replication factors, and the proteasome.** **KIF18A** (mitotic kinesin) is a WGD-specific essential gene: dispensable in diploids (KO mice viable), but its loss in tetraploid/WGD+ cells causes chromosome misalignment, multipolar spindles, nuclear-envelope rupture/micronuclei, mitotic errors, p53-dependent arrest, and loss of viability; KIF18A protein is elevated in WGD+ cells.

Verbatim: *"WGD gives rise to common genetic traits that are accompanied by unique vulnerabilities… KIF18A… is specifically required for the viability of WGD+ cells."*

## Limitations

Correlative TCGA/DepMap signals; mechanistic work in isogenic lines may not capture in-vivo tumor complexity; article carries a published correction (Nature 2021 May 11). Therapeutic upshot: **KIF18A inhibition** selectively kills WGD+ cells while sparing normal diploid tissue — now an active clinical drug class.

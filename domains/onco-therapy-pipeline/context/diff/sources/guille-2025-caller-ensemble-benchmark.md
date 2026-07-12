---
topic: Guille 2025 — 20-caller somatic benchmark with VAF-stratified truth sets and voting ensembles
keywords: [somatic caller, benchmark, ensemble, voting, WES, VAF stratified, MuSE, Mutect2, DRAGEN, Strelka, F1, SEQC2]
related: [../alignment-and-preprocessing.md, giab-hg002-subclonal-2025.md]
epistemics: empirical
source: "Guille A, Adélaïde J, Finetti P, … Chaffanet M. A benchmarking study of individual somatic variant callers and voting-based ensembles for whole-exome sequencing. Brief Bioinform 2025;26(1):bbae697. DOI:10.1093/bib/bbae697 (verified); PMID 39828270"
source_type: paper
asserted_at: "2026-07"
---

# 20-Caller Somatic Benchmark with VAF Strata

A systematic benchmark of individual callers and voting ensembles across four WES reference datasets with documented VAF strata — included for its VAF-stratified truth-set design and ensemble-F1 results.

## Design

Evaluated **20 somatic callers (18 for SNVs, 15 for indels)** across **four reference WES datasets**, then exhaustively tested ensemble voting across **8,178 SNV and 1,013 indel combinations.** F1 = 2TP/(2TP+FP+FN).

## Datasets (VAF strata — the load-bearing detail)

- **Synthetic HCC1143:** 474 TP SNVs + 464 TP indels at **VAF 50%, 33%, 20%.**
- **SEQC2 WES (HCC1395):** 1,160 TP SNVs + 50 TP indels, **median VAF 10% (0–100%).**
- **HCC1143 TNBC WES:** 257 TP SNVs, **median VAF 10%.**
- **PERMED-01** (real breast-cancer patients): 175 TP SNVs + 38 TP indels, **median VAF 20% (min 2%, max 60%)** — the only patient-derived set.

## Results (load-bearing)

- Top individual callers: **MuSE, Mutect2, DRAGEN, TNscope, NeuSomatic.**
- Best **SNV ensemble F1 = 0.927** (LoFreq + MuSE + Mutect2 + SomaticSniper + Strelka + Lancet), beating best single caller (DRAGEN) by **>3.6%.**
- Best **indel ensemble F1 = 0.867** (Mutect2 + Strelka + Varscan2 + Pindel), beating best single caller (NeuSomatic) by **>3.5%.**
- Cost-optimal reduced ensembles: MuSE+Mutect2+Strelka (SNV); Mutect2+Strelka+Varscan2 (indels).

Verbatim: *"…an ensemble combining LoFreq, Muse, Mutect2, SomaticSniper, Strelka, and Lancet outperformed the top-performing caller (Dragen) by >3.6% (mean F1 score = 0.927)."*

## Limitations

WES-only; three of four truth sets are cell-line/synthetic (median VAFs ≥10%), so genuine sub-5% VAF sensitivity is not directly benchmarked; class imbalance noted — reinforcing that low-VAF ground truth is the field's gap.

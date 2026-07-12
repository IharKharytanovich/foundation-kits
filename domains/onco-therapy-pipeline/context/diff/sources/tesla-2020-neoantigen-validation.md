---
topic: TESLA 2020 — consortium neoantigen-prediction benchmark and the provenance of the ~6% validation rate
keywords: [TESLA, neoantigen, immunogenicity, consortium, validation rate, 6 percent, presentation, agretopicity, affinity, stability, ranking, pMHC multimer]
related: [../immunogenicity-prediction-models.md, ../neoantigen-prediction-pipeline.md, parkhurst-2019-neoantigen-rate.md]
epistemics: empirical
source: "Wells DK, … Defranoux NA; TESLA Consortium. Key Parameters of Tumor Epitope Immunogenicity Revealed Through a Consortium Approach Improve Neoantigen Prediction. Cell 2020;183(3):818-834.e13. DOI:10.1016/j.cell.2020.09.015 (verified); PMC7652061"
source_type: paper
asserted_at: "2026-07"
---

# TESLA — The Neoantigen Validation Benchmark

The consortium study that produced the field's canonical **~6% validation rate** for top-ranked neoantigen predictions and identified the presentation + recognition parameters that improve ranking.

## Design

Global consortium; identical WES + RNA-seq + clinical HLA typing per subject → ranked pMHC lists, centrally validated. Cohort: **6 subjects (3 melanoma, 3 NSCLC); 28 teams submitted, 25 analyzed** (submissions 7–81,904 pMHC/sample, median 204). From pooled top predictions, **608 peptides** (median 97/subject) were tested by pMHC-multimer assay.

## Results (load-bearing)

- **37 of 608 tested peptides (6.08%) were immunogenic** — the provenance of "~6%," a validation rate *"similar to what has previously been reported (Yadav et al., 2014)."* Per-team median 3/51 (6%).
- Team predictions barely overlapped (median top-100 pairwise overlap **13%**, max 62%); no team captured >20 of 37 immunogenic peptides.
- Presentation thresholds (**affinity < 34 nM, tumor abundance > 33 TPM, binding stability > 1.4 h**) filtered **93% of non-immunogenic while retaining 55% of immunogenic** peptides (p = 3.7×10⁻⁸).
- Immunogenic pMHC had stronger affinity (p = 4×10⁻⁶), higher stability (p = 1.4×10⁻⁴), lower hydrophobicity (p = 0.04). Recognition features (agretopicity > 0.1, foreignness) were independent of presentation.
- Ranking presented-and-recognized pMHC by affinity reached **>70% precision at 45% recall**; the full integrated model **filtered 98% of non-immunogenic peptides at precision > 0.70.** Confirmed in an independent 310-epitope cohort.

Verbatim: *"608 epitopes were subsequently assessed for T cell binding… 37 (6%) of those were found to be immunogenic."*

## Provenance Nail-Down

The field's "~6%" is exactly **37/608 = 6.08%** — the fraction of **top-ranked, experimentally tested** candidate peptides that validated (a PPV/hit-rate over pooled top predictions), NOT a fraction of all mutations. Contrast with Parkhurst's ~1.6% over all screened mutations.

## Limitations

Only 6 subjects, high-TMB tumors, small feature subset (286/608 with all 5 presentation variables); class I only.

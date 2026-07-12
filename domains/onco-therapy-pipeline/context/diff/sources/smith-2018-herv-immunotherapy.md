---
topic: Smith 2018 — endogenous retroviral (hERV) signatures predict immunotherapy response in ccRCC
keywords: [endogenous retrovirus, hERV, hervQuant, viral mimicry, clear cell renal cell carcinoma, immunotherapy, checkpoint blockade, CD8 T cell, ERV antigen, TCGA]
related: [../rna-and-noncanonical-neoantigens.md, chong-2020-noncanonical-immunopeptidome.md]
epistemics: empirical
source: "Smith CC, Beckermann KE, Bortone DS, … Vincent BG. Endogenous retroviral signatures predict immunotherapy response in clear cell renal cell carcinoma. J Clin Invest 2018;128(11):4804-4820. DOI:10.1172/JCI121476 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# hERV Signatures and ICB Response in ccRCC

The reference for the "viral mimicry" angle: derepressed endogenous-retrovirus transcripts prime an inflamed, checkpoint-responsive tumor microenvironment — nominating ERVs as a therapeutically relevant tumor-associated antigen class.

## Design & Tools

Built **hervQuant**, an RNA-seq workflow quantifying expression of individual hERV loci genome-wide; applied to TCGA ccRCC (KIRC) and to ICB-treated ccRCC cohorts; integrated with immune-signature and survival analysis.

## Results (verified)

- hervQuant identified **>3,000 transcriptionally active hERVs** within TCGA.
- A subset of hERV expression signatures was **associated with intratumoral immune activation (CD8⁺ T-cell infiltration, antigen-presentation and checkpoint-pathway gene expression).**
- hERV signatures were **associated with clinical response/survival on immune-checkpoint blockade in ccRCC**, independent of stage and molecular subtype.

This supports the "viral mimicry" model — derepressed ERV dsRNA + potential ERV-encoded antigens inflame the microenvironment, consistent with ccRCC's known immunogenicity despite low TMB (and with the separately documented CT-RCC HERV-E envelope antigen driving T-cell responses in VHL-deficient ccRCC). Several specific hazard ratios/response percentages from automated extraction were not confirmable and are omitted.

## Limitations

ccRCC-specific; hERV *antigen* presentation largely inferred, not MS-confirmed here; an expression-based biomarker, not a direct neoantigen catalog. Therapeutic angle: epigenetic de-repression (DNMT/LSD1 inhibitors) to amplify viral mimicry.

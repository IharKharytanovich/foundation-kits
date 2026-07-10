---
topic: Antigen-negative relapse after targeted immunotherapy — pre-existing subclones and the resistance feedback loop
keywords: [antigen loss, CD19, relapse, CAR-T, resistance, subclonal, pre-existing, antigen escape, tumor evolution, selection pressure, pediatric ALL, solid tumor, immune evasion, negative subclone]
related: [../resistance-evolution-loop.md]
epistemics: empirical
source: "Majzner & Mackall 2018 Cancer Discov 8:1219; Orlando 2018 Nat Med 24:1504; Sotillo 2015 Cancer Discov 5:1282; Shah 2019 Nat Med 25:1392; Fischer 2017 Cancer Cell 31:147"
source_type: paper
asserted_at: "2026-07"
---

# Antigen-Negative Relapse

## Scope

This source captures the evidence that antigen-negative subclones exist before therapy and are selected (not created) by targeted immunotherapy, creating a feedback loop that demands re-sequencing (a new diff) after each treatment cycle.

## Pre-Existing Resistant Subclones

**Orlando et al (Nature Medicine 2018)**: Deep sequencing of pre-treatment samples from pediatric ALL patients who later relapsed CD19-negative after anti-CD19 CAR-T revealed that CD19 mutations (frameshift, splice-site) were detectable at low variant allele frequencies (0.003–1.8%) before treatment in a subset of patients. The mutations were not induced by CAR-T pressure — they pre-existed and were selected.

**Sotillo et al (Cancer Discovery 2015)**: Identified alternative splicing of CD19 exon 2 as a mechanism of antigen loss. The truncated CD19 protein loses the FMC63 epitope recognized by most CD19-directed CARs. Exon-skipping transcripts were detectable at low levels in some pre-treatment samples, indicating the escape variant is part of the pre-existing clonal repertoire.

## Relapse Rates

**Majzner & Mackall (Cancer Discovery 2018)**: Comprehensive review of antigen loss as a resistance mechanism across CAR-T targets. Key quantitative findings:
- CD19 CAR-T in pediatric ALL: 30–60% of relapses are CD19-negative or CD19-dim (pooled across ELIANA, CHOP-Penn, NCI-COG trials)
- CD22 CAR-T: rapid emergence of CD22-dim clones at lower site densities (<1,500 molecules/cell), demonstrating that even partial antigen downregulation suffices for escape
- Solid tumors: antigen heterogeneity is the norm (e.g., HER2, EGFR, mesothelin expression varies 10–100× within a single tumor), making antigen-negative escape nearly inevitable with single-target approaches

**Shah et al (Nature Medicine 2019)**: CHOP-Penn institutional cohort — among patients who achieved initial CR after tisagenlecleucel, those who relapsed showed CD19-negative disease in ~60% of cases. The median time to CD19-negative relapse was 6 months, consistent with selection of pre-existing subclones rather than de novo mutagenesis (which would require more time for fixation).

## The Feedback Loop

The mechanism is clonal selection, not mutation induction. Treatment applies selection pressure → pre-existing antigen-negative subclones expand → the dominant clone changes → the tumor's antigenic and mutational landscape is different from the pre-treatment state → a new diff (re-sequencing) is needed to identify the current target landscape.

This is the biological basis for the cycle described in the pipeline map: efficacy feeds back into a new diff because the tumor evolves faster than one treatment cycle. The subclones exist before therapy — they are not a surprise; they are a known constraint.

## Quantitative Summary

| Finding | Value | Source |
|---------|-------|--------|
| CD19-negative relapse rate (pediatric ALL) | 30–60% of relapses | Majzner & Mackall 2018, Shah 2019 |
| Pre-existing CD19 mutations detectable pre-treatment | 0.003–1.8% VAF | Orlando 2018 |
| CD22-dim escape threshold | <1,500 molecules/cell | Majzner & Mackall 2018 |
| Median time to CD19-negative relapse | ~6 months | Shah 2019 |
| Solid tumor antigen heterogeneity (intra-tumor) | 10–100× expression range | Majzner & Mackall 2018 |

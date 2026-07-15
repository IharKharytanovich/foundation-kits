---
topic: The resistance-evolution loop — antigen-negative subclones feed a new diff
keywords: [resistance, antigen loss, CD19-negative, relapse, subclonal, evolution, selection pressure, CAR-T, re-sequencing, feedback loop, clonal architecture, neoantigen, tumor evolution, immune escape, re-diff]
related: [../map.md, sources/antigen-loss-relapse.md, ../diff/index.md]
defines:
  resistance-evolution-loop: "Pre-existing antigen-negative subclones (detectable at 0.003–1.8% VAF before therapy) are selected by targeted immunotherapy; 30–60% of CAR-T relapses are antigen-negative; this changes the tumor's mutational and antigenic landscape, requiring re-sequencing (a new diff) to identify current targets — the biological basis of the efficacy→diff cycle"
kinds:
  resistance-evolution-loop: constraint
epistemics: empirical
source: "Majzner & Mackall 2018 Cancer Discov 8:1219; Orlando 2018 Nat Med 24:1504; Shah 2019 Nat Med 25:1392; Sotillo 2015 Cancer Discov 5:1282"
source_type: paper
asserted_at: "2026-07"
---

# The Resistance-Evolution Loop

[[resistance-evolution-loop]] is the biological mechanism that makes the personalized therapy pipeline a cycle, not a line. Treatment selects pre-existing antigen-negative subclones, changing the tumor's landscape — so the diff that informed the current therapy no longer represents the current tumor.

## The Mechanism Is Selection, Not Induction

Orlando et al (Nature Medicine 2018) showed that CD19 mutations (frameshift, splice-site) are detectable at 0.003–1.8% variant allele frequency in pre-treatment samples from pediatric ALL patients who later relapsed CD19-negative. The resistant subclones existed before CAR-T infusion — therapy did not create them; it selected them.

Sotillo et al (Cancer Discovery 2015) identified CD19 exon 2 skipping as a second escape mechanism: the truncated protein loses the FMC63 epitope. Exon-skipping transcripts were present at low levels before treatment.

This means the [[resistance-evolution-loop]] is a deterministic constraint: for any tumor with intra-clonal heterogeneity (which is the norm in solid tumors, where single-target expression varies 10–100× within a tumor), antigen-directed therapy will select escape variants. The question is when, not whether.

## Quantitative Evidence

Among patients achieving initial complete remission after anti-CD19 CAR-T:
- **30–60%** of relapses are CD19-negative or CD19-dim (pooled across ELIANA, CHOP-Penn, NCI-COG — Majzner & Mackall 2018, Shah 2019)
- Median time to CD19-negative relapse: **~6 months** (Shah 2019), consistent with clonal selection kinetics rather than de novo mutagenesis
- CD22-directed CAR-T shows analogous escape at site densities below **1,500 molecules/cell** (Majzner & Mackall 2018), confirming this is a general mechanism, not CD19-specific

In solid tumors, antigen heterogeneity is even more pronounced: HER2, EGFR, and mesothelin expression varies across spatial regions within a single lesion, making single-target escape nearly certain.

## The Cycle Back to Diff

After antigen-loss relapse, the tumor's mutational and antigenic landscape has shifted. The original sequencing data (somatic variants, clonal architecture, neoantigen predictions) no longer represents the dominant clone population. A new diff is required:

The [[resistance-evolution-loop]] feeds back into somatic variant calling because the dominant clone has changed and the variant landscape must be re-characterized.

feeds-into:: [[somatic-variant-calling]]

The [[resistance-evolution-loop]] feeds back into clonal architecture inference because subclone frequencies have shifted — the pre-treatment clonal tree is obsolete.

feeds-into:: [[clonal-architecture-inference]]

The [[resistance-evolution-loop]] feeds back into neoantigen prediction because the target antigens have changed — the prior neoantigen ranking may prioritize epitopes that the tumor no longer expresses.

feeds-into:: [[neoantigen-prediction-pipeline]]

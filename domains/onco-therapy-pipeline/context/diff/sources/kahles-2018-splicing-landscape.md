---
topic: Kahles 2018 — pan-cancer alternative splicing landscape and the neojunction neoantigen baseline
keywords: [alternative splicing, neojunction, SplAdder, TCGA, pan-cancer, splicing neoantigen, intron retention, exon skipping, immunopeptidomics, SF3B1]
related: [../rna-and-noncanonical-neoantigens.md, snaf-splicing-neoantigen-2024.md]
epistemics: empirical
source: "Kahles A, Lehmann K-V, Toussaint NC, … Rätsch G; TCGA Research Network. Comprehensive Analysis of Alternative Splicing Across Tumors from 8,705 Patients. Cancer Cell 2018;34(2):211-224.e6. DOI:10.1016/j.ccell.2018.07.001 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# Pan-Cancer Alternative Splicing Landscape

The foundational study establishing aberrant splicing as a systematic, under-exploited neoantigen source — the conceptual baseline for later splicing-neoantigen tools (SNAF, IRIS, ASNEO).

## Design & Cohort

Reanalysis of TCGA RNA-seq + whole-exome sequencing across **8,705 patients spanning 32 cancer types**; splicing quantified with the authors' graph-based **SplAdder** tool; matched normal (TCGA/GTEx) comparators; HLA typing from sequence; a subset of predicted splice-junction peptides tested against tumor immunopeptidomics mass spectra.

## Methods

SplAdder calls five event classes (exon skip, intron retention, alt 3′/5′, mutually exclusive exons); neojunctions = junctions absent from the normal reference; somatic-variant-to-splicing association; MHC-I binding prediction; validation against tumor HLA-peptidome MS.

## Results (load-bearing)

- Tumors show **up to 30% more alternative-splicing events** than normal samples.
- Headline immunogenic finding (verbatim): *"Using neojunction-derived and SNV-derived peptides increases the fraction of samples with at least one putative neoantigen confirmed from 30% to 75%."*
- Thousands of tumor-specific junctions recur across patients; a subset is statistically linked to specific somatic variants (e.g., splice-site and spliceosome-factor mutations such as *SF3B1*, *TP53*).

Note on unverified detail: some finer table counts returned by automated extraction (e.g. "930 neojunctions/tumor," "43 MS-validated") could not be confirmed against the text and are not asserted here.

## Limitations

Bulk RNA-seq/WES only, limiting detection of subclonal/low-expression events; MS validation is shallow relative to the predicted repertoire; presentation ≠ immunogenicity. Net: splicing roughly doubles the theoretical neoantigen search space beyond SNVs.

---
topic: The RNA layer and non-canonical neoantigen discovery — antigens beyond SNV point neoepitopes
keywords: [non-canonical neoantigen, splicing neoantigen, neojunction, gene fusion, frameshift, indel neoantigen, ERV, endogenous retrovirus, immunopeptidomics, mass spectrometry, RNA-seq, SNAF, IRIS, shared antigen]
related: [sources/kahles-2018-splicing-landscape.md, sources/iris-splicing-targets-2023.md, sources/snaf-splicing-neoantigen-2024.md, sources/kwok-public-splicing-neoantigens.md, sources/turajlic-2017-indel-neoantigens.md, sources/wei-2019-fusion-neoantigens.md, sources/haas-2019-fusion-detection-benchmark.md, sources/chong-2020-noncanonical-immunopeptidome.md, sources/smith-2018-herv-immunotherapy.md, neoantigen-prediction-pipeline.md]
defines:
  noncanonical-neoantigen-discovery: "Discovery of tumor antigens beyond SNV point neoepitopes — from aberrant splicing (neojunctions), gene fusions, frameshift/indels, and transposable-element/ERV transcripts — nominated computationally from RNA-seq and validated by immunopeptidomics; widens the antigen space and yields shared/public targets, but validation rates stay in the low single-digit percent"
kinds:
  noncanonical-neoantigen-discovery: method
epistemics: hybrid
source: "Kahles 2018 Cancer Cell (splicing); Pan 2023 PNAS (IRIS); Li 2024 Sci Transl Med (SNAF); Turajlic 2017 Lancet Oncol (indels); Chong 2020 Nat Commun (immunopeptidome)"
source_type: paper
asserted_at: "2026-07"
---

# RNA Layer and Non-Canonical Neoantigen Discovery

[[noncanonical-neoantigen-discovery]] turns the RNA half of the diff from a mere expression filter into a first-class antigen-discovery axis. The unifying computable principle: **novel or shifted open reading frames generate many highly non-self peptides per event**, so frameshift, fusion, and out-of-frame splice antigens are, per event, more immunogenic and more often *shared across patients* than private SNVs.

## The Three Mechanistic Classes

- **Aberrant splicing (neojunctions).** Tumors carry up to 30% more splicing events than normal tissue (Kahles, 8,705 patients); adding neojunction peptides to SNV peptides raised the fraction of samples with ≥1 predicted presented neoantigen **from ~30% to ~75%.** Tools: SNAF (528 neojunctions and ~1,090 predicted MHC-bound peptides per patient; shared splice antigens in up to 90% of melanoma patients), IRIS (TCR- and CAR-T–validated splice epitopes), and Kwok's tumor-wide/public neojunctions (GNAS, RPL22) targetable by off-the-shelf TCR-T.
- **Gene fusions.** Detected by STAR-Fusion/Arriba (the top-accuracy, fastest tools in Haas's 23-method benchmark, sensitivity-dominated and read-length-dependent), translated into junction-spanning neoepitopes; fusions create novel ORFs giving more candidate neoantigens per event than SNV/indel, though most individual fusion neoantigens have low immunogenic potential.
- **Frameshift/indel and ERV antigens.** Indels are 3× enriched for high-affinity binders and 9× enriched for mutant-specific binding vs SNVs (Turajlic); ERV/viral-mimicry transcripts (Smith, >3,000 active hERVs) prime an inflamed, ICB-responsive microenvironment.

This axis builds directly upon and enriches the SNV pipeline:

extends:: [[neoantigen-prediction-pipeline]]

## Why It Matters for Design

Non-canonical discovery supplies **shared, intratumor-conserved targets** that address the heterogeneity and per-patient-manufacturing bottlenecks of personalized SNV vaccines, and extends the modality set to TCR-T, CAR-T, and antibody/CAR extracellular epitopes.

feeds-into:: [[neoantigen-vaccine]]

## Honest Limits (mass-spec is the rate-limiter)

Computation nominates a rich repertoire cheaply, but **mass spectrometry is the ground truth for what is actually presented, and it is both shallow and specificity-limited.** Chong/Bassani-Sternberg found only hundreds of non-canonical HLA ligands per deep dataset (335 lncRNA-, 88 TE/ERV-derived), non-canonical databases inflate false discovery without group-specific FDR, and — most soberingly — **out of >500 non-canonical peptides screened, exactly one was immunogenic.** Non-canonical candidates should enter the design funnel as tumor-specificity-filtered, MS- and immunogenicity-gated additions to (not replacements for) the SNV pipeline.

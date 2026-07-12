---
topic: Mutational signature analysis and HRD scoring — the interpretive layer over the somatic callset
keywords: [mutational signatures, COSMIC, SBS, SigProfiler, HRD, HRDetect, homologous recombination deficiency, HRD score, PARP inhibitor, APOBEC, POLE, MMR, signature attribution, genomic scar]
related: [sources/sigprofiler-assignment-2023.md, sources/hrdetect-2017.md, sources/nlst-hrd-paola1-2023.md, sources/hrprofiler-2025.md, sources/mesica-signature-embedding-2024.md, sources/touat-2020-glioma-hypermutation.md, sources/cosmic-signatures-v34.md, somatic-variant-calling.md, tumor-mutational-burden.md]
defines:
  mutational-signature-analysis: "Refitting a somatic mutation catalogue against reference signatures (COSMIC v3.4: 86 SBS, 78 DBS channels, 83 ID types) to infer mutational processes, plus HRD scoring (genomic scar and signature classifiers); attribution is computable, the clinical HRD→PARP-response link is empirical"
kinds:
  mutational-signature-analysis: method
epistemics: hybrid
source: "Alexandrov 2020 Nature 578:94 (COSMIC signatures); Díaz-Gay/Alexandrov 2023 (SigProfilerAssignment); Davies 2017 Nat Med (HRDetect); Christinat 2023 JCO PO (nLST/PAOLA-1)"
source_type: paper
asserted_at: "2026-07"
---

# Mutational Signature Analysis and HRD Scoring

[[mutational-signature-analysis]] is the interpretive layer that sits on top of the somatic callset: it does not call new variants, it decomposes the mutation catalogue into the biological processes that generated it and scores the tumor for actionable repair defects. In the diff stage it is the step that turns "how many mutations" (TMB) into "why these mutations, and can we exploit the cause."

## What It Computes (the computable core)

Signature *attribution* (refitting) is a well-posed computational problem: given a mutation vector and a reference matrix, solve for per-signature activities. The reference is **COSMIC v3.4 (Oct 2023): 86 single-base-substitution (SBS) signatures** on the 96-channel trinucleotide context, **78 doublet (DBS) channels**, and an **83-type indel (ID)** classification — expanded from 30 SBS in v2.0 (the catalogue has since moved to v3.6). The de-facto engine is **SigProfilerAssignment** (forward-stagewise sparse regression + nonnegative least squares), which reached **F1 > 0.90 at 10% noise** on 2,700 synthetic genomes and was the only tool to hold that bar — attribution is computable given enough mutations.

Signatures are computed by refitting the somatic mutation catalogue produced upstream, so the analysis is strictly downstream of variant calling:

derived-from:: [[somatic-variant-calling]]

## HRD Scoring — From Genomic Scars to Signature Classifiers

Homologous-recombination deficiency (HRD) prediction spans an empirical→computable spectrum:

- **Genomic-scar scores (empirical/regulatory anchor).** The FDA companion diagnostic **Myriad myChoice** uses a Genomic Instability Score `GIS = LOH + TAI + LST`, HRD-positive at **GIS ≥ 42**. The academic **normalized LST (nLST)** score reproduces its PARP-benefit stratification on the PAOLA-1 trial biobank (**HR 0.40, 95% CI 0.28–0.57** vs 0.37 for myChoice) at a lower assay-failure rate.
- **Signature classifiers (computable).** **HRDetect** integrates six features (microhomology deletions, SBS3, rearrangement signatures 3 & 5, HRD index, SBS8) into an HR-deficiency probability with **98.7% sensitivity and AUC 0.98**, far above the **~60%** of the scar score alone — expanding PARP-eligible breast cancer to **~22%**. **HRProfiler** (2025) is the only benchmarked tool holding **AUC > 0.90 on whole-exome** data, where SV-dependent tools (CHORD, full HRDetect) degrade.

The HRD probability is computable, but whether an HRD-positive tumor actually responds to a PARP inhibitor or platinum is an empirical, trial-measured quantity — never presented as if derived.

## Etiology Explains the TMB

Signatures name the process behind the mutation count — APOBEC (SBS2/13), UV (SBS7a–d), tobacco (SBS4), defective MMR (SBS6/14/15/20/21/26/44), POLE proofreading (SBS10a/b), temozolomide (SBS11), platinum (SBS31/35). This etiology feeds the interpretation of tumor mutational burden: the *same* TMB means different things depending on which process produced it.

feeds-into:: [[tumor-mutational-burden]]

Touat 2020 (10,294 gliomas) makes the therapeutic consequence concrete: MMR/temozolomide-driven high-TMB gliomas (SBS11) responded *poorly* to PD-1 blockade — the signature etiology, not the raw TMB number, governed whether the burden was immunogenic.

## Honest Limits

- **Low counts destabilize attribution.** Panel assays (<2 Mb) barely sample genome-wide processes; embedding models (MESiCA) drop to "dominant-signature-only" and still **cannot reliably call SBS3/HRD** in panel data.
- **Signature bleeding.** Cosine-similar signatures (SBS3 vs SBS5/SBS40/SBS39) inflate false attributions.
- **WES vs WGS.** Rearrangement-signature features need WGS; off-WGS, only HRProfiler stays above AUC 0.90.
- **Scars are static.** A genomic-scar score cannot tell current HRD from a reverted (platinum-resistant) tumor that still carries the historical scar.

---
topic: COSMIC mutational signatures catalogue — v3.4 exact channel and signature counts
keywords: [COSMIC, mutational signatures, SBS, DBS, indel signatures, v3.4, reference catalogue, trinucleotide, Alexandrov, PCAWG, signature etiology]
related: [../mutational-signatures.md, sigprofiler-assignment-2023.md]
epistemics: empirical
source: "Alexandrov LB, et al. The repertoire of mutational signatures in human cancer. Nature 2020;578:94-101. DOI:10.1038/s41586-020-1943-3 (verified). COSMIC Signatures v3.4 (Oct 2023), Wellcome Sanger Institute cancer.sanger.ac.uk/signatures. v3.4 count corroborated by Ferronika et al. medRxiv 2024.10.23.24316019 (preprint)"
source_type: paper
asserted_at: "2026-07"
---

# COSMIC Mutational Signatures — Reference Catalogue

The reference database against which all signature refitting is performed. Signatures were extracted from **2,780 PCAWG whole genomes** (stability checked on 1,865 additional WGS + 19,184 exomes; Alexandrov 2020 Nature).

## Exact Counts (v3.4, October 2023)

- **86 SBS (single-base-substitution) reference signatures** — expanded from **30 in v2.0**. SBS uses the **96-channel** trinucleotide context.
- **DBS (doublet-base-substitution)** signatures on **78 strand-agnostic doublet channels**.
- **ID (indel)** signatures using an **83-type** indel classification.

Verbatim (corroborating preprint): *"the COSMIC SBS signatures were expanded to 86 signatures in Version 3.4 (V3.4) from 30 in V2.0."*

Note: the live COSMIC catalogue has since advanced to **v3.6** (SBS expanded further, e.g. toward SBS113, with additions to the DBS and ID sets). The exact per-version **DBS and ID totals for v3.4 specifically** should be read from the v3.4 download files — only the **86 SBS** count is dual-sourced here; the v3.4 DBS/ID totals are flagged as not independently verified.

## Etiology Anchors (used across the signature layer)

- **SBS3** = defective homologous-recombination repair (HRD).
- **SBS2 / SBS13** = APOBEC.
- **SBS4 / SBS92** = tobacco smoking.
- **SBS7a–d** = UV.
- **SBS6/14/15/20/21/26/44** = defective mismatch repair (MMR).
- **SBS10a/b** = POLE exonuclease-domain mutations; **SBS10c/d** = defective POLD1 proofreading.
- **SBS11** = temozolomide; **SBS31 / SBS35** = platinum chemotherapy.

These mechanistic links are what let an observed signature vector "explain" a tumor's mutation count — the basis for [[mutational-signature-analysis]] feeding TMB interpretation.

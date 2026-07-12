---
topic: Chong 2020 — non-canonical peptides in tumor immunopeptidomes and the presented-not-immunogenic wall
keywords: [immunopeptidomics, non-canonical peptide, mass spectrometry, lncRNA, ERV, transposable element, NewAnce, FDR, HLA ligand, proteogenomics, tumor specificity]
related: [../rna-and-noncanonical-neoantigens.md, smith-2018-herv-immunotherapy.md]
epistemics: empirical
source: "Chong C, Müller M, Pak H, … Coukos G, Bassani-Sternberg M. Integrated proteogenomic deep sequencing and analytics accurately identify non-canonical peptides in tumor immunopeptidomes. Nat Commun 2020;11:1293. DOI:10.1038/s41467-020-14968-9 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# Non-Canonical Peptides in Tumor Immunopeptidomes

The standard reference that mass-spec is the ground truth for what is *actually presented*, that non-canonical databases demand rigorous FDR control, and that presentation ≠ immunogenicity.

## Design & Cohort

Immunopeptidomics (HLA-I peptide elution + LC-MS/MS on Q Exactive HF-X) of **melanoma and lung tumor samples (~11 analyzed; 7 melanoma for lncRNA analysis)**, searched against RNA-seq + Ribo-seq personalized proteogenomic databases with the authors' **NewAnce** group-specific FDR pipeline (intersection of Comet + MaxQuant), plus targeted PRM and autologous T-cell assays.

## Results (deeply verified from full text)

- **335 lncRNA-derived non-canonical HLA-I peptides from 280 lncRNA genes** across 7 melanoma samples; **~23% tumor-specific.**
- **88 unique TE/ERV-derived HLA-I peptides**, of which **60/88 from presumed non-coding TE regions.**
- Class-II non-canonical presentation near-absent: **only 4 noncHLAIIp out of 11,256** class-II peptides.
- Validation: **93 non-canonical + 71 canonical TAA peptides synthesized (heavy-labeled) for PRM** — canonical confirmation (~78%) exceeded non-canonical.
- Quality control: **90% of non-canonical and 91% of canonical peptides were predicted HLA binders** at 3% PSM FDR; Ribo-seq periodicity supported translation for ~22% of candidates.
- **The critical immunogenicity ground-truth: out of >500 non-canonical peptides screened with autologous TILs/PBMCs, only ONE was immunogenic** — the ABCB5 dORF-derived KYKDRTNILF, recognized by CD8⁺ TILs and blood T cells.

Verbatim: *"Non-canonical HLA-bound peptides from presumed non-coding regions are potential targets for cancer immunotherapy, but their discovery remains challenging."*

## Limitations

Non-canonical databases inflate false PSMs (predicted-binder fraction only ~55% before stringent group-FDR, rising to 85–97% after) → high false-discovery risk; low expression limits detection; validated immunogenicity is extremely sparse. This is the empirical ceiling that all computational non-canonical discovery must reckon with.

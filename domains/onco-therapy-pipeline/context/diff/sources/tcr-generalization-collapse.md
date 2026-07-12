---
topic: TCR-pMHC predictors collapse to near-random on unseen epitopes — NetTCR, TITAN, and the critiques
keywords: [TCR generalization, unseen epitope, NetTCR, TITAN, ERGO, ImRex, CDR3 memorization, negative sampling bias, ROC AUC collapse, Grazioli, benchmark]
related: [../immunogenicity-prediction-models.md, pmtnet-tcr-2021.md]
epistemics: empirical
source: "Montemurro 2021 Commun Biol (NetTCR-2.0) DOI:10.1038/s42003-021-02610-3; Weber 2021 Bioinformatics (TITAN) DOI:10.1093/bioinformatics/btab294; Grazioli 2022 Front Immunol DOI:10.3389/fimmu.2022.1014256; Moris 2021 Brief Bioinform DOI:10.1093/bib/bbaa318; Deng 2023 Front Immunol DOI:10.3389/fimmu.2023.1128326 (all verified)"
source_type: paper
asserted_at: "2026-07"
---

# TCR Generalization Collapse on Unseen Epitopes

The consolidated evidence that TCR–pMHC binding predictors look strong on *seen* epitopes but collapse to near-random on *unseen* ones — the core reason recognition of a genuinely novel neoantigen is not yet computable.

## The Tools (seen-epitope performance)

- **NetTCR-2.0** (Montemurro 2021): shallow CNN over BLOSUM-encoded CDR3, paired α+β. **Paired overall AUC 0.89**; CDR3β-only max 0.69. But entirely data-driven: peptides with **≥200 TCRs → AUC 0.88, ≤20 TCRs → AUC 0.38 (worse than random)**; needs ≥150 distinct pairs per pMHC. No unseen-epitope claim.
- **TITAN** (Weber 2021): bimodal attention, epitope as SMILES string to aid generalization. **ROC-AUC 0.87 on unseen TCRs / seen epitopes**, but on **unseen epitopes ROC-AUC 0.62 ± 0.05** (strict split) — a **~0.25 AUC drop**, barely above the k-NN baseline (0.54). Authors: "simple models may outperform complex ones in a sparse data setting."

## The Critiques (unseen-epitope collapse)

- **Grazioli 2022** (key): re-benchmark of ERGO/ERGO-II on **528,020 unique (peptide, CDR3β) tuples**. Under a Hard Split (test peptides absent from training), verbatim: *"the predictions on the test set barely exceed random-level performance… almost no generalization to unseen peptides is occurring (AUROC ≈ 0.55)."* Mechanism: *"Models can learn to correctly map… simply by memorizing the CDR3 sequences, ignoring the peptide."*
- **Moris 2021 (ImRex):** first formalizes the epitope-agnostic regime; on the unseen-epitope subset (736 pairs, 10 epitopes) ImRex drops to **ROC-AUC ≈ 0.50.**
- **Deng 2023:** under strict splitting NetTCR-2.0, ERGO, ImRex, TITAN, DLpTCR all **collapse to ~0.50 ROC-AUC**; "complete collapse… when training on 5–10 examples per peptide."
- **Dens 2023** (preprint; NMI DOI unverified): identifies a second artifact — **negative-sampling bias**; models at ~70.8% ROC-AUC on biased negatives fall to **~49–54% (near-random)** under realistic negatives.

## Net

Seen-epitope AUCs of 0.85–0.98 are largely CDR3 memorization; on truly novel epitopes/TCRs performance is near-random. This is why TCR-level recognition of a novel neoantigen must still be settled by wet-lab multimer/functional screening, not prediction.

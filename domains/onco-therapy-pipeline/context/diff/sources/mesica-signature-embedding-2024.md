---
topic: MESiCA — neural-embedding dominant-signature calling in low-count clinical panels
keywords: [MESiCA, mutational signatures, neural embedding, clinical panel, targeted sequencing, pentanucleotide, APOBEC, POLE, MMR, SBS3, dominant signature, MSK-IMPACT]
related: [../mutational-signatures.md, sigprofiler-assignment-2023.md]
epistemics: empirical
source: "Yaacov A, Rosenberg S, … Shamay M. Cancer mutational signatures identification in clinical assays using neural embedding-based representations. Cell Rep Med 2024;5(6):101608. DOI:10.1016/j.xcrm.2024.101608 (verified); PMID 38866015"
source_type: paper
asserted_at: "2026-07"
---

# MESiCA — Signature Calling in Panels

An NLP/StarSpace-style **neural-embedding** model that learns joint embeddings of mutations and dominant signatures to predict the *dominant* mutational process from very few mutations — the regime where refitting engines like [[mutational-signature-analysis]] destabilize. It uses **pentanucleotide context (1,536 channels)** rather than the classic 96 trinucleotide channels.

## Design & Scope

Trained on TCGA WES; applied across **>150,000 tumors** including **>60,000 targeted-panel** samples (MSK-IMPACT, MSK-MET, GENIE, MSK-ICI). Dominant-signature classes: APOBEC (SBS2/13), UV (SBS7a–d/38), tobacco (SBS4), HRD (SBS3), MMR (SBS6/14/15/20/21/26/44), POLE (SBS10a/b), plus clock-like SBS1 and SBS5. Baselines: NNLS (MutationalPatterns), Mix, SigMA.

## Results (load-bearing)

- WES downsampled to 20% of mutations: **F1 0.707–0.982, AUC 0.795–1.0, AUPRC 0.541–0.975** across APOBEC/UV/tobacco/POLE/MMR/SBS5/SBS1 — beating NNLS on every signature, including where NNLS failed (clock signatures, MMR, POLE).
- **HRD (SBS3) consistently FAILED** in both WES and WGS (and in panels) — a critical limitation.
- On **994 labeled MSK-IMPACT panels**: sensitivity **0.9–1.0**, specificity **0.996–1.0**, PPV **0.99–1.0**.
- Predictions made with **≥4 SNVs** (even 1–3 tested); PCAWG WGS validation used 0.2% downsampling or ≥10 mutations.
- Reference comparators: SigMA ~84% SBS3 accuracy on downsampled WGS / ~73% others; Mix's only clinical measure AUC 0.64.
- Clinical use case: **APOBEC** was a robust, specific predictor of **EGFR-TKI resistance** in NSCLC; UV/tobacco/APOBEC associated with better survival independent of TMB.

Verbatim: *"MESiCA achieved…F1 scores of 0.707–0.982, AUCs of 0.795–1.0…There was one exception, HRD, which failed to be predicted in both cohorts."*

## Limitations

Predicts only the *dominant* signature, not full activities; **cannot reliably call SBS3/HRD** in low-count data; public panel datasets are under-annotated (raw data hold ~3× more mutations), so real-world coverage is likely higher; MMR/aging boundary cases mislabeled. Illustrates the **panel-size floor** on signature analysis.

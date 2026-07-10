---
topic: Neoantigen prediction pipeline — HLA typing through peptide-MHC binding to immunogenicity ranking
keywords: [neoantigen prediction, HLA typing, peptide-MHC binding, NetMHCpan, pVACseq, immunogenicity, clonal neoantigen, pipeline, T-cell, vaccine design]
related: [sources/hla-typing-ngs-accuracy.md, sources/neoantigen-vaccine-clinical-2025.md, somatic-variant-calling.md, clonal-architecture-inference.md, ../walls/immunogenicity.md]
defines:
  neoantigen-prediction-pipeline: "End-to-end computational pipeline from HLA typing → peptide generation → MHC binding prediction → expression/clonality filtering → candidate ranking; binding prediction computable (AUC >0.9), but immunogenicity prediction empirical (~6% PPV for top candidates)"
kinds:
  neoantigen-prediction-pipeline: stage
epistemics: hybrid
source: "pVACseq Hundal 2020 Cancer Immunol Res; NetMHCpan 4.1 Reynisson 2020 Nucleic Acids Res; TESLA consortium Wells 2020 Cell; mRNA-4157 Weber 2024 Lancet"
source_type: paper
asserted_at: "2026-07"
---

# Neoantigen Prediction Pipeline

[[neoantigen-prediction-pipeline]] is the computational path from somatic mutations to ranked vaccine candidates. It is the last computable step before the empirical wall of [[neoantigen-immunogenicity]]: peptide-MHC binding is predictable (AUC >0.9), but whether a presented neoantigen will trigger a T-cell response is not computable de novo.

## Pipeline Steps

1. **HLA typing** (OptiType/T1K, >99% accuracy Class I): determines the patient's MHC alleles.
2. **Peptide generation**: enumerate all 8-11mer peptides spanning each somatic mutation.
3. **MHC binding prediction** (NetMHCpan 4.1, MHCflurry 2.0): rank peptides by predicted binding affinity/eluted-ligand score. Strong binders: IC50 <500nM or %rank <2%.
4. **Expression filter**: RNA-seq confirms the mutated gene is expressed in tumor (TPM >1).
5. **Clonality filter**: retain only mutations classified as clonal (CCF >0.7) from clonal architecture inference.
6. **Ranking**: composite score combining binding strength, expression, clonality, variant type, and optional immunogenicity predictors.

## The Hybrid Epistemics

Steps 1-3 are **computable** — given correct HLA alleles and mutation coordinates, binding predictions are deterministic and well-validated. Steps 4-5 are computable given data (RNA-seq, clonality calls). But the final ranking's clinical value depends on immunogenicity, which is **empirical**: the TESLA consortium (Wells 2020) showed that <60% of predicted neoantigens are immunogenic, and ~6% of top-ranked predictions validate in functional T-cell assays. Current vaccines compensate by including 20-34 candidates, banking on ≥1 being functional.

## This stage is the terminal computable step of the diff pipeline and directly precedes the design stage, feeding ranked neoantigen candidates into vaccine construct design for [[neoantigen-vaccine]]:

precedes:: [[neoantigen-vaccine]]

## The pipeline's output quality is rate-limited by the immunogenicity wall — no computational filter reliably excludes non-immunogenic peptides:

gated-by:: [[neoantigen-immunogenicity]]

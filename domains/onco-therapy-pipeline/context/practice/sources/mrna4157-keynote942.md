---
topic: mRNA-4157/V940 KEYNOTE-942 — personalized neoantigen mRNA vaccine Phase 2b results in resected melanoma
keywords: [mRNA-4157, V940, KEYNOTE-942, neoantigen vaccine, melanoma, pembrolizumab, recurrence-free survival, personalized, Moderna, Merck, LNP]
source: "Weber JS et al. Lancet 2024 doi:10.1016/S0140-6736(24)00588-6; NCT03897881; Moderna press release 2023-12-14 (3-year RFS update)"
source_type: clinical-trial
epistemics: empirical
asserted_at: "2026-07"
---

# mRNA-4157/V940 (KEYNOTE-942) — Immune-Branch Worked Case

## Trial Design

Randomized, open-label Phase 2b trial (KEYNOTE-942, NCT03897881) in patients with completely resected high-risk stage III/IV melanoma. mRNA-4157 (V940) encodes up to 34 patient-specific neoepitopes identified by whole-exome sequencing of tumor-normal pairs, combined with pembrolizumab vs pembrolizumab alone.

Sponsored by Moderna and Merck. Enrolled 157 patients (2:1 randomization). Primary endpoint: recurrence-free survival (RFS).

## Pipeline Trace

The trial arc maps directly to the pipeline stages:

1. **Sampling**: surgical resection + tumor biopsy + matched normal (blood).
2. **Diff**: WES of tumor-normal pair; somatic variant calling (SNV, indel); HLA typing from germline WES; neoantigen prediction via proprietary pipeline (NetMHCpan-family binding, expression filtering, clonality weighting). Up to 34 neoepitopes selected per patient.
3. **Design (immune branch)**: mRNA construct encoding concatenated neoepitope minigenes; codon-optimized, modified nucleosides (N1-methylpseudouridine); 5' cap + poly(A) tail.
4. **Manufacture**: in-vitro transcription of patient-specific mRNA; LNP encapsulation (ionizable lipid formulation). Manufacturing turnaround ~6 weeks from biopsy to first dose (early batches); Moderna's mRNA platform reduces per-patient marginal time.
5. **Delivery**: intramuscular injection; LNP delivers mRNA to antigen-presenting cells at the injection site and draining lymph nodes (not systemic solid-tumor delivery — this is a vaccine, not a tumor-targeting therapy). Up to 9 doses over ~35 weeks.
6. **Efficacy**: RFS as primary endpoint; ctDNA and T-cell response as exploratory.

## Key Results

- **RFS hazard ratio 0.561** (95% CI 0.309-1.017; one-sided p=0.053) at the primary analysis (median ~2 years follow-up).
- **44% reduction** in recurrence or death vs pembrolizumab alone.
- 18-month RFS rate: 78.6% (mRNA-4157 + pembro) vs 62.2% (pembro alone).
- Updated 3-year data (presented ASCO 2024): sustained benefit, HR 0.59 (95% CI 0.34-1.03); distant-metastasis-free survival HR 0.48.
- T-cell responses (IFN-gamma ELISpot) detected against vaccine neoepitopes in the majority of evaluable patients.
- Phase 3 INTerpath-001 (NCT06077760) initiated late 2023, enrolling ~1,089 patients in adjuvant melanoma.

## Where the Binding Constraint Appeared

In this case, delivery is not the binding wall — the vaccine is injected IM, targeting APCs in peripheral lymphoid tissue, not solid tumor cells. The binding constraint is **neoantigen immunogenicity**: of the up to 34 predicted neoepitopes per patient, only a fraction elicit measurable T-cell responses. The pipeline's neoantigen-prediction step (MHC-I binding prediction AUC >0.9, but immunogenicity PPV ~6% for top candidates) is the quality gate that determines vaccine potency. The 44% RFS improvement demonstrates clinical signal despite this immunogenicity ceiling.

Manufacturing turnaround (~6 weeks) is a contributing floor but not the binding stage — Moderna's platform is industrialized for mRNA. The design stage (construct optimization) is computable and fast (<1 week).

## Source Quality

Phase 2b randomized trial with 157 patients; published in Lancet (peer-reviewed); 3-year update presented at ASCO 2024. Confidence: high for RFS signal, moderate for neoantigen-count claims (proprietary pipeline details not fully disclosed).

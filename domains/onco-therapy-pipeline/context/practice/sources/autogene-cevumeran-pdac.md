---
topic: Autogene cevumeran (BNT122) — personalized neoantigen mRNA vaccine Phase 1 results in resected pancreatic cancer
keywords: [autogene cevumeran, BNT122, neoantigen vaccine, pancreatic cancer, PDAC, BioNTech, Genentech, T-cell response, individualized, cold tumor]
source: "Rojas LA et al. Nature 2023 doi:10.1038/s41586-023-06063-y; NCT04161755; IMCODE 003 NCT05968326"
source_type: clinical-trial
epistemics: empirical
asserted_at: "2026-07"
---

# Autogene Cevumeran (BNT122) — Immune-Branch Worked Case in a Cold Tumor

## Trial Design

Phase 1 single-arm trial (NCT04161755) in patients with surgically resected pancreatic ductal adenocarcinoma (PDAC) — a tumor type historically classified as immunologically "cold" (low TMB, median ~1 mut/Mb; dense desmoplastic stroma; immunosuppressive microenvironment). Autogene cevumeran encodes up to 20 patient-specific neoepitopes as a uridine mRNA-LNP formulation, administered with atezolizumab (anti-PD-L1) followed by modified FOLFIRINOX chemotherapy.

Sponsored by BioNTech and Genentech. 16 patients received the vaccine; published by Rojas et al. in Nature 2023.

## Pipeline Trace

1. **Sampling**: surgical resection (Whipple procedure) + tumor tissue + matched blood.
2. **Diff**: WES + RNA-seq of tumor-normal pair; somatic variant calling; HLA typing; neoantigen prediction filtering for expression, clonality, and MHC binding. Median 7 nonsynonymous somatic mutations per tumor (PDAC has very low TMB).
3. **Design (immune branch)**: up to 20 neoepitopes selected per patient; uridine-modified mRNA construct; BioNTech's individualized neoantigen-specific immunotherapy (iNeST) platform.
4. **Manufacture**: mRNA synthesis in approximately 3 days (BioNTech's automated manufacturing); total turnaround from tissue to first dose ~6-9 weeks including sequencing, prediction, and QC.
5. **Delivery**: intravenous infusion (not IM like mRNA-4157); LNP formulation targets spleen/liver APCs systemically.
6. **Efficacy**: T-cell response as primary immunogenicity endpoint; RFS as clinical endpoint.

## Key Results

- **8 of 16 evaluable patients (50%)** developed vaccine-induced neoantigen-specific T-cell responses (responders), detected by ex-vivo IFN-gamma ELISpot and/or de novo T-cell clonotype expansion.
- **Responders had significantly longer RFS**: median not reached at 18 months vs 13.4 months for non-responders (HR 0.08, 95% CI 0.01-0.69, p=0.003).
- Some responders showed T-cell responses against multiple neoantigens (polyclonal).
- At median 18 months follow-up, 0/8 responders had recurrence vs 7/8 non-responders.
- T-cell clones were detectable in peripheral blood and showed expansion kinetics consistent with vaccine priming.

## Where the Binding Constraint Appeared

PDAC is the hardest test case for the immune branch: low TMB means few candidate neoantigens (median 7 vs 34 for melanoma in mRNA-4157), and the immunosuppressive microenvironment suppresses effector T-cell infiltration. The binding constraint in this case was **neoantigen immunogenicity in a cold tumor** — only 50% of patients mounted detectable responses, and the correlation between response and RFS was stark (HR 0.08). The small neoantigen pool (limited by low TMB) compounds the immunogenicity wall: fewer candidates to select from, and the quality of each candidate matters more.

Delivery here is IV-to-APC (not solid-tumor targeting), so the delivery wall does not apply directly. Manufacturing was fast (~3 days for mRNA synthesis). The binding constraint is squarely at the diff-to-design interface: can you find enough immunogenic neoantigens in a cold tumor?

## Phase 2 Status

Phase 2 IMCODE 003 (NCT05968326) initiated 2023, randomized, enrolling patients with resected PDAC. Results pending as of mid-2025.

## Source Quality

Phase 1, single-arm, 16 patients — small but landmark (first individualized neoantigen vaccine in PDAC); published in Nature (peer-reviewed); striking RFS correlation. Confidence: high for the biology (T-cell response ↔ RFS), moderate for magnitude (small N).

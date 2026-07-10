---
topic: Tumor clonal evolution dynamics during personalized therapy manufacturing intervals — how fast neoantigen targets become stale
keywords: [clonal evolution, tumor doubling time, neoantigen loss, immune editing, HLA LOH, subclonal dynamics, TRACERx, immune evasion, antigen escape, manufacturing interval]
related: [../manufacturing-time-floor.md]
epistemics: empirical
source: "McGranahan et al. Cell 2017 171:1259 (clonal neoantigen depletion); Rosenthal et al. Cancer Cell 2019 35(6):885 (HLA LOH in NSCLC, TRACERx); Jamal-Hanjani et al. NEJM 2017 376:2109 (TRACERx clonal evolution); Litchfield et al. Cell 2021 184(3):596 (pan-cancer neoantigen depletion)"
source_type: paper
asserted_at: "2026-07"
---

# Tumor Clonal Evolution Dynamics and Neoantigen Target Stability

## Clonal Evolution Rates

Tumor clonal evolution operates on timescales directly relevant to personalized therapy manufacturing intervals:

- **Tumor volume doubling time**: median ~60–200 days depending on cancer type. NSCLC: ~100–180 days (Jamal-Hanjani 2017 TRACERx). Melanoma: ~60–90 days. Pancreatic: ~80–120 days. These are bulk volume doublings; subclonal populations turn over faster.
- **Somatic mutation rate**: approximately 1–10 mutations per cell division per genome (Tomasetti 2017 Science). Over a 4–8 week manufacturing interval, a typical solid tumor with ~10^9 cells undergoes multiple rounds of cell division.
- **Subclonal turnover**: In TRACERx, clonal architecture shifted measurably between paired biopsies taken ~median 7 months apart (Jamal-Hanjani et al. NEJM 2017). Shorter intervals (~4–8 weeks) still show detectable shifts in VAF distributions of subclonal mutations.

## Neoantigen Loss Under Immune Pressure

Tumors actively deplete their neoantigen burden through immune editing:

- **HLA loss of heterozygosity (LOH)**: Rosenthal et al. Cancer Cell 2019 found HLA LOH in 40% of NSCLC tumors (TRACERx 100). HLA LOH preferentially affects the allele presenting the strongest neoantigens, effectively erasing the target. This is a one-time irreversible event, not gradual.
- **Clonal neoantigen depletion**: McGranahan et al. Cell 2017 showed that tumors with high clonal neoantigen burden undergo observable neoantigen loss over time — the ratio of observed to expected neoantigens decreases in later-stage samples, consistent with negative selection.
- **Pan-cancer evidence**: Litchfield et al. Cell 2021 analyzed >1,000 tumors across 12 cancer types and found systematic neoantigen depletion in immunogenic tumors, with stronger depletion in tumors with higher immune infiltration.
- **Beta-2 microglobulin (B2M) loss**: loss-of-function mutations in B2M abolish all MHC-I presentation. Found in ~5–10% of tumors post-immunotherapy (Sade-Feldman et al. Nat Med 2017).

## The "Stale Target" Problem

The manufacturing interval creates a temporal mismatch:

1. Tumor is biopsied at time T=0.
2. Neoantigens are predicted from the T=0 snapshot.
3. Vaccine is manufactured over 4–8 weeks.
4. Patient receives first dose at T=4–8 weeks.
5. By T=4–8 weeks, the tumor's neoantigen landscape may have shifted:
   - Subclonal neoantigens at T=0 may be undetectable at T+6 weeks (clonal sweep by a competing subclone).
   - HLA LOH events during the interval can eliminate the presentation of predicted neoantigens.
   - New subclones may have emerged that are not targeted by the vaccine.

This is not a theoretical concern. In the BNT122 pancreatic trial (Rojas 2023), 8/16 patients showed T cell responses; the non-responders may partly reflect target drift during the 6-week manufacturing interval, though tumor heterogeneity and immunosuppressive microenvironment are confounding factors.

## Quantitative Estimates

- A tumor with doubling time of 100 days undergoes ~0.4–0.6 volume doublings in a 6-week window.
- At a mutation rate of ~1 mutation/Gb/division, a tumor with ~10^9 cells acquires ~10^9 new mutations per doubling — most are passengers, but a fraction (~1–5 per genome per cell) are in coding regions.
- The probability of losing a specific clonal neoantigen target in a 6-week window is low (~1–5% per allele through LOH or editing); the probability of at least one subclonal neoantigen target changing is high (>50% for a 20-neoantigen panel with any subclonal components).

## Implications for Speed

The biological argument for speed is not about convenience — it is about target validity. Every week of delay increases the probability that the neoantigen snapshot used to design the vaccine no longer matches the tumor at dosing. This creates a fundamental tension: faster manufacturing compresses QC (risking safety), but slower manufacturing degrades efficacy (the target drifts). The optimal manufacturing time is the shortest interval that does not compromise safety — currently ~4 weeks at the BioNTech/Moderna frontier.

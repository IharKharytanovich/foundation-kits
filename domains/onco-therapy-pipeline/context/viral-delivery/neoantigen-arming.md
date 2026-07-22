---
topic: Neoantigen-encoded oncolytic viruses — arming the virus with a patient's own tumor neoantigens so the anti-tumor response is engineered in, not hoped for
keywords: [neoantigen arming, oncolytic vaccine, personalized cancer vaccine, epitope spreading, immunodominance, MHC class II, CD4 help, prime-boost, PeptiCRAd, MY-NEOVAX, in-situ vaccination, HLA restriction]
related: [armored-oncolytic-virus.md, ov-neutralizing-antibody.md, ov-platform-landscape.md, chemokine-flt3l-arming.md, ../diff/neoantigen-prediction-pipeline.md, ../walls/immunogenicity.md]
defines:
  neoantigen-encoded-oncolytic-virus: "An oncolytic virus armed with the patient's own tumor neoantigens (computed from a tumor-normal diff + HLA typing) so its lytic, immunogenic cell death primes a systemic anti-neoantigen response — an oncolytic virus used as a personalized cancer vaccine"
kinds:
  neoantigen-encoded-oncolytic-virus: method
epistemics: hybrid
source: "Alkayyal 2026 Pharmaceuticals 19(3):364 (review); Roy 2021 Nat Commun; Baleeiro 2023 JITC; Feola 2022 Front Immunol (PeptiCRAd); Bouvet 2019 Oxf Med Case Rep (MY-NEOVAX); Tran 2016 NEJM (HLA-C*08:02 KRAS G12D TIL)"
source_type: paper
asserted_at: "2026-07"
---

# Neoantigen Arming

[[neoantigen-encoded-oncolytic-virus]] is the arm of [[armored-oncolytic-virus]] where the payload is not a cytokine or antibody but the **patient's own tumor neoantigens**. The virus does two jobs at once: it lyses tumor cells (immunogenic cell death + danger signal) and it presents computed neoantigens as its cargo, so the primed T-cell response is engineered to recognize the cancer. The field name is *oncolytic vaccine* / *neoantigen-encoded OV*; Alkayyal 2026 (Pharmaceuticals) is a full review dedicated to it.

This file records where a design discussion converged and what the 2019–2026 literature confirms.

## The Two-Knob Model — Why "Make the Virus Look Like the Cancer" Is Wrong

The intuitive idea — build a virus that resembles the tumor so the anti-viral response cross-reacts with cancer — fails on **self-tolerance**. Resemblance to the tumor means resemblance to self; shared epitopes are self-antigens, which tolerance suppresses (weak response) and, if force-broken, cause autoimmunity against normal tissue carrying the same antigen (Linette 2013 MAGE-A3/titin: two deaths). This is mimicry, and it is a trap.

The correct setting is **anti-parallel**, because two independent knobs control two different immune responses:

- **Surface (capsid/envelope) → stealth.** Less foreign surface → slower neutralization → longer oncolysis. Governs how long the virus survives, not how hard the cancer is hit.
- **Cargo (encoded antigen) → maximally foreign (mutant neoantigens).** Governs the strength of the anti-tumor response, with no tolerance and no autoimmunity.

The delta is immune, not oncolytic (see [[armored-oncolytic-virus]]): direct lysis as monotherapy has a low ceiling (PHOCUS, TRAVERSE failed randomization). The anti-tumor response comes from **in-situ vaccination** — antigens released from lysed cancer cells, plus epitope spreading — *not* from the virus resembling the tumor. So the virus need not look like cancer at all; it needs to lyse well and carry foreign mutant targets.

## The Immunodominance Ceiling

"Engineer the virus so the *only* possible response is anti-tumor" is unreachable. The viral scaffold (capsid, structural proteins) is genuinely foreign — more foreign than self-derived neoantigens — so the immune system preferentially answers the viral proteins (**immunodominance**), pushing neoepitopes into the shade. Removing the viral scaffold entirely to force an anti-neoantigen-only response leaves a lipid particle carrying RNA — i.e. an mRNA vaccine (Kennedy 2022 synthetic RNA virus). Taken to its limit, the idea becomes the personalized neoantigen vaccine (mRNA-4157, autogene cevumeran).

Field countermeasures to viral immunodominance:
1. **Delete immunodominant viral loci** (HSV ICP34.5/ICP47, vaccinia TK) — doubles as tumor selectivity; ΔICP47 also restores TAP → better presentation.
2. **Encode CD4 help / MHC class II neoepitopes** (preferred lever) — CD4 licensing of DCs holds neoantigen-specific CD8 across repeat doses (Huff 2023).
3. **Heterologous prime-boost** — antigen-agnostic OV primes the TME, personalized antigen-bearing agent boosts (Ad-prime / Maraba-boost); serotype swap also dodges neutralizing antibodies.
4. **Surface peptide co-delivery** — PeptiCRAd adsorbs neoantigen peptides on the capsid (Feola 2022); Roy 2021 showed peptide co-admin equals genome-encoding and is **replication-independent**.
5. **Dampen anti-viral immunity** — rare serotypes, capsid engineering, high-MOI intratumoral over systemic.

## The Oracle/Wall Boundary — KRAS G12D Worked Example

The pipeline diff → translation → neoepitope enumeration → MHC-binding rank is **computable and HLA-specific**; a toy run over KRAS G12D shows one driver yielding different targets per HLA type: A*02:01 favors `KLVVVGADGV`, A*03:01/A*11:01 favor `VVVGADGVGK` (different C-terminal anchor). This is why a personalized vaccine must condition on HLA type, not just the mutation — [[neoantigen-prediction-pipeline]] is the mature, computable front end.

But **which** epitope actually drives killing is the empirical wall: TCR recognition is near-random de novo (AUC 0.52–0.60), ~6% of top predictions validate. The clinical anchor is exactly a boundary illustration: HLA-C*08:02-restricted KRAS G12D drove a TIL response in metastatic colorectal cancer (Tran 2016 NEJM) — an epitope a crude anchor heuristic ranks "weak." The oracle ranks; the patient and the lab confirm. This is why the engineering above (many epitopes, CD4 help, MS immunopeptidomics validation, reliance on epitope spreading) exists — it **bypasses** the immunogenicity wall by number and adjuvancy rather than breaking it by prediction.

## Clinical / Preclinical Anchors (2019–2026)

- **MY-NEOVAX** (Bouvet 2019) — personalized neoantigen-armed oncolytic adenovirus; two terminal patients, >12 months benefit, no dose-limiting toxicity (case report, N=2 — low generalizability).
- **Roy 2021** (Nat Commun) — OV + neoantigen peptides equals genome-encoding, replication-independent.
- **Baleeiro 2023** (JITC) — oncolytic vaccinia + long peptides prime/boost in TNBC; neoantigen-specific CD8, improved survival.
- **PeptiCRAd** (Feola 2022) — surface peptide adsorption, fast N-of-1 adaptation, immunogenic (not tolerogenic) presentation.
- **EnteroMix** (2025) — hybrid oncolytic enteroviruses + personalized mRNA neoantigen component; the two branches fused into one product.
- **Hyperacute-rejection OV** (Cancer Discovery 2025) — virus expresses α-Gal to weaponize pre-existing anti-Gal antibodies (turns the anti-viral immune response into the anti-tumor weapon — the closest realization of the original discussion idea).

This is a personalized cancer vaccine that self-replicates and self-adjuvants at the tumor, so it routes around the delivery wall (local injection + intratumoral amplification) while inheriting the immunogenicity and N-of-1 manufacturing walls.

derived-from:: [[armored-oncolytic-virus]]
gated-by:: [[neoantigen-immunogenicity]]
bypasses:: [[solid-tumor-delivery]]

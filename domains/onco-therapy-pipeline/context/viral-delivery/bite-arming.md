---
topic: BiTE-armed oncolytic viruses — the virus secretes a bispecific T-cell engager intratumorally to redirect polyclonal and antigen-negative T-cell killing
keywords: [BiTE, bispecific T-cell engager, EpCAM, FAP, EGFR, EphA2, bystander killing, antigen negative, enadenotucirev, NG-641, CAR-T combination]
related: [armored-oncolytic-virus.md, ov-local-payload-secretion.md, sources/freedman-2017-enad-epcam-bite.md, sources/yu-2014-ephA2-tea-vv.md]
defines:
  bite-arming: "Arming an oncolytic virus with a bispecific T-cell engager (BiTE) — a secreted antibody linking a tumor/stromal antigen to CD3 — so infected tumor cells manufacture the engager locally, redirecting endogenous polyclonal T cells (and bystander killing of antigen-negative and stromal cells) without ex-vivo cell engineering"
kinds:
  bite-arming: method
epistemics: empirical
source: "Freedman 2017 EnAd-EpCAM-BiTE (30-fold T-cell expansion, kills in patient ascites despite PD-1 65%); Yu 2014 EphA2-TEA-VV (100% CR vs unarmed VV, p<0.0001); de Sostoa 2019 ICO15K-FBiTE (15–20% bystander kill); NG-641 clinical"
source_type: paper
asserted_at: "2026-07"
---

# BiTE Arming

[[bite-arming]] loads an oncolytic virus with a secreted bispecific T-cell engager — one arm binds a tumor or stromal antigen (EpCAM, EGFR, FAP, EphA2), the other binds CD3 — so the infected tumor becomes a local factory for a T-cell–redirecting antibody. It is a distinct arm of [[armored-oncolytic-virus]] because it recruits the patient's **own polyclonal** T cells and reaches **antigen-negative** cells by bystander killing, addressing the antigen-escape problem that limits single-target CAR-T.

## Secretion and Redirection (Freedman 2017)

Enadenotucirev encoding an EpCAM×CD3 BiTE secreted up to 165 µg per 10⁶ infected cells (functional EC50 7.4 ng/mL). In primary patient malignant ascites, the secreted BiTE activated endogenous T cells (dual CD25⁺/CD69⁺ to 50–95%), drove up to 30-fold T-cell proliferation, and depleted EpCAM⁺ targets in **all** patient samples — even with T-cell PD-1 around 65% and immunosuppressive IL-10 present. The unarmed virus produced none of this; oncolysis was identical.

## The Cleanest In-Vivo Survival Delta (Yu 2014)

An EphA2×CD3 BiTE-armed vaccinia (EphA2-TEA-VV) replicated identically to unarmed GFP-vaccinia, but only the armed virus activated T cells and, in A549 xenografts with human PBMCs, produced **complete remission in all treated animals versus none** for unarmed virus + T cells (survival p<0.0001).

## Stromal Targeting and Bystander Kill (de Sostoa 2019)

A FAP×CD3 BiTE-armed adenovirus (ICO15K-FBiTE) directed T cells against tumor-associated fibroblasts and killed FAP-negative bystander cells at 15–20% cytotoxicity; in A549 and HPAC xenografts, tumors were controlled where unarmed virus + T cells failed. FAP-BiTE arming is the OV route into the stromal-exclusion problem covered in the trafficking cluster.

## Clinical State and Combination

The leading clinical asset, NG-641 (enadenotucirev + FAP-TAc engager + CXCL9/CXCL10/IFNα), is intravenously deliverable and pharmacodynamically active (transgene-specific serum cytokines absent in the unarmed parent), but its phase 1a produced no objective responses and its efficacy figures are conference-level. BiTE-armed OVs also pair with CAR-T: OAd-BiTE redirects both the CAR-T and bystander T cells against antigen-negative escape variants.

supports:: [[armored-oncolytic-virus]]

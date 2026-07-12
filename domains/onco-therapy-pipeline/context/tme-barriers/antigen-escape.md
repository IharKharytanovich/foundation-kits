---
topic: Antigen escape — antigen-negative relapse and MHC-I/β2-microglobulin loss that let tumors evade even a working immune or CAR-T response over time
keywords: [antigen escape, antigen loss, CD19-negative relapse, BCMA loss, B2M, beta-2-microglobulin, MHC-I, HLA loss of heterozygosity, immune evasion, resistance]
related: [solid-tumor-immune-response.md, ../efficacy/resistance-evolution-loop.md, sources/han-2025-b2m.md]
defines:
  antigen-escape: "Loss of the target antigen or of antigen presentation as an immune-evasion mechanism: antigen-negative relapse (CD19-negative 9–33%), and MHC-I / β2-microglobulin loss (B2M altered in ~29% of melanoma, HLA loss-of-heterozygosity in ~40% of NSCLC) — defeating a working immune or CAR-T response over time"
kinds:
  antigen-escape: constraint
epistemics: empirical
source: "Atilla 2022 Transl Oncol (CD19-neg relapse 9–25% B-ALL, ~33% DLBCL; BCMA loss 8%); Han 2025 Front Immunol (B2M 29.4% melanoma, HLA-LOH 40% NSCLC, B2M LOH 3× in PD-1 non-responders)"
source_type: paper
asserted_at: "2026-07"
---

# Antigen Escape

[[antigen-escape]] is the temporal blocker: even a response that clears most of a tumor is defeated over time by variants the immune system can no longer see. It erodes [[solid-tumor-immune-response]] and feeds the [[resistance-evolution-loop]] — the tumor evolves faster than one treatment cycle, and antigen-negative subclones frequently exist before therapy begins.

## Antigen-Negative Relapse

The clearest evidence comes from CAR-T, where the target antigen is single and defined. CD19-negative relapse occurs in **9–25% of B-cell acute lymphoblastic leukemia** and about **33% of diffuse large B-cell lymphoma** treated with CD19 CAR-T. For BCMA CAR-T in myeloma, biopsy-proven antigen loss occurs in ~8% of patients, with a majority showing reduced BCMA intensity after infusion. Relapse after CD19/CD22 CAR-T reaches up to 50% of pre-B ALL by 12 months. Antigen escape is a leading relapse driver even when the CAR-T cells persist — a warning that single-antigen targeting invites escape (the rationale for multi-antigen and bystander-killing strategies like BiTE arming).

## Loss of Antigen Presentation (MHC-I / β2-Microglobulin)

Tumors also escape by losing the machinery that displays antigen. In advanced melanoma, **29.4%** carry β2-microglobulin (B2M) mutation, deletion, or loss-of-heterozygosity, and B2M LOH is **3× more frequent in anti-PD-1 non-responders** than responders. HLA loss-of-heterozygosity occurs in **~40% of NSCLC**, and B2M mutations in ~24% of MSI-high colorectal cancer. Higher B2M expression predicts better checkpoint-inhibitor response and longer survival; B2M frameshift mutation confers acquired PD-1 resistance.

## The Paradox

MHC-I loss is not always an absolute resistance mechanism: MSI-high colorectal cancers frequently lose B2M yet most still benefit from checkpoint inhibitors (a 35-patient cohort found no significant PD-1-efficacy difference by B2M status), because NK cells provide a backup that recognizes MHC-I-low cells. Antigen escape is a strong but context-dependent blocker — the reason durable control needs either a moving target set (re-diff after evolution) or effectors that do not depend on a single antigen or on classical MHC-I presentation.

blocks:: [[solid-tumor-immune-response]]
supports:: [[resistance-evolution-loop]]

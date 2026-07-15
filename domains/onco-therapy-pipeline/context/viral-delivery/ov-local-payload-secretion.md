---
topic: Local intratumoral payload secretion by armed oncolytic viruses — the virus manufactures the therapeutic protein inside the tumor, sparing systemic exposure and toxicity
keywords: [local secretion, intratumoral, payload, transgene, systemic toxicity, checkpoint antibody, IL-12, BiTE, serum-undetectable, in-situ manufacturing]
related: [armored-oncolytic-virus.md, checkpoint-arming.md, cytokine-arming.md, sources/tanoue-2017-cadvec-minibody.md]
defines:
  ov-local-payload-secretion: "The defining pharmacological advantage of an armed oncolytic virus: the virus expresses its transgene payload (cytokine, checkpoint antibody, T-cell engager) inside the tumor, reaching therapeutic intratumoral concentrations while remaining undetectable or minimal in serum — decoupling local potency from systemic toxicity"
kinds:
  ov-local-payload-secretion: claim
epistemics: empirical
source: "Tanoue 2017 (PD-L1 minibody in tumor, undetectable in serum; local 110 d vs systemic IgG 59 d); BT-001 (anti-CTLA-4 0/350 blood samples); Niu 2020 vvDD-iPDL1 (serum >15 d); C5252 (intratumoral anti-PD-1 242.5 pg/mL)"
source_type: paper
asserted_at: "2026-07"
---

# Local Payload Secretion — The Reason to Arm a Virus at All

[[ov-local-payload-secretion]] is the pharmacological argument for putting a transgene into an oncolytic virus rather than giving the drug systemically: the virus becomes a tumor-localized factory that reaches high **intratumoral** concentrations of an otherwise-toxic agent (IL-12, a checkpoint antibody, a T-cell engager) while keeping **serum** levels low. It underpins [[armored-oncolytic-virus]] and is the direct rationale for [[checkpoint-arming]].

## The Cleanest Demonstration (Tanoue 2017)

An oncolytic adenovirus co-delivering an anti-PD-L1 minibody produced the minibody in tumor lysates at days 3, 7, and 21 but **left it undetectable in serum**. The functional payoff was a survival difference attributable to *where* the antibody was: virus + local minibody gave 110-day median survival versus 59 days for virus + the same checkpoint antibody given systemically as IgG — and systemic IgG produced 30–90% lower intratumoral T-cell activity than local delivery.

## Consistent Across Payload Classes

- **Checkpoint antibodies.** BT-001 (oncolytic vaccinia encoding anti-CTLA-4) was detectable in tumor biopsies but positive in **0 of 350 blood samples** — the entire point of local delivery is avoiding systemic anti-CTLA-4 toxicity.
- **Cytokines.** IL-12 is too toxic to give systemically at active doses; armed viruses reach intratumoral IL-12 in the hundreds-to-thousands of pg/mL range (C5252: intratumoral anti-PD-1 242.5 pg/mL, IL-12p70 401.7 pg/mL) with cytokine detectable only in the armed arms.
- **Traps and peptides.** A soluble PD-1–Fc trap from vvDD-iPDL1 persisted in serum >15 days — a reminder that "local only" holds for most but not all constructs, and each payload's biodistribution must be measured.

The recurring authoring gap: most studies report the *effect* (p-values, survival deltas) but few report **absolute intratumoral vs serum concentration in ng/mL** — the two hard numbers are C5252 and the qualitative "not detectable in serum" of Tanoue and BT-001.

supports:: [[armored-oncolytic-virus]]

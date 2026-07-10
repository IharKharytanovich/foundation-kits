---
topic: Genetic targeting design — the genetic branch's design loop from diff to allele-specific or phenotype-targeted therapeutic
keywords: [genetic targeting, allele-specific, CRISPR, oncolytic virus, ASO, siRNA, selectivity, driver mutation, ex vivo, in vivo, delivery wall]
related: [sources/crispr-oncology-clinical.md, sources/oncolytic-virus-platforms.md, sources/allele-specific-selectivity.md, ../../delivery/delivery-wall.md, ../../delivery/barriers.md]
defines:
  genetic-targeting-design: "The design loop that turns a patient's driver mutation catalog into a genetic therapeutic candidate — allele-specific inhibitors, gene editing constructs, or phenotype-targeted vectors; mostly ex vivo or liver-reachable; solid-tumor in-vivo editing gated by the delivery wall"
kinds:
  genetic-targeting-design: stage
epistemics: hybrid
source: "Sotorasib FDA 2021; adagrasib NEJM 2022; MRTX1133 preclinical 2022; CTX110 Phase 1; T-VEC JCO 2015; siG12D-LODER Phase 2"
source_type: paper
asserted_at: "2026-07"
---

# Genetic Targeting Design

[[genetic-targeting-design]] is the genetic branch of the design stage: given a [[somatic-variant-calling]] catalog from the diff stage, identify driver mutations amenable to allele-specific targeting, design the genetic therapeutic (small-molecule inhibitor, editing construct, ASO/siRNA, or oncolytic vector), and route to the appropriate delivery strategy. Unlike the immune branch, the genetic branch works for **specific driver mutations** — not arbitrary passenger mutations — and is mostly **ex vivo** or restricted to reachable organs (liver). Direct in-vivo editing of solid-tumor cells is gated by [[solid-tumor-delivery]].

## The Selectivity Envelope

Allele-specific targeting is real for a narrow mutation class:

- **Covalent-handle mutations** (KRAS G12C): infinite selectivity — sotorasib/adagrasib bind a cysteine absent in WT. Approved, ORR ~37–43% in NSCLC.
- **Shape-complementarity mutations** (KRAS G12D): ~500× selectivity (MRTX1133 IC50 ~0.2 nM G12D vs ~100 nM WT). Phase 1/2 initiated 2023.
- **Fusion breakpoints** (BCR-ABL, ALK, RET, NTRK): the junction sequence is unique; kinase inhibitors target the downstream domain. Matched, not patient-unique.
- **Viral oncogenes** (HPV E6/E7): foreign protein, infinite selectivity. Therapeutic vaccines and TCR-T in clinical trials.
- **ASO/siRNA single-nucleotide discrimination**: 37.7–80.1× knockdown of G12D vs <1% WT (siG12D-LODER); sequence-position-dependent, not universally achievable.

Everything else — most passenger mutations, loss-of-function tumor suppressors (TP53, RB1), copy-number amplifications — is **not** allele-specifically targetable by the genetic branch. Those patients are routed to the immune branch.

## Modality Routing

**CRISPR/base/prime editing** — ex vivo dominates:
- Allogeneic CAR-T with CRISPR knockout (CTX110, BEAM-201): off-the-shelf, editing efficiency >90%, manufacturing from donor bank. The editing is applied to immune cells, not tumor cells.
- In-vivo editing clinically achieved only in liver (NTLA-2001, >90% protein knockdown). Solid-tumor in-vivo editing: preclinical only — blocked by [[in-vivo-genetic-editing]] and [[solid-tumor-delivery]].
- Sequence-level guide design and off-target prediction are delegated to the **onco-target-design** domain.

**Oncolytic viruses** — phenotype-targeted, not mutation-specific:
- Selectivity is to tumor phenotype (Rb-deficient, p53-mutant, viral promoter), not to the patient's unique mutations. T-VEC (HSV, approved melanoma), RP1/RP2 (armed HSV, Phase 2–3), CG0070 (adenovirus, Phase 3 bladder).
- Delivery is intratumoral injection — bypasses the systemic delivery wall but limits applicability to accessible lesions.

**Small-molecule allele-specific inhibitors** — the currently approved path:
- KRAS G12C (sotorasib, adagrasib): oral, systemic, approved.
- KRAS G12D (MRTX1133): Phase 1/2.
- Design of new covalent/non-covalent inhibitors is a medicinal chemistry problem, delegated to specialized design tools outside this domain.

## What the Genetic Branch Cannot Do

The genetic branch cannot target arbitrary patient-unique mutations. It works for:
1. A small set of recurrent drivers with exploitable structural features (KRAS G12C/G12D, fusions, viral oncogenes).
2. Ex vivo engineering of immune cells (CRISPR CAR-T).
3. Phenotype-selective oncolytic viruses (not personalized to mutations).

For the majority of patients whose tumors are driven by mutations outside this narrow envelope, the pipeline routes to the immune branch.

gated-by:: [[solid-tumor-delivery]]

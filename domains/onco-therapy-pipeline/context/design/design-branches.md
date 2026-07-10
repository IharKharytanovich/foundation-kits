---
topic: The two-branch design cycle — immune vs genetic, different evaluability, different economics, converging on manufacture
keywords: [design, two branches, immune branch, genetic branch, cycle, evaluability, economics, branching, neoantigen, allele-specific, delegation, oracle]
related: [immune/personalized-immunotherapy-design.md, genetic/genetic-targeting-design.md, immune/sources/keynote-942-mrna4157.md, genetic/sources/allele-specific-selectivity.md, ../map.md, ../landscape/modalities.md, ../walls/immunogenicity.md, ../delivery/delivery-wall.md]
defines:
  design-branch-cycle: "The design stage is a cycle over two branches — immune (neoantigen vaccines, adoptive cells) and genetic (allele-specific inhibitors, editing, oncolytic vectors) — with different evaluability, economics, and constraints; the branching decision is made at the diff stage based on the mutation class"
kinds:
  design-branch-cycle: stage
epistemics: hybrid
source: "KEYNOTE-942 (Weber 2024); sotorasib FDA 2021; Amtagvi FDA 2024; domain architecture (onco-target-design, mrna-design delegation)"
source_type: agent-inference
asserted_at: "2026-07"
---

# The Two-Branch Design Cycle

[[design-branch-cycle]] is the structure of the design stage: not a single linear path, but a **cycle over two branches** with fundamentally different evaluability, economics, and constraints. The branching decision is made at the [[somatic-variant-calling]] stage, based on what class of mutations the diff reveals.

## Branch Routing Logic

The diff stage produces a catalog of somatic variants. The design stage routes each actionable variant to the appropriate branch:

- **Immune branch** ([[personalized-immunotherapy-design]]): for the majority of tumor-specific mutations — passenger neoantigens, clonal neoantigens without a druggable structural feature. The immune system can recognize any mutant peptide presented on HLA, regardless of the mutation's functional role. This is the broadest branch: it covers every tumor that generates immunogenic neoantigens. Rate-limited by [[neoantigen-immunogenicity]] prediction accuracy.

- **Genetic branch** ([[genetic-targeting-design]]): for the narrow set of recurrent driver mutations with exploitable structural features — KRAS G12C/G12D (covalent/non-covalent inhibitors, ~37–500× selectivity), fusion breakpoints (unique junction sequences), viral oncogenes (HPV E6/E7, foreign protein). Also covers ex vivo immune-cell engineering (CRISPR CAR-T) and phenotype-targeted oncolytic viruses. Gated by [[solid-tumor-delivery]] for in-vivo applications.

## Different Evaluability

The two branches differ fundamentally in what is computable versus empirical:

| Dimension | Immune branch | Genetic branch |
|---|---|---|
| Binding prediction | Computable (peptide-HLA, AUC >0.85) | Computable (docking, covalent reactivity) |
| Therapeutic response | Empirical (immunogenicity <60% validate) | Mixed (covalent: predictable; non-covalent: empirical) |
| Fastest personalized loop | <4 weeks (mRNA vaccine) | Weeks–months (depending on modality) |
| Applicable mutation range | Broad (any neoantigen) | Narrow (specific drivers only) |
| Delivery constraint | Systemic (LNP/peptide) | Gated by delivery wall for in-vivo solid tumors |

## Different Economics

- **Immune branch**: N-of-1 manufacturing (each patient gets a unique vaccine or TIL product). Cost: >$100k per patient for TIL (Amtagvi list ~$515k); mRNA vaccines potentially cheaper at scale due to cell-free manufacturing.
- **Genetic branch**: matched therapeutics (one drug for all patients with the same mutation). Cost per patient lower at scale (sotorasib ~$17k/month), but R&D cost per drug is high and only covers patients with that specific mutation.

## Delegation to Paired Domains

The design stage delegates two sequence-level oracles outside this domain:

- **Genetic guide oracle** → **onco-target-design** domain: CRISPR guide RNA design, off-target prediction, base/prime editing window optimization. The genetic branch identifies that an edit is needed; onco-target-design designs the specific guide sequence.
- **mRNA construct oracle** → **mrna-design** domain: codon optimization, UTR engineering, modified nucleoside selection, LNP formulation parameters. The immune branch identifies the neoepitopes; mrna-design optimizes the mRNA construct encoding them.

These delegations are the reason the design stage is a cycle, not a one-shot: the oracle returns a construct, which may need iteration based on predicted immunogenicity (immune branch) or off-target profile (genetic branch).

## The Cycle Feeds Manufacturing

Both branches converge on the same downstream stages: manufacture → delivery → efficacy. The design stage's output is a therapeutic candidate specification; [[manufacturing-throughput]] determines how fast that specification becomes a dose.

feeds-into:: [[personalized-therapy-throughput]]

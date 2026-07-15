# Personal Cancer-Target Identification & Guide Design — Knowledge Base

Your starting point for turning a tumour-normal DNA difference into a targetable mutation and an allele-specific guide. The discipline throughout: **find a target that is clonal, DNA-unique, and discriminable — and score every choice on the sequence.** A targeting property you did not compute is a hypothesis, not a recommendation.

Navigate by the parallel sweep (`exploreConcept` + `hybridSearch` + the folder `index.md`), not by walking folders one at a time. Do not guess filenames.

## Contents

- [diff/index.md](diff/index.md) — The tumour-normal diff: somatic vs germline variants, allele fraction, clonality, and heterozygosity — what the difference between healthy and cancer DNA actually tells you.
- [targets/index.md](targets/index.md) — Target classes and the honesty tiers: fusion breakpoints and viral oncogenes (DNA-unique, clean), PAM/seed SNVs (the discriminable minority), and generic SNVs (wall-blocked).
- [constraints/index.md](constraints/index.md) — The physical walls that bound targetability: single-base discrimination, one-cut-is-not-death, and delivery. These are cited, not hand-waved past.
- [guide-design/index.md](guide-design/index.md) — Designing the gRNA / retron: PAM requirement, seed placement, on/off-target scoring, allele specificity, and guide-RNA folding.
- [methods/index.md](methods/index.md) — The compute toolkit mapped to tasks: biopython, seqtk, viennarna, and the off-target scan / scoring machinery.
- [practice/index.md](practice/index.md) — Workflow, the kit-to-task map, the interactive-scale boundary, and the defensive-therapeutic ethical frame.

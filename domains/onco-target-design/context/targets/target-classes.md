---
topic: Cancer target classes ranked by targetability — fusion breakpoints, viral oncogenes, PAM/seed SNVs
keywords: [fusion gene, breakpoint, BCR-ABL, EML4-ALK, HPV, E6, E7, viral oncogene, PAM, seed, clonal, unique]
related: [../constraints/single-base-discrimination.md, ../guide-design/specificity.md]
anchors:
  clean-targets: [fusion, breakpoint, viral oncogene, HPV, absent from healthy]
  hard-targets: [SNV, PAM-altering, seed region, minority]
defines:
  clonal-unique-target: "A cancer target that is present in (ideally all) tumour cells and absent from healthy DNA — the property that makes DNA-level targeting honest"
  fusion-breakpoint-target: "The junction sequence of a fusion oncogene (e.g. BCR-ABL), which exists in no healthy cell"
  viral-oncogene-target: "A foreign viral oncogene sequence (e.g. HPV E6/E7) absent from the human germline"
  pam-altering-snv: "A point mutation that creates or destroys a PAM or lands in the seed region, making it discriminable"
kinds:
  clonal-unique-target: claim
  fusion-breakpoint-target: definition
  viral-oncogene-target: definition
  pam-altering-snv: definition
source_type: agent-inference
asserted_at: "2026-07"
---

# Target Classes and the Honesty Tiers

The whole game is finding a [[clonal-unique-target]]: a sequence present in the tumour and **absent from healthy DNA**, so that a guide against it cannot harm normal cells. Ranked by how cleanly they satisfy that:

<!-- @anchor: clean-targets -->
## Clean — Sequences Absent from Healthy DNA

[[fusion-breakpoint-target]]: a fusion oncogene (BCR-ABL, EML4-ALK, EWS-FLI1) has a **junction** — the exact base sequence where two genes joined — that exists in no healthy cell. It is not a single-base difference; it is a novel sequence. This is the ideal case.

fusion-breakpoint-target supports:: [[clonal-unique-target]]

[[viral-oncogene-target]]: HPV E6/E7 in cervical cancer is **foreign DNA** — the cleanest case of all, since the entire sequence is absent from the human germline.

viral-oncogene-target supports:: [[clonal-unique-target]]

<!-- @anchor: hard-targets -->
## Hard — Point Mutations

[[pam-altering-snv]]: a single-nucleotide variant is targetable **only** when it creates or destroys a PAM or falls in the seed region — the discriminable minority. Generic SNVs are wall-blocked by [[single-base-discrimination]] and are flagged, not promised.

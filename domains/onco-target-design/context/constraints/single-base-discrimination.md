---
topic: Why single-nucleotide cancer mutations are usually not cleanly targetable by DNA-level cutting
keywords: [single base, SNV, mismatch tolerance, PAM, seed region, heterozygosity, wild-type allele, discrimination, off-target]
related: [../targets/target-classes.md, ../guide-design/specificity.md]
anchors:
  mismatch-tolerance: [Cas9, mismatch, seed region, PAM-distal, tolerance]
  heterozygosity: [heterozygous, wild-type allele, germline, ocean of dilution]
defines:
  single-base-discrimination: "The difficulty of distinguishing a one-nucleotide mutant allele from the wild-type sequence when targeting DNA"
  direct-dna-targeting: "Killing a cancer cell by cutting a mutation-specific DNA sequence with a programmable nuclease"
kinds:
  single-base-discrimination: claim
  direct-dna-targeting: method
source: "Conversation analysis, 2026-07 — the four physical walls"
source_type: agent-inference
asserted_at: "2026-07"
---

# Single-Base Discrimination — the First Wall

The appeal of [[direct-dna-targeting]] is that the tumour-normal diff hands you a mutation the healthy genome lacks. The trouble is that most of those differences are a **single nucleotide**, and a single nucleotide is exactly what DNA-cutting nucleases discriminate poorly.

<!-- @anchor: mismatch-tolerance -->
## Mismatch Tolerance

Cas9 tolerates mismatches in the PAM-distal region of its guide: a one-base difference far from the PAM often does not prevent cutting. Reliable discrimination requires the mutation to fall in the **seed region** (PAM-proximal) or to **create or destroy the PAM itself** — and that is a minority of point mutations. For a generic SNV, the guide that cuts the mutant also cuts the wild type.

<!-- @anchor: heterozygosity -->
## Heterozygosity and the Ocean of Wild Type

Even setting the enzyme aside, the cancer cell is usually **heterozygous** — it still carries a healthy copy of the allele — and the rest of the body holds billions of healthy cells with that same sequence. Distinguishing one mutant allele from this ocean of wild type is close to unsolvable for DNA targeting.

For these reasons this claim stands against the naive method: single-base-discrimination contradicts:: [[direct-dna-targeting]]

The consequence is not "give up" — it is **target selection**: choose mutations that are not single-base at all (see [[clonal-unique-target]]).

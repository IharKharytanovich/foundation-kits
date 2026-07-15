---
topic: Scoring allele specificity of a guide — discrimination margin, off-target scan, and guide folding
keywords: [allele specificity, off-target, mismatch, seed, discrimination margin, guide RNA folding, on-target, scoring]
related: [../constraints/single-base-discrimination.md, ../methods/index.md]
anchors:
  discrimination: [mutant, wild-type, seed mismatch, margin, specificity]
  off-target-scan: [off-target, near-match, genome context, enumeration]
  guide-fold: [guide RNA, secondary structure, self-fold, Cas loading]
defines:
  allele-specificity: "How reliably a guide cuts the mutant allele while sparing the wild-type sequence, quantified as a discrimination margin"
  off-target-scan: "Enumerating near-matches to a candidate guide across the provided sequence context and counting/scoring them"
kinds:
  allele-specificity: metric
  off-target-scan: method
source_type: agent-inference
asserted_at: "2026-07"
---

# Scoring a Guide

A guide earns three scores, and its usefulness is the minimum of them.

<!-- @anchor: discrimination -->
## Discrimination Margin

[[allele-specificity]] is the gap between how well the guide matches the mutant versus the wild-type sequence. It is dominated by **where** the distinguishing base sits — a mismatch in the seed region collapses wild-type cutting (good), a PAM-distal one does not (bad). This is the quantitative face of [[single-base-discrimination]].

allele-specificity measured-by:: [[off-target-scan]]

<!-- @anchor: off-target-scan -->
## Off-Target Scan

[[off-target-scan]]: enumerate near-matches to the candidate guide across the available sequence context, weighting mismatches by position, and count how many sites could be cut. Fewer, weaker off-targets is better. Implemented with sequence handling in `biopython`/`seqtk` and scoring in `numpy`/`scipy`.

<!-- @anchor: guide-fold -->
## Guide RNA Fold

A guide that folds into its own strong secondary structure will not load into Cas efficiently, no matter how well it matches. Fold the guide in `viennarna` (`RNAfold`) and penalise self-structure over the spacer.

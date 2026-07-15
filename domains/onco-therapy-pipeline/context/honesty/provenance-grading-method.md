---
topic: Graded provenance — the source-type weight taxonomy that sets edge-confidence priors across the pipeline
keywords: [provenance, grading, source weight, source type, confidence, prior, edge confidence, GRADE, trust, mislabeling, corporate-pr, regulatory]
related: [sources/keynote-942-press-vs-peer.md, sources/grade-evidence-hierarchy.md, ../map.md]
defines:
  provenance-grading: "The method of grading source reliability by origin type — regulatory and clinical-trial high-trust, paper peer-reviewed, preprint mid, corporate-pr and industry-report low-trust — to set numeric edge-confidence priors in the knowledge graph"
kinds:
  provenance-grading: method
epistemics: hybrid
source: "Guyatt et al., BMJ 2008 doi:10.1136/bmj.39489.470347.AD (GRADE); DCC foundation-onco@1.0 schema.yaml edge-confidence.source-priors"
source_type: paper
asserted_at: "2026-07"
---

# Provenance Grading

[[provenance-grading]] is the method that keeps a broad pipeline map honest: every quantitative claim carries a `source` and a `source_type`, and the `source_type` sets a numeric confidence prior that propagates through every edge in the graph. A claim from an FDA filing (`regulatory`, prior 0.92) and a claim from a press release (`corporate-pr`, prior 0.55) may state the same number — but the system trusts them differently, by construction.

## The Weight Taxonomy

The taxonomy is borrowed from the GRADE evidence-quality framework (Guyatt et al., BMJ 2008) and operationalized as numeric priors in the DCC `edge-confidence.source-priors` table:

| source_type | Prior | Rationale |
|-------------|-------|-----------|
| paper | 0.95 | Peer-reviewed; highest factual reliability after review |
| regulatory | 0.92 | FDA/EMA facts; legal standing, narrow framing |
| clinical-trial | 0.88 | Registered readout; protocol-bound |
| experiment | 0.85 | Primary data; lab-specific |
| preprint | 0.70 | Not peer-reviewed; ~30% never published, ~15-20% materially revised |
| agent-inference | 0.70 | AI-generated; useful but unvalidated |
| corporate-pr | 0.55 | Press release; framing optimized for investors, not scientists |
| industry-report | 0.50 | Market forecast; lowest factual weight |

The gap between `corporate-pr` (0.55) and `paper` (0.95) is the system's defense against the most common mislabeling in precision oncology: a phase-2b interim analysis number, reported in a press release without confidence intervals, indexed at the same weight as a peer-reviewed meta-analysis.

## The Mislabeling Failure Mode

The KEYNOTE-942 case (see [sources/keynote-942-press-vs-peer.md](sources/keynote-942-press-vs-peer.md)) illustrates the pattern: Moderna/Merck's press release reported a 44% RFS reduction (HR 0.561) without foregrounding the CI (0.309–1.017, crossing 1.0) or the small sample (n=157). A system that tagged this as `paper` instead of `corporate-pr` would have inflated the edge confidence by ~73% (0.95/0.55). The peer-reviewed Lancet publication confirmed the point estimate but forced the uncertainty into view — that is why the prior jumps from 0.55 to 0.95 on peer review.

## Why Provenance Grading Matters for Pipeline Reasoning

Provenance grading determines confidence in how reliably we can assess [[personalized-therapy-throughput]]: a throughput figure sourced from a corporate-pr press release carries a prior of 0.55, while the same figure from a peer-reviewed paper carries 0.95. Since the pipeline map exists to locate the binding constraint, and the binding constraint is identified by comparing quantitative claims across stages, mislabeled provenance can shift which stage appears binding — not because the evidence changed, but because the confidence was wrong.

discusses:: [[personalized-therapy-throughput]]

This is not a theoretical risk. Industry press releases routinely report manufacturing cycle times, delivery efficiencies, and response rates without the error bars and caveats that peer review requires. A provenance-unaware system would weight these equally — and the pipeline map would be optimistic in exactly the places where the evidence is weakest.

cites:: doi:10.1136/bmj.39489.470347.AD

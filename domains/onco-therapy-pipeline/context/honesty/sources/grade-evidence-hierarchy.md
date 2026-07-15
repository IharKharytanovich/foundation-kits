---
topic: GRADE evidence-quality framework mapped to the DCC source-type weight taxonomy for precision oncology
keywords: [GRADE, evidence, hierarchy, quality, certainty, source weight, regulatory, clinical trial, paper, preprint, press release, confidence]
related: [../provenance-grading-method.md]
epistemics: empirical
source: "Guyatt et al., BMJ 2008 336:924-926, doi:10.1136/bmj.39489.470347.AD; Schünemann et al., BMJ 2008 336:1106-1110"
source_type: paper
asserted_at: "2026-07"
---

# GRADE Evidence-Quality Framework

## The Framework

GRADE (Grading of Recommendations, Assessment, Development and Evaluation) is the dominant framework for rating certainty of evidence in clinical medicine. Developed by Guyatt, Schünemann, and collaborators (BMJ 2008), it classifies evidence into four levels:

- **High certainty**: further research is very unlikely to change confidence in the effect estimate. Typically: large RCTs, systematic reviews of RCTs with low risk of bias.
- **Moderate certainty**: further research is likely to have an important impact on confidence. Typically: RCTs with some limitations, strong observational studies.
- **Low certainty**: further research is very likely to have an important impact. Typically: observational studies, case series.
- **Very low certainty**: any estimate is very uncertain. Typically: case reports, expert opinion, mechanism-based reasoning.

Five factors can downgrade: risk of bias, inconsistency, indirectness, imprecision, and publication bias. Three factors can upgrade: large effect, dose-response, and confounders acting against the observed effect.

## Mapping to DCC Source-Type Priors

The DCC `foundation-onco@1.0` source-type taxonomy maps approximately to GRADE levels:

| DCC source_type | GRADE analogue | Prior |
|-----------------|---------------|-------|
| `regulatory` | High (FDA/EMA fact) | 0.92 |
| `clinical-trial` | High–Moderate (registered trial) | 0.88 |
| `paper` | Moderate (peer-reviewed) | 0.95 |
| `experiment` | Moderate (primary data) | 0.85 |
| `preprint` | Low–Moderate (no peer review) | 0.70 |
| `agent-inference` | Low (AI-generated) | 0.70 |
| `corporate-pr` | Very Low (press release) | 0.55 |
| `industry-report` | Very Low (market forecast) | 0.50 |

The mapping is imperfect — `paper` has a higher prior (0.95) than `regulatory` (0.92) because peer review corrects for the narrow framing of regulatory filings, while regulatory status reflects legal standing rather than scientific completeness. Both are high-trust but for different reasons.

## Why Source Hierarchy Matters in Precision Oncology

Precision oncology generates claims across a wide trust spectrum: FDA approvals, phase 3 publications, phase 1 interim analyses, preprints, press releases, and analyst forecasts. The same efficacy number (e.g., "44% reduction in recurrence risk") can carry vastly different confidence depending on its origin.

GRADE's contribution is making this gradient explicit and systematic rather than implicit and ad-hoc. The DCC operationalizes GRADE-like thinking as numeric priors in the edge-confidence formula, so a claim's provenance automatically modulates its weight in graph queries.

## Preprint Reliability in Oncology

Multiple analyses have shown that oncology preprints undergo meaningful revision before peer-reviewed publication. Key findings: ~30% of preprints in clinical oncology are never published in peer-reviewed journals; among those published, ~15-20% show material changes in reported effect sizes or conclusions; and retraction rates for preprints are higher than for peer-reviewed publications. These empirical revision rates are what justify the gap between `preprint` (0.70) and `paper` (0.95) priors.

## FDA ODAC Advisory Panel Pattern

When companies present clinical data to FDA's Oncologic Drugs Advisory Committee (ODAC), the FDA statistical review frequently differs from the company's presentation. Common patterns: different analysis populations (ITT vs per-protocol), different censoring rules, different handling of missing data, and different endpoint definitions. The FDA's independent analysis serves as an implicit source-type upgrade — from `corporate-pr` to near-`regulatory` — and the discrepancies between the two validate maintaining separate priors.

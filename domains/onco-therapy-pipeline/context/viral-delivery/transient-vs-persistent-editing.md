---
topic: Transient versus persistent editor delivery — why RNP/mRNA/VLP delivery lowers off-target editing relative to DNA-encoded AAV/lentivirus/plasmid
keywords: [transient delivery, persistent expression, off-target, RNP, mRNA, plasmid, AAV, lentivirus, GUIDE-seq, exposure time, editor clearance, computable]
related: [engineered-vlp-editor-delivery.md, retargeted-viral-vectors.md, sources/kim-2014-rnp-offtarget.md, sources/montagna-2018-vesicas.md]
defines:
  transient-editor-advantage: "The principle that off-target editing accumulates with the duration of nuclease exposure, so transient formats (RNP, mRNA, VLP; cleared in <24–72 h) produce far less off-target than DNA-encoded formats (plasmid, lentivirus, AAV; expressed for weeks to years) — a 2× to ~900× reduction depending on locus, guide, and assay"
kinds:
  transient-editor-advantage: claim
epistemics: hybrid
source: "Kim 2014 (RNP 9.5–13× more specific than plasmid); Montagna 2018 VEsiCas (GUIDE-seq 87→1 off-target sites, 17–22×); Liang 2015 (plasmid > mRNA > RNP monotonic); Banskota 2022 (12–900× lower off-target)"
source_type: paper
asserted_at: "2026-07"
---

# Transient vs Persistent Editing — the Off-Target Argument

[[transient-editor-advantage]] is the safety case for delivering gene editors as short-lived cargo rather than as DNA. The causal variable is **exposure time**: off-target editing accrues while the nuclease is present. An RNP or protein editor is cleared within ~24–72 hours; a plasmid, lentivirus, or AAV expresses the nuclease for weeks to permanently, giving it prolonged opportunity to cut off-target sites after the on-target site is already saturated. It is the principle that makes [[engineered-vlp-delivery]] worth the engineering.

## The Persistence Ladder Maps onto Off-Target Burden

The reduction is monotonic in exposure time (plasmid > mRNA > RNP/VLP):
- **RNP vs plasmid (Kim 2014):** on/off-target ratios 9.5–13× higher for RNP; RNP off-target undetectable where plasmid gave 1–6%. Cas9 barely detectable by 24 h (RNP) versus several days (plasmid).
- **RNP vs mRNA vs plasmid (Liang 2015):** at one locus 1.6× lower (mRNA) and 28× lower (RNP) than plasmid — confirming the ordering.
- **RNP-vesicle vs plasmid, genome-wide (Montagna 2018 VEsiCas):** GUIDE-seq detected 87 off-target sites for plasmid versus **a single** site for the vesicle-delivered RNP; 17–22× fewer indels; 37× better on/off ratio.
- **eVLP vs plasmid/AAV/lentivirus (Banskota 2022):** Cas-dependent off-target 12–900× lower than plasmid; in vivo liver no off-target above background where AAV8 dual-vector gave 0.1–0.3%; RNA off-target eliminated versus an ABE-lentivirus.

## Why This Is `hybrid`, Not Fully Computable

The *direction* (transient < persistent) is robust across every assay. The *magnitude* is empirical and highly locus-, guide-, and assay-dependent — spanning 2× to ~900× — so there is no single universal multiplier to compute. Genome-wide assays (GUIDE-seq, CIRCLE-seq) give stronger evidence than the T7E1 mismatch assay, whose floor is ~1%. The guide-design half of the problem (predicting which off-target sites exist for a given sequence) is the computable oracle delegated to onco-target-design; the delivery half (how long the nuclease persists) is what this concept governs.

supports:: [[engineered-vlp-delivery]]
refines:: [[in-vivo-genetic-editing]]

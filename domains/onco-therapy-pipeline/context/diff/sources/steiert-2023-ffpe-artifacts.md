---
topic: Steiert 2023 — FFPE-DNA deamination artifacts and the quantitative effectiveness of filters
keywords: [FFPE, deamination, C>T artifact, formalin, allele frequency, FilterMutectCalls, UMI consensus, DNA repair, false positive, artifact]
related: [../alignment-and-preprocessing.md]
epistemics: empirical
source: "Steiert TA, Parra G, Gut M, et al. A critical spotlight on the paradigms of FFPE-DNA sequencing. Nucleic Acids Res 2023;51(14):7143-7162. DOI:10.1093/nar/gkad519 (verified)"
source_type: paper
asserted_at: "2026-07"
---

# FFPE-DNA Artifacts and Filtering

The reference quantifying how formalin-fixation artifacts masquerade as low-VAF somatic calls and how much each mitigation recovers — the honest weak point of the preprocessing stage.

## Method

Compares FFPE vs fresh-frozen (FF) libraries across DNA-repair enzymes (IQBErepair, NEBrepair), UMI/consensus workflows (molecular consensus MolCon, duplex consensus DupCon), and computational filters; proposes the "ERROR-FFPE-DNA" reporting checklist.

## Results (load-bearing)

- **C>T/G>A deamination artifacts ~7-fold higher in FFPE vs FF** (single-source multiple; the phenomenon itself is broadly established). C>A/G>T oxidation artifacts equally prevalent in aged (13-year) samples.
- **Artifact allele frequencies (AAF) exceeded 10%** in low-coverage regions — FFPE artifacts routinely masquerade as bona fide low-VAF somatic calls.
- FP suppression: **GATK FilterMutectCalls alone removed ~98% of FP calls (~58-fold); +5% VAF filter → 250-fold; +10% VAF filter → 400-fold.** Multi-library: **~94% reduction with 2 libraries, ~98% with 3.**
- DNA repair: **IQBErepair yielded 53–80% more unique sequencing bases** and lowered median AAF; BER repair reduces measured DNA by 10–40% post-treatment.
- Practical penalties: FFPE insert sizes ~half of FF (~120 bp vs ~240 bp); **4× deeper sequencing recommended**; UMI-consensus workflows need **5,000–7,500× coverage**; post-filter read loss 72–99%.

Verbatim: residual *"artefacts reaching high AAFs"* persist even after consensus-based filtering.

## Limitations

Severely degraded FFPE gives non-uniform coverage even after optimization; residual artifacts can persist at relatively high AAFs after consensus filtering; computational models are restricted to their specific use case. The takeaway: FFPE input imposes a real precision penalty on the whole diff, only partly recoverable.

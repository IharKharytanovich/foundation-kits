# End-to-End Personalized Onco-Therapy Pipeline — Knowledge Base

Your starting point for reasoning about the whole personalized cancer-therapy process as one **evolving** map, across both design branches — immune (neoantigen vaccines, CAR-T/TCR-T/TIL, BiTE/ICI) and genetic (oncolytic virus, CRISPR/base/prime, ASO/siRNA). The discipline throughout: **separate what you can compute from what is wet-lab / clinical, and grade every number's provenance.** A broad map is only useful if each node says how much to trust it.

The pipeline shape and its binding constraint live in [map.md](map.md) — a living file that changes as the research develops. Trust it over any order implied by folder names. Today's binding wall is **delivery into the solid tumor**.

Navigate by the parallel sweep (`exploreConcept` + `hybridSearch` + the folder `index.md`), not by walking folders one at a time. Do not guess filenames.

## Contents

- [map.md](map.md) — The living pipeline map: stages, flow, and where whole-loop throughput is actually decided.
- [sampling/index.md](sampling/index.md) — Biopsy / liquid biopsy, nucleic-acid extraction, tumor-normal pairing.
- [diff/index.md](diff/index.md) — Sequencing → somatic calling → clonality → neoantigen + HLA.
- [design/index.md](design/index.md) — The two design branches: immune and genetic (the genetic guide oracle lives in the paired onco-target-design domain; the construct oracle in mrna-design).
- [manufacturing/index.md](manufacturing/index.md) — mRNA/LNP vs viral vector vs cell product; titre, yield, QC/release — the CMC wall.
- [delivery/index.md](delivery/index.md) — LNP/AAV/virion/cell delivery, biodistribution, the solid-tumor delivery wall — the binding constraint.
- [efficacy/index.md](efficacy/index.md) — Metrics of delivery and of action, resistance and tumor evolution, the feedback loop.
- [walls/index.md](walls/index.md) — The blockers as first-class knowledge: each wall, what it gates, and how wins bypass rather than break it.
- [landscape/index.md](landscape/index.md) — The global map of ~17 modalities: maturity and personalization type.
- [speed/index.md](speed/index.md) — Timeline reality versus the optimistic target; which stages are compressible.
- [honesty/index.md](honesty/index.md) — The provenance discipline: computable vs empirical vs aspirational.
- [practice/index.md](practice/index.md) — Worked end-to-end cases, the kit-to-task map, and the interactive-scale boundary.

<!-- BEGIN GENERATED — DO NOT EDIT below this line -->

> ⚠️ **AUTO-GENERATED** — DO NOT EDIT. Changes will be overwritten on next write.

## Sections

- [delivery/](delivery/index.md): How the payload physically reaches the target cell in vivo: LNP vs AAV vs virion vs cell carriers, biodistribution, and penetration of the tumor microenvironment. This is the pipeline's binding constraint — median 0.7% of dose reaches a solid tumor, 1–2% escapes the endosome. The 2024–26 wins bypass the wall (aim at the liver, inject locally, hit blood cells) rather than break it. (3 files)
- [design/](design/index.md): Turning the diff into a therapeutic. The two branches have different evaluability and different economics of manufacture. Immune ([immune/index.md](immune/index.md)) is the fastest personalized loop today; genetic ([genetic/index.md](genetic/index.md)) works for point drivers and mostly ex vivo. The genetic guide oracle is delegated to the onco-target-design domain; the mRNA construct oracle to mrna-design. (0 files)
- [diff/](diff/index.md): The tumor-normal difference: alignment → somatic variant calling (SNV/indel/CNV) → clonality → TMB/MSI → HLA typing → neoantigen prediction. Computable: alignment, calling, TMB/MSI, HLA, MHC-binding. Empirical / not computable de novo: neoantigen immunogenicity (see [walls/index.md](../walls/index.md)); unstable: SV calling, subclone inference. Feeds [design/index.md](../design/index.md). (0 files)
- [efficacy/](efficacy/index.md): Two kinds of metric plus the loop back to diff. Delivery metrics (editing %, %CAR+, expression) and action metrics (RECIST, MRD/ctDNA) are countable — computable. But the link metric → clinical outcome (surrogacy) is empirical and unsettled (ctDNA not an accepted OS/DFS surrogate; in-vivo editing measurement "aspirational"). Resistance/evolution closes the cycle: antigen-negative subclones drive relapse and feed a new diff (see [map.md](../map.md)). (0 files)
- [honesty/](honesty/index.md): The guardrail that keeps a broad map useful: every claim is tagged computable, empirical, or aspirational. Computable claims are shown with their compute; empirical figures carry a `source`; aspirational targets (like the 30-minute loop) are named as such and checked against reality. (0 files)
- [landscape/](landscape/index.md): The ~17 therapy modalities the field actually runs on, beyond the "diff → aim a virus at DNA" frame: approved backbone (targeted small molecules, ICI, ADC, BiTE, radioligands, synthetic lethality, tumor-agnostic), bespoke N-of-1 breakthroughs of 2024 (Amtagvi/TIL, Tecelra/TCR-T, Imdelltra/BiTE, mRNA-4157, autogene cevumeran), and the frontier (PROTAC, genome editing, RNA therapeutics, oncolytic virotherapy, microbiome, AI design). Each carries a maturity (approved / clinical / preclinical) and a personalization type (bespoke / matched / off-the-shelf). Concepts live in [modalities.md](modalities.md). (1 files)
- [manufacturing/](manufacturing/index.md): Production of the therapeutic: mRNA/LNP (cell-free, the only truly N-of-1-scalable platform) vs viral vector vs cell product, then titre, yield, purification, QC/release. These are empirical, engineering-bound stages — the domain models throughput and kinetics but takes real yields from experiment, with provenance. This is a hard CMC wall (74% of FDA CRLs are quality/CMC), but **not the pipeline's binding constraint** — that is delivery (see [../delivery/index.md](../delivery/index.md)). (2 files)
- [practice/](practice/index.md): How the agent works day to day: graph sweep first, separate computable from empirical, end by naming the binding constraint. The kit-to-task map (scipy/numpy/pandas for throughput and kinetics models, biopython/viennarna for sequence stages, networkx for the pipeline DAG), and the interactive-scale boundary — no manufacturing, no clinical advice. (0 files)
- [sampling/](sampling/index.md): Getting the biomaterial: tissue biopsy vs liquid biopsy (ctDNA/CTC), nucleic-acid extraction, and tumor-normal pairing. Computable here: FFPE-artifact filtering, purity estimate, required depth/LOD, somatic-vs-germline logic. Empirical: lesion accessibility, real yield/degradation, ctDNA fraction, CHIP status. Feeds [diff/index.md](../diff/index.md). (0 files)
- [speed/](speed/index.md): The timeline reality of the whole loop versus the optimistic "30 min / 2 h / 1 h" target. Where time actually goes, which stages are genuinely compressible, and which are hard floors set by biology and QC. (2 files)
- [walls/](walls/index.md): The nine walls that gate the pipeline, ranked by how bindable each is. A wall is not a footnote of one stage — most gate several stages at once (delivery gates design, manufacture, delivery, and efficacy). Each wall says what it blocks and how wins bypass rather than break it. The binding wall — solid-tumor delivery — is defined in [delivery/delivery-wall.md](../delivery/delivery-wall.md). (2 files)

## Files

- [map.md](map.md) — The living map of the personalized onco-therapy pipeline — stages, flow, branches, and the binding constraint

<!-- END GENERATED -->

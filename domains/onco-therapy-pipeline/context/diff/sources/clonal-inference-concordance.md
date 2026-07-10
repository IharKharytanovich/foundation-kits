---
topic: Tumor clonal architecture reconstruction — algorithm concordance and the PCAWG subclonality challenge
keywords: [clonality, subclone, PyClone, CITUP, PhyloWGS, DPClust, concordance, PCAWG, VAF, CCF, tumor evolution, algorithm dependence]
related: [../clonal-architecture-inference.md]
epistemics: empirical
source: "PCAWG Evolution & Heterogeneity 2020 Cell 182(1):226-239 doi:10.1016/j.cell.2020.04.045; Dentro 2021 Cell Syst doi:10.1016/j.cels.2020.12.004; Gillis 2021 Nat Methods doi:10.1038/s41592-020-01013-2"
source_type: paper
asserted_at: "2026-07"
---

# Clonal Architecture Inference — The Concordance Problem

## PCAWG Subclonal Reconstruction Challenge (2020-2021)

The PCAWG consortium ran a formal benchmarking challenge for subclonal reconstruction methods on 2,658 tumor whole genomes.

**Key results (Dentro et al. 2021):**
- 13 methods compared on synthetic and real tumors.
- Number of subclones called: range 1-12 across methods for the same sample; median disagreement 2-3 subclones.
- Cluster assignment concordance: 65-81% pairwise (i.e., 19-35% of mutations assigned to different subclones by different methods).
- CCF estimation: median absolute deviation 0.05-0.15 across methods.

**Best performers:**
- DPClust: best on simple (2-3 clone) tumors, robust to noise.
- PyClone-VI: fastest (minutes vs hours), good concordance with full PyClone on high-purity samples.
- PhyloWGS: uniquely models tree structure, but sensitive to input SNV set quality.
- CITUP: strong theoretical basis (integer linear programming) but computational cost prohibitive for WGS (>10,000 SNVs).

## Sources of Disagreement

1. **Tumor purity estimation**: Systematic bias of ±5-10% in purity cascades into CCF errors. Methods using allele-specific CN (ASCAT, FACETS) more robust than coverage-only (Sequenza).
2. **Copy number integration**: Methods differ on whether/how to correct VAF → CCF for local CN. Some (DPClust) take CN as fixed input; others (PhyloWGS) co-infer CN and clonality.
3. **Number-of-clones prior**: Dirichlet process methods (PyClone, DPClust) let data decide; parametric methods require user specification. Non-parametric methods tend to over-split noise at low depth.
4. **Minimum CCF resolution**: At 60x depth, subclones below ~10% CCF (i.e., VAF ~5% in diploid) indistinguishable from noise. 200x+ required for resolution below 5% CCF.

## Multi-Region and Longitudinal (2022-2025)

- TRACERx (Jamal-Hanjani 2017, Swanton lab): multi-region sequencing of NSCLC resolves spatial heterogeneity missed by single-biopsy.
- REVOLVER, RECAP: phylogenetic methods designed for multi-sample input; concordance improves to 80-90% with 3+ regions.
- ctDNA longitudinal monitoring (ArcherDX/Invitae, Guardant): tracks clonal shifts at ~0.1% VAF with UMI-based panels but cannot resolve spatial structure.

## Clinical Impact

- Clonal neoantigens (present in all tumor cells) are better vaccine targets than subclonal ones (escape via selection against the expressing subclone).
- Clonal driver identification: only mutations clonal across all regions are reliable therapy targets.
- Algorithm choice matters for patient-level decisions: 19-35% discordance directly impacts which neoantigens are called "clonal" and prioritized for vaccine design.

## Minimum Requirements for Reliable Subclone Calling

- Tumor purity >30% (below this, all methods degrade severely).
- Sequencing depth: ≥100x for 2-3 subclone resolution; ≥300x for subclones at 5-10% CCF.
- ≥50 somatic SNVs per cluster to distinguish signal from noise (rules out TMB-low tumors <5 mut/Mb from subclonal analysis).
- Multi-region sequencing (≥3 samples) dramatically improves tree inference accuracy.

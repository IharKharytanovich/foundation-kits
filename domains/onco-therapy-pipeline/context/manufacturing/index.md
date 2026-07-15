# Manufacturing — The CMC Wall

Production of the therapeutic: mRNA/LNP (cell-free, the only truly N-of-1-scalable platform) vs viral vector vs cell product, then titre, yield, purification, QC/release. These are empirical, engineering-bound stages — the domain models throughput and kinetics but takes real yields from experiment, with provenance. This is a hard CMC wall (74% of FDA CRLs are quality/CMC), but **not the pipeline's binding constraint** — that is delivery (see [../delivery/index.md](../delivery/index.md)).

**Concepts:** `manufacturing-throughput`, `vector-yield`, `growth-kinetics-model` (seed); `cmc-wall`, `platform-scalability`, `manufacturing-sensitivity-analysis`, `qc-release-bottleneck` (Phase 02). **Sources:** 6 raw references in `sources/` (Levine 2017, FDA CMC 2020/2024, Sahin/Rojas 2023, CRL deficiency analysis, Lopes 2024, Hong 2018). **Reports:** platform comparison, CMC wall, QC/release bottleneck, sensitivity model (computable layer via SALib/lmfit).

<!-- BEGIN GENERATED — DO NOT EDIT below this line -->

> ⚠️ **AUTO-GENERATED** — DO NOT EDIT. Changes will be overwritten on next write.

### Subfolders

- [sources/](sources/index.md): Primary literature, regulatory documents, and research dumps backing the manufacturing cluster's distilled reports. Each file is a leaf node (no `defines`) tagged with its true source weight. (6 files)

### Files

- [bioreactor.md](bioreactor.md) — Manufacturing throughput — the rate ceiling of therapeutic production, modeled but empirically bounded
- [cmc-wall.md](cmc-wall.md) — The CMC wall — manufacturing quality deficiencies as the dominant regulatory barrier for cell and gene therapies
- [models.md](models.md) — Manufacturing model concepts — vector yield and the growth-kinetics model
- [platform-comparison.md](platform-comparison.md) — Manufacturing platform scalability — mRNA/LNP vs viral vector vs cell product for N-of-1 personalized therapy
- [qc-release.md](qc-release.md) — QC/release testing as a per-patient rate limiter in personalized therapy manufacturing
- [sensitivity-model.md](sensitivity-model.md) — Manufacturing throughput sensitivity analysis — identifying which kinetic parameters bind production via Sobol GSA

<!-- END GENERATED -->

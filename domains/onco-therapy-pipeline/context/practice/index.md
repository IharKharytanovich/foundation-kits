# Practice

How the agent works day to day: graph sweep first, separate computable from empirical, end by naming the binding constraint. Three worked end-to-end cases (mRNA-4157 melanoma, autogene cevumeran PDAC, NTLA-2001 liver editing) trace real 2024-2026 therapy arcs through the pipeline and show where the binding constraint appears in each modality. The kit-to-task map assigns all 11 compute kits to pipeline stages (biopython/viennarna for sequence, scipy/numpy/pandas/lmfit for throughput and kinetics, salib for global sensitivity, rdkit for ionizable-lipid chemistry, networkx for the pipeline DAG, uncertainties/pint for dimensional error propagation), within the interactive-scale boundary — no HPC, no manufacturing, no clinical advice.

<!-- BEGIN GENERATED — DO NOT EDIT below this line -->

> ⚠️ **AUTO-GENERATED** — DO NOT EDIT. Changes will be overwritten on next write.

### Subfolders

- [sources/](sources/index.md): Raw source material for the practice cluster: worked end-to-end personalized therapy cases, clinical trial readouts, and the in-vivo editing landmark that demonstrates the delivery-wall bypass. (3 files)

### Files

- [end-to-end-case-method.md](end-to-end-case-method.md) — Worked end-to-end cases — tracing real 2024-2026 personalized therapy arcs through the pipeline to identify where the binding constraint appears
- [kit-to-task-map.md](kit-to-task-map.md) — Kit-to-task map — mapping the domain's 11 compute kits to computable pipeline stages and the interactive-scale boundary

<!-- END GENERATED -->

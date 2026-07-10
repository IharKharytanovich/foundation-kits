---
topic: Kit-to-task map — mapping the domain's 11 compute kits to computable pipeline stages and the interactive-scale boundary
keywords: [kit, task, compute, scipy, numpy, biopython, rdkit, salib, networkx, viennarna, lmfit, uncertainties, pint, computable, interactive scale]
related: [../map.md, end-to-end-case-method.md, sources/mrna4157-keynote942.md]
defines:
  kit-to-task-map: "The mapping from the domain's 11 compute kits to specific computable pipeline tasks — biopython and viennarna for sequence stages (diff, design), scipy/numpy/pandas/lmfit for throughput and kinetics models, salib for global sensitivity analysis, rdkit for ionizable-lipid chemistry, networkx for the pipeline DAG, uncertainties/pint for dimensional error propagation — within the interactive-scale boundary (no HPC, no wet-lab, no clinical advice)"
kinds:
  kit-to-task-map: method
epistemics: computable
source: "domain.json kit list (biopython 1.85, viennarna 2.7.2, numpy 2.2.5, scipy 1.14.1, pandas 2.3.3, networkx 3.4.2, rdkit 2025.3.4, salib 1.5.2, uncertainties 3.2.2, pint 0.25.3, lmfit 1.3.4)"
source_type: agent-inference
asserted_at: "2026-07"
---

# Kit-to-Task Map

The [[kit-to-task-map]] assigns each of the domain's 11 compute kits to the pipeline stages where it serves. The map is bounded by the [[computable-empirical-split]]: kits operate on the computable layer only, and the agent refuses to compute empirical quantities (immunogenicity, biodistribution, clinical response) even when a kit could technically produce a number.

supports:: [[computable-empirical-split]]

## Sequence Stages (Diff + Design)

**biopython 1.85** — sequence I/O, translation, codon tables, FASTA/GenBank parsing, pairwise alignment. Used in the diff stage for reading variant-called sequences, checking reading frames, and in the design stage for construct verification (open reading frame integrity, codon optimization checks, restriction-site scanning).

**viennarna 2.7.2** — RNA secondary structure prediction (MFE, partition function, base-pair probabilities). Used in the design stage for mRNA construct evaluation: 5'UTR/3'UTR folding stability, self-complementarity checks, and accessibility of the start codon region. Relevant to both neoantigen mRNA vaccines (mRNA-4157, BNT122 constructs) and gene-editing guide RNA structure.

These two kits feed the [[neoantigen-prediction-pipeline]] at the sequence level — the computable part. The immunogenicity prediction step that follows is empirical and outside kit scope.

## Throughput and Kinetics Models

**scipy 1.14.1** — ODE solvers (`solve_ivp`), optimization (`minimize`), interpolation. Used for growth-kinetics models (cell growth curves, bioreactor dynamics), throughput ODEs (stage-time models summed along the pipeline), and parameter fitting.

**numpy 2.2.5** — array operations, linear algebra, random sampling. Substrate for all numeric computation; used directly for matrix operations in sensitivity analysis input/output and for vectorized stage-time calculations.

**pandas 2.3.3** — tabular data manipulation. Used for organizing multi-parameter throughput sweeps, trial-data summaries, and stage-time comparison tables.

**lmfit 1.3.4** — nonlinear least-squares fitting with parameter bounds and uncertainty estimation. Used for fitting growth-kinetics models (Monod, logistic, substrate-limited) to experimental titre/yield data. Produces parameter confidence intervals that feed into the uncertainty layer.

These four kits serve the [[stage-time-model]] and the [[manufacturing-throughput]] model — both computable. The empirical inputs (measured titre, yield, growth rates) are pinned with their sources; the model layer is computed.

## Global Sensitivity Analysis

**salib 1.5.2** — Sobol, Morris, FAST methods for global sensitivity analysis. Used to answer the question "which parameter actually binds throughput?" — e.g., is the end-to-end timeline more sensitive to neoantigen-prediction turnaround, mRNA synthesis time, or QC/release duration? The answer identifies the [[personalized-therapy-throughput]] bottleneck computationally, complementing the empirical case-method evidence.

## Ionizable-Lipid Chemistry

**rdkit 2025.3.4** — cheminformatics: molecular descriptors (logP, TPSA, HBD/HBA), substructure search, fingerprints, 3D conformer generation. Used for the computable layer of LNP formulation: ionizable-lipid pKa estimation (Henderson-Hasselbalch + descriptor regression), HLB calculation, and structural comparison of lipid libraries. The in-vivo behavior (endosomal escape efficiency, biodistribution, ApoE adsorption kinetics) is empirical and outside kit scope — the agent presents measured values with graded sources for those.

Feeds the computable layer of [[ionizable-lipid-chemistry]].

## Pipeline Graph

**networkx 3.4.2** — graph construction, traversal, DAG operations, shortest-path, topological sort. Used for representing the pipeline as a directed graph (stages as nodes, dependencies as edges), computing critical paths, and identifying which stage removals/compressions would change the binding constraint. The pipeline DAG is the structural backbone of the map.

## Dimensional Error Propagation

**uncertainties 3.2.2** — automatic error propagation through arithmetic expressions. Used when combining empirical measurements (titre ± SD, yield ± SD, purity ± SD) through a computed model: the output carries propagated uncertainty without manual partial-derivative bookkeeping.

**pint 0.25.3** — physical units and dimensional analysis. Used to ensure dimensional integrity in throughput models (doses/week, g/L, vg/mL, cells/mL) and to catch unit-mismatch errors at computation time rather than at interpretation time.

These two kits together ensure that when the agent models a quantity that mixes computable structure with empirical inputs, the empirical error bars propagate honestly and the units are correct.

## The Interactive-Scale Boundary

The kit map operates within the agent's interactive-scale boundary: process reasoning, small throughput/kinetics/sensitivity models, sequence-level checks, and provenance bookkeeping. The agent does not run HPC screens (molecular dynamics, large-scale docking, genome-wide off-target search), wet-lab protocols, manufacturing operations, or provide clinical/dosing advice. When a stage is empirical, the agent presents measured values with graded sources — it never fabricates a computed number to fill the gap.

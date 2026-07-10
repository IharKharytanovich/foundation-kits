---
topic: Manufacturing throughput sensitivity analysis — identifying which kinetic parameters bind production via Sobol GSA
keywords: [sensitivity analysis, Sobol, SALib, growth kinetics, mu_max, throughput, ODE, lmfit, uncertainties, pint, bioreactor, parameter, binding]
related: [bioreactor.md, models.md, sources/hong-2024-bioprocess-modeling.md]
defines:
  manufacturing-sensitivity-analysis: "Global sensitivity analysis (Sobol/SALib) over the growth-kinetics ODE model that identifies which empirical parameters (mu_max, alpha, X_max, harvest timing) bind manufacturing throughput — the computable layer that tells you where to measure, not what you will find"
kinds:
  manufacturing-sensitivity-analysis: method
epistemics: computable
source: "Hong et al. 2018 Comput Chem Eng (bioprocess control framework); SALib documentation; lmfit/uncertainties/pint Python packages; growth kinetics ODE standard form"
source_type: paper
asserted_at: "2026-07"
---

# Manufacturing Throughput Sensitivity Analysis

[[manufacturing-sensitivity-analysis]] is the computable layer of the manufacturing cluster — it answers "which parameter binds throughput?" without requiring the absolute throughput value (which is empirical). The analysis uses global sensitivity analysis over an ODE model of producer cell growth and product formation.

## The Model

The ODE system couples logistic cell growth with Luedeking-Piret product formation:

```
dX/dt = mu_max * X * (1 - X/X_max)           # cell growth (logistic)
dP/dt = alpha * dX/dt + beta * X              # product formation (L-P)
dS/dt = -(1/Y_xs) * dX/dt - m_s * X          # substrate consumption
```

Six parameters: `mu_max` (max growth rate), `X_max` (carrying capacity), `alpha` (growth-associated productivity), `beta` (non-growth-associated productivity), `Y_xs` (cell/substrate yield), `m_s` (maintenance coefficient). Throughput output: total product P at harvest time t_h, which the model evaluates for a grid of harvest times to find the optimal t_h.

## Parameter Estimation

Fit the ODE to time-course data (cell density, glucose, titre at 4–8 h intervals) via `lmfit` — returns parameter estimates with confidence intervals. Dimensional integrity enforced by `pint` (e.g., mu_max in h^-1, X_max in cells/mL, titre in vg/mL or TU/mL). Error propagation via `uncertainties` on fitted parameters propagates measurement uncertainty into throughput predictions (typical CV: 15–30%).

## Global Sensitivity (SALib)

Sobol variance decomposition with Saltelli sampling (N=2048, 6 parameters → ~16,000 model evaluations):

- **mu_max (S1 ≈ 0.30–0.40):** the single most influential parameter — faster growth → more biomass → more product. This is the parameter to measure most carefully and optimize first.
- **alpha (S1 ≈ 0.15–0.30):** growth-associated specific productivity — how efficiently growing cells make product. Second priority.
- **X_max (S1 ≈ 0.10–0.20):** carrying capacity sets the ceiling on biomass; relevant for perfusion systems that push density higher.
- **Harvest timing (S1 ≈ 0.05–0.15):** when to harvest relative to growth-phase peak vs. stationary accumulation. Cheap to optimize (schedule, not biology).

Second-order interactions (S2) between mu_max and alpha are typically 0.05–0.10 — the two top parameters interact modestly, meaning they can be optimized somewhat independently.

## What This Computes and What It Does Not

The model computes the **relative influence** of parameters on throughput — it identifies binding parameters. It does **not** compute absolute titre or yield — those are [[vector-yield]] values from empirical measurement. The model beneath the measurement:

measured-by:: [[growth-kinetics-model]]

The sensitivity analysis is the domain's first real compute example: it uses `salib` for Sobol indices, `lmfit` for parameter estimation, `uncertainties` for error propagation, and `pint` for dimensional integrity. The absolute titres modelled by the kinetics are hybrid — the model layer is computable, the empirical inputs are measured. This is why the epistemics tag is `computable` (the analysis itself) while the underlying throughput metric ([[manufacturing-throughput]]) is `hybrid`.

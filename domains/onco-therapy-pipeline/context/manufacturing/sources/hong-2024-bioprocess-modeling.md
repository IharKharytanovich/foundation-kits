---
topic: Bioprocess modeling and global sensitivity analysis for viral vector and mRNA manufacturing optimization
keywords: [bioprocess, modeling, sensitivity analysis, Sobol, ODE, growth kinetics, Monod, titre, bioreactor, viral vector, AAV, lentivirus, SALib, optimization]
related: [../bioreactor.md, ../models.md]
epistemics: hybrid
source: "Hong MS, Severson KA, Jiang M, et al. Challenges and opportunities in biopharmaceutical manufacturing control. Comput Chem Eng. 2018;110:106-114. DOI:10.1016/j.compchemeng.2017.12.007; supplemented with 2024-2025 process modeling literature for viral vector/mRNA systems"
source_type: paper
asserted_at: "2026-07"
---

# Bioprocess Modeling and Sensitivity Analysis for Therapeutic Manufacturing

Mathematical modeling of bioreactor processes and global sensitivity analysis (GSA) provide the computable layer for understanding which parameters bind manufacturing throughput.

## Growth Kinetics Models

**Monod kinetics.** The standard model for substrate-limited microbial/cell growth: mu = mu_max * S / (K_s + S), where mu is specific growth rate, S is limiting substrate concentration, mu_max is maximum specific growth rate, and K_s is the half-saturation constant. Applied to HEK293 and insect cell (Sf9/Sf21) cultures used in AAV and baculovirus-based production.

**Logistic growth.** For producer cells where cell density rather than substrate limitation is the primary constraint: dX/dt = mu_max * X * (1 - X/X_max). Used when the growth ceiling is set by contact inhibition or metabolic waste accumulation rather than nutrient depletion.

**Luedeking-Piret product formation.** Product (virus/mRNA) formation rate as a linear combination of growth-associated and non-growth-associated terms: dP/dt = alpha * dX/dt + beta * X. For AAV production in HEK293, the growth-associated term (alpha) typically dominates during the growth phase, while the non-growth-associated term (beta) captures constitutive production during stationary phase.

## Parameter Estimation

Growth kinetics parameters (mu_max, K_s, X_max, alpha, beta) are estimated by fitting ODE solutions to time-course data using nonlinear least-squares fitting (e.g., `scipy.optimize.curve_fit` or `lmfit` for parameter estimation with confidence intervals). Typical datasets include cell density, viability, substrate (glucose/glutamine), metabolite (lactate/ammonia), and product titre measured at 4–8 hour intervals over the culture duration.

## Global Sensitivity Analysis

**Sobol indices** decompose the output variance of a model into contributions from each input parameter and their interactions. First-order indices (S1) quantify the direct contribution of each parameter; total-order indices (ST) include interactions. For viral vector bioreactor throughput:

- **mu_max (maximum growth rate):** typically the highest S1 (0.25–0.40), indicating that cell growth rate is the most influential parameter on final titre
- **alpha (growth-associated product formation rate):** S1 = 0.15–0.30, the second most influential — how efficiently growing cells produce virus
- **X_max (carrying capacity):** S1 = 0.10–0.20, sets the maximum cell density achievable
- **Harvest timing:** S1 = 0.05–0.15, when to harvest relative to the growth curve peak

These analyses use `SALib` (Python) with Saltelli sampling (N=1024–4096 samples, typically 6–8 parameters → 8000–40000 model evaluations).

## Titre Benchmarks (2024-2025)

- **AAV (HEK293 transient transfection):** ~10^10–10^11 vg/mL crude harvest; ~10^13–10^14 vg/L after downstream processing and concentration
- **AAV (stable producer cell line):** 5×10^10–5×10^11 vg/mL, but producer line establishment takes 6–12 months
- **Lentiviral vector (HEK293T transient):** ~10^7–10^8 TU/mL crude; concentrated to ~10^8–10^9 TU/mL
- **Lentiviral vector (suspension, perfusion):** up to ~8×10^10 TU/L in optimized perfusion systems

## Error Propagation

Parameter uncertainty propagates to throughput predictions via `uncertainties` (Python) for analytical Gaussian propagation or Monte Carlo sampling. Typical coefficient of variation on throughput predictions: 15–30% given typical measurement uncertainty on growth/titre data.

## Impact

The computable layer (growth kinetics + sensitivity analysis) identifies which empirical parameters bind throughput — enabling targeted experimental optimization rather than brute-force screening. However, the absolute titre values remain empirical measurements, not model outputs. The model tells you where to look; the measurement tells you what you find.

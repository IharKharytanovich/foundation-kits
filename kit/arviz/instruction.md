# arviz

arviz is a Python library for exploratory analysis of Bayesian models. It
provides backend-agnostic diagnostics (R-hat, effective sample size, HDI),
posterior summaries, and the InferenceData container for organising MCMC draws.
arviz works with output from any sampler (emcee, dynesty, PyMC, Stan) via its
`from_dict` / `from_*` converters. The Python import name is `arviz`. It
requires NumPy, SciPy, pandas, and packaging at runtime.

## Limitations in this kit

matplotlib, bokeh, and plotly plotting backends are unavailable in this Pyodide
environment (native/heavy). All plotting functions (`az.plot_trace`,
`az.plot_posterior`, `az.plot_pair`, etc.) will fail. Extract diagnostics and
summary statistics programmatically with `az.summary`, `az.rhat`, `az.ess`,
`az.hdi` and format output as text or DataFrames instead.

## When to Use

- Diagnosing MCMC convergence: R-hat, effective sample size (ESS), Monte Carlo
  standard error (MCSE) for draws from **emcee** or **dynesty**
- Computing highest-density intervals (HDI) and posterior summaries
- Creating `InferenceData` objects from raw numpy arrays or sampler results
- Comparing models via WAIC, LOO-CV (using `az.waic`, `az.loo`)
- Posterior predictive checks (numerical, not visual in this environment)

## When NOT to Use

- MCMC sampling itself (use **emcee** for ensemble MCMC or **dynesty** for
  nested sampling — arviz analyses their output, it does not sample)
- Frequentist hypothesis testing or regression (use **statsmodels**)
- Machine-learning classification/regression (use **scikit-learn**)
- Uncertainty propagation on measured quantities (use **uncertainties**)
- Symbolic algebra (use **sympy**)

## Capabilities

| Area | Key API |
|---|---|
| Data container | `az.InferenceData`, `az.from_dict(posterior={...})`, `az.from_emcee(sampler)` |
| Convergence | `az.rhat(idata)`, `az.ess(idata)`, `az.mcse(idata)` |
| Summary | `az.summary(idata)` — DataFrame with mean, sd, hdi, rhat, ess |
| Intervals | `az.hdi(idata, hdi_prob=0.94)` |
| Model comparison | `az.waic(idata)`, `az.loo(idata)` |
| Data conversion | `az.from_dict`, `az.from_emcee`, `az.from_pymc`, `az.from_cmdstan` |

## Worked Example

Create an InferenceData object from a fixed array and compute the posterior mean:

```python
import numpy as np, arviz as az

d = az.from_dict(posterior={'x': np.array([[1., 2., 3., 4., 5.]])})
str(float(d.posterior['x'].mean()))
# -> "3.0"
```

A typical workflow: run a sampler (e.g. emcee), convert the output to
InferenceData, then call `az.summary(idata)` for a convergence summary
including R-hat and ESS for each parameter.

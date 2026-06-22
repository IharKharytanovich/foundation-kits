# pyhf

pyhf is a pure-Python implementation of the HistFactory statistical model for
binned profile-likelihood fits. It provides hypothesis testing (CLs
limit-setting) and parameter estimation for particle physics and counting
experiments. This kit uses the default NumPy backend only.

## When to Use

- Binned profile-likelihood fits (HistFactory models)
- CLs upper-limit setting on signal strength
- Signal/background hypothesis testing (p-values)
- Uncorrelated and correlated systematic uncertainties in counting experiments
- Model building with signal, background, and modifier channels

## When NOT to Use

- Unbinned maximum-likelihood fits (use iminuit or scipy.optimize)
- Generic MCMC sampling / Bayesian posteriors (use emcee or dynesty)
- Bare function minimization without a HistFactory model (use iminuit)
- Non-physics curve fitting (use lmfit or scipy.optimize.curve_fit)
- GPU/JAX/TensorFlow backends (only the numpy backend is available)

## Capabilities

| Area | Key API |
|---|---|
| Simple models | `pyhf.simplemodels.uncorrelated_background`, `correlated_background` |
| Hypothesis testing | `pyhf.infer.hypotest` (CLs observed + expected) |
| Upper limits | `pyhf.infer.intervals.upper_limits.upper_limit` |
| Workspaces | `pyhf.Workspace` — load/combine JSON HistFactory workspaces |
| Model building | `pyhf.Model` — full HistFactory model with modifiers |
| Fit | `pyhf.infer.mle.fit`, `pyhf.infer.mle.fixed_poi_fit` |

## Worked Example

Build a single-bin counting model with signal = 10, background = 50 ± 7, observe
60 events, and compute the CLs for signal strength μ = 1:

```python
import pyhf
model = pyhf.simplemodels.uncorrelated_background(signal=[10.0], bkg=[50.0], bkg_uncertainty=[7.0])
data = [60.0] + model.config.auxdata
CLs_obs, CLs_exp = pyhf.infer.hypotest(1.0, data, model, return_expected=True)
str(round(float(CLs_obs), 6))
# → "0.602043"
```

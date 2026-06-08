# dynesty

dynesty is a Python package for dynamic nested sampling, a method for computing
Bayesian posteriors and evidences. It adaptively allocates live points to
improve posterior or evidence accuracy, making it effective for multi-modal and
high-dimensional distributions. The Python import name is `dynesty`. It
requires NumPy and SciPy at runtime. Because nested sampling is inherently
stochastic, results vary between runs — always set a random seed for
reproducibility.

## Limitations in this kit

matplotlib is an unconditional upstream dependency but cannot be provided in
this Pyodide environment (native/heavy). Plotting functions
(`dynesty.plotting.runplot`, `traceplot`, `cornerplot`) are unavailable.
Extract chain data from the results object and format output programmatically
instead.

## When to Use

- Computing Bayesian evidence (marginal likelihood) for model comparison
- Sampling multi-modal posterior distributions where MCMC struggles
- Parameter estimation in high-dimensional spaces with complex degeneracies
- Problems where you need both posterior samples and evidence in one run
- Dynamic allocation of live points for efficient posterior resolution

## When NOT to Use

- Simple unimodal posterior sampling (use **emcee** — ensemble MCMC is faster
  when the posterior is well-behaved)
- Maximum-likelihood fitting or least-squares optimisation (use **iminuit** or
  **scipy** — dynesty is a sampler, not an optimiser)
- Polynomial chaos or quadrature-based uncertainty quantification (use
  **chaospy**)
- Deterministic machine-learning model training (use **scikit-learn**)
- Error propagation on individual measurements (use **uncertainties**)

## Capabilities

| Area | Key API |
|---|---|
| Static sampler | `dynesty.NestedSampler(loglike, prior_transform, ndim)` |
| Dynamic sampler | `dynesty.DynamicNestedSampler(loglike, prior_transform, ndim)` |
| Running | `sampler.run_nested()` |
| Results | `sampler.results` — dict with `samples`, `logz`, `logl`, `weights` |
| Utilities | `dynesty.utils.resample_equal(samples, weights)` |
| Bounding | `'multi'`, `'single'`, `'balls'`, `'cubes'`, `'none'` |
| Sampling | `'unif'`, `'rwalk'`, `'slice'`, `'rslice'`, `'hslice'` |

## Worked Example

Verify dynesty is available and check its version (the golden test uses a
version smoke because nested sampling output is stochastic and not
deterministically assertable):

```python
import dynesty

dynesty.__version__
# → "3.0.0"
```

A typical workflow defines a log-likelihood function, a prior transform
(mapping the unit cube to the prior), and runs the sampler:

```python
import numpy as np
import dynesty

def loglike(x):
    return -0.5 * np.sum(x ** 2)

def prior_transform(u):
    return 10.0 * u - 5.0

sampler = dynesty.NestedSampler(loglike, prior_transform, ndim=2)
sampler.run_nested(print_progress=False)
results = sampler.results
# results['logz'][-1] = log-evidence estimate
```

Always set `rstate=np.random.default_rng(42)` for reproducible evidence
estimates and posterior samples.

# emcee

emcee is a Python implementation of the affine-invariant ensemble sampler for
Markov chain Monte Carlo (MCMC). It is the standard tool for Bayesian parameter
estimation in astrophysics, cosmology, and the physical sciences. emcee requires
only NumPy at runtime; SciPy, h5py, and dill are optional extras (not hard
dependencies). Because MCMC sampling is inherently stochastic, results vary
between runs — always set a random seed for reproducibility.

## When to Use

- Sampling posterior probability distributions for Bayesian parameter estimation
- Fitting models to data with uncertainties where you need credible intervals
  rather than point estimates
- Exploring multimodal or high-dimensional likelihood surfaces that gradient
  methods struggle with
- Computing marginal likelihoods or Bayesian evidence via thermodynamic
  integration
- Running ensemble MCMC when you need multiple interacting walkers for better
  convergence diagnostics (auto-correlation time, acceptance fraction)

## When NOT to Use

- Maximum-likelihood or least-squares optimisation without posterior sampling
  (use **scipy** — `scipy.optimize.minimize` or `curve_fit` are faster for point
  estimates)
- Deterministic machine-learning model fitting, classification, or regression
  (use **scikit-learn**)
- Basic descriptive statistics, means, or percentiles (use **numpy**)
- Unit-aware astrophysical calculations (use **astropy** — emcee handles the
  sampler; Astropy handles units, coordinates, and cosmology models that you
  pass to emcee's log-probability function)
- Symbolic integration or differentiation (use **sympy**)

## Capabilities

| Area | Key API |
|---|---|
| Sampler | `emcee.EnsembleSampler(nwalkers, ndim, log_prob_fn)` |
| Sampling | `sampler.run_mcmc(initial_state, nsteps)` |
| Chain access | `sampler.get_chain()`, `sampler.get_log_prob()`, `sampler.flatchain` |
| Diagnostics | `sampler.acceptance_fraction`, `emcee.autocorr.integrated_time` |
| Moves | `emcee.moves.StretchMove`, `DEMove`, `DESnookerMove`, `GaussianMove` |
| Backends | `emcee.backends.HDFBackend` (optional, requires h5py) |
| Seeding | Pass `numpy.random.Generator` or seed via `np.random.default_rng(42)` |

## Worked Example

Verify emcee is available and check its version (the golden test uses a version
smoke because MCMC output is stochastic and not deterministically assertable):

```python
import emcee

emcee.__version__
# → "3.1.6"
```

A typical sampling workflow defines a log-probability function, initialises
walkers near a guess, and runs the sampler:

```python
import numpy as np
import emcee

def log_prob(x):
    return -0.5 * np.sum(x ** 2)

nwalkers, ndim = 32, 2
rng = np.random.default_rng(42)
p0 = rng.standard_normal((nwalkers, ndim))
sampler = emcee.EnsembleSampler(nwalkers, ndim, log_prob)
sampler.run_mcmc(p0, 500, progress=False)
chain = sampler.get_chain(flat=True)
# chain.shape → (16000, 2)
```

Always set a random seed (`default_rng(42)`) for reproducible chains and discard
an initial burn-in period before analysing posterior samples.

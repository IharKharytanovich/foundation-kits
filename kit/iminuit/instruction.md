# iminuit

iminuit is a Jupyter-friendly Python frontend for the CERN Minuit2 C++
minimiser. It provides fast, robust function minimisation (Migrad, Simplex,
Scan) and error analysis (Hesse, Minos) widely used in particle physics and
the physical sciences. The Python import name is `iminuit`. It requires NumPy
at runtime.

## When to Use

- Minimising a chi-squared or negative-log-likelihood function to obtain
  best-fit parameter values
- Computing parameter uncertainties and covariance matrices via Hesse or
  asymmetric errors via Minos
- Fitting models to binned or unbinned data with support for parameter limits
  and fixed parameters
- Profile-likelihood scans and contour plots for pairs of parameters
- Any least-squares or maximum-likelihood fitting problem where you need
  reliable second-derivative-based error estimation

## When NOT to Use

- Bayesian posterior sampling or MCMC inference (use **emcee** or **dynesty**)
- General-purpose numerical optimisation with constraints (use
  **scipy** — `scipy.optimize.minimize` supports many algorithms and
  constraint types)
- Symbolic differentiation or algebraic simplification (use **sympy**)
- Machine-learning model training, classification, or regression (use
  **scikit-learn**)
- Uncertainty propagation on measured quantities (use **uncertainties** —
  iminuit finds best-fit parameters; uncertainties propagates errors through
  calculations)

## Capabilities

| Area | Key API |
|---|---|
| Cost helpers | `iminuit.cost.UnbinnedNLL`, `BinnedNLL`, `LeastSquares` |
| Minimiser | `Minuit(fcn, **start)`, `m.migrad()`, `m.simplex()`, `m.scan()` |
| Errors | `m.hesse()`, `m.minos()` |
| Results | `m.values`, `m.errors`, `m.covariance`, `m.fmin` |
| Limits | `m.limits['x'] = (lo, hi)`, `m.fixed['x'] = True` |
| Profiles | `m.mnprofile('x')`, `m.mncontour('x', 'y')` |
| Validity | `m.fmin.is_valid`, `m.fmin.has_accurate_covar` |

## Worked Example

Minimise a simple parabola (x - 2)^2 and extract the best-fit x value:

```python
from iminuit import Minuit

str(round(Minuit(lambda x: (x-2)**2, x=0).migrad().values[0], 1))
# → "2.0"
```

For real fits, define a cost function (chi-squared or NLL), pass initial
parameter guesses, optionally set limits, call `m.migrad()` to minimise, then
`m.hesse()` for symmetric errors or `m.minos()` for asymmetric confidence
intervals. Always check `m.fmin.is_valid` to confirm convergence.

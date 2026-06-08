# lmfit

lmfit is a Python library for non-linear least-squares minimization and
curve fitting. It builds on `scipy.optimize` but replaces plain floats with
Parameter objects that can be bounded, fixed, or constrained by algebraic
expressions. lmfit includes many built-in peak and lineshape models and
supports every optimization method in SciPy. The Python import name is
`lmfit`. It depends on NumPy, SciPy, uncertainties (for automatic error
propagation), dill (for serialization), and bundles asteval (safe expression
evaluator for parameter constraints).

## When to Use

- Fitting models to data with bounded or constrained parameters (min/max
  limits, algebraic constraints between parameters)
- Non-linear least-squares curve fitting with automatic uncertainty
  estimation and confidence intervals
- Using built-in lineshape models (Gaussian, Lorentzian, Voigt, polynomial,
  step, exponential, power-law) or composing them
- Comparing multiple optimization algorithms on the same model (Levenberg-
  Marquardt, Nelder-Mead, Powell, differential evolution, etc.)
- Fitting composite/multi-peak spectra by summing or multiplying Model
  objects

## When NOT to Use

- Simple minimization of a scalar function without parameter bounds or
  constraints (use **scipy** — `scipy.optimize.minimize` is lighter)
- Bayesian posterior sampling or MCMC (use **emcee** or **dynesty** — lmfit
  is an optimizer, not a sampler)
- Interactive minimization with gradient-based Hessian access (use
  **iminuit** — Minuit provides richer convergence diagnostics)
- Polynomial chaos or surrogate-based uncertainty quantification (use
  **chaospy**)
- Machine-learning model training, cross-validation, or pipelines (use
  **scikit-learn**)
- Symbolic differentiation or exact analytical solutions (use **sympy**)

## Capabilities

| Area | Key API |
|---|---|
| Parameters | `Parameters`, `Parameter`, `create_params` — bounded, constrained variables |
| Minimizer | `minimize(residual, params)`, `Minimizer` class |
| Models | `Model(func)`, `CompositeModel` (`+`, `*` operators) |
| Built-ins | `GaussianModel`, `LorentzianModel`, `VoigtModel`, `LinearModel`, `PolynomialModel`, `StepModel`, `ExponentialModel` |
| Fitting | `model.fit(data, params, x=x)` — returns `ModelResult` |
| Results | `result.params`, `result.best_fit`, `result.fit_report()` |
| Confidence | `conf_interval(mini, result)`, `conf_interval2d` |
| Methods | `'leastsq'`, `'nelder'`, `'powell'`, `'differential_evolution'`, `'emcee'`, etc. |

## Worked Example

Fit a line to three points and extract the slope:

```python
from lmfit.models import LinearModel
import numpy as np

str(round(LinearModel().fit(np.array([0.,2.,4.]), x=np.array([0.,1.,2.])).params['slope'].value, 1))
# → "2.0"
```

`LinearModel` fits `slope * x + intercept`. For more complex models, compose
built-in shapes: `GaussianModel() + LinearModel()`, or wrap any Python
function with `Model(my_func)`. Bounded parameters are set via
`params['amp'].set(min=0)`.

# uncertainties

uncertainties is a Python library for calculations with values that have
uncertainties (error propagation). It transparently handles error propagation
through mathematical operations using linear error theory, computing derivatives
automatically. The Python import name is `uncertainties`. It has no runtime
dependencies. Results carry both a nominal value and a standard deviation; use
`.nominal_value` (`.n`) and `.std_dev` (`.s`) to extract them.

## When to Use

- Propagating measurement uncertainties through arithmetic and mathematical
  functions (addition, multiplication, trigonometry, etc.)
- Creating values with uncertainties (`ufloat`) and computing derived quantities
  with automatically tracked error bars
- Accessing partial derivatives of computed quantities with respect to input
  variables (`derivatives` attribute)
- Working with correlated uncertain values — uncertainties tracks correlations
  automatically when variables are derived from the same source
- Formatting results with proper significant figures using the `±` notation

## When NOT to Use

- Monte Carlo sampling of posterior distributions or Bayesian inference (use
  **emcee** — uncertainties does analytic linear propagation, not sampling)
- Numerical optimisation or curve fitting (use **scipy** `curve_fit` or
  **lmfit** — uncertainties handles the error bars on the resulting parameters,
  not the fitting itself)
- Symbolic differentiation or integration (use **sympy** — uncertainties
  computes numerical derivatives internally, not symbolic expressions)
- Statistical hypothesis testing or distribution fitting (use **scipy** `stats`)
- Array-level numerical computation without uncertainties (use **numpy**)

## Capabilities

| Area | Key API |
|---|---|
| Uncertain values | `ufloat(nominal, std_dev)`, `ufloat_fromstr('1.0+/-0.1')` |
| Correlated values | `correlated_values([nom], covariance_matrix)` |
| Nominal / std_dev | `x.nominal_value` (`.n`), `x.std_dev` (`.s`) |
| Math functions | `uncertainties.umath.sin`, `cos`, `exp`, `log`, `sqrt`, etc. |
| Derivatives | `x.derivatives[y]` — partial derivative of x w.r.t. y |
| Formatting | `f'{x:.2uS}'` — shorthand notation; `f'{x:.2uP}'` — pretty ± |
| NumPy interop | `uncertainties.unumpy.uarray(noms, stds)` — arrays of ufloats |

## Worked Example

Add two uncertain measurements and extract the nominal value of the sum:

```python
from uncertainties import ufloat

result = ufloat(2.0, 0.1) + ufloat(3.0, 0.2)
str(result.nominal_value)
# → "5.0"
```

The standard deviation of the sum is `result.std_dev`, which equals
`sqrt(0.1² + 0.2²) ≈ 0.2236` — computed automatically by linear error
propagation. Use `uncertainties.umath` for transcendental functions that
correctly propagate errors (e.g. `umath.sin(x)`).

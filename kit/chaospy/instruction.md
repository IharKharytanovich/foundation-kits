# chaospy

chaospy is a numerical tool for uncertainty quantification using polynomial
chaos expansions. It provides probability distributions, quadrature rules,
orthogonal polynomial generation, and pseudo-spectral projection for
propagating uncertainty through computational models. The Python import name is
`chaospy`. It requires NumPy, SciPy, and setuptools at runtime, and bundles
numpoly (polynomial array library) as an exclusive dependency.

## When to Use

- Propagating input uncertainty through a deterministic model via polynomial
  chaos expansion (PCE)
- Generating quadrature nodes and weights for numerical integration
  (Gaussian, Clenshaw-Curtis, sparse grids)
- Building orthogonal polynomial bases for arbitrary probability distributions
- Sampling from univariate or multivariate distributions with dependencies
  (Nataf/Rosenblatt transforms)
- Sensitivity analysis via Sobol indices derived from PCE coefficients

## When NOT to Use

- Bayesian posterior sampling or MCMC inference (use **emcee** or **dynesty**)
- Fitting model parameters to data (use **iminuit**, **lmfit**, or **scipy**)
- Error propagation on individual measured values (use **uncertainties** —
  chaospy handles model-level UQ, uncertainties handles measurement-level
  error bars)
- Finite element assembly or PDE solving (use **scikit-fem** — chaospy wraps
  around a solver; scikit-fem is the solver)
- General-purpose optimisation (use **scipy**)

## Capabilities

| Area | Key API |
|---|---|
| Distributions | `chaospy.Normal`, `Uniform`, `Beta`, `J` (joint), `Iid` |
| Moments | `chaospy.E(dist)`, `chaospy.Var(dist)`, `chaospy.Std(dist)` |
| Quadrature | `chaospy.generate_quadrature(order, dist, rule=...)` |
| Polynomials | `chaospy.generate_expansion(order, dist)` |
| PCE fitting | `chaospy.fit_regression(expansion, nodes, responses)` |
| Sampling | `dist.sample(n, rule='sobol')`, `dist.sample(n, rule='halton')` |
| Sobol indices | Derived from PCE coefficients via `chaospy.Sens_m` / `Sens_t` |

## Worked Example

Compute the expected value of a standard normal distribution:

```python
import chaospy

str(float(chaospy.E(chaospy.Normal(0, 1))))
# → "0.0"
```

A typical UQ workflow defines a joint input distribution, generates quadrature
nodes, evaluates the model at each node, fits a PCE, and extracts statistics
(mean, variance) or Sobol sensitivity indices from the expansion.

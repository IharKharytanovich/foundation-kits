# SciPy

SciPy builds on NumPy to provide scientific computing routines: optimization,
integration, interpolation, signal processing, special functions, and sparse
linear algebra.

## When to Use

- Special mathematical functions (combinatorics, Bessel, gamma, erf)
- Numerical integration and ODE solving
- Optimization and root-finding
- Interpolation and curve fitting
- Sparse matrices and sparse linear algebra
- Signal processing (filtering, convolution, spectral analysis)

## When NOT to Use

- Basic array arithmetic or linear algebra on dense matrices (use numpy)
- Symbolic computation (use sympy)
- Sequence/bioinformatics operations (use seqtk)

## Capabilities

| Area | Key Modules |
|---|---|
| Special functions | `scipy.special` — `comb`, `factorial`, `gamma`, `erf`, `bessel*` |
| Integration | `scipy.integrate` — `quad`, `solve_ivp`, `trapezoid` |
| Optimization | `scipy.optimize` — `minimize`, `root`, `curve_fit` |
| Interpolation | `scipy.interpolate` — `interp1d`, `CubicSpline` |
| Signal | `scipy.signal` — `butter`, `filtfilt`, `welch` |
| Sparse | `scipy.sparse` — `csr_matrix`, `linalg.spsolve` |

## Worked Example

Compute "5 choose 2" using the combinatorics function:

```python
import scipy.special as sp
result = sp.comb(5, 2)
str(float(result))
# → "10.0"
```

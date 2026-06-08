# findiff

findiff is a Python library for finite-difference numerical derivatives of any
order on arbitrary-dimensional grids. It computes derivatives of discrete data
(NumPy arrays) using configurable accuracy and supports mixed partial
derivatives, gradients, Laplacians, and general differential operators. The
Python import name is `findiff`. It depends on NumPy, SciPy, and SymPy at
runtime.

## When to Use

- Computing numerical derivatives (first, second, or higher order) of discrete
  data sampled on regular or non-uniform grids
- Evaluating gradients, Laplacians, divergences, or curls of array-valued fields
- Building finite-difference stencils with configurable accuracy order
- Solving or discretising partial differential equations (PDEs) on structured
  grids by converting differential operators to sparse matrices
- Looking up finite-difference coefficients for custom stencil design
  (`coefficients()`)

## When NOT to Use

- Symbolic differentiation or integration (use **sympy** — findiff computes
  numerical derivatives from sampled data, not symbolic expressions)
- Solving PDEs with finite-element methods on unstructured meshes (use
  **scikit-fem**)
- Wavelet-based signal decomposition or filtering (use **pywavelets**)
- Statistical fitting or optimisation (use **scipy** `optimize` or **lmfit**)
- Low-level array math without derivatives (use **numpy**)

## Capabilities

| Area | Key API |
|---|---|
| Derivative operator | `Diff(axis, spacing, deriv=1)` — first derivative along an axis |
| Higher order | `Diff(axis, spacing, deriv=n)` — nth derivative |
| Mixed partials | `Diff(0, dx) * Diff(1, dy)` — d²/dxdy via operator product |
| Accuracy | `Diff(axis, spacing, acc=4)` — 4th-order accurate stencil |
| Coefficients | `coefficients(deriv, acc)` — raw stencil weights |
| Matrix form | `Diff(axis, spacing).matrix(shape)` — sparse matrix operator |
| Apply | `d(f)` — apply operator to an ndarray `f` |

## Worked Example

Compute the numerical first derivative of f(x) = x² on a unit grid and read
the value at x = 2 (expected: 2x = 4):

```python
import numpy as np
from findiff import Diff

str(Diff(0, 1.0)(np.array([0.0, 1.0, 4.0, 9.0, 16.0]))[2])
# → "4.0"
```

`Diff(0, 1.0)` creates a first-derivative operator along axis 0 with grid
spacing 1.0. Applying it to the array `[0, 1, 4, 9, 16]` (which is x² at
x = 0..4) yields the numerical derivative. At index 2 (x = 2), the result is
4.0, matching the analytic derivative 2x = 4.

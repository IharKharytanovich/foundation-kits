# autograd

autograd is a Python library for automatic differentiation of native Python and
NumPy code. It can compute derivatives of scalar-valued functions with respect
to one or many arguments via reverse-mode (backpropagation) or forward-mode AD.
autograd wraps NumPy transparently — existing NumPy code can be differentiated
without rewriting, and the resulting gradients are themselves differentiable,
enabling higher-order derivatives. autograd requires NumPy at runtime.

## When to Use

- Computing exact gradients, Jacobians, or Hessians of Python/NumPy functions
  for optimisation, sensitivity analysis, or physics simulations
- Differentiating through complex numerical pipelines (loops, branches,
  closures) where symbolic differentiation would be impractical
- Prototyping machine-learning models or custom loss functions that need
  gradient-based optimisation without a heavy framework
- Higher-order differentiation — gradient of gradient, or computing curvature
  (Hessian-vector products)
- Educational demonstrations of automatic differentiation concepts

## When NOT to Use

- Symbolic differentiation where you need a closed-form expression (use
  **sympy** — `sympy.diff`)
- Numerical finite-difference derivatives on a grid (use **findiff** — it
  provides finite-difference operators on NumPy arrays without requiring
  smooth, traced functions)
- Large-scale neural network training with GPU acceleration (use dedicated
  ML frameworks; autograd is CPU-only and designed for small-to-medium
  scientific models)
- Uncertainty propagation through measurements (use **uncertainties** — it
  tracks error propagation without requiring you to write a differentiable
  function)
- Bayesian parameter estimation or MCMC sampling (use **emcee** or **dynesty**)

## Capabilities

| Area | Key API |
|---|---|
| Gradient | `autograd.grad(fun)(x)` — gradient of a scalar function |
| Jacobian | `autograd.jacobian(fun)(x)` — full Jacobian matrix |
| Hessian | `autograd.hessian(fun)(x)` — second-order Hessian |
| Elementwise grad | `autograd.elementwise_grad(fun)(x)` |
| Value + grad | `autograd.value_and_grad(fun)(x)` — avoids duplicate work |
| Forward mode | `autograd.make_jvp(fun)(x)(v)` — Jacobian-vector product |
| NumPy wrapping | `autograd.numpy` — drop-in replacement for `numpy` |
| SciPy wrapping | `autograd.scipy` — partial support for `scipy.special`, etc. |

## Worked Example

Compute the derivative of f(x) = x^3 at x = 2 using reverse-mode AD:

```python
from autograd import grad

str(grad(lambda x: x**3)(2.0))
# -> "12.0"
```

The derivative of x^3 is 3x^2, which at x = 2 gives 3 * 4 = 12. A typical
optimisation workflow computes gradients in a loop:

```python
import autograd.numpy as np
from autograd import grad

def loss(params):
    return np.sum((params - np.array([1.0, 2.0])) ** 2)

g = grad(loss)
params = np.zeros(2)
for _ in range(100):
    params = params - 0.1 * g(params)
# params converges to [1.0, 2.0]
```

Use `value_and_grad` when you need both the function value and gradient in a
single pass, avoiding redundant computation.

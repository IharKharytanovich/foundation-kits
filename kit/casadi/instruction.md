# casadi

CasADi — a symbolic framework for nonlinear optimization and algorithmic
differentiation. It provides building blocks for formulating and solving
nonlinear programs (NLP), quadratic programs (QP), and optimal control problems
(OCP). CasADi features sparse symbolic expressions with automatic (algorithmic)
differentiation, interfaces to numerical solvers (IPOPT, qpOASES, SUNDIALS),
and ODE/DAE integrators — all with efficient sparsity-exploiting code
generation.

## When to use

- Formulating and solving nonlinear optimization problems with sparse structure.
- Computing exact gradients, Jacobians, and Hessians via algorithmic
  differentiation (forward and reverse mode) on symbolic expression graphs.
- Optimal control and trajectory optimization (direct collocation /
  direct multiple shooting) with ODE/DAE dynamics.
- Building custom NLP solvers that exploit problem structure and sparsity.

## When NOT to use

- **Reverse-mode AD on plain NumPy/array code** — use autograd or JAX instead;
  CasADi operates on its own symbolic `SX`/`MX` expression graph, not on
  arbitrary Python/NumPy code.
- **Convex optimization (disciplined convex programming)** — use CVXPY; CasADi
  targets general nonlinear, not DCP-verified convex problems.
- **Pure LP/MIP (linear / mixed-integer programming)** — use HiGHS or PuLP;
  CasADi is designed for continuous nonlinear problems.
- **Large-scale machine-learning training** — use PyTorch/JAX; CasADi is for
  optimization-model-scale problems, not GPU tensor workloads.

## Optional extras not bundled

Plotting (matplotlib) and advanced solver interfaces (HSL linear solvers, WORHP,
SNOPT, KNITRO) are NOT bundled. CasADi's built-in IPOPT interface with MUMPS
is available.

## Example

Compute the derivative of f(x) = x² and evaluate it at x = 3:

```python
import casadi
x = casadi.SX.sym('x')
f = x**2
grad = casadi.jacobian(f, x)
fn = casadi.Function('fn', [x], [grad])
result = fn(3.0)
print(str(int(float(result))))
# => 6
```

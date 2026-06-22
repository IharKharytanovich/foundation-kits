# cvxpy

cvxpy is a Python-embedded modelling language for disciplined convex
optimisation (DCP). It lets you declare decision variables, build an objective
and constraints using natural mathematical syntax, then solve the resulting
problem with a backend solver. cvxpy checks DCP compliance at construction time,
so invalid (non-convex) problems are rejected before solving. The Python import
name is `cvxpy`. It requires NumPy and SciPy at runtime.

## Limitations in this kit

The only solver available in-sandbox is **CLARABEL** (a Rust-based interior-point
solver for conic programs). Other solvers commonly available in desktop cvxpy
installations (OSQP, ECOS, SCS, GLPK, MOSEK, Gurobi) are **not provided** in
this Pyodide environment. Consequently:

- All problems must be expressible as conic programs solvable by CLARABEL
  (LP, QP, SOCP, SDP, exponential-cone, power-cone).
- Mixed-integer programming (MIP) is **not supported** (no MIP-capable solver).
- Always pass `solver='CLARABEL'` explicitly to avoid solver-selection errors.

## When to Use

- Least-squares and minimum-norm problems (`Minimize(sum_squares(...))`)
- Linear programming (LP) and quadratic programming (QP)
- Second-order cone programs (SOCP) — robust optimisation, Markowitz portfolio
- Semidefinite programs (SDP) — matrix completion, sensor-network localisation
- Convex regression, Lasso, ridge, elastic net via DCP atoms
- Any problem where you need DCP validation of the formulation before solving

## When NOT to Use

- Non-convex optimisation or global search (cvxpy rejects non-DCP problems;
  use **scipy** `minimize` or **scikit-optimize** for black-box optimisation)
- Raw LP/MIP/QP without a modelling layer (use **highs-js** for HiGHS solver
  access without the DCP DSL overhead)
- Symbolic algebra or equation solving (use **sympy**)
- Statistical model fitting (use **statsmodels** or **scikit-learn**)
- Bayesian inference or MCMC sampling (use **emcee** or **dynesty**)

## Capabilities

| Area | Key API |
|---|---|
| Variables | `cp.Variable(n)`, `cp.Variable((m,n), symmetric=True)`, `cp.Variable(n, nonneg=True)` |
| Objective | `cp.Minimize(expr)`, `cp.Maximize(expr)` |
| Atoms | `cp.sum_squares`, `cp.norm`, `cp.quad_form`, `cp.log_sum_exp`, `cp.lambda_max` |
| Constraints | `A @ x == b`, `x >= 0`, `cp.norm(x) <= t`, `X >> 0` (SDP) |
| Problem | `prob = cp.Problem(objective, constraints); prob.solve(solver='CLARABEL')` |
| Results | `x.value`, `prob.value`, `prob.status`, dual values via `constraint.dual_value` |
| Parameters | `cp.Parameter(n)` for re-solving with new data without rebuilding |

## Worked Example

Solve a simple least-squares problem: minimise ||Ax - b||^2 where A is the
identity matrix and b = [1, 2]:

```python
import cvxpy as cp, numpy as np

x = cp.Variable(2)
A = np.array([[1., 0.], [0., 1.]])
b = np.array([1., 2.])
cp.Problem(cp.Minimize(cp.sum_squares(A @ x - b))).solve(solver='CLARABEL')
'%.2f,%.2f' % (x.value[0], x.value[1])
# -> "1.00,2.00"
```

The solution is x = b = [1, 2] because A is the identity matrix. For
non-trivial problems, build constraints and use DCP-compliant atoms to ensure
the problem is accepted by cvxpy's verifier.

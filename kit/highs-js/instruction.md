# HiGHS (highs-js)

HiGHS is a high-performance solver for Linear Programming (LP), Mixed-Integer
Programming (MIP), and Quadratic Programming (QP). This kit wraps the prebuilt
single-threaded Emscripten WASM distribution of HiGHS, exposing the solver
through a scriptable JS interface.

## When to Use

- Solving linear programs (LP) — maximize/minimize a linear objective subject to
  linear constraints and variable bounds
- Solving mixed-integer programs (MIP) — LP with integrality constraints on some
  or all variables
- Solving convex quadratic programs (QP) — quadratic objectives with linear
  constraints
- Any optimization problem expressible in LP/CPLEX format or as a model built
  through the HiGHS API
- When you need exact optimal solutions (not heuristic/approximate)

## When NOT to Use

- General nonlinear optimization, unconstrained minimization, or curve fitting
  (use scipy — `scipy.optimize`)
- Symbolic equation solving or simplification (use sympy)
- Gradient-based optimization of differentiable functions (use autograd + scipy)
- Problems that are not LP/MIP/QP — HiGHS cannot handle arbitrary nonlinear
  constraints

## Capabilities

| Feature | Details |
|---|---|
| LP | Simplex (primal/dual) and interior-point methods |
| MIP | Branch-and-cut with presolve, cuts, and heuristics |
| QP | Convex quadratic objectives (positive semi-definite Q) |
| Input format | LP/CPLEX-format string passed to `handle.solve(lp)` |
| Output | Solution object with `Status`, `ObjectiveValue`, `Columns`, `Rows` |

The `solve()` method accepts an LP-format problem string and returns a JavaScript
object containing the solution status, objective value, primal/dual values for
each variable, and row activity.

## Scripting

This kit is scriptable — write free JS against the module handle. The handle is
the initialized HiGHS solver instance:

- `handle.solve(lpString)` — solve an LP/MIP/QP problem in CPLEX LP format;
  returns `{Status, ObjectiveValue, Columns, Rows}`
- `sol.Status` — `"Optimal"`, `"Infeasible"`, `"Unbounded"`, etc.
- `sol.ObjectiveValue` — the optimal objective value (number)
- `sol.Columns.<name>.Primal` — optimal value of variable `<name>`
- Always return a **string** (use `String(...)`, `JSON.stringify(...)`, or string
  concatenation)

### Worked Example

```js
const sol = handle.solve('Maximize\n obj: x1 + 2 x2 + 4 x3 + x4\nSubject To\n c1: - x1 + x2 + x3 + 10 x4 <= 20\n c2: x1 - 4 x2 + x3 <= 30\n c3: x2 - 0.5 x4 = 0\nBounds\n 0 <= x1 <= 40\n 2 <= x4 <= 3\nEnd');
return sol.Status + ':' + sol.ObjectiveValue;
// => "Optimal:87.5"
```

## Golden Capture

```bash
cd /tmp && mkdir -p highs-capture && cd highs-capture && npm init -y && npm install highs@1.14.2
node -e "
const highs_loader = require('highs');
(async () => {
  const highs = await highs_loader({
    locateFile: (file) => require('path').join(require('path').dirname(require.resolve('highs')), '..', 'build', file)
  });
  const script = \`const sol = handle.solve('Maximize\\\\n obj: x1 + 2 x2 + 4 x3 + x4\\\\nSubject To\\\\n c1: - x1 + x2 + x3 + 10 x4 <= 20\\\\n c2: x1 - 4 x2 + x3 <= 30\\\\n c3: x2 - 0.5 x4 = 0\\\\nBounds\\\\n 0 <= x1 <= 40\\\\n 2 <= x4 <= 3\\\\nEnd'); return sol.Status + ':' + sol.ObjectiveValue;\`;
  const fn = new Function('handle', 'return (async()=>{' + script + '})()');
  console.log(await fn(highs));
})();
"
```

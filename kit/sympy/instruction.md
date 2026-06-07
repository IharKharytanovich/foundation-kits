# SymPy

SymPy is a pure-Python library for symbolic mathematics. It performs algebraic
simplification, calculus, equation solving, and expression manipulation — all
symbolically, producing exact results rather than floating-point approximations.

## When to Use

- Simplifying algebraic expressions
- Symbolic differentiation and integration
- Solving equations and systems of equations symbolically
- Series expansion (Taylor, Laurent)
- Exact arithmetic with rationals, roots, and constants (pi, e)

## When NOT to Use

- Numerical computation on large arrays (use numpy)
- Numerical optimization or interpolation (use scipy)
- Floating-point statistics or FFT (use numpy/scipy)

## Capabilities

| Area | Key Functions |
|---|---|
| Simplification | `sympy.simplify`, `sympy.expand`, `sympy.factor`, `sympy.collect` |
| Calculus | `sympy.diff`, `sympy.integrate`, `sympy.limit`, `sympy.series` |
| Solving | `sympy.solve`, `sympy.solveset`, `sympy.linsolve` |
| Matrices | `sympy.Matrix` — symbolic determinant, inverse, eigenvalues |
| Display | `sympy.pretty`, `sympy.latex` |

## Worked Example

Simplify the expression `x + x`:

```python
import sympy
result = sympy.simplify('x + x')
str(result)
# → "2*x"
```

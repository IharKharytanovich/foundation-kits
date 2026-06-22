# flint

Exact polynomial, number-theory, and matrix arithmetic with certified ball
arithmetic, powered by FLINT and Arb via python-flint.

## When to use

- Exact integer/rational polynomial arithmetic (factoring, GCD, resultants) over
  `fmpz_poly`, `fmpq_poly`, and other FLINT polynomial rings.
- Number-theoretic computations: modular arithmetic (`nmod`, `fmpz_mod`), integer
  factoring, primality testing.
- Certified ball arithmetic with Arb (`arb`, `acb`): compute real/complex values
  to arbitrary precision with rigorous error bounds — the result is a ball
  (midpoint + radius) guaranteed to contain the true value.
- Exact integer and rational matrix arithmetic (`fmpz_mat`, `fmpq_mat`):
  determinant, inverse, Hermite/Smith normal form.

## When NOT to use

- **Symbolic algebra** (simplification, integration, equation solving) — use
  **sympy** instead.
- **Floating-point linear algebra** (dense numeric arrays, eigenvalues, SVD) —
  use **numpy** or **scipy** instead.
- **Arbitrary-precision floats without error tracking** — use **mpmath** (bundled
  with sympy) if you need arbitrary-precision but not certified error bounds.

## Example

Factor the polynomial x² − 1 over the integers:

```python
import flint
poly = flint.fmpz_poly([-1, 0, 1])   # coefficients: -1 + 0·x + 1·x²
result = str(poly.factor())
# result == "(1, [(x + (-1), 1), (x + 1, 1)])"
```

The output shows the unit (1) and irreducible factors with their multiplicities:
(x − 1)¹ · (x + 1)¹.

# olll

olll is a pure-Python implementation of the Lenstra-Lenstra-Lovász (LLL) lattice
basis reduction algorithm. It operates in exact rational arithmetic using
Python's `fractions.Fraction`, so results are precise with no floating-point
drift. olll has zero third-party dependencies — it uses only the standard
library — and is well-suited for sandbox-scale lattice problems. For very large
bases (hundreds of vectors in high dimension), it will be slow compared to
compiled implementations, but for typical educational and research inputs it
works well.

## When to Use

- Reducing a lattice basis to find shorter, more orthogonal vectors (the classic
  LLL problem in computational number theory)
- Cryptographic lattice analysis — breaking knapsack ciphers, analysing
  NTRU/LWE-style schemes, or finding small solutions to modular equations
- Integer relation detection — finding integer linear combinations that relate
  given real numbers (e.g. PSLQ-style problems via lattice construction)
- Approximating shortest/closest vector problems (SVP/CVP) — LLL gives a
  polynomial-time approximation
- Simultaneous Diophantine approximation and finding minimal polynomial
  relations among algebraic numbers

## When NOT to Use

- General-purpose linear algebra (matrix multiply, eigenvalues, SVD) — use
  **numpy** or **scipy**
- Exact symbolic computation, polynomial manipulation, or computer algebra — use
  **sympy** or **flint**
- Large-scale high-performance lattice reduction where speed is critical — olll
  is pure-Python and operates in exact `Fraction` arithmetic, which is slower
  than C/Fortran implementations like fplll
- Problems that are not naturally expressed as lattice basis reduction

## Capabilities

| Area | Key API |
|---|---|
| LLL reduction | `olll.reduction(basis, delta)` — reduce an integer basis with parameter delta (typically 0.75) |

The single entry point accepts a list-of-lists of integers (the lattice basis
vectors) and a reduction parameter delta in (0.25, 1). It returns the reduced
basis as a list-of-lists of `Fraction` values (which are exact integers for
integer input).

## Worked Example

Reduce the integer basis [[1,1,1], [-1,0,2], [3,5,6]] with delta=0.75:

```python
import olll

str(olll.reduction([[1,1,1],[-1,0,2],[3,5,6]], 0.75))
# -> "[[0, 1, 0], [1, 0, 1], [-1, 0, 2]]"
```

The reduced basis has shorter, more orthogonal vectors than the input. To work
with the result as plain integers:

```python
import olll

reduced = olll.reduction([[1,1,1],[-1,0,2],[3,5,6]], 0.75)
int_basis = [[int(x) for x in row] for row in reduced]
# int_basis = [[0, 1, 0], [1, 0, 1], [-1, 0, 2]]
```

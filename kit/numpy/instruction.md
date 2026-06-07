# NumPy

NumPy is the fundamental package for numerical computing in Python. It provides
N-dimensional arrays, linear algebra, Fourier transforms, and random number
generation.

## When to Use

- Matrix and vector operations (dot products, determinants, eigenvalues)
- Element-wise arithmetic on large arrays
- Linear algebra (solving systems, SVD, LU decomposition)
- Statistical aggregations (mean, std, percentiles) over numeric data
- Fourier transforms and signal-domain conversions

## When NOT to Use

- Symbolic algebra (use sympy instead)
- Statistical distributions or special functions (use scipy instead)
- String processing or text manipulation
- File I/O or data parsing beyond `numpy.loadtxt`

## Capabilities

| Area | Key Functions |
|---|---|
| Array creation | `np.array`, `np.zeros`, `np.ones`, `np.linspace`, `np.arange` |
| Linear algebra | `np.linalg.det`, `np.linalg.inv`, `np.linalg.eig`, `np.linalg.solve` |
| Statistics | `np.mean`, `np.std`, `np.median`, `np.percentile` |
| Transforms | `np.fft.fft`, `np.fft.ifft` |
| Random | `np.random.default_rng` (always use the new Generator API) |

## Worked Example

Compute the determinant of a 2x2 matrix:

```python
import numpy as np
A = np.array([[1, 2], [3, 4]])
det = np.linalg.det(A)
str(round(float(det), 4))
# → "-2.0"
```

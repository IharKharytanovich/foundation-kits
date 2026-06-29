# pygsp

pygsp (PyGSP) is a Python library for graph signal processing: it represents
signals defined on the vertices of a weighted graph and provides the spectral
machinery to analyze and transform them — graph Laplacians, the graph Fourier
transform (GFT), spectral filter banks and graph wavelets, Chebyshev polynomial
filter approximation, differential operators (gradient/divergence), and a large
collection of built-in graph generators. It operates on NumPy arrays and SciPy
sparse matrices; it requires numpy and scipy at runtime.

Import name: `pygsp` (e.g. `from pygsp import graphs, filters`).

## When to Use

- Process **signals defined on graphs** — forward/inverse graph Fourier
  transform, spectral filtering, graph wavelet transform.
- Design and apply **spectral filter banks** (heat kernel, Mexican-hat and Meyer
  wavelets, Abspline, Itersine tight frames) on graph-structured data, with exact
  (eigendecomposition) or fast **Chebyshev polynomial** filtering.
- Compute the **graph Laplacian** (combinatorial or normalized), its spectrum
  (eigenvalues/eigenvectors), and the **graph differential operator**
  (gradient/divergence) for spectral graph analysis.
- Build graphs from **built-in generators** (Ring, Path, Grid2d, Torus, Sensor,
  Community, stochastic block model, Bunny, Minnesota road network, …) or from a
  custom adjacency / weight matrix.

## When NOT to Use

- **Graph topology and network analytics** (shortest paths, centrality,
  community detection, isomorphism) → use `networkx` or `igraph`.
- **1-D / 2-D wavelet transforms** on regular signals (time series, images) →
  use **pywavelets**.
- **Optimal transport** on graphs or point clouds → use **pot**.
- **Plotting or visualization** — PyGSP's plotting extras (`matplotlib`,
  `pyqtgraph`) are NOT available in the sandbox; compute results numerically and
  return them as data.

## Dependencies

- **numpy** and **scipy** — array math and sparse Laplacian/eigendecomposition
  (listed in `dependencies[]`).
- `networkx` and `matplotlib` are **optional extras** — NOT installed and NOT
  required. Do not import them. All graph construction and spectral computation
  works with numpy and scipy alone.

## Capabilities

| Area | Key API |
|---|---|
| Graph from matrix | `pygsp.graphs.Graph(adjacency, lap_type='combinatorial')` |
| Graph generators | `graphs.Ring(N)`, `graphs.Path(N)`, `graphs.Grid2d(N1, N2)`, `graphs.Torus`, `graphs.Sensor(N)`, `graphs.Community(N)`, `graphs.StochasticBlockModel`, `graphs.Bunny`, `graphs.Minnesota` |
| Laplacian | `G.compute_laplacian(lap_type='combinatorial'\|'normalized')`; matrix at `G.L` |
| Fourier basis | `G.compute_fourier_basis()` → eigenvalues `G.e`, eigenvectors `G.U` |
| Graph Fourier transform | `G.gft(s)` (forward), `G.igft(s_hat)` (inverse) |
| Differential operator | `G.compute_differential_operator()`, then `G.grad(x)`, `G.div(y)` |
| Filter kernels | `filters.Heat(G, scale=10)`, `filters.MexicanHat(G, Nf)`, `filters.Meyer(G, Nf)`, `filters.Abspline(G, Nf)`, `filters.Itersine(G, Nf)`, `filters.Expwin(G)` |
| Apply a filter | `f.filter(s, method='chebyshev', order=30)` (fast) or `method='exact'` |
| Filter analysis | `f.evaluate(x)` (kernel values), `f.estimate_frame_bounds()` |

`Nf` is the number of filters (scales) in a wavelet filter bank. `filter()` with
`method='chebyshev'` avoids the full eigendecomposition and scales to large
graphs; `method='exact'` uses `G.U`/`G.e` and requires `compute_fourier_basis()`
first.

## Worked Example

Build an 8-node ring graph, compute its combinatorial Laplacian and full Fourier
basis, then report the largest Laplacian eigenvalue:

```python
from pygsp import graphs
G = graphs.Ring(N=8)
G.compute_laplacian()
G.compute_fourier_basis()
print(round(float(G.e[-1]), 6))
# -> "4.0"
```

`G.e` holds the Laplacian eigenvalues (graph frequencies, ascending) and `G.U`
the corresponding eigenvectors (the graph Fourier basis). For the ring the
spectrum is `2 - 2*cos(2*pi*k/N)`, so the maximum is `4.0`.

### Spectral filtering — diffuse a signal with a heat kernel

```python
import numpy as np
from pygsp import graphs, filters

G = graphs.Sensor(N=64, seed=42)        # random geometric sensor graph
G.compute_fourier_basis()               # needed for method='exact'

s = np.zeros(G.N); s[0] = 1.0           # an impulse on vertex 0
g = filters.Heat(G, scale=10)           # heat-kernel low-pass filter
smooth = g.filter(s, method='exact')    # diffuse the impulse over the graph
print(round(float(smooth.sum()), 6))    # heat kernel ~ preserves total mass
```

The heat filter `exp(-scale * lambda)` attenuates high graph frequencies, so the
impulse spreads to neighbouring vertices. Swap in `filters.MexicanHat(G, Nf=6)`
for a multi-scale wavelet filter bank, or `method='chebyshev'` to filter without
the eigendecomposition.

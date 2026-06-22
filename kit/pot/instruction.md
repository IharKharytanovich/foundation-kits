# POT — Python Optimal Transport

POT provides efficient algorithms for optimal transport: computing distances
between probability distributions (Wasserstein / Earth Mover's Distance),
regularized transport (Sinkhorn), Gromov-Wasserstein for incomparable spaces,
and Wasserstein barycenters.

Import name: `ot` (not `pot`).

## When to Use

- Compute Earth Mover's Distance (EMD / Wasserstein-1) between histograms or
  point-cloud distributions
- Regularized optimal transport via Sinkhorn / Sinkhorn-Knopp
- Gromov-Wasserstein distance for comparing distributions on different metric
  spaces
- Wasserstein barycenters (averaging distributions in transport geometry)
- Domain adaptation, color transfer, or distribution matching via OT plans

## When NOT to Use

- Simple distance metrics between vectors (use scipy or numpy)
- Probability density estimation (use scipy.stats or scikit-learn)
- Graph shortest-path / network flow problems unrelated to optimal transport
  (use networkx or igraph)
- Large-scale GPU-accelerated transport (POT's core is CPU-only C++; for
  GPU batches consider dedicated GPU-OT libraries)

## Capabilities

| Area | Key Functions |
|---|---|
| EMD | `ot.emd`, `ot.emd2` — exact linear-program OT (C++ network simplex) |
| Sinkhorn | `ot.sinkhorn`, `ot.sinkhorn2` — entropic-regularized OT |
| Gromov-Wasserstein | `ot.gromov_wasserstein`, `ot.gromov_wasserstein2` |
| Barycenters | `ot.barycenter`, `ot.barycenter_sinkhorn` |
| Mappings | `ot.da` — domain adaptation via OT |
| Sliced | `ot.sliced_wasserstein_distance` — fast 1-D projections |
| Unbalanced | `ot.unbalanced` — transport with mass creation/destruction |

## Worked Example

Compute the Earth Mover's Distance between two 2-bin distributions under a
unit-cost transport matrix:

```python
import ot
cost = ot.emd2([0.5, 0.5], [0.0, 1.0], [[0.0, 1.0], [1.0, 0.0]])
str(cost)
# → "0.5"
```

Half of the mass at bin 0 must move to bin 1 at unit cost, giving a total
transport cost of 0.5.

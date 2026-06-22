# ripser

Ripser is a lean, high-performance C++ tool for computing Vietoris-Rips
persistence barcodes — the core computation of topological data analysis (TDA).
Given a pairwise distance matrix, it builds the Vietoris-Rips filtration and
returns the persistence barcode: a list of (birth, death) intervals per homology
dimension that describe the shape of the data (connected components in dim 0,
loops in dim 1, voids in dim 2, etc.).

This kit exposes Ripser as a single strict operation over one WASI binary. Input
is a lower-distance matrix on stdin (materialised as a file); output is the
persistence barcode on stdout.

## Input format

The `barcode` operation reads a **lower-distance matrix** — the strict lower
triangle of a symmetric distance matrix, one row per line, space-separated:

```
d(1,0)
d(2,0) d(2,1)
d(3,0) d(3,1) d(3,2)
...
```

Row *i* lists distances from point *i* to points 0, 1, ..., *i*-1. The first
point (index 0) has no row. The number of points is inferred from the number of
rows + 1.

For example, three equidistant points (all pairwise distances = 2):

```
2
2 2
```

## When to Use

- **Persistent homology** — compute the Vietoris-Rips persistence barcode of a
  point cloud or distance matrix to detect topological features (clusters, loops,
  voids) at multiple scales.
- **Topological data analysis (TDA)** — summarise the "shape" of data: which
  features persist over a wide range of distance thresholds (long bars) vs.
  which are noise (short bars).
- **Comparing datasets** — compute barcodes of two datasets and compare their
  persistence diagrams (e.g. bottleneck / Wasserstein distance, done downstream).
- **Dimensionality-free shape detection** — Ripser works on any metric (Euclidean,
  geodesic, cosine, etc.) as long as you supply the pairwise distance matrix.

## When NOT to Use

- Computing pairwise distances from raw coordinates (compute the distance matrix
  first with **numpy** or **scipy**, then feed it to ripser).
- Graph-theoretic algorithms (shortest paths, connected components, centrality) —
  use **networkx**.
- Mapper / other TDA visualisations beyond the raw barcode (not a CLI capability).
- Simplicial complex construction or homology over fields other than Z/2Z (ripser
  defaults to Z/2Z; coefficients are a build-time option not exposed here).
- Very large datasets (>10k points) where the O(n^3) distance matrix is
  prohibitive — consider approximate methods or Ripser with sparse input (not
  exposed in this strict operation).

## Capabilities

| Operation | What it does | Output |
|---|---|---|
| `barcode` | Vietoris-Rips persistence barcode | dimension headers + (birth, death) intervals per dimension |

## Worked Example

Compute the persistence barcode of three equidistant points (all pairwise
distances = 2).

Input on stdin (lower-distance matrix):

```
2
2 2
```

`barcode` output (captured at maintainer build time — the barcode golden is NOT
hand-derived; the build pipeline gates determinism by asserting two runs produce
byte-identical output):

```
<captured at build>
```

The expected output will show dim 0 intervals (connected components merging at
distance 2) and dim 1 intervals (a 1-cycle born at distance 2 and dying at
infinity, or immediately, depending on the threshold).

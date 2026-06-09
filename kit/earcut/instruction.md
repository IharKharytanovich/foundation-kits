# earcut

earcut is a pure-Python port of the Mapbox Earcut JavaScript library for fast,
robust polygon triangulation. It converts a polygon (optionally with holes)
into a set of triangles using an ear-clipping algorithm that handles
degenerate cases, self-intersections, and holes. The input is a flat coordinate
array and an optional array of hole indices; the output is a flat array of
vertex indices forming triangles. earcut requires NumPy at runtime.

## When to Use

- Triangulating simple or complex 2D polygons, including polygons with holes,
  for rendering, mesh generation, or area computation
- Converting GeoJSON polygon geometries into triangle meshes for WebGL or
  other rasterisation pipelines
- Lightweight constrained triangulation where Delaunay quality is not required
  — earcut optimises for speed and robustness over triangle quality
- Building 2D computational geometry pipelines that need a fast triangulator
  with a minimal dependency footprint

## When NOT to Use

- Delaunay triangulation, Voronoi diagrams, or convex hulls (use **scipy** —
  `scipy.spatial.Delaunay`, `Voronoi`, `ConvexHull`)
- 3D mesh generation or tetrahedral meshing (use specialised meshing tools)
- Finite-element mesh generation with quality guarantees (use **skfem** for
  FEM assembly on pre-built meshes, or external mesh generators)
- General computational geometry operations like boolean polygon ops,
  buffering, or spatial predicates (use **geos** via the jswasm track)
- Symbolic geometry or coordinate-free geometric algebra (use **sympy**)

## Capabilities

| Area | Key API |
|---|---|
| Triangulate | `earcut(vertices, hole_indices=None, dim=2)` |
| Input format | Flat coordinate array `[x0,y0, x1,y1, ...]` |
| Holes | `hole_indices` = list of starting indices in the flat array |
| 3D projection | `dim=3` projects 3D vertices onto the best-fit 2D plane |
| Output | Flat list of triangle vertex indices `[i0,i1,i2, i3,i4,i5, ...]` |
| Deviation | `deviation(vertices, hole_indices, dim, triangles)` — quality metric |
| Flatten | `flatten(data)` — convert nested ring arrays to flat + holes format |

## Worked Example

Triangulate a unit square (4 vertices) into two triangles:

```python
from earcut.earcut import earcut

str(earcut([0,0, 1,0, 1,1, 0,1]))
# -> "[2, 3, 0, 0, 1, 2]"
```

The output `[2, 3, 0, 0, 1, 2]` represents two triangles: vertices (2, 3, 0)
and (0, 1, 2). For polygons with holes, pass the hole starting indices:

```python
from earcut.earcut import earcut

# Outer square with a triangular hole
outer = [0,0, 10,0, 10,10, 0,10]
hole = [2,2, 8,2, 5,8]
indices = earcut(outer + hole, [4])  # hole starts at index 4
```

Each group of three indices in the result forms one triangle. Use `deviation()`
to check triangulation quality — a value of 0.0 means the triangulated area
exactly matches the polygon area.

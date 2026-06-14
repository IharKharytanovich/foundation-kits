# trimesh

trimesh is a Python library for loading, creating, and manipulating triangular
meshes. It supports STL, PLY, OBJ, GLTF, and many other 3D formats. trimesh
computes mass properties (volume, center of mass, moments of inertia), tests
watertightness, generates convex hulls, and creates geometric primitives (boxes,
spheres, cylinders, extrusions). Only NumPy is required at runtime; optional
extras (scipy, networkx, shapely, rtree, lxml) are not available in this kit.

## When to Use

- Loading and inspecting triangle meshes from STL, PLY, OBJ, GLTF, OFF, or 3MF
  files
- Computing volume, surface area, center of mass, and moments of inertia for
  watertight meshes
- Generating geometric primitives (box, sphere, cylinder, capsule, extrusion)
- Testing whether a mesh is watertight, checking face normals, and repairing
  winding order
- Computing convex hulls and bounding boxes (OBB, AABB)
- Transforming meshes (translate, rotate, scale) and concatenating multiple meshes

## When NOT to Use

- Boolean operations on meshes — union, intersection, difference (use
  **manifold**)
- Mesh simplification, quantisation, or compression for transmission (use
  **meshoptimizer**)
- 2D polygon triangulation only (use **earcut**)
- Symbolic geometry or algebraic surface equations (use **sympy**)
- Molecular 3D structure (atoms, bonds, crystals) rather than triangle meshes
  (use **ase** or **rdkit**)

## Capabilities

| Area | Key API |
|---|---|
| Loading | `trimesh.load(file_obj, file_type=...)` — auto-detects format |
| Primitives | `trimesh.creation.box()`, `.sphere()`, `.cylinder()`, `.capsule()`, `.extrude_polygon()` |
| Mass props | `mesh.volume`, `mesh.area`, `mesh.center_mass`, `mesh.moment_inertia` |
| Watertight | `mesh.is_watertight`, `mesh.is_volume` |
| Convex hull | `mesh.convex_hull` |
| Bounds | `mesh.bounding_box`, `mesh.bounding_box_oriented`, `mesh.extents` |
| Transforms | `mesh.apply_transform(matrix)`, `mesh.apply_translation(v)` |
| Export | `mesh.export(file_type='stl')` — STL, PLY, OBJ, GLTF, OFF |
| Scene | `trimesh.Scene` — multi-mesh scenes with a scene graph |

## Worked Example

Create a unit box, then check its volume, watertightness, and face count:

```python
import trimesh
m = trimesh.creation.box(extents=[2,2,2])
str((float(round(m.volume,6)), m.is_watertight, len(m.faces)))
# → "(8.0, True, 12)"
```

# Manifold (manifold-3d)

Manifold is a robust, single-threaded Emscripten/WASM library for 3D triangle
mesh boolean operations (constructive solid geometry). It performs
union, difference, and intersection on watertight manifold meshes with
guaranteed topological correctness — no self-intersections, T-junctions, or
degenerate faces in the output.

## When to Use

- Computing boolean CSG operations on 3D meshes: union, difference, intersection
- Building solid geometry from primitives (cube, sphere, cylinder, tetrahedron)
- Extrusion and revolution of 2D cross-sections into 3D solids
- Computing volume and surface area of manifold meshes
- Convex hull computation on meshes or point sets
- Minkowski sum and difference of meshes
- SDF (signed distance function) level-set meshing

## When NOT to Use

- 2D polygon triangulation without 3D (use **earcut**)
- Mesh simplification or vertex-cache optimization (use **meshoptimizer**)
- Physics simulation with rigid bodies (use **rapier3d**)
- Linear algebra or matrix decomposition (use **eigen**)
- Symbolic geometry or algebra (use **sympy**)

## Scripting

This kit is scriptable — write free JS against the module handle. After calling
`handle.setup()`, the handle exposes `Manifold` with static constructors and
instance methods:

- `handle.setup()` — **must call** before first use (idempotent)
- `new Manifold.cube([x, y, z])` — axis-aligned box
- `new Manifold.sphere(r, segments)` — sphere
- `new Manifold.cylinder(h, rLow, rHigh, segments)` — cylinder/cone
- `a.add(b)` / `Manifold.union(...)` — CSG union
- `a.subtract(b)` / `Manifold.difference(...)` — CSG difference
- `a.intersect(b)` / `Manifold.intersection(...)` — CSG intersection
- `m.volume()` — volume of the manifold
- `m.surfaceArea()` — surface area
- `m.numVert()`, `m.numTri()` — mesh stats
- `m.translate(x,y,z)`, `m.rotate([x,y,z])`, `m.scale(s)` — transforms
- `m.getMesh()` — extract mesh data (vertices + triangles)
- Always return a **string** (wrap numbers in `String(...)`)

### Worked Example

Subtract a unit cube from a 2×2×2 cube and report the remaining volume:

```js
handle.setup();
const { Manifold } = handle;
const big = new Manifold.cube([2, 2, 2]);
const small = new Manifold.cube([1, 1, 1]);
return String(big.subtract(small).volume());
// => "7"
```

## Golden Capture

```bash
cd /tmp && mkdir -p manifold-capture && cd manifold-capture
npm init -y && npm install manifold-3d@3.5.1
node --input-type=module -e "
import Module from 'manifold-3d';
import { readFileSync } from 'node:fs';
const handle = await Module({locateFile: p => new URL(p, import.meta.url).pathname});
handle.setup();
const { Manifold } = handle;
console.log(String(new Manifold.cube([2,2,2]).subtract(new Manifold.cube([1,1,1])).volume()));
"
```

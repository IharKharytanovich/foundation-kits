# Meshoptimizer

Meshoptimizer is a single-threaded WASM library for mesh optimization. It
provides mesh simplification (polygon reduction), vertex cache and overdraw
optimization, vertex buffer compression, and mesh clusterization for GPU-driven
rendering. The library operates on indexed triangle meshes represented as
typed arrays.

## When to Use

- Reducing polygon count of a triangle mesh while preserving shape (mesh
  simplification / decimation)
- Optimizing index order for GPU vertex cache locality
- Compressing vertex and index buffers for storage or transmission (glTF meshopt
  codec)
- Encoding and decoding vertex/index buffers with meshopt compression
- Mesh clusterization (splitting meshes into clusters for nanite-style rendering)
- Computing mesh scale factor for error thresholds

## When NOT to Use

- 3D mesh boolean operations (union/difference/intersection) (use **manifold**)
- 2D polygon triangulation (use **earcut**)
- Physics simulation (use **rapier3d**)
- Linear algebra or matrix operations (use **eigen**)
- LP/MIP optimization (use **highs-js**)

## Scripting

This kit is scriptable — write free JS against the module handle. The handle
exports four modules, each with a `.ready` promise that must be awaited:

- `handle.MeshoptSimplifier` — mesh simplification
  - `.ready` — await before use
  - `.simplify(indices, positions, stride, targetCount, targetError)` →
    `[resultIndices, error]`
  - `.simplifySloppy(...)` — faster, lower quality simplification
  - `.getScale(positions, stride)` — mesh extent for error normalization
- `handle.MeshoptEncoder` — buffer compression
  - `.ready` — await before use
  - `.encodeVertexBuffer(buffer, count, stride)` → compressed Uint8Array
  - `.encodeIndexBuffer(indices, count, vertexCount)` → compressed Uint8Array
  - `.reorderMesh(indices, unique, vertexCount)` → `[reorderedIndices, count]`
- `handle.MeshoptDecoder` — buffer decompression
  - `.ready` — await before use
  - `.decodeVertexBuffer(count, stride, source)` → Uint8Array
  - `.decodeIndexBuffer(count, stride, source)` → Uint8Array
- `handle.MeshoptClusterizer` — mesh cluster generation
  - `.ready` — await before use
  - `.buildMeshlets(...)` — split mesh into GPU meshlets
- Always return a **string** (wrap numbers in `String(...)`)

### Worked Example

Simplify a 4×4 subdivided flat plane (18 triangles) down to its minimal form:

```js
await handle.MeshoptSimplifier.ready;
const p = new Float32Array([
  0,0,0,1,0,0,2,0,0,3,0,0,
  0,1,0,1,1,0,2,1,0,3,1,0,
  0,2,0,1,2,0,2,2,0,3,2,0,
  0,3,0,1,3,0,2,3,0,3,3,0
]);
const ix = [];
for (let y=0;y<3;y++) for (let x=0;x<3;x++) {
  const i=y*4+x; ix.push(i,i+1,i+5,i,i+5,i+4);
}
const [r] = handle.MeshoptSimplifier.simplify(
  new Uint32Array(ix), p, 3, 6, 0.1
);
return String(r.length/3);
// => "2"
```

## Golden Capture

```bash
cd /tmp && mkdir -p meshopt-capture && cd meshopt-capture
npm init -y && npm install meshoptimizer@1.1.1
node --input-type=module -e "
import { MeshoptSimplifier } from 'meshoptimizer/simplifier';
await MeshoptSimplifier.ready;
const p = new Float32Array([0,0,0,1,0,0,2,0,0,3,0,0,0,1,0,1,1,0,2,1,0,3,1,0,0,2,0,1,2,0,2,2,0,3,2,0,0,3,0,1,3,0,2,3,0,3,3,0]);
const ix = [];
for (let y=0;y<3;y++) for (let x=0;x<3;x++) { const i=y*4+x; ix.push(i,i+1,i+5,i,i+5,i+4); }
const [r] = MeshoptSimplifier.simplify(new Uint32Array(ix), p, 3, 6, 0.1);
console.log(String(r.length/3));
"
```

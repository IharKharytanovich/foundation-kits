# GEOS (geos-wasm)

GEOS-WASM is a WebAssembly port of the GEOS (Geometry Engine - Open Source)
library. It provides computational geometry operations — area, buffer, union,
intersection, spatial predicates — via the reentrant C API in a JavaScript
sandbox.

## When to Use

- Computing area, length, or distance of geometries
- Spatial predicates (contains, intersects, within, touches)
- Geometry operations (buffer, union, intersection, difference, convex hull)
- Reading/writing WKT and WKB geometry formats
- Topology validation and simplification
- Any 2D computational geometry on vector data

## When NOT to Use

- 3D physics simulation (use rapier2d or rapier3d)
- Symbolic geometry or equation solving (use sympy)
- Geodetic / coordinate-reference-system transforms (use geodesy)
- Raster / grid data processing
- Visualization or map rendering

## Scripting

This kit is scriptable — write free JS against the module handle. The handle
exposes the full GEOS reentrant C API via Emscripten bindings:

**Initialization:**
- `handle.GEOS_init_r()` → context pointer (required for all `_r` functions)
- `handle.GEOS_finish_r(ctx)` — release context (call when done)

**WKT I/O:**
- `handle.GEOSWKTReader_create_r(ctx)` → reader pointer
- `handle.GEOSWKTReader_read_r(ctx, reader, wktPtr)` → geometry pointer
- `handle.GEOSWKTWriter_create_r(ctx)` → writer pointer
- `handle.GEOSWKTWriter_write_r(ctx, writer, geomPtr)` → C-string pointer

**Geometry operations:**
- `handle.GEOSArea_r(ctx, geomPtr, areaPtr)` — write area to double pointer
- `handle.GEOSLength_r(ctx, geomPtr, lengthPtr)` — write length to double pointer
- `handle.GEOSBuffer_r(ctx, geomPtr, width, quadsegs)` → buffered geometry
- `handle.GEOSIntersection_r(ctx, g1, g2)` → intersection geometry
- `handle.GEOSUnion_r(ctx, g1, g2)` → union geometry
- `handle.GEOSContains_r(ctx, g1, g2)` → 1 if g1 contains g2
- `handle.GEOSIntersects_r(ctx, g1, g2)` → 1 if geometries intersect

**Memory management (Emscripten Module):**
- `handle.Module._malloc(bytes)` — allocate memory
- `handle.Module._free(ptr)` — free memory
- `handle.Module.stringToUTF8(str, ptr, maxBytes)` — write JS string to C memory
- `handle.Module.getValue(ptr, 'double')` — read a double from pointer
- `handle.GEOSGeom_destroy_r(ctx, geomPtr)` — free a geometry
- `handle.GEOSWKTReader_destroy_r(ctx, reader)` — free a WKT reader
- Always return a **string** (wrap numbers in `String(...)`)

### Worked Example

```js
const ctx = handle.GEOS_init_r();
const reader = handle.GEOSWKTReader_create_r(ctx);
const wkt = 'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))';
const wktPtr = handle.Module._malloc(wkt.length + 1);
handle.Module.stringToUTF8(wkt, wktPtr, wkt.length + 1);
const geom = handle.GEOSWKTReader_read_r(ctx, reader, wktPtr);
handle.Module._free(wktPtr);
const areaPtr = handle.Module._malloc(8);
handle.GEOSArea_r(ctx, geom, areaPtr);
const area = handle.Module.getValue(areaPtr, 'double');
handle.Module._free(areaPtr);
handle.GEOSGeom_destroy_r(ctx, geom);
handle.GEOSWKTReader_destroy_r(ctx, reader);
handle.GEOS_finish_r(ctx);
return String(area);
// => "1"
```

## Golden Capture

```bash
cd /tmp && mkdir -p geos-capture && cd geos-capture && npm init -y && npm install geos-wasm@3.1.1
node --input-type=module -e "
import initGeos from 'geos-wasm';
const handle = await initGeos();
const script = \`const ctx = handle.GEOS_init_r(); const reader = handle.GEOSWKTReader_create_r(ctx); const wkt = 'POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))'; const wktPtr = handle.Module._malloc(wkt.length + 1); handle.Module.stringToUTF8(wkt, wktPtr, wkt.length + 1); const geom = handle.GEOSWKTReader_read_r(ctx, reader, wktPtr); handle.Module._free(wktPtr); const areaPtr = handle.Module._malloc(8); handle.GEOSArea_r(ctx, geom, areaPtr); const area = handle.Module.getValue(areaPtr, 'double'); handle.Module._free(areaPtr); handle.GEOSGeom_destroy_r(ctx, geom); handle.GEOSWKTReader_destroy_r(ctx, reader); handle.GEOS_finish_r(ctx); return String(area);\`;
const fn = new Function('handle', 'return (async()=>{' + script + '})()');
console.log(await fn(handle));
"
```

# Geodesy

Geodesy-wasm is a geodetic coordinate transformation library built on the Rust
`geodesy` crate, compiled to WebAssembly via wasm-bindgen. It runs as a JS-WASM
callable library — you write free JS against the loaded module handle.

## When to Use

- Converting between geographic coordinate systems (lat/lon to UTM, etc.)
- Geodetic datum transformations
- Map projection conversions (e.g. degrees to UTM grid coordinates)
- Unit conversions for geospatial data

## When NOT to Use

- General-purpose math (use numpy, scipy)
- Full GIS operations or spatial analysis (use geos for geometry operations)
- Astronomical coordinate transforms (use astropy)

## Scripting

This kit supports free JS scripting against the module handle. The handle
exports the following:

- `handle.Geodesy(pipeline)` — constructor; takes a PROJ-style pipeline string
- `g.forward(coords)` — forward transformation on `[[x,y], …]` coordinate arrays
- `g.inverse(coords)` — inverse transformation
- `handle.createWasmCoordinates(coords)` — create coordinate objects for WASM
- `handle.unpackWasmCoordinates(wasmCoords)` — unpack WASM coordinates to arrays
- `handle.diffCoordinates(a, b)` — compute differences between coordinate sets
- `handle.validateCoordinates(coords)` — validate coordinate arrays

### Worked Example

```js
// Convert lon/lat (degrees) to UTM zone 32
const g = new handle.Geodesy('unitconvert xy_in=deg | utm zone=32');
const result = g.forward([[12, 55]]);
return result[0][0].toFixed(2) + ' ' + result[0][1].toFixed(2);
// => "691875.63 6098907.83"
```

## Golden capture

```bash
cd /tmp && mkdir -p golden && cd golden && npm init -y && npm install geodesy-wasm@0.7.0
node -e "
const handle = require('geodesy-wasm/node');
const g = new handle.Geodesy('unitconvert xy_in=deg | utm zone=32');
const o = g.forward([[12,55]]);
console.log(o[0][0].toFixed(2)+' '+o[0][1].toFixed(2));
"
# Expected output: 691875.63 6098907.83
```

# gemmi

gemmi is a macromolecular crystallography library. This kit vendors its official
single-threaded WebAssembly build (the `convert` tool from
[project-gemmi/wasm](https://github.com/project-gemmi/wasm)) as a JS-WASM callable
module: it converts macromolecular structure files between **mmCIF**, **PDB**, and
**MTZ**, parsing the unit cell, symmetry, and atom records along the way.

## When to Use

- Converting a structure between mmCIF ↔ PDB (`pdb2cif`, `cif2pdb`)
- Converting reflection data between mmCIF ↔ MTZ (`cif2mtz`, `mtz2cif`)
- Reading unit-cell parameters / symmetry out of a PDB or mmCIF file (parse, then
  read the emitted `_cell.*` fields)

## When NOT to Use

- Small-molecule chemistry or SMILES-based analysis (use rdkit)
- Crystal symmetry determination / primitive-cell search (use spglib)
- Protein sequence analysis (use biopython)
- Molecular mass from formulas (use molmass)

## Loading

This is a **non-MODULARIZE** Emscripten build (`convert.js` + `convert.wasm`):

- `moduleSystem: cjs` — in Node the entry sets `module.exports = Module`.
- `initStyle: default-init` — the module auto-runs on load; wait for
  `Module.onRuntimeInitialized` before calling exports (the runtime resolves the
  handle once that fires).
- `wasmSupply: locateFile` — `convert.wasm` is a separate artifact loaded from the
  same directory.
- Single-threaded (no pthreads / SharedArrayBuffer / worker).

## Capabilities

The loaded `handle` exposes gemmi's full C surface. Every conversion has the same
ABI: `_<fn>(ptr, len)` where `(ptr, len)` is the input written into WASM memory;
it returns a pointer to a result string of `_get_global_str_size()` bytes.

| Area | Key API | Direction |
|---|---|---|
| Structure → mmCIF | `handle._pdb2cif(ptr, len)` | PDB text → mmCIF text |
| Structure → PDB | `handle._cif2pdb(ptr, len)` | mmCIF text → PDB text |
| Reflections → mmCIF | `handle._mtz2cif(ptr, len)` | MTZ bytes → mmCIF (SF) text |
| Reflections → MTZ | `handle._cif2mtz(ptr, len)` | mmCIF (SF) text → MTZ bytes |
| Deposition prep | `handle._mxdepo(...)` | mmCIF preparation for deposition |
| Version | `handle._get_version()` | → pointer to gemmi version string |
| Result size | `handle._get_global_str_size()` | → byte length of the last result |
| Free result | `handle._clear_string()` | release the last result buffer |
| Write input | `handle._malloc(n)`, `handle.writeArrayToMemory(arr, ptr)` | stage input bytes |
| Read output | `handle.HEAP8`, `handle.UTF8ToString(ptr)`, `handle.getValue(ptr)` | read result bytes |

## Calling convention

1. Encode the input and copy it into WASM memory:
   `const buf = handle._malloc(arr.length); handle.writeArrayToMemory(arr, buf);`
2. Call the conversion: `const ret = handle._pdb2cif(buf, arr.length);`
3. Read `handle._get_global_str_size()` bytes from `handle.HEAP8.buffer` starting
   at `ret` (text results decode as UTF-8; MTZ output is raw bytes).
4. Call `handle._clear_string()` to free the result buffer.

A result whose first byte is `E` (`ERROR: …`) signals a parse failure — check it
with `handle.getValue(ret) === 69` (ASCII `'E'`) or by inspecting the prefix.

### Worked Example — read the unit cell of a PDB via pdb2cif

```js
const pdb = "CRYST1   10.000   20.000   30.000  90.00  90.00  90.00 P 1           1\n" +
            "ATOM      1  CA  ALA A   1       1.000   2.000   3.000  1.00 10.00           C\nEND\n";
const arr = new TextEncoder().encode(pdb);
const buf = handle._malloc(arr.length);
handle.writeArrayToMemory(arr, buf);
const ret = handle._pdb2cif(buf, arr.length);
const size = handle._get_global_str_size();
const cif = new TextDecoder().decode(new Uint8Array(handle.HEAP8.buffer, ret, size));
handle._clear_string();
return ["a", "b", "c"].map(x => (cif.match(new RegExp("_cell\\.length_" + x + " (\\d+)")) || [])[1]).join(",");
// => "10,20,30"
```

## Provenance

Vendored from [project-gemmi/wasm](https://github.com/project-gemmi/wasm) at commit
`075e2a01`, embedding gemmi `v0.6.7-115-g76f405ea`. Licensed MPL-2.0 (upstream is
dual MPL-2.0 OR LGPL-3.0; MPL-2.0 recorded). Integrity is anchored by the
`artifacts[].sha256` in `kit.json`, not by the source URL.

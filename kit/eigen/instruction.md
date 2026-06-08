# Eigen (eigen-js)

Eigen-JS is a WebAssembly port of the Eigen C++ linear algebra library. It
provides matrix and vector operations — decomposition, solving, determinants,
eigenvalues — in a JavaScript sandbox.

## When to Use

- Matrix creation and manipulation (dense matrices of any size)
- Determinant, inverse, and trace computation
- Eigenvalue and eigenvector decomposition
- Solving linear systems (Ax = b)
- Singular value decomposition (SVD)
- Matrix arithmetic (add, multiply, transpose, scale)

## When NOT to Use

- Arbitrary-precision arithmetic (use gmp)
- Symbolic matrix algebra (use sympy)
- Sparse matrices or large-scale numerical PDE solving (use scipy)
- Statistics or data analysis (use pandas, statsmodels)

## Scripting

This kit is scriptable — write free JS against the module handle. The handle
is the Eigen module with constructors and a GC helper:

- `new handle.Matrix(array2d)` — create a matrix from a 2D array
- `new handle.Vector(array1d)` — create a vector from a 1D array
- `m.det()` — determinant
- `m.inverse()` — matrix inverse
- `m.transpose()` — transpose
- `m.rows()` / `m.cols()` — dimensions
- `m.mul(other)` — matrix multiplication
- `m.solve(b)` — solve linear system Ax = b
- `handle.GC.flush()` — **must call** after operations to free WASM memory
- Always return a **string** (wrap numbers in `String(...)`)

### Worked Example

```js
const M = new handle.Matrix([[1,2],[3,4]]);
const d = M.det();
handle.GC.flush();
return String(d);
// => "-2"
```

## Golden Capture

```bash
cd /tmp && mkdir -p eigen-capture && cd eigen-capture && npm init -y && npm install eigen@0.2.2
node -e "
const handle = require('eigen');
(async () => {
  await handle.ready;
  const script = \`const M = new handle.Matrix([[1,2],[3,4]]); const d = M.det(); handle.GC.flush(); return String(d);\`;
  const fn = new Function('handle', 'return (async()=>{' + script + '})()');
  console.log(await fn(handle));
})();
"
```

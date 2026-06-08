# GMP (gmp-wasm)

GMP-WASM is a WebAssembly port of the GNU Multiple Precision Arithmetic Library
(GMP) and GNU MPFR. It provides arbitrary-precision integer, rational, and
floating-point arithmetic in a JavaScript sandbox.

## When to Use

- Arbitrary-precision integer arithmetic (big numbers beyond JS `Number` range)
- Arbitrary-precision floating-point calculations (configurable decimal places)
- Rational number arithmetic (exact fractions, no rounding)
- Primality testing and number-theory operations
- Any computation requiring more precision than IEEE 754 doubles

## When NOT to Use

- Standard 64-bit floating-point math (use numpy or plain JS)
- Symbolic algebra or equation solving (use sympy)
- Linear algebra / matrix operations (use numpy, scipy, or eigen)
- Statistical analysis (use scipy or statsmodels)

## Scripting

This kit is scriptable — write free JS against the module handle. The handle
exposes a `calculate` method that provides a GMP context with factory functions:

- `handle.calculate(g => { ... })` — run a computation with the GMP context `g`
- `g.Float(value)` — create an arbitrary-precision float
- `g.Integer(value)` — create an arbitrary-precision integer
- `g.Rational(num, den)` — create a rational number
- Float operations: `.add()`, `.sub()`, `.mul()`, `.div()`, `.sqrt()`, `.pow()`, `.toFixed(n)`
- Integer operations: `.add()`, `.sub()`, `.mul()`, `.div()`, `.mod()`, `.pow()`, `.isPrime()`, `.gcd()`
- Always return a **string** (use `.toFixed(n)` or `.toString()`)

### Worked Example

```js
return handle.calculate(g => g.Float(22).div(7).toFixed(10));
// => "3.1428571429"
```

## Golden Capture

```bash
cd /tmp && mkdir -p gmp-capture && cd gmp-capture && npm init -y && npm install gmp-wasm@1.3.2
node -e "
const f = require('gmp-wasm');
(async () => {
  const handle = await f.init();
  const script = \`return handle.calculate(g => g.Float(22).div(7).toFixed(10));\`;
  const fn = new Function('handle', 'return (async()=>{' + script + '})()');
  console.log(await fn(handle));
})();
"
```

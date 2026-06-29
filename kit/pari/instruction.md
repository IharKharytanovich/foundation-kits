# PARI/GP

PARI/GP is a heavyweight number-theory computer algebra system providing
fast integer factorization, primality testing, elliptic-curve arithmetic,
modular forms, class groups, Galois theory, and arbitrary-precision computation.
It is the engine behind many large-scale number-theoretic computations and
is widely used in algebraic number theory research.

This kit wraps the Emscripten WASM build of PARI 2.13.2 via
`@sagemath/pari@1.0.5`. The handle is the loaded Emscripten module; scripts
must call `ccall`/`cwrap` to initialize the GP interpreter, then pass GP
expression strings to the embedded evaluator.

## When to Use

- Integer factorization of large numbers (`factor(n)`)
- Primality testing and next-prime queries (`isprime`, `nextprime`)
- Elliptic curve arithmetic — constructing curves over Q or finite fields,
  counting points, computing L-functions (`ellinit`, `ellap`, `ellcard`)
- Modular forms — computing Fourier expansions, Hecke operators, newforms
  (`mfinit`, `mfcoefs`, `mfeigenbasis`)
- Algebraic number theory — number field arithmetic, class groups, unit groups,
  ideal decomposition (`nfinit`, `bnfinit`, `idealprimedec`)
- Galois theory — computing Galois groups, resolvents (`galoisinit`,
  `galoispermtopol`)
- Arbitrary-precision computation (set precision with `\p N`)
- Continued fractions, Bernoulli/Euler numbers, zeta values, L-functions
- Polynomial arithmetic over Z, Q, Fp (`Mod`, `factormod`, `polroots`)

## When NOT to Use

- Arbitrary-precision ball arithmetic (interval/rigorous error bounds) — use
  **flint** (Arb)
- SMT solving or satisfiability — use **z3**
- Big-integer arithmetic only (no number theory) — use **gmp**
- Lattice reduction (LLL) only — use **olll**
- Symbolic algebra for calculus/physics (integration, differentiation, ODEs) —
  use **sympy**
- General numerical linear algebra — use **numpy** / **scipy**

## Capabilities

| Feature | GP expression |
|---|---|
| Factorization | `factor(n)` |
| Next prime | `nextprime(n)` |
| Primality test | `isprime(n)` |
| Elliptic curve init | `ellinit([a1,a2,a3,a4,a6])` |
| Points on E/Fp | `ellcard(E)`, `ellap(E, p)` |
| Modular forms | `mfinit([N,k])`, `mfcoefs(f, n)` |
| Number field init | `nfinit(pol)` |
| Class group | `bnfinit(pol)` |
| Galois group | `galoisinit(pol)` |
| Set precision | `\p N` (N digits) |
| Continued fractions | `contfrac(x)` |
| Polynomial factoring | `factor(Mod(1,p)*pol)`, `factormod(pol, p)` |

All GP expressions are evaluated as strings; results are returned as strings
with a `%N = ...` history prefix.

## Scripting

This kit is scriptable — write free JS against the Emscripten module handle.

Before evaluating GP expressions, the embedded interpreter must be initialized:

```js
handle.ccall('gp_embedded_init', null, ['number', 'number'], [536608768, 536608768]);
const gp = handle.cwrap('gp_embedded', 'string', ['string']);
```

Then call `gp(expr)` with any GP expression string. The result is always a
string. Always return a **string** from the script.

### Worked Example

Find the next prime after one billion:

```js
handle.ccall('gp_embedded_init', null, ['number', 'number'], [536608768, 536608768]);
const gp = handle.cwrap('gp_embedded', 'string', ['string']);
return gp('nextprime(10^9)');
// => "%1 = 1000000007\n"
```

Factorize 91:

```js
handle.ccall('gp_embedded_init', null, ['number', 'number'], [536608768, 536608768]);
const gp = handle.cwrap('gp_embedded', 'string', ['string']);
return gp('factor(91)');
// => "%1 = [7, 1; 13, 1]\n"   (matrix: 91 = 7^1 * 13^1)
```

Elliptic curve point count over F_101:

```js
handle.ccall('gp_embedded_init', null, ['number', 'number'], [536608768, 536608768]);
const gp = handle.cwrap('gp_embedded', 'string', ['string']);
const E = gp('E = ellinit(Mod(1,101)*[0,0,0,1,0])');
return gp('ellcard(E)');
// number of points on y^2 = x^3 + x over F_101
```

## Golden Capture

```bash
cd /tmp && mkdir -p pari-capture && cd pari-capture
npm install @sagemath/pari@1.0.5
node --no-experimental-fetch -e "
const path = require('path');
const gpStaFactory = require(path.resolve('node_modules/@sagemath/pari/dist/gp-sta.js'));
(async () => {
  const handle = await gpStaFactory({ noInitialRun: true });
  handle.ccall('gp_embedded_init', null, ['number', 'number'], [536608768, 536608768]);
  const gp = handle.cwrap('gp_embedded', 'string', ['string']);
  console.log(JSON.stringify(gp('nextprime(10^9)')));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
"
# => "%1 = 1000000007\n"
```

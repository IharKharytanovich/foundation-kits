# z3

Z3 is a high-performance SMT (Satisfiability Modulo Theories) solver from
Microsoft Research. It decides satisfiability of logical formulas over integers,
reals, bit-vectors, arrays, strings, uninterpreted functions, and quantifiers,
and can **optimize** objectives subject to constraints. It runs as a
single-threaded WASI binary (`z3 -smt2 -in`); you select an operation and supply
an SMT-LIB2 script on the `script` parameter — the runtime handles invocation.

## When to Use

- Deciding satisfiability of logical/arithmetic constraints (`sat`/`unsat`)
- Extracting a concrete **model** (satisfying assignment) or evaluating terms
- **Proving theorems** — assert the negation, expect `unsat`
- **Optimization modulo theories** — maximize/minimize an objective under
  logical constraints (small, exact, integer/real/bit-vector domains)
- Reasoning over **bit-vectors** (machine arithmetic, bitwise ops), **exact
  reals/rationals**, arrays, strings, uninterpreted functions, quantifiers
- Encoding puzzles, scheduling, planning, and program-verification conditions

## When NOT to Use

- **Large-scale linear / mixed-integer programming** (big LP/MIP with a numeric
  objective over thousands of continuous variables) — use `highs-js`. Z3's
  optimizer is exact and SMT-level; it is not a high-throughput LP solver.
- **Symbolic algebra, calculus, equation solving** — use `sympy`. Z3 reasons
  over logical assertions, not algebraic manipulation.
- **Floating-point numerics or matrix math** — use `numpy` / `scipy`. (This
  build also has no hardware-float rounding-mode control; the FloatingPoint
  theory falls back to software semantics.)

## Operations

| Operation | Summary |
|---|---|
| `solve` | Decide satisfiability — `sat` / `unsat` / `unknown` |
| `model` | Solve and return a satisfying assignment via `(get-model)` |
| `eval` | Evaluate terms in the model via `(get-value (...))` |
| `optimize` | Maximize/minimize an objective via `(maximize)`/`(minimize)` |
| `prove` | Prove a theorem by asserting its negation and checking `unsat` |
| `bitvector` | Solve over fixed-width bit-vectors (`(_ BitVec N)`) |
| `unsat-core` | Return the minimal conflicting subset of named assertions |
| `real` | Exact real (rational) arithmetic — read fractional values |

Supply your SMT-LIB2 script as the `script` parameter. It is piped to
`z3 -smt2 -in` on stdin; the verdict (`sat`/`unsat`/`unknown`) and any
`(get-model)` / `(get-value)` / `(get-objectives)` / `(get-unsat-core)` output go
to stdout. Do not pass raw command-line flags — the runtime maps the operation
to the correct invocation.

## Worked Examples

Each example is the operation's golden — copy the `script`, expect the `Output`.

### `solve` — basic satisfiability
```smt2
(declare-const x Int)
(assert (and (> x 2) (< x 5)))
(check-sat)
```
Output: `sat`

### `model` — a satisfying assignment
```smt2
(declare-const x Int)
(declare-const y Int)
(assert (= (+ x y) 10))
(assert (= (- x y) 4))
(check-sat)
(get-model)
```
Output:
```
sat
(
  (define-fun y () Int
    3)
  (define-fun x () Int
    7)
)
```

### `eval` — evaluate a term
```smt2
(declare-const a Int)
(declare-const b Int)
(assert (= a 6))
(assert (= b 7))
(check-sat)
(get-value ((* a b)))
```
Output: `sat` then `(((* a b) 42))`

### `optimize` — maximize under constraints
```smt2
(declare-const x Int)
(assert (>= x 0))
(assert (<= x 5))
(maximize x)
(check-sat)
(get-objectives)
```
Output:
```
sat
(objectives
 (x 5)
)
```

### `prove` — prove x>0 ∧ y>0 ⟹ x+y>0
Assert the negation; `unsat` means the theorem holds.
```smt2
(declare-const x Int)
(declare-const y Int)
(assert (> x 0))
(assert (> y 0))
(assert (<= (+ x y) 0))
(check-sat)
```
Output: `unsat`

### `bitvector` — solve over 8-bit machine words
```smt2
(declare-const x (_ BitVec 8))
(assert (= (bvand x #x0f) #x05))
(assert (= (bvand x #xf0) #x30))
(check-sat)
(get-value (x))
```
Output: `sat` then `((x #x35))`

### `unsat-core` — which assertions conflict
```smt2
(set-option :produce-unsat-cores true)
(declare-const x Int)
(assert (! (> x 10) :named c1))
(assert (! (< x 5) :named c2))
(check-sat)
(get-unsat-core)
```
Output: `unsat` then `(c1 c2)`

### `real` — exact rational arithmetic
```smt2
(declare-const x Real)
(assert (= (* 3 x) 1))
(check-sat)
(get-value (x))
```
Output: `sat` then `((x (/ 1.0 3.0)))` (exact ⅓, not a float)

## SMT-LIB2 Quick Reference

```smt2
; Sorts: Int, Real, Bool, (_ BitVec N), (Array Int Int), String
(declare-const x Int)
(declare-fun f (Int) Int)            ; uninterpreted function

; Constraints
(assert (> x 0))
(assert (= (f x) 10))
(assert (forall ((y Int)) (=> (> y 0) (> (f y) 0))))   ; quantifiers

; Arrays
(declare-const a (Array Int Int))
(assert (= (select (store a 0 7) 0) 7))

; Strings
(declare-const s String)
(assert (= (str.++ s "!") "hi!"))

; Decide, then inspect
(check-sat)        ; sat | unsat | unknown
(get-model)        ; full assignment
(get-value (x))    ; specific terms
(get-objectives)   ; after (maximize)/(minimize)
(get-unsat-core)   ; needs (set-option :produce-unsat-cores true) + :named
```

Notes:
- `unknown` can occur for hard nonlinear or quantified problems (the solver
  cannot decide within its strategy) — it is not an error.
- This is a **single-threaded** build (no parallel tactics, no
  SharedArrayBuffer). Wasm32 caps process memory at 4 GB; very large bit-vector
  or quantifier-heavy problems may exceed it.

## Build Note

This kit is built by `build/z3/` (CMake + wasi-sdk 33 cross-compile,
single-threaded, C++ WASM exceptions, `wasm-opt -Oz`). `z3.wasm` is verified by
a `wasmtime` smoke test over all eight operation goldens. See
`build/z3/README.md` for the build + publish procedure.

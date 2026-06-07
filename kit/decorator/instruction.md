# decorator

The `decorator` module simplifies writing Python decorators that **preserve the
original function's signature**. In plain Python, wrapping a function with a
decorator loses its argument names, defaults, and annotations — breaking
introspection tools like `help()`, `inspect.signature()`, and IDE tooltips. The
`decorator` library solves this by generating a wrapper whose signature exactly
matches the original, while still executing the decorator logic.

## When to Use

- Writing decorators that must preserve the decorated function's full signature
  (argument names, defaults, annotations, docstring)
- Adding cross-cutting concerns (logging, timing, retry, caching, validation) to
  functions without disrupting their introspection or documentation
- Wrapping library functions with additional behavior while keeping their public
  API intact
- Building decorator factories that accept parameters and still produce
  signature-preserving wrappers

## When NOT to Use

- Simple decorators where signature preservation is unnecessary — a plain
  `functools.wraps` wrapper is sufficient if callers never inspect arguments
- Class-based decorators or descriptors — the `decorator` module targets
  function-level decoration
- Metaclass or class-construction hooks — out of scope
- Performance-critical inner loops — the generated wrapper adds a small overhead
  per call

## Capabilities

| Area | Key API |
|---|---|
| Basic decorator | `@decorator` — decorate a "caller" function `(f, *args, **kw)` → result |
| Manual wrapping | `decorator.decorate(func, caller)` — programmatic decoration |
| `decorator` function | `decorator.decorator(caller)` — turn a caller into a decorator |
| Contextmanager | `decorator.contextmanager` — signature-preserving context managers |
| FunctionMaker | `decorator.FunctionMaker` — low-level signature generation |
| Dispatch | `decorator.dispatch_on(argname)` — single-dispatch by argument name |

**How it works:**

The core pattern is a "caller" — a function with signature `(func, *args, **kw)`.
You decorate the caller with `@decorator`, and it becomes a decorator that
preserves the target function's signature:

```python
from decorator import decorator

@decorator
def log_call(func, *args, **kw):
    print(f"calling {func.__name__}")
    return func(*args, **kw)

@log_call
def add(a, b):
    return a + b
# inspect.signature(add) still shows (a, b)
```

**Notes:**

- networkx depends on decorator internally; if networkx is loaded, decorator is
  already available.
- The decorator module is a single-file, zero-dependency package — lightweight
  and well-suited as a shared utility.

## Worked Example

Verify that `decorator` is a callable (it serves as both a module and a
decorator function):

```python
from decorator import decorator
str(callable(decorator))
# → "True"
```

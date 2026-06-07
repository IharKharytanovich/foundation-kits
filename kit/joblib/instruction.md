# joblib

joblib is a lightweight Python library for pipelining, caching, and parallelism.
Its primary strengths are fast, deterministic hashing of arbitrary Python objects,
transparent disk-caching of expensive function results, and a simple API for
embarrassingly parallel loops. In the Pyodide sandbox, parallelism is
single-threaded, so the most useful features are `hash()` for fingerprinting
objects and `Memory` for memoizing computations.

## When to Use

- Computing a deterministic hash (MD5) of any picklable Python object — lists,
  dicts, numpy arrays, nested structures — for cache keys, deduplication, or
  change detection
- Memoizing expensive pure functions to disk so repeated calls with the same
  arguments return instantly
- Serializing numpy arrays efficiently with `joblib.dump` / `joblib.load`
  (faster than pickle for large arrays)
- Running embarrassingly parallel loops with `Parallel(n_jobs=…)(delayed(f)(x)
  for x in items)` (single-threaded in the sandbox but the API still works)

## When NOT to Use

- Serializing lambdas, closures, or dynamically defined classes — use **dill**
  instead; joblib relies on standard pickle, which cannot handle those
- Distributed or GPU parallelism — joblib is process/thread-level only
- Cryptographic hashing (SHA-256, etc.) — `joblib.hash` uses MD5, which is fast
  but not cryptographically secure
- Complex workflow orchestration or DAG scheduling — use dedicated tools

## Capabilities

| Area | Key API |
|---|---|
| Object hashing | `joblib.hash(obj, hash_name='md5')` — deterministic MD5 hex string |
| Disk caching | `joblib.Memory(location, verbose=0)` — decorator-based memoization |
| Cached function | `@memory.cache` — auto-caches function results by argument hash |
| Serialization | `joblib.dump(obj, filename)` / `joblib.load(filename)` — optimized for numpy |
| Parallel loops | `joblib.Parallel(n_jobs=2)(joblib.delayed(fn)(x) for x in data)` |
| Hashing options | `hash_name='md5'` (default) or `'sha1'` — selectable digest |

**Notes:**

- `joblib.hash` hashes via pickle protocol 2, then applies MD5. The output is a
  32-character lowercase hex string, deterministic for identical inputs within
  the same Python version.
- scikit-learn depends on joblib internally for model caching and parallel
  cross-validation; if scikit-learn is loaded, joblib is already available.

## Worked Example

Compute a deterministic hash of a Python list:

```python
import joblib
joblib.hash([1, 2, 3])
# → "ac03ee32f9d9f64d2504cbd93e913739"
```

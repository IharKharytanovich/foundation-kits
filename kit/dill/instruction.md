# dill

dill extends Python's standard `pickle` module to serialize almost any Python
object — including lambdas, closures, nested functions, generators, and
interactively defined classes. Where `pickle` raises `PicklingError` on
non-standard callables, dill handles them transparently, making it the go-to
serializer for saving complex runtime state, transferring functions between
contexts, or deep-copying objects that resist normal pickling.

## When to Use

- Serializing and deserializing lambdas, closures, or functions defined at
  runtime (objects that `pickle` cannot handle)
- Saving an entire interactive session's state (variables, functions, classes)
  for later restoration
- Deep-copying complex objects that contain unpicklable references
- Testing whether an arbitrary object is serializable with `dill.pickles(obj)`
  before sending it over the wire or to disk
- Serializing decorated or wrapped functions whose internals reference outer
  scopes

## When NOT to Use

- Simple data structures (lists, dicts, dataclasses) that standard `pickle`
  handles — prefer `pickle` for better performance and compatibility
- Large numpy arrays — use `numpy.save`/`numpy.load` or `joblib.dump` for
  optimized array serialization
- Human-readable serialization — use **pyyaml** or `json` for text formats
- Cryptographic or integrity-sensitive serialization — dill does not sign or
  verify payloads
- Cross-language interop — dill is Python-only; use JSON, Protocol Buffers, or
  similar for polyglot formats

## Capabilities

| Area | Key API |
|---|---|
| Serialize to bytes | `dill.dumps(obj)` → `bytes` |
| Deserialize | `dill.loads(data)` → original object |
| Serialize to file | `dill.dump(obj, file)` / `dill.load(file)` |
| Deep copy | `dill.copy(obj)` — serialize-deserialize round-trip copy |
| Serializability test | `dill.pickles(obj)` → `True`/`False` |
| Session save/load | `dill.dump_session()` / `dill.load_session()` |
| Protocol control | `dill.dumps(obj, protocol=N)` — pickle protocol selection |
| Source extraction | `dill.source.getsource(obj)` — inspect source of callables |

**Notes:**

- dill is a drop-in replacement for pickle: `import dill as pickle` works for
  most code paths.
- The serialized format is Python-version-sensitive — objects pickled on one
  Python minor version may not unpickle on another.
- dill serializes by value, not by reference — the recipient does not need the
  original module installed.

## Worked Example

Round-trip serialize a Python list through dill:

```python
import dill
str(dill.loads(dill.dumps([1, 2, 3])))
# → "[1, 2, 3]"
```

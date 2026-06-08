# six

six is a Python 2/3 compatibility utility library. It provides simple functions
and constants for smoothing over the differences between Python 2 and Python 3,
allowing code to run on both versions with minimal changes. The Python import
name is `six`. It has no runtime dependencies. In a Python 3-only environment,
six still provides useful type-checking helpers and string/byte utilities.

## When to Use

- Checking the Python version at runtime (`six.PY3`, `six.PY2`) when writing
  code that must adapt to the interpreter version
- Using `six.moves` to import renamed standard-library modules with a single
  import path (e.g. `six.moves.urllib`, `six.moves.range`)
- Type-checking for string and integer types across Python versions
  (`six.string_types`, `six.integer_types`, `six.text_type`)
- Wrapping metaclass usage (`six.with_metaclass`, `six.add_metaclass`) for
  code that must work on both Python 2 and 3
- Byte/text conversion utilities (`six.ensure_str`, `six.ensure_text`,
  `six.ensure_binary`)

## When NOT to Use

- General-purpose data manipulation or analysis (use **pandas**)
- Numerical array computation (use **numpy**)
- Serialisation of complex Python objects (use **dill** — six handles
  string/byte coercion, not object serialisation)
- Package metadata, version parsing, or build system utilities (use
  **setuptools** or **packaging**)

## Capabilities

| Area | Key API |
|---|---|
| Version constants | `six.PY2`, `six.PY3` |
| Type constants | `six.string_types`, `six.integer_types`, `six.text_type`, `six.binary_type` |
| Moved modules | `six.moves.urllib`, `six.moves.range`, `six.moves.zip` |
| String helpers | `six.ensure_str()`, `six.ensure_text()`, `six.ensure_binary()` |
| Metaclass | `six.with_metaclass()`, `six.add_metaclass()` |
| Functional | `six.iteritems()`, `six.iterkeys()`, `six.itervalues()` |

## Worked Example

Check whether the runtime is Python 3:

```python
import six

str(six.PY3)
# → "True"
```

In a Python 3 environment `six.PY3` is always `True`. Use `six.ensure_str(b)`
to decode bytes to `str`, and `six.moves` to import standard-library modules
whose names changed between Python 2 and 3 (e.g.
`from six.moves.urllib.request import urlopen`).

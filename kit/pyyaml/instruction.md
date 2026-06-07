# PyYAML

PyYAML is a full-featured YAML parser and emitter for Python, supporting the
YAML 1.1 specification. It converts between YAML text and native Python objects
(dicts, lists, strings, numbers, booleans, `None`). The Python import name is
**`yaml`**, not `pyyaml`.

## When to Use

- Parsing YAML configuration strings or documents into Python dicts/lists
- Emitting Python data structures as human-readable YAML text
- Processing multi-document YAML streams (`---`-separated)
- Reading scientific or bioinformatics configuration files that use YAML format
- Converting between YAML and Python when JSON is too restrictive (comments,
  anchors, multi-line strings)

## When NOT to Use

- JSON processing — use Python's built-in `json` module; it is faster and
  supports the same data types for JSON input
- Binary serialization of Python objects — use `pickle` or **dill**
- XML processing — use `xml.etree.ElementTree` from the stdlib
- TOML configuration files — use `tomllib` (Python ≥ 3.11)
- Complex object serialization with custom classes — avoid `yaml.load()` with
  `Loader=FullLoader` or `UnsafeLoader` in the sandbox; always prefer `safe_load`

## Capabilities

| Area | Key API |
|---|---|
| Parse one doc | `yaml.safe_load(string_or_stream)` → Python object |
| Parse all docs | `yaml.safe_load_all(stream)` → iterator of Python objects |
| Emit one doc | `yaml.safe_dump(data)` → YAML string |
| Emit all docs | `yaml.safe_dump_all([doc1, doc2])` → multi-document YAML |
| File I/O | `yaml.safe_load(open('f.yaml'))` / `yaml.safe_dump(data, open(…,'w'))` |
| Type mapping | `null`→`None`, `true/false`→`bool`, numbers→`int`/`float`, sequences→`list`, mappings→`dict` |

**Important safety guidance:**

- **Always use `safe_load` / `safe_dump`** — never `yaml.load()` without an
  explicit safe `Loader`. The unsafe variants can execute arbitrary Python code
  embedded in YAML tags, which is a security risk even in a sandbox.
- YAML 1.1 treats bare `yes`, `no`, `on`, `off` as booleans. Quote these values
  if you intend them as strings: `key: "yes"`.
- Anchors (`&`) and aliases (`*`) are supported for repeated sub-trees but can
  cause exponential expansion with deeply nested aliases — keep documents simple.

## Worked Example

Parse a simple YAML mapping and extract a value:

```python
import yaml
str(yaml.safe_load('a: 1')['a'])
# → "1"
```

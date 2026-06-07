# setuptools

setuptools is Python's established build system and packaging toolkit. In the
Pyodide sandbox, its build-system role is irrelevant (there is no compiler or
`pip install`), but setuptools remains important because it ships
**`pkg_resources`** — the runtime API that many packages use to discover installed
distributions, access bundled data files, and resolve entry points. Several
packages in the kit ecosystem (notably networkx) declare setuptools as a
dependency for this reason.

## When to Use

- Querying metadata of installed packages at runtime: version, author, license,
  entry points (`pkg_resources.get_distribution('numpy').version`)
- Accessing non-code resource files bundled inside installed packages via
  `pkg_resources.resource_string()` or `resource_filename()`
- Iterating over entry-point groups (`pkg_resources.iter_entry_points('console_scripts')`)
- Checking whether a specific package is installed and at what version
- Comparing installed versions against requirement specifiers
  (`pkg_resources.require('numpy>=1.20')`)

## When NOT to Use

- Building or distributing Python packages — the sandbox has no compiler or
  upload path; build-time setuptools functionality is unavailable
- Installing packages — there is no `pip` in the sandbox; packages are
  pre-vendored as kits
- Version comparison logic — use **packaging** (`packaging.version.Version`)
  for PEP 440-correct comparisons; `pkg_resources` version parsing is legacy
- Reading YAML or JSON config — use **pyyaml** or the `json` stdlib

## Capabilities

| Area | Key API |
|---|---|
| Distribution lookup | `pkg_resources.get_distribution('numpy')` → `Distribution` |
| Version query | `dist.version` → `'2.2.5'` |
| Resource access | `pkg_resources.resource_string('pkg', 'data/file.csv')` |
| Resource path | `pkg_resources.resource_filename('pkg', 'data/file.csv')` |
| Entry points | `pkg_resources.iter_entry_points('group_name')` |
| Requirement check | `pkg_resources.require('numpy>=1.20')` — raises if unmet |
| Working set | `pkg_resources.working_set` — all installed distributions |
| Version class | `pkg_resources.parse_version('1.2.3')` — comparable version (legacy) |

**Notes:**

- `pkg_resources` is the legacy resource API. Modern Python code should prefer
  `importlib.metadata` (Python ≥ 3.8) and `importlib.resources` (Python ≥ 3.9)
  when available. In Pyodide, both approaches work; `pkg_resources` is provided
  primarily for compatibility with packages that already depend on it.
- setuptools includes vendored copies of several sub-packages (jaraco, packaging,
  etc.) — these are internal and should not be imported directly.
- The kit's version tracks the vendored wheel (`76.0.0`), not the latest
  upstream release.

## Worked Example

Retrieve the installed setuptools version:

```python
import setuptools
setuptools.__version__
# → "76.0.0"
```

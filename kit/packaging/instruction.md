# packaging

packaging provides the core Python packaging utilities defined by PEP 440
(version identifiers), PEP 508 (dependency specifiers), and PEP 425 (platform
tags). It is the reference implementation used by pip, setuptools, and the wider
ecosystem for parsing and comparing version strings, evaluating requirement
specifiers, and inspecting wheel tags.

## When to Use

- Comparing Python version strings according to PEP 440 rules (pre-releases,
  post-releases, dev versions, epochs)
- Evaluating whether a version satisfies a specifier set (e.g. `>=1.4,<2.0`)
- Parsing PEP 508 requirement strings (name, extras, version constraints, markers)
- Inspecting or filtering wheel/sdist tags for platform compatibility
- Normalizing version strings for reliable sorting or de-duplication

## When NOT to Use

- Installing or downloading packages — this is not pip; it only parses metadata
- Building or distributing Python packages — use **setuptools** for that
- General-purpose string comparison or sorting — use Python builtins
- Semantic versioning (semver) — PEP 440 is Python-specific and differs from
  semver in epoch, post-release, and pre-release ordering

## Capabilities

| Area | Key API |
|---|---|
| Version parsing | `packaging.version.Version('1.2.3')` — comparable, hashable version |
| Version comparison | `Version('2.0') > Version('1.0')` — full PEP 440 ordering |
| Specifier sets | `packaging.specifiers.SpecifierSet('>=1.0,<2.0')` — containment check |
| Specifier match | `Version('1.5') in SpecifierSet('>=1.0,<2.0')` → `True` |
| Requirements | `packaging.requirements.Requirement('numpy>=1.20')` — name, extras, specifier, marker |
| Markers | `packaging.markers.Marker('python_version>="3.8"')` — environment markers |
| Tags | `packaging.tags.sys_tags()` — platform compatibility tags |
| Normalization | `packaging.utils.canonicalize_name('Scikit-Learn')` → `scikit-learn` |

**Notes:**

- `Version` rejects non-PEP-440 strings (e.g. `'1.0-beta'`); use
  `packaging.version.parse()` if you need to handle legacy versions gracefully.
- Specifier containment ignores pre-releases by default; pass
  `prereleases=True` to include them.

## Worked Example

Compare two PEP 440 version strings:

```python
from packaging.version import Version as V
str(V('2.0') > V('1.0'))
# → "True"
```

# pint

pint is a Python library for defining, operating on, and converting between
physical quantities with units. It supports over 300 units out of the box,
handles unit conversions automatically, and raises errors on dimensionally
inconsistent operations. The Python import name is `pint`. It bundles its own
dependencies (flexcache, flexparser, platformdirs, typing_extensions) and
requires no shared kits. Create a `UnitRegistry` once, then build quantities
from it.

## When to Use

- Converting between physical units (e.g. kilometres to metres, Celsius to
  Kelvin, eV to joules)
- Building dimensionally-aware calculations that catch unit mismatches at
  runtime (e.g. adding metres to seconds raises `DimensionalityError`)
- Defining custom units or unit systems for domain-specific work
- Formatting quantities with proper unit symbols for display or reporting
- Wrapping NumPy arrays with units for vectorised unit-aware computation

## When NOT to Use

- Astronomical unit conversions, coordinate frames, or cosmology (use
  **astropy** — `astropy.units` is tightly integrated with its coordinate and
  cosmology systems)
- Numerical array math without units (use **numpy** — pint adds overhead when
  units are unnecessary)
- Symbolic algebra or calculus with unit symbols (use **sympy** — pint is
  numeric, not symbolic)
- Uncertainty propagation on measurements (use **uncertainties** — pint handles
  units, uncertainties handles error bars; they can be combined)
- Statistical modelling or curve fitting (use **scipy**)

## Capabilities

| Area | Key API |
|---|---|
| Registry | `pint.UnitRegistry()` — create the default unit registry |
| Quantity creation | `ureg('1 km')`, `ureg.Quantity(1, 'km')`, `1 * ureg.km` |
| Conversion | `q.to('m')`, `q.ito('m')` (in-place), `q.to_base_units()` |
| Magnitude / units | `q.magnitude` (`.m`), `q.units` (`.u`) |
| Dimensionality | `q.dimensionality`, `q.check('[length]')` |
| NumPy interop | `ureg.Quantity(np.array([1,2,3]), 'km')` — vectorised |
| Custom units | `ureg.define('smoot = 1.7018 * meter')` |
| Formatting | `f'{q:~P}'` — compact pretty format; `f'{q:.2f}'` |

## Worked Example

Convert 1 kilometre to metres and extract the numeric magnitude:

```python
import pint

str(pint.UnitRegistry()('1 km').to('m').magnitude)
# → "1000.0"
```

For repeated use, store the registry: `ureg = pint.UnitRegistry()`, then build
quantities with `ureg('9.8 m/s**2')` or `9.8 * ureg.m / ureg.s**2`. Pint
raises `DimensionalityError` if you try to add incompatible units
(e.g. metres + seconds), catching physics errors early.

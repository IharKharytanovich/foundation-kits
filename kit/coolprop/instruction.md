# CoolProp

CoolProp is a reference-grade thermophysical property library providing
multiparameter equations of state (EOS) for 122+ pure fluids and humid-air
properties. It implements the same reference-quality formulations used by NIST
REFPROP, delivering density, enthalpy, entropy, viscosity, conductivity, and
more — all from built-in tables with no network access required.

## When to Use

- Computing reference-grade thermodynamic properties of pure fluids (water,
  nitrogen, CO2, refrigerants, hydrocarbons, etc.) at given T/P/rho state points
- Humid-air psychrometric calculations (dew point, wet bulb, relative humidity,
  enthalpy) via `HAPropsSI`
- Phase-boundary queries (saturation pressure/temperature, quality)
- Transport properties (viscosity, thermal conductivity) from validated
  correlations
- Fluid constants (critical point, triple point, molar mass, acentric factor)
  via a single-state `PropsSI` call, e.g. `PropsSI('Tcrit','',0,'',0,'Water')`
- EOS mixtures via the HEOS backend, e.g.
  `PropsSI('D','T',300,'P',101325,'HEOS::Water[0.5]&Ethanol[0.5]')`
- Any scenario requiring NIST-quality fluid data without an external database

## When NOT to Use

- Estimating properties of arbitrary chemical compounds from group-contribution
  or corresponding-states methods (use **thermo** — it covers estimation/correlation
  for thousands of compounds, not just the 122+ reference fluids)
- Mixture VLE/LLE with **activity-coefficient** models (NRTL/UNIQUAC/UNIFAC) —
  CoolProp does EOS (HEOS) mixtures, not activity models (use **thermo** for those)
- Molecular mass or formula parsing (use **molmass**)
- General numerical computation or curve fitting (use **numpy** / **scipy**)

## Capabilities

| Feature | API |
|---|---|
| Pure-fluid properties | `handle.PropsSI(output, input1, val1, input2, val2, fluid)` |
| Humid-air properties | `handle.HAPropsSI(output, input1, val1, input2, val2, input3, val3)` |
| Supported fluids | 122+ (Water, Air, CO2, N2, O2, R134a, R410A, Ethanol, ...) |
| Property keys | `D` (density), `H` (enthalpy), `S` (entropy), `C` (Cp), `V` (viscosity), `L` (conductivity), `P` (pressure), `T` (temperature), `Q` (quality) |
| Phase info | `handle.PhaseSI(input1, val1, input2, val2, fluid)` |
| Fluid constants | `handle.PropsSI('Tcrit'\|'pcrit'\|'molemass'\|'acentric', '', 0, '', 0, fluid)` |
| EOS mixtures | `handle.PropsSI('D','T',300,'P',101325,'HEOS::Water[0.5]&Ethanol[0.5]')` |

All inputs and outputs are in SI units (Pa, K, kg/m3, J/kg, J/(kg*K), Pa*s,
W/(m*K)).

## Scripting

This kit is scriptable — write free JS against the module handle.

- `handle.PropsSI(output, name1, val1, name2, val2, fluid)` — query a pure-fluid
  property; returns a number
- `handle.HAPropsSI(output, name1, val1, name2, val2, name3, val3)` — query a
  humid-air property; returns a number
- Always return a **string** (use `String(...)` or string concatenation)

### Worked Example

Density of liquid water at 25 C and 1 atm:

```js
return String(handle.PropsSI('D', 'T', 298.15, 'P', 101325, 'Water'))
// => "997.047636760347"
```

Saturation pressure of R134a at 25 C:

```js
return String(handle.PropsSI('P', 'T', 298.15, 'Q', 0, 'R134a'))
```

## Golden Capture

```bash
cd /tmp && mkdir -p coolprop-capture && cd coolprop-capture
# Download CoolProp 7.2.0 Emscripten build from SourceForge
curl -fSL -o coolprop.js 'https://sourceforge.net/projects/coolprop/files/CoolProp/7.2.0/Javascript/coolprop.js/download'
curl -fSL -o coolprop.wasm 'https://sourceforge.net/projects/coolprop/files/CoolProp/7.2.0/Javascript/coolprop.wasm/download'
node -e "
(async () => {
  const { join } = require('path');
  const mod = await import(join(process.cwd(), 'coolprop.js'));
  const handle = await mod.default({
    locateFile: (file) => join(process.cwd(), file)
  });
  const script = \"return String(handle.PropsSI('D','T',298.15,'P',101325,'Water'))\";
  const fn = new Function('handle', script);
  console.log(fn(handle));
})();
"
```

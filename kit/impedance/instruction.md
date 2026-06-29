# impedance

impedance.py is a Python library for electrochemical impedance spectroscopy
(EIS). It provides equivalent-circuit fitting — Randles, CPE (constant phase
element), Warburg diffusion, and arbitrary user-defined circuits via
`CustomCircuit` — as well as Kramers-Kronig validation (`linKK`) and
impedance-data preprocessing (cropping, interpolation). It depends on NumPy
and SciPy (kit dependencies). Matplotlib and Altair are used internally by
the library's visualization module but are NOT bundled as kit dependencies —
they are optional plotting backends available in the Pyodide distribution.

## When to Use

- Fitting an equivalent-circuit model to measured impedance spectra (Nyquist /
  Bode data): `CustomCircuit`, `Randles`
- Defining arbitrary circuit strings (`'R0-p(R1,C1)'`, `'R0-p(R1,W1)'`,
  `'R0-p(R1-Wo1,C1)'`) and fitting them to complex impedance Z(f)
- Kramers-Kronig validation of impedance data (`impedance.validation.linKK`)
- Preprocessing raw impedance data: cropping frequency ranges
  (`cropFrequencies`), ignoring negative imaginary parts
  (`ignoreBelowX`)
- Extracting fitted circuit parameters (resistances, capacitances, Warburg
  coefficients) from `circuit.parameters_`

## When NOT to Use

- General nonlinear curve fitting unrelated to impedance → use **lmfit**
- Generic numerical optimization → use **scipy** directly
- Plotting / visualizing Nyquist or Bode diagrams — the kit provides the
  fitting engine; plotting requires matplotlib/altair which are not kit
  dependencies
- AC circuit simulation or SPICE-like transient analysis — impedance.py is
  strictly for EIS equivalent-circuit fitting, not general circuit simulation

## Capabilities

| Area | Key API |
|---|---|
| Circuit models | `CustomCircuit(circuit, initial_guess)`, `Randles` |
| Fitting | `circuit.fit(frequencies, Z)`, `circuit.parameters_`, `circuit.conf_` |
| Prediction | `circuit.predict(frequencies)` |
| Validation | `impedance.validation.linKK(frequencies, Z, ...)` |
| Preprocessing | `impedance.preprocessing.cropFrequencies(frequencies, Z, ...)` |
| Circuit elements | R (resistor), C (capacitor), W (Warburg), Wo (finite-length Warburg), CPE, L (inductor) |

## Worked Example

Fit a simple R-RC circuit to synthetic impedance data and extract the fitted
parameters:

```python
import numpy as np
from impedance.models.circuits import CustomCircuit

# Fixed synthetic impedance: R0=100 Ω, R1=200 Ω, C1=1 mF
f = np.array([0.01, 0.1, 1.0, 10.0, 100.0])
Z = 100.0 + 200.0 / (1 + 1j * 2 * np.pi * f * 200.0 * 1e-3)

c = CustomCircuit('R0-p(R1,C1)', initial_guess=[100, 200, 1e-3])
c.fit(f, Z)
', '.join(f'{p:.6e}' for p in c.parameters_)
# → "1.000000e+02, 2.000000e+02, 1.000000e-03"
```

The circuit string `'R0-p(R1,C1)'` describes a resistor R0 in series with a
parallel combination of R1 and C1. `fit()` uses `scipy.optimize.curve_fit`
under the hood. The fitted parameters recover the true values: R0 = 100 Ω,
R1 = 200 Ω, C1 = 1 mF.

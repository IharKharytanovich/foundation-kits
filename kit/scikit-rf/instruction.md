# scikit-rf

scikit-rf (import name `skrf`) is a Python library for RF and microwave
engineering. It provides a `Network` object to represent multi-port microwave
networks and supports reading/writing Touchstone (`.s1p`, `.s2p`, `.snp`) files,
S-parameter manipulation (cascading, de-embedding, interpolation), network
parameter conversions (S, Z, Y, ABCD, T), Smith chart visualization, and
calibration routines (TRL, SOLT, multiline TRL, unknown-thru).

## When to Use

- Reading, writing, and manipulating Touchstone (`.snp`) files
- Analyzing S-parameters of RF/microwave networks (return loss, insertion loss,
  VSWR, group delay)
- Converting between network parameter representations (S, Z, Y, ABCD, T)
- Cascading and de-embedding multi-port networks
- Performing VNA calibration (TRL, SOLT, multiline TRL, unknown-thru)
- Computing impedance from S-parameters or vice versa
- Interpolating network data across frequency sweeps
- Building circuit models from connected networks (Circuit class)

## When NOT to Use

- General signal processing or filtering (use **scipy** — `scipy.signal`)
- Control systems or feedback loop analysis (use a dedicated controls library)
- Electromagnetic field simulation or full-wave solvers (scikit-rf is a
  measurement/network-analysis tool, not a simulator)
- General-purpose linear algebra or array math (use **numpy**)
- Antenna radiation pattern analysis (scikit-rf handles port parameters, not
  far-field patterns)

## Capabilities

| Area | Key API |
|---|---|
| Network object | `skrf.Network(s=..., z0=..., frequency=...)`, `skrf.Network('file.s2p')` |
| Touchstone I/O | `skrf.Network('file.s2p')`, `network.write_touchstone('out.s2p')` |
| S-parameters | `network.s`, `network.s_db`, `network.s_mag`, `network.s_deg` |
| Impedance (Z) | `network.z`, `network.z_mag`, `network.z_re`, `network.z_im` |
| Admittance (Y) | `network.y` |
| ABCD parameters | `network.a` |
| T parameters | `network.t` |
| Cascading | `result = network_a ** network_b` (cascade two 2-ports) |
| De-embedding | `skrf.network.de_embed(network, left, right)` |
| Calibration | `skrf.calibration.OnePort`, `skrf.calibration.TwelveTerm`, `skrf.calibration.SOLT` |
| Frequency | `skrf.Frequency(start, stop, npoints, unit)` |
| Media / lines | `skrf.media.DefinedGammaZ0(frequency, z0=50)` — ideal transmission line |
| Circuit | `skrf.Circuit(connections)` — build circuits from connected networks |

## Worked Example

Convert S-parameters to impedance for a single-frequency, one-port network with
S11 = 0.5 and Z0 = 50 ohms:

```python
import skrf, numpy as np

n = skrf.Network(s=np.array([[[0.5]]]), z0=50)
z = round(n.z[0, 0, 0].real, 1)
str(z)
# -> "150.0"
```

The impedance Z = Z0 * (1 + S11) / (1 - S11) = 50 * 1.5 / 0.5 = 150 ohms,
confirming the S-to-Z conversion. Use `skrf.Network('measured.s2p')` to load
real measurement data from Touchstone files, then access `.s_db` for
S-parameters in dB, `.z` for impedance, or cascade two networks with `**`.

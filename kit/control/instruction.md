# control

python-control is a library for analysis and design of feedback control systems.
It provides transfer-function and state-space representations, frequency-response
analysis (Bode, Nyquist, Nichols), time-domain simulation (step, impulse,
initial-condition response), and controller design (pole placement, LQR/LQE,
PID tuning). The API mirrors MATLAB's Control System Toolbox conventions.
Plotting functions (Bode plots, root-locus) require matplotlib, which is not
available in this environment — use the numerical outputs instead.

## When to Use

- Creating and manipulating transfer functions and state-space models
  (series, parallel, feedback interconnections)
- Frequency-response analysis: Bode magnitude/phase data, Nyquist contour data,
  gain/phase margins
- Time-domain simulation: step response, impulse response, forced response,
  initial-condition response
- Stability analysis: poles, zeros, DC gain, controllability/observability
  matrices
- Controller design: pole placement, LQR (linear quadratic regulator), LQE
  (Kalman filter), Hinf synthesis
- System conversion: continuous ↔ discrete (c2d / d2c), transfer function ↔
  state space (tf2ss / ss2tf), minimal realisation

## When NOT to Use

- General-purpose optimisation or curve fitting — use **scipy**
  (`scipy.optimize`)
- Signal processing (FFT, digital filters, spectrograms) — use **scipy**
  (`scipy.signal`)
- Statistical modelling or time-series forecasting (ARIMA) — use **statsmodels**
- Symbolic transfer-function algebra or Laplace transforms — use **sympy**
- Machine-learning-based system identification — use **scikit-learn**

## Capabilities

| Area | Key API |
|---|---|
| Transfer function | `control.TransferFunction(num, den)`, `tf` |
| State space | `control.StateSpace(A, B, C, D)`, `ss` |
| Feedback | `control.feedback(G, H)`, `series`, `parallel` |
| Frequency response | `control.bode_plot` (data), `nyquist_plot` (data), `margin` |
| Time response | `control.step_response`, `impulse_response`, `forced_response` |
| Stability | `control.poles`, `control.zeros`, `control.dcgain` |
| Design | `control.place`, `control.lqr`, `control.lqe`, `control.acker` |
| Conversion | `control.c2d`, `control.d2c`, `control.tf2ss`, `control.minreal` |
| MIMO | `control.append`, `control.connect`, `control.interconnect` |

## Worked Example

Compute the DC gain of a second-order transfer function G(s) = 1 / (s² + 2s + 1):

```python
import control
g = control.TransferFunction([1], [1, 2, 1])
str(round(float(control.dcgain(g)), 4))
# -> "1.0"
```

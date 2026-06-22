# cirq

Gate-level quantum circuit construction and state-vector / density-matrix
simulation, powered by the **cirq-core** library from Google Quantum AI.

## When to use

- **Build quantum circuits** from standard gates (H, CNOT, T, S, SWAP, Rx, Ry,
  Rz, ISWAP, …) on qubits (`cirq.LineQubit`, `cirq.GridQubit`, `cirq.NamedQubit`).
- **Simulate circuits** with the built-in `cirq.Simulator` (state-vector) or
  `cirq.DensityMatrixSimulator` (density-matrix / mixed states / noise).
- **Measure and sample** — append `cirq.measure()` to a circuit and run
  `simulator.run(circuit, repetitions=N)` to collect measurement histograms.
- **Inspect state** — use `result.final_state_vector` (pure state) or
  `result.final_density_matrix` (mixed) after `simulator.simulate(circuit)`.
- **Noise modelling** — apply `cirq.depolarize`, `cirq.amplitude_damp`, or
  custom channels to gates or entire circuits.
- **Circuit algebra** — compose, append, insert, zip, and decompose moments;
  compute circuit unitary via `cirq.unitary(circuit)`.

## When NOT to use

- **Numerical linear algebra / array math** → use numpy or scipy.
- **Symbolic algebra** → use sympy (cirq uses sympy internally for parameterised
  gates, but general symbolic tasks belong in sympy).
- **Graph algorithms** → use networkx directly (cirq depends on networkx but
  graph-only tasks do not need cirq).
- **Classical machine learning / optimisation** → use scikit-learn, scipy.optimize,
  or a dedicated ML kit.
- **Hardware execution** — this kit contains cirq-core only (no cirq-google,
  cirq-ionq, or other hardware providers). Use it for simulation, not cloud QPU
  access.

## Worked example

Build a Bell-state circuit (|00⟩ + |11⟩) / √2 and read the final state-vector:

```python
import cirq, numpy as np

q0, q1 = cirq.LineQubit.range(2)
c = cirq.Circuit([cirq.H(q0), cirq.CNOT(q0, q1)])
sv = cirq.Simulator().simulate(c).final_state_vector

# Rounded amplitudes (real parts; imaginary is zero for this circuit)
print('[' + ', '.join(f'{x.real:.3f}' for x in sv) + ']')
# → [0.707, 0.000, 0.000, 0.707]
```

## Notes

- This kit ships **cirq-core** (the simulation + circuit library), not the `cirq`
  PyPI metapackage which bundles hardware-provider extras (cirq-google, cirq-ionq,
  cirq-pasqal, …). The import name is still `import cirq`.
- Plotting functions (`cirq.plot_state_histogram`, etc.) require matplotlib. Avoid
  calling them unless matplotlib is available in the environment.
- Parameterised gates accept sympy symbols:
  `cirq.Rz(sympy.Symbol('θ'))`. Resolve via `cirq.resolve_parameters`.

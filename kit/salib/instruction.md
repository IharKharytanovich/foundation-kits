# SALib

SALib (Sensitivity Analysis Library) is a Python library for global
sensitivity analysis. It implements methods including Sobol', Morris,
FAST, DGSM, PAWN, HDMR, and fractional factorial analysis. SALib generates
parameter samples, runs them through a model, and computes sensitivity
indices that quantify how much each input contributes to output variability.
The Python import name is `SALib`. It depends on NumPy, SciPy, and pandas
at runtime.

## Limitations in this kit

matplotlib is an unconditional upstream dependency but cannot be provided in
this Pyodide environment (native/heavy). Plotting functions in
`SALib.plotting` are unavailable. Extract sensitivity indices from result
DataFrames and format output programmatically instead. multiprocess is also
an upstream dependency but Pyodide has no real multiprocessing support;
parallel evaluation of model runs is unavailable — run models sequentially.

## When to Use

- Variance-based global sensitivity analysis (Sobol' indices: first-order,
  second-order, total-order)
- Screening large parameter spaces to identify influential inputs (Morris
  method / Elementary Effects)
- Fourier-based sensitivity analysis (FAST, RBD-FAST)
- Distribution-based sensitivity (PAWN, moment-independent)
- High-Dimensional Model Representation (HDMR) for metamodelling and
  sensitivity
- Fractional factorial design and analysis

## When NOT to Use

- Local sensitivity (partial derivatives at a point) — use **findiff** for
  finite-difference derivatives
- Uncertainty propagation on individual measurements — use **uncertainties**
- Polynomial chaos expansion for surrogate-based UQ — use **chaospy**
- Bayesian parameter estimation or posterior sampling — use **emcee** or
  **dynesty**
- Curve fitting or model calibration — use **lmfit** or **iminuit**
- Machine-learning feature importance — use **scikit-learn**

## Capabilities

| Area | Key API |
|---|---|
| Problem spec | `SALib.ProblemSpec({'num_vars': N, 'names': [...], 'bounds': [...]})` |
| Sobol' | `SALib.sample.sobol.sample(problem, N)`, `SALib.analyze.sobol.analyze(problem, Y)` |
| Morris | `SALib.sample.morris.sample(problem, N)`, `SALib.analyze.morris.analyze(problem, X, Y)` |
| FAST | `SALib.sample.fast_sampler.sample(problem, N)`, `SALib.analyze.fast.analyze(problem, Y)` |
| PAWN | `SALib.analyze.pawn.analyze(problem, X, Y)` |
| HDMR | `SALib.analyze.hdmr.analyze(problem, X, Y)` |
| DGSM | `SALib.analyze.dgsm.analyze(problem, X, Y)` |
| Workflow | `ProblemSpec.sample(method).evaluate(model).analyze(method)` |

## Worked Example

Verify SALib is available and check its version (the golden test uses a
version smoke because sensitivity analysis output depends on stochastic
sampling):

```python
import SALib
from importlib.metadata import version

version('SALib')
# → "1.5.2"
```

A typical Sobol' workflow defines a problem, generates samples, evaluates
the model, and computes sensitivity indices:

```python
import numpy as np
from SALib.sample import sobol as sobol_sample
from SALib.analyze import sobol as sobol_analyze

problem = {'num_vars': 3, 'names': ['x1','x2','x3'],
           'bounds': [[-3.14, 3.14]]*3}
X = sobol_sample.sample(problem, 1024)
Y = np.sin(X[:,0]) + 0.1*np.sin(X[:,1])**2 + 0.01*X[:,2]**4*np.sin(X[:,0])
Si = sobol_analyze.analyze(problem, Y)
# Si['S1'] = first-order indices, Si['ST'] = total-order indices
```

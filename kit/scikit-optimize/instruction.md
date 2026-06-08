# scikit-optimize

scikit-optimize (skopt) is a library for sequential model-based optimization
of expensive black-box functions. It uses Bayesian optimization with
Gaussian process, random forest, or gradient-boosted tree surrogates to
minimize a function in fewer evaluations than grid or random search. The
Python import name is `skopt`. It depends on NumPy, SciPy, scikit-learn,
joblib, packaging, and PyYAML at runtime; pyaml (a YAML dumper) is bundled.
Because Bayesian optimization involves stochastic surrogate fitting and
acquisition function sampling, results vary between runs — always set a
random seed for reproducibility.

## When to Use

- Black-box optimization of expensive functions (simulation, experiment,
  hyperparameter tuning) where each evaluation is costly
- Bayesian optimization with Gaussian process surrogates
  (`gp_minimize`) for smooth, low-dimensional objective functions
- Tree-based surrogate optimization (`forest_minimize`,
  `gbrt_minimize`) for noisy or categorical search spaces
- Defining mixed search spaces with `Real`, `Integer`, and
  `Categorical` dimensions
- Hyperparameter tuning for machine-learning models via
  `BayesSearchCV` (drop-in replacement for GridSearchCV)

## When NOT to Use

- Evolutionary or genetic algorithm optimization (use **deap** — DEAP
  provides GA, GP, and multi-objective evolutionary search)
- Gradient-based or deterministic local optimization (use **scipy** —
  `scipy.optimize.minimize` with known gradients is faster)
- Curve fitting or non-linear least-squares with parameter constraints
  (use **lmfit** or **iminuit**)
- Bayesian posterior sampling or MCMC (use **emcee** or **dynesty** —
  skopt is an optimizer, not a sampler)
- Machine-learning model training and evaluation pipelines (use
  **scikit-learn** directly)
- Sensitivity analysis of model inputs (use **salib**)

## Capabilities

| Area | Key API |
|---|---|
| GP-based | `skopt.gp_minimize(func, dimensions, n_calls=50)` |
| Forest-based | `skopt.forest_minimize(func, dimensions)` |
| GBRT-based | `skopt.gbrt_minimize(func, dimensions)` |
| General | `skopt.Optimizer(dimensions)` — ask/tell interface |
| Dimensions | `skopt.space.Real`, `Integer`, `Categorical` |
| Callbacks | `skopt.callbacks.EarlyStopper`, `DeltaXStopper`, `CheckpointSaver` |
| ML tuning | `skopt.BayesSearchCV(estimator, search_spaces)` |
| Plotting | `skopt.plots.plot_convergence`, `plot_objective`, `plot_evaluations` |
| Persistence | `skopt.dump(result, 'result.pkl')`, `skopt.load('result.pkl')` |

## Worked Example

Verify scikit-optimize is available and check its version (the golden test
uses a version smoke because Bayesian optimization output is stochastic and
not deterministically assertable):

```python
import skopt

skopt.__version__
# → "0.10.2"
```

A typical workflow minimizes a noisy function in a bounded search space:

```python
import numpy as np
from skopt import gp_minimize
from skopt.space import Real

def objective(x):
    return (x[0] - 2)**2 + (x[1] + 3)**2

result = gp_minimize(objective, [Real(-5, 5), Real(-5, 5)],
                     n_calls=20, random_state=42)
# result.x  → best parameters found (close to [2, -3])
# result.fun → best objective value (close to 0)
```

Always pass `random_state=42` to `gp_minimize` / `forest_minimize` for
reproducible optimization runs.

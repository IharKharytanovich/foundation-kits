# lifelines

lifelines is a Python library for survival analysis (time-to-event modelling).
It implements Kaplan-Meier estimation, Cox proportional-hazards regression,
Aalen additive-hazards models, Weibull/log-normal/log-logistic parametric
models, and the log-rank test for comparing survival curves. lifelines uses
autograd for automatic differentiation in its parametric fitters. The Python
import name is `lifelines`. It requires NumPy, SciPy, pandas, and autograd at
runtime.

## Limitations in this kit

matplotlib is an unconditional upstream dependency but cannot be provided in this
Pyodide environment (native/heavy). Plotting methods (`KaplanMeierFitter.plot`,
`CoxPHFitter.plot`, `plot_lifetimes`) are unavailable. Extract survival
functions, hazard ratios, and confidence intervals programmatically from the
fitted model attributes (e.g. `kmf.survival_function_`, `cph.summary`) and
format output as DataFrames or text instead.

## When to Use

- Estimating survival curves from censored time-to-event data (Kaplan-Meier)
- Modelling covariate effects on survival with Cox proportional-hazards
- Parametric survival models (Weibull, log-normal, log-logistic, exponential)
- Computing median survival time, hazard ratios, and confidence intervals
- Comparing survival distributions between groups (log-rank test)
- Analysing customer churn, clinical trial endpoints, or equipment failure times

## When NOT to Use

- General-purpose regression or classification (use **statsmodels** for
  OLS/GLM/ARIMA or **scikit-learn** for ML models)
- Bayesian posterior sampling (use **emcee** or **dynesty** — lifelines is a
  frequentist/MLE library)
- Bayesian diagnostics on MCMC output (use **arviz**)
- Curve fitting or least-squares optimisation (use **iminuit** or **lmfit**)
- Time-series forecasting without censoring (use **statsmodels** ARIMA)

## Capabilities

| Area | Key API |
|---|---|
| Non-parametric | `KaplanMeierFitter().fit(durations, event_observed)` |
| Semi-parametric | `CoxPHFitter().fit(df, duration_col, event_col)` |
| Parametric | `WeibullFitter`, `LogNormalFitter`, `LogLogisticFitter`, `ExponentialFitter` |
| Aalen additive | `AalenAdditiveFitter().fit(df, duration_col, event_col)` |
| Comparison | `logrank_test(T1, T2, E1, E2)` |
| Results | `.survival_function_`, `.median_survival_time_`, `.summary`, `.confidence_interval_` |
| Prediction | `cph.predict_survival_function(X)`, `cph.predict_median(X)` |

## Worked Example

Fit a Kaplan-Meier estimator on five fully-observed durations and read the
median survival time:

```python
from lifelines import KaplanMeierFitter
import numpy as np

k = KaplanMeierFitter()
k.fit(np.array([1., 2., 3., 4., 5.]), np.array([1, 1, 1, 1, 1]))
str(float(k.median_survival_time_))
# -> "3.0"
```

The Kaplan-Meier survival function drops below 0.5 at t = 3, making 3.0 the
estimated median. For censored data, set the corresponding entries in the
event-observed array to 0.

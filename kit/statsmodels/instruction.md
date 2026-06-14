# statsmodels

statsmodels is a Python library for statistical modelling, hypothesis testing,
and econometrics. It provides regression models (OLS, GLS, WLS, GLM),
time-series analysis (ARIMA, SARIMAX, VAR), statistical tests (ADF, Ljung-Box,
Durbin-Watson), and nonparametric estimators. Unlike machine-learning toolkits
that focus on prediction, statsmodels produces full inference output: p-values,
confidence intervals, R-squared, AIC/BIC, and summary tables.

## When to Use

- Ordinary / generalised / weighted least-squares regression with inference
  (p-values, confidence intervals, R-squared)
- Time-series modelling and forecasting (ARIMA, SARIMAX, exponential smoothing,
  VAR, Holt-Winters)
- Statistical hypothesis tests (t-test, F-test, Augmented Dickey-Fuller, KPSS,
  Ljung-Box, Jarque-Bera, Breusch-Pagan)
- Generalised linear models (logistic, Poisson, negative-binomial regression)
- Analysis of variance (ANOVA), mixed-effects models
- Nonparametric density estimation (kernel density, LOWESS smoothing)
- Diagnostic plots and residual analysis (Q-Q, influence, leverage)

## When NOT to Use

- Prediction-focused machine learning (classification, random forests, SVMs,
  cross-validation) — use **scikit-learn**
- Basic array math, means, medians, or standard deviations — use **numpy**
- Low-level statistical primitives (distributions, integration, optimisation)
  without inference — use **scipy**
- Symbolic algebra or closed-form solutions — use **sympy**
- Bayesian posterior sampling (MCMC) — use **emcee**
- Curve fitting without a full regression summary — use **lmfit** or
  **scipy** (`curve_fit`)

## Capabilities

| Area | Key API |
|---|---|
| OLS / GLS / WLS | `sm.OLS(y, X).fit()`, `.summary()`, `.params`, `.rsquared` |
| GLM | `sm.GLM(y, X, family=sm.families.Binomial()).fit()` |
| ARIMA / SARIMAX | `sm.tsa.ARIMA(y, order=(p,d,q)).fit()`, `.forecast(steps)` |
| Exponential smoothing | `sm.tsa.ExponentialSmoothing(y, …).fit()` |
| VAR | `sm.tsa.VAR(data).fit(maxlags)` |
| Statistical tests | `sm.stats.diagnostic.acorr_ljungbox`, `adfuller`, `het_breuschpagan` |
| ANOVA | `sm.stats.anova.anova_lm(model)` |
| Nonparametric | `sm.nonparametric.KDEUnivariate`, `lowess` |
| Formula API | `smf.ols('y ~ x1 + x2', data=df).fit()` |

## Worked Example

Fit an OLS regression to a perfect linear relationship and extract the slope
and R-squared:

```python
import numpy as np, statsmodels.api as sm
x = np.array([1., 2., 3., 4., 5.])
y = np.array([2., 4., 6., 8., 10.])
m = sm.OLS(y, sm.add_constant(x)).fit()
str((round(float(m.params[1]), 4), round(float(m.rsquared), 4)))
# -> "(2.0, 1.0)"
```

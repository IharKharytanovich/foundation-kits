# pybaselines

pybaselines provides 50+ algorithms for fitting baselines to experimental data,
covering Whittaker smoothing (AsLS, airPLS, ArPLS, IArPLS, DrPLS), polynomial
(ModPoly, IModPoly), morphological (MPLS, Mor, AMORMOL), spline, classification,
optimizers (SNIP, noise median), and miscellaneous methods.

## When to Use

- Spectral baseline correction (Raman, IR, UV-Vis, NMR, XRD, mass spectrometry)
- Chromatogram baseline removal
- Any signal where a slowly varying background must be subtracted before peak analysis
- Comparing different baseline algorithms on the same data

## When NOT to Use

- Curve fitting or peak fitting (use lmfit or scipy.optimize.curve_fit)
- Wavelet transforms or denoising (use pywavelets)
- General signal filtering (use scipy.signal)
- Baseline correction already built into a domain-specific tool

## Capabilities

| Category | Key Algorithms |
|---|---|
| Whittaker | `asls`, `airpls`, `arpls`, `iarpls`, `drpls`, `aspls` |
| Polynomial | `modpoly`, `imodpoly`, `penalized_poly`, `loess` |
| Morphological | `mpls`, `mor`, `amormol`, `rolling_ball` |
| Spline | `mixture_model`, `irsqr`, `pspline_asls` |
| Classification | `dietrich`, `golotvin`, `std_distribution` |
| Optimizers | `snip`, `noise_median`, `interp_pts` |

## Dependencies

Requires only numpy and scipy. The optional `numba` and `pentapy` extras are
**not available** in this sandbox — use only the default algorithms (which
cover all categories above). Do not import `numba` or `pentapy`.

## Worked Example

Compute an AsLS (Asymmetric Least Squares) baseline on a fixed synthetic signal:

```python
import numpy as np
from pybaselines import Baseline

x = np.arange(20, dtype=float)
y = np.array([1.0, 2.0, 1.5, 3.0, 2.5, 4.0, 3.5, 5.0, 4.5, 6.0, 5.5, 7.0, 6.5, 5.0, 4.0, 3.0, 2.0, 1.5, 1.0, 0.5])
baseline_fitter = Baseline(x_data=x)
baseline, params = baseline_fitter.asls(y, lam=1e3, p=0.01)
print(str(np.round(baseline, 4).tolist()))
# → "[1.2401, 1.2238, 1.2073, 1.1903, 1.1726, 1.154, 1.1343, 1.1134, 1.091, 1.0671, 1.0417, 1.0146, 0.986, 0.9558, 0.9243, 0.8916, 0.858, 0.8236, 0.7887, 0.7535]"
```

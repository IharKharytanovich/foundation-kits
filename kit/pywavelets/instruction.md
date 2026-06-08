# pywavelets

PyWavelets (pywt) is a Python library for discrete wavelet transforms (DWT),
continuous wavelet transforms (CWT), and related signal-processing operations.
It supports 1-D and 2-D transforms with a comprehensive set of built-in
wavelets (Haar, Daubechies, Symlets, Coiflets, biorthogonal, etc.). The Python
import name is `pywt` (not `pywavelets`). It depends on NumPy at runtime.

## When to Use

- Decomposing signals into wavelet coefficients for multi-resolution analysis
  (DWT, SWT, wavelet packets)
- Denoising time-series or image data using wavelet thresholding
- Computing continuous wavelet transforms (CWT) for time-frequency analysis
- Compressing data by zeroing small wavelet coefficients and reconstructing
- Working with 2-D wavelet transforms for image processing (DWT2, IDWT2)
- Determining the maximum decomposition level for a given signal length

## When NOT to Use

- Fourier transforms, spectral analysis, or frequency-domain filtering (use
  **scipy** `fft` or **numpy** `fft` — pywt is wavelet-domain, not
  Fourier-domain)
- Finite-difference numerical derivatives on grids (use **findiff**)
- Statistical time-series modelling or ARIMA (use **pandas** with statsmodels)
- Symbolic mathematics or analytic signal processing (use **sympy**)
- Machine-learning feature extraction from signals (use **scikit-learn** — pywt
  handles the transform; scikit-learn handles the learning)

## Capabilities

| Area | Key API |
|---|---|
| Wavelet list | `pywt.wavelist(kind='discrete')`, `pywt.wavelist(kind='continuous')` |
| DWT (1-D) | `pywt.dwt(data, wavelet)` → `(cA, cD)` |
| IDWT (1-D) | `pywt.idwt(cA, cD, wavelet)` |
| Multi-level DWT | `pywt.wavedec(data, wavelet, level=n)` → coefficient list |
| Multi-level IDWT | `pywt.waverec(coeffs, wavelet)` |
| 2-D DWT | `pywt.dwt2(data, wavelet)`, `pywt.idwt2(coeffs, wavelet)` |
| CWT | `pywt.cwt(data, scales, wavelet)` |
| Max level | `pywt.dwt_max_level(data_len, wavelet)` |
| Thresholding | `pywt.threshold(data, value, mode)` |

## Worked Example

Compute the maximum DWT decomposition level for a 256-sample signal using the
Haar wavelet:

```python
import pywt

str(pywt.dwt_max_level(256, 'haar'))
# → "8"
```

For a signal of length 256 and the Haar wavelet (filter length 2), the maximum
decomposition level is 8 (= log2(256)). Use `pywt.wavedec(signal, 'haar',
level=8)` to perform a full multi-level decomposition, and `pywt.waverec()` to
reconstruct the signal from its wavelet coefficients.

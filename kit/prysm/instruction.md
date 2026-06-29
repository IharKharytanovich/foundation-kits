# prysm

prysm is a Python library for physical and Fourier optics: diffraction-limited
PSF computation, modulation transfer function (MTF) and phase transfer function
(PTF) analysis, Zernike and other polynomial wavefront expansions, thin-film
coatings, thin-lens calculations, interferogram analysis, and optical propagation
(angular spectrum, Fresnel). It operates on NumPy arrays and uses SciPy for
special functions and optimization. prysm requires numpy and scipy at runtime.

The wheel was built from the `prysm-0.21.1.tar.gz` sdist (pure-Python, no
compiled extensions). matplotlib, h5py, and imageio are optional extras and are
not available in this environment.

## When to Use

- Computing diffraction-limited or aberrated point spread functions (PSF) for
  circular or segmented apertures
- Evaluating modulation transfer function (MTF) or optical transfer function
  (OTF) from a PSF or from diffraction-limited theory
- Expanding wavefront error in Zernike polynomials (Noll, Fringe, ANSI
  indexing), Jacobi, Legendre, Chebyshev, Q-polynomial, or Hopkins bases
- Modeling thin-film coatings (reflectance, transmittance vs. wavelength/angle)
- Thin-lens first-order calculations (focal length, magnification, f/# to NA)
- Analyzing interferograms: PV, RMS, power spectral density (PSD), bandlimited
  RMS, surface fitting
- Angular-spectrum or Fresnel propagation of coherent wavefronts
- Generating test objects (slits, pinholes, Siemens stars) for image-quality
  simulation

## When NOT to Use

- Paraxial geometric ray tracing (ABCD matrix, sequential lens layout) — use
  **raytracing** instead
- Full-wave electromagnetic simulation (FDTD Maxwell solver) — use **fdtd**
  instead
- Signal processing on graphs (graph Fourier transform, spectral filters) — use
  **pygsp** instead
- General 1-D/2-D wavelet transforms — use **pywavelets** instead
- Symbolic optics or analytical derivations — use **sympy** instead

## Capabilities

| Area | Key API |
|---|---|
| Diffraction-limited MTF | `prysm.otf.diffraction_limited_mtf(fno, wavelength, frequencies)` |
| PSF from OTF | `prysm.otf.mtf_from_psf(psf_data, dx)` |
| Zernike polynomials | `prysm.polynomials.zernike_nm(n, m, r, theta)` |
| Zernike sequences | `prysm.polynomials.zernike_nm_sequence(nms, r, theta)` |
| Coordinate grids | `prysm.coordinates.make_xy_grid(N, dx)` |
| Polar conversion | `prysm.coordinates.cart_to_polar(x, y)` |
| Aperture geometry | `prysm.geometry.circle(radius, r)`, `truecircle`, `spider` |
| Angular-spectrum propagation | `prysm.propagation.angular_spectrum(field, ...)` |
| Thin-lens calculations | `prysm.thinlens.object_to_image_dist(efl, object_dist)` |
| Interferogram analysis | `prysm.interferogram.psd(data, dx)`, `rms`, `pv` |
| Thin-film coatings | `prysm.thinfilm` |
| Airy disk | `prysm.psf.airydisk(fno, wavelength, r)` |

## Worked Example

Compute the diffraction-limited MTF at 100 lp/mm for an f/5.6 lens at
550 nm wavelength:

```python
from prysm.otf import diffraction_limited_mtf
import numpy as np

print(round(float(diffraction_limited_mtf(5.6, 0.55, np.array([100.0]))[0]), 10))
# -> "0.6141338586"
```

The MTF value 0.614 means the lens preserves about 61% of contrast at 100 lp/mm
under ideal diffraction-limited conditions. Higher spatial frequencies yield
lower MTF; the cutoff frequency for this configuration is
1 / (wavelength * fno) ~= 325 lp/mm.

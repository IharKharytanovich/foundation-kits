# Astropy

Astropy is the core Python library for astronomy and astrophysics. It provides
physical units and quantities, celestial coordinate transforms, time systems,
astronomical constants, cosmological calculations, and FITS file I/O. Astropy
depends on NumPy, packaging, and PyYAML; it bundles pyerfa (Earth rotation) and
astropy-iers-data (IERS bulletins) as exclusive artifacts.

## When to Use

- Converting between physical units and quantities (e.g. kilometres to metres,
  Joules to electron-volts, parsecs to light-years)
- Transforming celestial coordinates between frames (ICRS, Galactic, ecliptic,
  AltAz) via `SkyCoord`
- Working with astronomical time scales (UTC, TAI, TDB, JD, MJD, ISO) via the
  `Time` class
- Looking up physical and astronomical constants (`c`, `G`, `M_sun`, `k_B`)
- Computing cosmological distances, look-back times, and luminosity distances
  with `FlatLambdaCDM` or built-in cosmologies (`Planck18`)
- Reading or writing FITS files (`astropy.io.fits`)
- Building and manipulating table data with `astropy.table.Table`

## When NOT to Use

- General-purpose array math or linear algebra (use **numpy**)
- Statistical distributions, hypothesis testing, or generic optimisation (use
  **scipy** — Astropy's fitting module is astronomy-specific)
- Bayesian posterior sampling / MCMC (use **emcee** — often used alongside
  Astropy but emcee owns the sampler)
- Tabular data wrangling that is not astronomy-specific (use **pandas**)
- Machine-learning classification, regression, or clustering (use
  **scikit-learn**)
- Chemical formula masses or molecular-weight calculations (use **molmass**)

## Capabilities

| Area | Key API |
|---|---|
| Units & quantities | `astropy.units` (`u.km`, `u.m`, `u.s`, `u.Jy`), `Quantity.to()`, equivalencies |
| Coordinates | `astropy.coordinates.SkyCoord`, frame transforms (Galactic, ICRS, AltAz) |
| Constants | `astropy.constants` (`c`, `G`, `M_sun`, `k_B`, `h`) |
| Time | `astropy.time.Time`, `TimeDelta`, scales (utc, tai, tdb), formats (jd, mjd, iso) |
| Cosmology | `astropy.cosmology.FlatLambdaCDM`, `Planck18`, `luminosity_distance`, `age` |
| FITS I/O | `astropy.io.fits.open`, `fits.getdata`, `fits.writeto` |
| Tables | `astropy.table.Table`, `join`, `vstack`, `hstack`, column operations |

## Worked Example

Convert a distance from kilometres to metres:

```python
from astropy import units as u

distance = 1 * u.km
result = distance.to(u.m)
str(result.value)
# → "1000.0"
```

The `units` module supports compound units (`u.km / u.s`), equivalencies
(spectral, mass-energy), and unit-aware arithmetic. Attach units early — most
Astropy functions accept and propagate `Quantity` objects automatically.

# sgp4

sgp4 is a pure-Python implementation of the SGP4 satellite orbit propagation
algorithm, the standard model used by NORAD and the US Space Command to predict
satellite positions from Two-Line Element (TLE) sets. Given a TLE and a target
time, sgp4 computes the satellite's position and velocity vectors in the
True Equator Mean Equinox (TEME) reference frame. The algorithm is
deterministic and depends only on the TLE epoch and elapsed time — no network
access or external ephemeris files are needed. sgp4 has no runtime
dependencies.

## When to Use

- Propagating satellite orbits from publicly available TLE data (CelesTrak,
  Space-Track) to predict positions at future or past times
- Computing satellite ground tracks, pass predictions, or visibility windows
- Batch-propagating many satellites over a time grid for conjunction screening
  or coverage analysis
- Validating orbital elements by comparing propagated positions against
  observed coordinates
- Educational exercises in astrodynamics and orbital mechanics

## When NOT to Use

- High-precision orbit determination or manoeuvre planning requiring numerical
  integration of full force models (SGP4 is an analytical approximation with
  ~1 km accuracy at epoch, degrading over days)
- General astronomical coordinate transforms, time scales, or ephemeris lookup
  (use **astropy** — `astropy.coordinates`, `astropy.time`)
- Planetary or solar-system body positions (use **astropy.coordinates** with
  built-in solar-system ephemerides)
- Unit-aware physical calculations (use **pint** or **astropy.units**)
- Statistical orbit uncertainty quantification (use **uncertainties** for
  error propagation or **emcee** for Bayesian sampling)

## Capabilities

| Area | Key API |
|---|---|
| Parse TLE | `Satrec.twoline2rv(line1, line2, WGS72)` |
| Propagate | `satellite.sgp4(jd, fr)` -> `(error, r_km, v_km_s)` |
| Julian date | `jday(year, month, day, hour, minute, second)` -> `(jd, fr)` |
| Batch propagate | `satellite.sgp4_array(jd_array, fr_array)` |
| Gravity models | `WGS72`, `WGS84` |
| Epoch access | `satellite.epochyr`, `satellite.epochdays`, `satellite.jdsatepoch` |
| Error codes | `0` = success; non-zero = decayed or bad elements |
| OMM / XML | `omm.parse_xml(xml_text)` for modern OMM-format elements |

## Worked Example

Propagate the ISS orbit from a TLE to a specific UTC time and extract the
position vector in TEME coordinates (km):

```python
from sgp4.api import Satrec, WGS72, jday

s = '1 25544U 98067A   19356.27756250  .00001029  00000-0  27858-4 0  9992'
t = '2 25544  51.6430 178.1191 0007597  68.3804  18.1540 15.44074047202482'
sat = Satrec.twoline2rv(s, t, WGS72)
e, r, v = sat.sgp4(*jday(2019, 12, 20, 12, 0, 0))
'%.4f, %.4f, %.4f' % (r[0], r[1], r[2])
# -> "-1570.5335, 4022.6890, -5279.8660"
```

`r` is the position vector (x, y, z) in km in the TEME frame; `v` is the
velocity vector in km/s. Error code `e == 0` means propagation succeeded.
Always check `e` before using the result — non-zero indicates the satellite
has decayed or the elements are invalid.

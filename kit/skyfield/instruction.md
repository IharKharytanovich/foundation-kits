# Skyfield

Skyfield is a high-precision astronomy library for computing the positions of
stars, planets, the Sun, and the Moon using JPL DE ephemeris data. This kit
bundles the DE421 ephemeris file (~16 MB), enabling fully offline positional
astronomy with no network access required.

## When to Use

- Computing apparent right ascension and declination of Solar System bodies
  (planets, Sun, Moon) at a given date/time
- Calculating rise, set, and transit times for celestial objects at a geographic
  location
- Determining planet distances, elongations, and angular separations
  (`position.separation_from(other)`)
- Discrete-event search via `almanac`: seasons (equinox/solstice), Moon phases,
  Sun/Moon rise-set, conjunctions/oppositions (`almanac.find_discrete`)
- Positions of catalog stars via `Star(ra_hours=…, dec_degrees=…)`
- Converting between coordinate frames (ICRS, apparent, horizontal, ecliptic)
- Time-scale conversions (UTC, TT, UT1, TAI, TDB)
- Satellite positions from TLE elements (via the bundled sgp4 dependency)

## When NOT to Use

- Coordinate transforms and general astronomical utilities without ephemerides
  (use **astropy** — it provides frames, units, FITS I/O, and cosmology)
- TLE propagation only (use **sgp4** directly — lighter, no ephemeris needed)
- Orbital mechanics or trajectory optimization (not covered by skyfield)
- Celestial mechanics N-body integration (skyfield reads precomputed
  ephemerides, it does not integrate)

## Capabilities

| Area | Key API |
|---|---|
| Load ephemeris | `load_file('artifacts/de421.bsp')` — load the bundled DE421 file (NO network) |
| Timescale | `api.load.timescale(builtin=True)` — built-in leap-second table |
| Positions | `earth.at(t).observe(mars).radec()` — astrometric RA, Dec, distance |
| Rise/set | `almanac.find_risings(observer, target, t0, t1)` |
| Discrete events | `almanac.find_discrete(t0, t1, almanac.seasons(eph))`, `moon_phases(eph)` |
| Stars | `from skyfield.api import Star` — `Star(ra_hours=…, dec_degrees=…)` |
| Separation | `pos.separation_from(other_pos)` — angular separation |
| Ecliptic | `apparent.ecliptic_latlon()` |
| Horizontal | `apparent.altaz()` — altitude, azimuth from a geographic topos |

**IMPORTANT:** Always load the ephemeris with `load_file('artifacts/de421.bsp')`.
Never use `load('de421.bsp')` — that attempts a network download which is
unavailable in the sandbox. The bundled DE421 covers years 1900-2050.

## Worked Example

Apparent position of Mars as seen from Earth at J2000.0:

```python
from skyfield.api import load_file
from skyfield import api

ts = api.load.timescale(builtin=True)
eph = load_file('artifacts/de421.bsp')
t = ts.tt_jd(2451545.0)
ra, dec, dist = eph['earth'].at(t).observe(eph['mars']).radec()
f'{round(ra._degrees, 4)} {round(dec.degrees, 4)} {round(dist.au, 6)}'
# => "330.524 -13.1807 1.849684"
```

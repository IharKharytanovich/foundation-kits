# pymap3d

pymap3d is a pure-Python geodetic coordinate-transform library. It converts
between geodetic (latitude/longitude/altitude), Earth-Centered Earth-Fixed
(ECEF), East-North-Up (ENU), North-East-Down (NED), and Azimuth-Elevation-
Slant-Range (AER) coordinate frames. These are the local-tangent-plane and
observer-to-target look-angle transforms used in satellite tracking, radar,
navigation, and geospatial analysis. pymap3d supports WGS84 and arbitrary
reference ellipsoids.

pymap3d has zero required dependencies — it runs on the Python standard-library
`math` module for scalar inputs. numpy, astropy, and pyproj are optional extras
(for array inputs, astronomical frames, and EPSG/CRS projections respectively)
and are not available in this environment.

## When to Use

- Converting geodetic coordinates (lat/lon/alt) to ECEF Cartesian coordinates or
  vice versa
- Computing local-tangent-plane (ENU or NED) offsets between two geodetic
  positions — e.g. how far east/north/up is target B from observer A
- Computing look angles (azimuth, elevation, slant range) from an observer to a
  target — the AER frame
- Chaining transforms: geodetic → ECEF → ENU → AER (or any subset/reverse)
- Working with non-WGS84 ellipsoids (GRS80, custom semi-major/semi-minor axes)
- Quick geodetic geometry without heavy GIS dependencies

## When NOT to Use

- **CRS/datum/EPSG reprojection** (map projections, UTM, state-plane,
  datum shifts) — use **pyproj**
- **Geodetic-crate transforms** (Vincenty/Karney geodesic distances, area on the
  ellipsoid) — use **geodesy**
- **Positional astronomy and ephemerides** (planet/star positions, time scales,
  proper motion) — use **skyfield** or **astropy**
- **General 3-D geometry or mesh operations** — use **trimesh** or **numpy**
- **Map tile / raster / vector GIS** — pymap3d does coordinate transforms only,
  not spatial data I/O

## Capabilities

| Area | Key API |
|---|---|
| Geodetic ↔ ECEF | `geodetic2ecef(lat, lon, alt)`, `ecef2geodetic(x, y, z)` |
| Geodetic ↔ ENU | `geodetic2enu(lat, lon, alt, lat0, lon0, alt0)`, `enu2geodetic(...)` |
| Geodetic ↔ NED | `geodetic2ned(...)`, `ned2geodetic(...)` |
| Geodetic ↔ AER | `geodetic2aer(...)`, `aer2geodetic(...)` |
| ECEF ↔ ENU | `ecef2enu(...)`, `enu2ecef(...)` |
| ECEF ↔ NED | `ecef2ned(...)`, `ned2ecef(...)` |
| AER ↔ ENU | `aer2enu(az, el, srange)`, `enu2aer(e, n, u)` |
| AER ↔ ECEF | `aer2ecef(...)`, `ecef2aer(...)` |
| Ellipsoid | All functions accept an optional `ell=` parameter for non-WGS84 ellipsoids |

All angles are in **degrees**; altitudes and ranges are in **metres**.

## Worked Example

Convert a geodetic position (42.0 N, 82.0 W, 200 m altitude) to ECEF:

```python
import pymap3d

str(tuple(round(v, 4) for v in pymap3d.geodetic2ecef(42.0, -82.0, 200.0)))
# -> "(660675.2518, -4700948.6832, 4245737.6622)"
```

The result is (X, Y, Z) in metres in the ECEF frame. To go back:

```python
import pymap3d

lat, lon, alt = pymap3d.ecef2geodetic(660675.2518, -4700948.6832, 4245737.6622)
# lat ~ 42.0, lon ~ -82.0, alt ~ 200.0
```

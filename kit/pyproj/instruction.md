# pyproj

pyproj is a Python interface to the PROJ library for cartographic projections
and coordinate reference system (CRS) transformations. It provides access to
over 10,000 EPSG coordinate reference systems, forward/inverse map projections,
geodesic distance and azimuth calculations, and datum transformations. The
Pyodide wheel bundles `libproj.so` and the full `proj.db` CRS database, so all
operations run fully offline with no network access required. The Python import
name is `pyproj`.

## When to Use

- Transforming coordinates between geographic (lat/lon) and projected coordinate
  systems (e.g. EPSG:4326 WGS84 to EPSG:3857 Web Mercator)
- Computing geodesic distances and azimuths between points on an ellipsoid
  (forward and inverse geodesic problems)
- Looking up and inspecting EPSG coordinate reference system definitions
  (parameters, datum, projection method, area of use)
- Converting between different geodetic datums (e.g. NAD27 to NAD83, WGS84 to
  ETRS89)
- Reprojecting geospatial data points for mapping, GIS analysis, or
  cartographic display

## When NOT to Use

- Computational geometry operations like polygon intersection, buffering, or
  convex hull (use **geos** — it provides GEOS planar geometry primitives)
- Geodetic coordinate transforms already covered by a narrower API (use
  **geodesy** for simple reference-ellipsoid calculations)
- Unit conversions between physical quantities (use **pint** for general
  unit handling)
- Astronomical coordinate frames or celestial mechanics (use **astropy** —
  `astropy.coordinates`)
- Raster/vector geospatial file I/O (out of scope — pyproj is CRS and
  projection only)

## Capabilities

| Area | Key API |
|---|---|
| CRS from EPSG | `pyproj.CRS.from_epsg(4326)` |
| CRS from string | `pyproj.CRS.from_user_input('EPSG:3857')`, WKT, PROJ string |
| Transform | `Transformer.from_crs(src, dst, always_xy=True)` then `.transform(x, y)` |
| Geodesic | `pyproj.Geod(ellps='WGS84')` → `.inv()`, `.fwd()`, `.npts()` |
| CRS info | `crs.name`, `crs.datum`, `crs.ellipsoid`, `crs.area_of_use` |
| Pipeline | `Transformer.from_pipeline('+proj=...')` for custom PROJ pipelines |

## Worked Example

Transform the Eiffel Tower from WGS84 (EPSG:4326) to Web Mercator (EPSG:3857):

```python
from pyproj import Transformer

t = Transformer.from_crs(4326, 3857, always_xy=True)
x, y = t.transform(2.2945, 48.8584)
f'{round(x,2)},{round(y,2)}'
# -> "255534.78,6250916.49"
```

Use `always_xy=True` to ensure the input order is (longitude, latitude)
regardless of the CRS axis order convention. For geodesic calculations, use
`Geod`:

```python
from pyproj import Geod

g = Geod(ellps='WGS84')
az12, az21, dist = g.inv(2.2945, 48.8584, -73.9857, 40.7484)
# dist is the geodesic distance in metres between Paris and New York
```

# pytz

pytz brings the IANA (Olson) timezone database into Python, providing `tzinfo`
implementations for every named timezone. It is the standard way to attach
timezone information to `datetime` objects in the Pyodide sandbox, enabling
correct conversions between UTC and local times, including historical offsets and
daylight-saving transitions.

## When to Use

- Converting a naive `datetime` to a timezone-aware `datetime` with a named zone
  (e.g. `US/Eastern`, `Europe/Berlin`)
- Converting an aware `datetime` from one timezone to another via `.astimezone()`
- Listing all available IANA timezone names for user selection or validation
- Looking up the canonical zone name for a given region or abbreviation
- Handling historical timezone transitions (pre-1970 offsets, abolished DST rules)

## When NOT to Use

- Date arithmetic, parsing, or formatting — use Python's built-in `datetime` or
  `python-dateutil` (bundled in the pandas kit) for that
- Calendar operations (weeks, business days, holidays) — not a calendar library
- Time-series analysis or resampling — use **pandas** with its timezone-aware
  `DatetimeIndex` instead
- Measuring elapsed wall-clock time — use `time.monotonic()` or `time.perf_counter()`

## Capabilities

| Area | Key API |
|---|---|
| Timezone lookup | `pytz.timezone('US/Eastern')` → a `tzinfo` instance |
| UTC constant | `pytz.utc` — the UTC timezone (preferred over `timezone('UTC')`) |
| Localize naive dt | `tz.localize(naive_dt)` — attach zone to a naive datetime |
| Convert zones | `aware_dt.astimezone(other_tz)` — move to another timezone |
| List all zones | `pytz.all_timezones` — frozenset of ~590 zone names |
| Common zones | `pytz.common_timezones` — curated subset without legacy aliases |
| Country mapping | `pytz.country_timezones` — ISO-3166 code → zone list |

**Important notes:**

- Always use `tz.localize(dt)` instead of `dt.replace(tzinfo=tz)` — the latter
  silently applies an incorrect historical offset for many zones.
- For arithmetic across DST boundaries, convert to UTC first, do the math, then
  convert back.
- pytz is the legacy approach; Python ≥ 3.9 ships `zoneinfo` in the stdlib. In
  the Pyodide sandbox, pytz remains the standard because `zoneinfo` may lack the
  bundled IANA database.

## Worked Example

Look up the canonical name of the UTC timezone:

```python
import pytz
pytz.timezone('UTC').zone
# → "UTC"
```

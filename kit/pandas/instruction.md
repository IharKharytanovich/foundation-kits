# pandas

pandas is the standard Python library for tabular data manipulation. It provides
DataFrame and Series data structures for loading, cleaning, transforming, and
analysing structured data. The Python import name is `pandas` (conventionally
aliased as `pd`). pandas depends on NumPy for array storage and pytz for
timezone handling; python-dateutil is bundled for datetime parsing.

## When to Use

- Creating, inspecting, and manipulating DataFrames and Series from raw data,
  dictionaries, or NumPy arrays
- Reading and writing tabular file formats (CSV, TSV, JSON, Parquet, Excel) via
  `read_csv`, `read_json`, `to_csv`, etc.
- Filtering, selecting, and slicing rows and columns (`loc`, `iloc`, `query`,
  boolean indexing)
- Grouping and aggregating data (`groupby`, `agg`, `transform`, `pivot_table`,
  `value_counts`, `crosstab`)
- Merging, joining, and concatenating multiple tables (`merge`, `join`, `concat`)
- Time-series analysis: resampling, rolling windows, date-range generation
- Handling missing data (`fillna`, `dropna`, `interpolate`, `isna`)
- Computing summary statistics (`describe`, `corr`, `cov`, `mean`, `sum`)

## When NOT to Use

- Low-level array math, linear algebra, or FFTs (use **numpy** — pandas is built
  on top of NumPy and adds overhead for non-tabular operations)
- Statistical distributions, hypothesis tests, or curve fitting (use **scipy**)
- Machine-learning model training, evaluation, or pipelines (use **scikit-learn**)
- Symbolic algebra or calculus (use **sympy**)
- Graph or network analysis (use **networkx**)
- Astronomical unit conversions or coordinate transforms (use **astropy**)

## Capabilities

| Area | Key API |
|---|---|
| Construction | `pd.DataFrame`, `pd.Series`, `pd.date_range`, `pd.Categorical` |
| I/O | `pd.read_csv`, `pd.read_json`, `pd.read_parquet`, `DataFrame.to_csv`, `DataFrame.to_json` |
| Selection | `DataFrame.loc`, `DataFrame.iloc`, `DataFrame.query`, boolean indexing |
| Grouping | `DataFrame.groupby`, `DataFrame.pivot_table`, `DataFrame.value_counts`, `pd.crosstab` |
| Joining | `pd.merge`, `pd.concat`, `DataFrame.join` |
| Time series | `DataFrame.resample`, `DataFrame.rolling`, `pd.to_datetime` |
| Missing data | `DataFrame.fillna`, `DataFrame.dropna`, `DataFrame.interpolate`, `DataFrame.isna` |
| Statistics | `DataFrame.describe`, `DataFrame.corr`, `DataFrame.mean`, `Series.sum` |

## Worked Example

Sum a simple integer series:

```python
import pandas as pd

s = pd.Series([1, 2, 3])
result = s.sum()
str(result)
# → "6"
```

`Series.sum()` returns the scalar total. For column-wise sums on a DataFrame,
use `DataFrame.sum(axis=0)`; for row-wise, `DataFrame.sum(axis=1)`. Chain with
`groupby` for grouped aggregations: `df.groupby('category')['value'].sum()`.

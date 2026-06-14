# intervaltree

intervaltree is a Python library that implements a self-balancing interval tree
for efficient overlap queries. It stores intervals as `(begin, end, data)`
tuples and supports fast insertion, deletion, and querying — finding all
intervals that overlap a point or range. The tree is built on sortedcontainers
(bundled) and has no other dependencies.

## When to Use

- Finding all genomic features (genes, exons, variants) that overlap a given
  coordinate range
- Interval scheduling — detecting overlapping time slots, bookings, or events
- Range queries on one-dimensional numeric data (e.g. which sensors cover a
  given frequency band)
- Merging, chopping, or splitting overlapping intervals
- Building spatial indices for 1D segment data when you need fast stabbing
  queries (point-in-interval)

## When NOT to Use

- Indexed random access into FASTA sequences by coordinate (use **pyfaidx** —
  it reads indexed FASTA files directly)
- 2D/3D spatial queries, R-trees, or k-d trees (use **scipy**
  `scipy.spatial.KDTree`)
- Graph or network overlap problems (use **networkx**)
- Symbolic interval arithmetic or set algebra (use **sympy**)

## Capabilities

| Area | Key API |
|---|---|
| Construction | `IntervalTree()`, `IntervalTree.from_tuples([(b,e,d), ...])` |
| Insertion | `tree[begin:end] = data`, `tree.add(Interval(b, e, d))` |
| Point query | `tree[point]` — set of intervals containing the point |
| Range query | `tree[begin:end]` — set of intervals overlapping the range |
| Envelope | `tree.begin()`, `tree.end()` — span of the tree |
| Merge | `tree.merge_overlaps(data_reducer=...)` |
| Chop/slice | `tree.chop(begin, end)`, `tree.slice(point)` |
| Remove | `tree.remove(interval)`, `tree.discard(interval)` |
| Iteration | `for iv in tree:` — `iv.begin`, `iv.end`, `iv.data` |

## Worked Example

Insert two overlapping intervals and query the overlap region:

```python
from intervaltree import IntervalTree
t = IntervalTree()
t[100:200] = 'A'
t[150:250] = 'B'
str(sorted(iv.data for iv in t[160:170]))
# → "['A', 'B']"
```

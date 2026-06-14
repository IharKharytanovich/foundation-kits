# spglib

spglib is a C library for finding and handling crystal symmetries. It determines
space groups, lists symmetry operations, reduces a cell to its primitive form,
and standardizes crystal structures using the International Tables for
Crystallography (ITA) conventions. Given a set of lattice vectors, atomic
positions, and atom types, spglib returns the international (Hermann-Mauguin)
space-group symbol and ITA number, the full set of symmetry operations
(rotations + translations), per-atom Wyckoff letters, the primitive cell, and
the standardized conventional cell.

This kit exposes spglib as five strict operations over a single CLI binary. All
operations take the **same** structure description and differ only in what they
report.

## Input format

Every operation reads one crystal structure (whitespace-delimited text):

```
a_x a_y a_z        # basis vector a (Cartesian, Angstrom) — one vector per row
b_x b_y b_z        # basis vector b
c_x c_y c_z        # basis vector c
N                  # number of atoms
fx fy fz           # fractional coordinates, one line per atom (N lines)
t1 t2 ... tN       # integer atom types (same integer = same species)
symprec            # symmetry tolerance, e.g. 1e-5
```

Basis vectors are given as **rows** (the spglib Python `cell` convention); the
binary transposes to spglib's column-vector C convention internally.

## When to Use

- **`get-spacegroup`** — classify a structure by its space group (international
  symbol + ITA number), e.g. recognise FCC/BCC/hexagonal.
- **`get-dataset`** — get the full symmetry summary in one call: international +
  Hall symbol, Hall number, point group, number of symmetry operations, atom
  count, and per-atom Wyckoff letters.
- **`get-symmetry`** — list every symmetry operation (3×3 integer rotation matrix
  + translation vector) for symmetry-adapted calculations.
- **`find-primitive`** — reduce a conventional cell to its primitive cell (fewer
  atoms for downstream DFT / molecular-dynamics input).
- **`standardize-cell`** — produce the standardized, idealized conventional cell
  (canonical lattice + symmetrized positions per ITA conventions).
- Comparing two structures: run `get-spacegroup` (or `get-dataset`) on each at a
  chosen `symprec` and compare.

## When NOT to Use

- Building crystal structures from CIF/XYZ files or converting between file
  formats (use **ase** -- it reads/writes structures; spglib analyses their
  symmetry)
- Computing interatomic potentials, total energies, or running molecular dynamics
  (use **ase** for structure setup and calculator interfaces)
- Visualising crystal structures or generating publication-quality figures (not a
  CLI capability)
- General-purpose linear algebra or numerical computation on arrays (use
  **numpy** or **scipy**)

## Capabilities

| Operation | What it does | Output |
|---|---|---|
| `get-spacegroup` | Space-group identification | `<symbol> (<number>)` |
| `get-dataset` | Full symmetry dataset | labeled lines: international, number, hall_symbol, hall_number, pointgroup, n_operations, n_atoms, wyckoffs |
| `get-symmetry` | All symmetry operations | `n_operations: N` + N lines of 9 rotation ints + 3 translation floats |
| `find-primitive` | Primitive-cell reduction | `lattice:` + 3 rows, `atoms: M` + M `fx fy fz type` lines |
| `standardize-cell` | Standardized conventional cell | same layout as `find-primitive` |

## Worked Example

Determine the space group of BCC iron (body-centred cubic, conventional cell with
a = 2.87 A, 2 atoms at (0,0,0) and (0.5,0.5,0.5)).

Input on stdin (lattice vectors, atom count, fractional positions, types,
symprec):

```
2.87 0.0 0.0
0.0 2.87 0.0
0.0 0.0 2.87
2
0.0 0.0 0.0
0.5 0.5 0.5
1 1
1e-5
```

`get-spacegroup` output:

```
Im-3m (229)
```

`find-primitive` on the same structure reduces the 2-atom conventional cell to
the 1-atom BCC primitive cell:

```
lattice:
-1.435000 1.435000 1.435000
1.435000 -1.435000 1.435000
1.435000 1.435000 -1.435000
atoms: 1
0.000000 0.000000 0.000000  1
```

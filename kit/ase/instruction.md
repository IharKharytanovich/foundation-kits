# ase

ASE (Atomic Simulation Environment) is a Python library for setting up,
manipulating, and analysing atomistic structures. It provides the Atoms object
for representing molecules and crystals, builders for common structures (bulk,
surfaces, nanotubes, molecules), file I/O for dozens of formats (CIF, XYZ,
POSCAR, extxyz, Protein Data Bank), and geometric analysis (distances, angles,
neighbour lists, cell operations). ASE requires numpy and scipy at runtime.
Note: matplotlib is listed as a dependency but is not available in this sandbox;
plotting functions will not work, but all structural building, I/O, and analysis
capabilities function correctly without it.

## When to Use

- Building crystal structures (FCC, BCC, HCP, diamond, zincblende) with
  specified lattice parameters
- Reading/writing atomistic structure files (CIF, XYZ, POSCAR, extxyz, PDB,
  VASP, Gaussian, etc.)
- Creating surfaces, slabs, nanotubes, or nanoparticles from bulk structures
- Computing geometric properties: distances, angles, dihedral angles,
  centre of mass, moments of inertia
- Manipulating unit cells: supercells, strain, rotation, periodic boundary
  conditions
- Neighbour-list calculations and coordination analysis

## When NOT to Use

- Organic molecule manipulation via SMILES/SMARTS or substructure search (use
  **rdkit**)
- Stoichiometry balancing or chemical reaction equations (use **chempy**)
- Elemental property lookups without structure context (use **mendeleev** or
  **periodictable**)
- Symbolic mathematics or equation solving (use **sympy**)
- General numerical linear algebra without atomic context (use **numpy** or
  **scipy** directly)

## Capabilities

| Area | Key API |
|---|---|
| Atoms object | `Atoms(symbols, positions, cell, pbc)` |
| Bulk builder | `ase.build.bulk('Cu', 'fcc', a=3.6)` |
| Surface builder | `ase.build.fcc111('Au', size=(3,3,4), vacuum=10)` |
| Molecule builder | `ase.build.molecule('H2O')` |
| File I/O | `ase.io.read('file.cif')`, `ase.io.write('out.xyz', atoms)` |
| Cell ops | `atoms.get_volume()`, `atoms.get_cell()`, `atoms * (2,2,2)` |
| Geometry | `atoms.get_distances(0, [1,2])`, `atoms.get_angle(0,1,2)` |
| Neighbour lists | `ase.neighborlist.NeighborList(cutoffs)` |

## Worked Example

Build an FCC copper unit cell with lattice parameter 3.6 A and compute its
volume:

```python
from ase.build import bulk
str(round(bulk('Cu', 'fcc', a=3.6).get_volume(), 6))
# -> "11.664"
```

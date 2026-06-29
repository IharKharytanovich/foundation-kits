# pythtb — tight-binding electronic structure

## What it does

PythTB builds and solves tight-binding (TB) Hamiltonians for crystalline solids
and finite systems. Core capabilities:

- **Model construction** — define lattice vectors, orbital positions, on-site
  energies, and hopping parameters (real or complex) for arbitrary dimensionality
  (1D chains, 2D sheets, 3D bulk).
- **Band structure** — solve the Hamiltonian at arbitrary k-points
  (`solve_ham(k_pts=…)`) to obtain eigenvalues and eigenvectors.
- **Berry phase & Wannier centers** — compute Berry phases along closed loops in
  k-space, hybrid Wannier charge centers, and related topological invariants.
- **Topological invariants** — Z2 invariant, Chern number via discretized Berry
  curvature or Wilson loops.
- **Finite systems** — cut a periodic model to produce finite (open-boundary)
  clusters; compute edge/surface states.

## When to Use

- You need a tight-binding model of a crystal (SSH chain, graphene, topological
  insulator, Weyl semimetal, …).
- You need band structure eigenvalues/eigenvectors at specific k-points.
- You need Berry phase, Wannier centers, or topological invariants (Z2, Chern).
- You need to study edge states by cutting a periodic model.

## When NOT to Use

- **DFT / ab-initio electronic structure** — PythTB does not perform
  self-consistent field calculations; it only solves a user-defined TB
  Hamiltonian. Use a DFT kit if one exists.
- **Symmetry analysis / Brillouin-zone paths** — for high-symmetry k-paths and
  space-group operations, use `spglib` or `seekpath`.
- **Molecular orbital theory** — PythTB is for periodic/finite lattice models,
  not molecular quantum chemistry.

## matplotlib note

`import pythtb` does NOT require matplotlib — matplotlib is only needed for
PythTB's `.visualize()` plotting helpers. The core computation (model building,
solving, Berry phase) works without matplotlib. Avoid calling `.visualize()` or
any plotting method in sandboxed code unless plotting output is explicitly needed.

## Worked example (golden)

Build a 1D two-site SSH chain (on-site energy 0, intra-cell hopping t = 1.0),
solve at k = 0, and print sorted eigenvalues:

```python
from pythtb import tb_model
import warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
my_model = tb_model(1, 1, lat=[[1.0]], orb=[[0.0],[0.5]])
my_model.set_onsite([0.0, 0.0])
my_model.set_hop(1.0, 0, 1, [0])
eval_k = my_model.solve_ham(k_pts=[[0.0]])
print(str([round(float(x),6) for x in sorted(eval_k)]))
```

Output: `[-1.0, 1.0]`

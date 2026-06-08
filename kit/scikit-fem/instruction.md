# scikit-fem

scikit-fem is a pure-Python library for performing finite element assembly. It
transforms bilinear forms into sparse matrices and linear forms into vectors,
targeting PDEs on triangular, quadrilateral, tetrahedral, and hexahedral
meshes. The Python import name is `skfem`. It requires NumPy and SciPy at
runtime.

## When to Use

- Assembling stiffness, mass, or load matrices for finite element problems
  (Poisson, elasticity, heat, Stokes, etc.)
- Solving PDEs on 1D, 2D, or 3D meshes with various element types (P1, P2,
  Q1, Q2, Crouzeix-Raviart, mini, bubble, etc.)
- Building custom weak forms by combining `BilinearForm` and `LinearForm`
  with user-defined integrands
- Adaptive mesh refinement driven by a posteriori error estimators
- Eigenvalue problems discretised via finite elements (e.g. vibration modes,
  Laplacian eigenvalues)

## When NOT to Use

- Finite differences on regular grids (use **findiff** — scikit-fem builds
  FEM matrices on unstructured meshes, not stencil arrays)
- Spectral / polynomial-chaos uncertainty quantification (use **chaospy**)
- Symbolic PDE derivation or analytical integration (use **sympy**)
- Optimisation or curve fitting (use **scipy** or **iminuit**)
- Large-scale mesh generation (scikit-fem has built-in simple meshes; for
  complex domains import meshes via meshio)

## Capabilities

| Area | Key API |
|---|---|
| Meshes | `MeshTri`, `MeshQuad`, `MeshTet`, `MeshHex`, `MeshLine` |
| Mesh constructors | `.init_symmetric()`, `.init_circle()`, `.init_tensor()` |
| Elements | `ElementTriP1`, `ElementTriP2`, `ElementQuad1`, `ElementTetP1`, ... |
| Assembly | `BilinearForm(integrand)`, `LinearForm(integrand)`, `.assemble(basis)` |
| Basis | `Basis(mesh, element)` — maps element to mesh for assembly |
| Solvers | `solve(K, f)`, `condense(K, f, D=bc)` — apply BCs and solve |
| Refinement | `mesh.refined()`, `mesh.adaptive(facets)` |

## Worked Example

Create a default triangular mesh and count its vertices:

```python
import skfem

str(skfem.MeshTri().p.shape[1])
# → "4"
```

A minimal Poisson solve on a unit square starts with `MeshTri.init_symmetric()`,
builds a `Basis` with `ElementTriP1`, assembles the stiffness matrix via a
`BilinearForm`, applies boundary conditions with `condense`, and calls `solve`.

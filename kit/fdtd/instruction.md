# fdtd

fdtd is a pure-Python finite-difference time-domain (FDTD) Maxwell
electromagnetic wave simulator. It models the propagation of electromagnetic
fields in 1-D, 2-D, and 3-D grids using the Yee algorithm, supporting perfectly
matched layer (PML) absorbing boundaries, various source types (point sources,
line sources, plane sources), detectors (field probes, block detectors), and
material objects with custom permittivity/permeability. fdtd runs on a NumPy
backend by default; a PyTorch backend exists but is optional and not used in this
kit. fdtd requires NumPy and SciPy at runtime; matplotlib and tqdm are also
imported at load time but are provided by the pyodide distribution and are not
bundled as kit dependencies.

## When to Use

- Simulating time-domain electromagnetic wave propagation (Maxwell's equations)
  in 1-D, 2-D, or 3-D finite grids
- Modelling PML absorbing boundary conditions for open-domain problems
- Studying source injection (point, line, plane) and field detection over time
- Investigating wave interaction with dielectric or magnetic objects/materials
- Educational demonstrations of FDTD wave phenomena (reflection, refraction,
  diffraction, interference)

## When NOT to Use

- **Frequency-domain** electromagnetic analysis (use dedicated FEM/MoM solvers)
- **Paraxial geometric (ray) optics** — ABCD matrix, thin-lens, Gaussian beams
  (use **raytracing**)
- **Physical/Fourier optics** — PSF, MTF, Zernike wavefront analysis (use
  **prysm**)
- **Static or quasi-static** electric/magnetic field problems (Poisson/Laplace
  solvers, not time-domain FDTD)
- **Large-scale 3-D simulations** requiring GPU acceleration (fdtd's NumPy
  backend is CPU-only; for GPU, external FDTD tools or the optional PyTorch
  backend would be needed, but are not available in this kit)

## Capabilities

| Area | Key API |
|---|---|
| Grid | `fdtd.Grid(shape, grid_spacing)` — create a simulation grid |
| Sources | `fdtd.PointSource(period)`, `fdtd.LineSource(period)`, `fdtd.PlaneSource(period)` |
| Boundaries | `fdtd.PML(num_layers)`, `fdtd.PeriodicBoundary()` |
| Objects | `fdtd.Object(permittivity, name)`, `fdtd.AnisotropicObject(...)` |
| Detectors | `fdtd.BlockDetector(name)`, `fdtd.CurrentDetector(name)` |
| Stepping | `grid.step()` — advance one time step; `grid.run(steps)` |
| Backend | `fdtd.set_backend('numpy')` — select the compute backend |
| Fields | `grid.E`, `grid.H` — electric/magnetic field arrays |

## Runtime Dependencies

- **numpy** and **scipy** — listed as kit dependencies.
- **matplotlib** and **tqdm** — imported at module load time; provided by the
  pyodide distribution (not bundled as kit dependencies).
- **torch** — optional alternative backend; NOT used by this kit (the numpy
  backend is always selected via `fdtd.set_backend('numpy')`).

## Worked Example

Create a 1-D free-space grid, inject a point source, step 40 times, and report
the total squared electric field (a deterministic scalar on the numpy backend):

```python
import fdtd
fdtd.set_backend('numpy')
g = fdtd.Grid(shape=(50,1,1), grid_spacing=1e-6)
g[10,0,0] = fdtd.PointSource(period=15e-15)
[g.step() for _ in range(40)]
print(round(float((g.E**2).sum()), 6))
# -> "8.728638"
```

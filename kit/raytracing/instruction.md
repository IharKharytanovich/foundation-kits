# Raytracing

Raytracing is a pure-Python paraxial optics library implementing ABCD
ray-transfer matrix formalism. It models optical systems as sequences of
elements (lenses, mirrors, spaces, apertures, dielectrics), computes system
matrices, traces rays, and determines conjugate planes, image formation, and
principal planes.

## When to Use

- Computing the ABCD transfer matrix of a compound optical system (lenses,
  spaces, mirrors, dielectric interfaces)
- Finding object/image conjugates, magnification, and principal planes
- Tracing paraxial rays (height and angle) through a system
- Modeling thin and thick lenses, aperture stops, field stops
- Evaluating back/front focal distances and effective focal length
- Simple Gaussian beam propagation through paraxial elements

## When NOT to Use

- Full wave-optics or electromagnetic field simulation (not covered)
- Non-paraxial / exact ray tracing with aberrations (this is the paraxial
  approximation only)
- Optical design optimization (no merit function / optimizer)
- Diffraction simulation (use **diffraction** for X-ray/neutron diffraction)
- General numerical computation (use **numpy** / **scipy**)

## Capabilities

| Area | Key API |
|---|---|
| Elements | `Space(d=...)`, `Lens(f=...)`, `ThickLens(...)`, `DielectricInterface(...)`, `Aperture(...)` |
| System matrix | `system = elem1 * elem2 * ...` — multiply elements left-to-right |
| ABCD entries | `system.A`, `system.B`, `system.C`, `system.D` |
| Trace | `system.trace(ray)` — propagate a `Ray(y, theta)` through the system |
| Conjugates | `system.forwardConjugate()`, `system.backwardConjugate()` |
| Focal lengths | `system.effectiveFocalLengths()`, `system.backFocalLength()` |
| Principal planes | `system.principalPlanePositions()` |
| Ray-tracing path | `ImagingPath(elements=[...])` — multi-ray tracing, field of view, image size |
| Gaussian beams | `LaserPath(elements=[...])` — propagate a `GaussianBeam(w=...)` through the system |

Use `ImagingPath`/`LaserPath` (numerical methods, e.g. `.trace()`,
`.imagingMagnification()`, `.eigenModes()`) when modeling a full system; the
bare `Matrix` product (`Space(d) * Lens(f)`) is enough for ABCD entries and
conjugates. `GaussianBeam` propagation goes through `LaserPath`, not the bare
matrix product.

Note: GUI/display and OpenCL-accelerated features are not available in the
sandbox.

## Worked Example

ABCD matrix of a 10 mm free space followed by a thin lens with f = 5 mm:

```python
from raytracing import Space, Lens

m = Space(d=10) * Lens(f=5)
f'A={round(m.A, 1)} B={round(m.B, 1)} C={round(m.C, 1)} D={round(m.D, 1)}'
# => "A=-1.0 B=10.0 C=-0.2 D=1.0"
```

This is the standard matrix product: Space(d) * Lens(f) =
[[1-d/f, d], [-1/f, 1]] = [[-1, 10], [-0.2, 1]].

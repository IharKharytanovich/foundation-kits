# ikpy

ikpy is a Python library for robot kinematics. It builds kinematic chains from
URDF files or programmatic link lists and computes forward kinematics (joint
angles to end-effector pose), optimization-based inverse kinematics (target pose
to joint angles via scipy.optimize), and geometric Jacobians. ikpy requires
numpy, scipy, and sympy at runtime; sympy is used internally for symbolic
rotation matrices.

## When to Use

- Computing the end-effector position/orientation of a robot arm given joint
  angles (forward kinematics)
- Solving for joint angles that place the end-effector at a target pose
  (inverse kinematics via numerical optimization)
- Computing the geometric Jacobian of a kinematic chain for velocity-level
  control or singularity analysis
- Loading a URDF robot description and querying its kinematic tree
- Prototyping pick-and-place, reach-analysis, or workspace-boundary studies
  for serial manipulators

## When NOT to Use

- Rigid-body dynamics, contact forces, or physics simulation (use a physics
  engine or dynamics library)
- Trajectory optimization or optimal control (use **casadi** or a dedicated
  motion-planning framework)
- Parallel/closed-loop mechanisms (ikpy models open serial chains only)
- Visualization or 3D rendering of the robot (ikpy's optional plot extra
  requires matplotlib/graphviz, which are not available in this environment)

## Dependencies

- **numpy** and **scipy** — numerical computation and optimization
- **sympy** — symbolic rotation matrices (imported at load time; listed in
  `dependencies[]`)
- matplotlib and graphviz are **optional** (`plot` extra) and are NOT available
  in this environment; do not import them

## Capabilities

| Area | Key API |
|---|---|
| Chain construction | `Chain.from_urdf_file(path)`, `Chain(name, links=[...])` |
| Forward kinematics | `chain.forward_kinematics(joints)` → 4x4 homogeneous matrix |
| Inverse kinematics | `chain.inverse_kinematics(target_position)` → joint angles |
| IK with orientation | `chain.inverse_kinematics(target_position, target_orientation, orientation_mode)` |
| Jacobian | `chain.jacobian(joints)` → 6xN geometric Jacobian |
| Link types | `OriginLink()`, `URDFLink(name, origin_translation, origin_orientation, rotation)` |

## Worked Example

Build a simple 2-link planar arm and compute the end-effector position at a
90-degree elbow bend:

```python
import numpy as np
from ikpy.chain import Chain
from ikpy.link import OriginLink, URDFLink

c = Chain(name='arm', links=[
    OriginLink(),
    URDFLink(name='l1', origin_translation=[1,0,0],
             origin_orientation=[0,0,0], rotation=[0,0,1]),
    URDFLink(name='l2', origin_translation=[1,0,0],
             origin_orientation=[0,0,0], rotation=[0,0,1])
])
T = c.forward_kinematics([0, np.pi/2, 0])
print([round(float(x), 4) for x in T[:3,3]])
# -> "[1.0, 1.0, 0.0]"
```

The first link rotates 90 degrees about Z, placing its tip at (0, 1, 0)
relative to (1, 0, 0); the second link extends one unit along the rotated X
axis, reaching (1, 1, 0). A typical inverse-kinematics call:

```python
target = [1.5, 0.5, 0.0]
joints = c.inverse_kinematics(target)
# joints is an array of joint angles that bring the end-effector near `target`
```

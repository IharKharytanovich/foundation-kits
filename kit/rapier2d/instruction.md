# Rapier2D

Rapier2D is a 2D physics engine compiled from Rust to WebAssembly via
wasm-bindgen. It runs as a JS-WASM callable library — you write free JS against
the loaded module handle. The runtime calls `init()` before handing you the
handle; your script must NOT call `init()` itself.

## When to Use

- 2D rigid-body physics simulations (gravity, collisions, bouncing)
- 2D collision detection and ray-casting
- Simulating mechanical systems in two dimensions
- Verifying physics-based calculations (projectile motion, pendulums)

## When NOT to Use

- 3D physics simulations (use rapier3d)
- Symbolic mechanics or analytical solutions (use sympy)
- Fluid dynamics or continuous PDE solvers (use specialized PDE kits)
- Graphics rendering (this is physics only, no visuals)

## Scripting

This kit supports free JS scripting against the module handle. The handle
exposes the full Rapier2D API after initialization:

- `new handle.World({x, y})` — create a physics world with gravity vector
- `handle.RigidBodyDesc.dynamic()` / `.fixed()` / `.kinematicPositionBased()` — body descriptors
- `bodyDesc.setTranslation(x, y)` — set initial position
- `w.createRigidBody(desc)` — add a rigid body to the world
- `handle.ColliderDesc.ball(radius)` / `.cuboid(hx, hy)` — collider shapes
- `w.createCollider(desc, body)` — attach a collider to a body
- `w.timestep = dt` — set the simulation timestep
- `w.step()` — advance the simulation by one timestep
- `body.translation()` — get current position `{x, y}`
- `body.linvel()` — get current linear velocity `{x, y}`

### Worked Example

```js
// Drop a ball from y=10 under gravity for 1 second (60 steps at 1/60s)
const w = new handle.World({x: 0, y: -9.81});
const b = w.createRigidBody(
  handle.RigidBodyDesc.dynamic().setTranslation(0, 10)
);
w.createCollider(handle.ColliderDesc.ball(0.5), b);
w.timestep = 1 / 60;
for (let i = 0; i < 60; i++) w.step();
return b.translation().y.toFixed(3);
// => "5.075"
```

## Golden capture

```bash
cd /tmp && mkdir -p golden && cd golden && npm init -y && npm install @dimforge/rapier2d-compat@0.19.3
node -e "
(async () => {
  const handle = require('@dimforge/rapier2d-compat');
  await handle.init();
  const w = new handle.World({x:0,y:-9.81});
  const b = w.createRigidBody(handle.RigidBodyDesc.dynamic().setTranslation(0,10));
  w.createCollider(handle.ColliderDesc.ball(0.5),b);
  w.timestep=1/60;
  for(let i=0;i<60;i++) w.step();
  console.log(b.translation().y.toFixed(3));
})();
"
# Expected output: 5.075
```

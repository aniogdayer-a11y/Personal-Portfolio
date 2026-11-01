export const PULL_THRESHOLD = 80;
export const MAX_PULL = 114;
export interface Motion { x: number; y: number; vx: number; vy: number; angle: number; angularVelocity: number }
export interface EntryDrop extends Motion { caught: boolean }
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function pendulumRise(x: number, length: number) {
  const radius = Math.max(100, length);
  const horizontal = clamp(x, -radius * .8, radius * .8);
  return radius - Math.sqrt(radius * radius - horizontal * horizontal);
}
export function dragTarget(dx: number, dy: number, maxX: number, length = 180) {
  const limit = Math.max(1, Math.min(maxX, Math.max(100, length) * .72));
  const x = limit * Math.tanh(dx / limit);
  const pull = dy >= 0 ? MAX_PULL * Math.tanh(dy / 145) : 68 * Math.tanh(dy / 90);
  return { x, y: pull - pendulumRise(x, length) };
}

// Exact solution of a damped spring over one interval. Small substeps below
// handle the coupling between the pendulum's horizontal and vertical motion.
function spring(s: Motion, position: 'x' | 'y' | 'angle', velocity: 'vx' | 'vy' | 'angularVelocity', target: number, k: number, damping: number, dt: number) {
  const displacement = s[position] - target;
  const v = s[velocity];
  const decay = damping / 2;
  const discriminant = k - decay * decay;
  let x: number, nextV: number;
  if (discriminant > .00001) {
    const frequency = Math.sqrt(discriminant);
    const a = Math.cos(frequency * dt), b = Math.sin(frequency * dt);
    const envelope = Math.exp(-decay * dt);
    x = envelope * (displacement * a + (v + decay * displacement) / frequency * b);
    nextV = envelope * (v * a - (decay * v + k * displacement) / frequency * b);
  } else if (discriminant < -.00001) {
    const root = Math.sqrt(-discriminant);
    const slow = -decay + root, fast = -decay - root;
    const a = (v - fast * displacement) / (slow - fast), b = displacement - a;
    x = a * Math.exp(slow * dt) + b * Math.exp(fast * dt);
    nextV = slow * a * Math.exp(slow * dt) + fast * b * Math.exp(fast * dt);
  } else {
    const b = v + decay * displacement, envelope = Math.exp(-decay * dt);
    x = (displacement + b * dt) * envelope;
    nextV = (v - decay * b * dt) * envelope;
  }
  s[position] = target + x;
  s[velocity] = nextV;
}

// The entrance falls from outside the scene, then the lanyard catches its
// weight. Solve the catch time exactly so slower frames don't skip the recoil.
export function stepEntryDrop(s: EntryDrop, dt: number, reduced: boolean) {
  if (reduced) { s.y = 0; s.vy = 0; s.caught = true; return; }
  if (!Number.isFinite(dt) || dt <= 0) return;
  let remaining = Math.min(dt, .08);
  if (!s.caught) {
    const gravity = 1600, catchAt = -40;
    const catchTime = s.y >= catchAt ? 0 : (-s.vy + Math.sqrt(s.vy ** 2 + 2 * gravity * (catchAt - s.y))) / gravity;
    const fallingTime = Math.min(remaining, catchTime);
    s.y += s.vy * fallingTime + gravity * fallingTime ** 2 / 2;
    s.vy += gravity * fallingTime;
    remaining -= fallingTime;
    if (fallingTime === catchTime) s.caught = true;
  }
  if (s.caught && remaining > 0) spring(s, 'y', 'vy', 0, 110, 23, remaining);
}

export function stepMotion(s: Motion, target: { x: number; y: number }, dt: number, dragging: boolean, length: number, reduced: boolean) {
  if (!Number.isFinite(dt) || dt <= 0) return s;
  const elapsed = Math.min(dt, .08);
  const steps = Math.ceil(elapsed / (1 / 240));
  const h = elapsed / steps;
  const horizontalLimit = Math.min(150, Math.max(100, length) * .75);
  const gravitySpring = clamp(1800 / Math.max(100, length), 6, 18);
  for (let i = 0; i < steps; i++) {
    spring(s, 'x', 'vx', clamp(target.x, -horizontalLimit, horizontalLimit), dragging ? 620 : reduced ? 90 : gravitySpring,
      dragging ? 43 : reduced ? 20 : Math.sqrt(gravitySpring) * 1.4, h);
    const verticalTarget = dragging ? target.y : target.y - pendulumRise(s.x, length);
    spring(s, 'y', 'vy', clamp(verticalTarget, -100, MAX_PULL), dragging ? 540 : reduced ? 90 : 68,
      dragging ? 42 : reduced ? 20 : 13.5, h);
    if (reduced) { s.angle = 0; s.angularVelocity = 0; }
    else {
      const angleTarget = clamp(-Math.atan2(s.x, Math.max(100, length)) * 180 / Math.PI * .55 + s.vx * .004, -14, 14);
      spring(s, 'angle', 'angularVelocity', angleTarget, 60, 14, h);
    }
    // Dissipate outward velocity at the safety bounds; don't let hidden energy
    // build up against the clamp and fling the ID when the pointer is released.
    if (Math.abs(s.x) > horizontalLimit) { s.x = clamp(s.x, -horizontalLimit, horizontalLimit); s.vx = 0; }
    if (s.y < -100 || s.y > MAX_PULL) { s.y = clamp(s.y, -100, MAX_PULL); s.vy = 0; }
    if (Math.abs(s.angle) > 14) { s.angle = clamp(s.angle, -14, 14); s.angularVelocity = 0; }
  }
  return s;
}

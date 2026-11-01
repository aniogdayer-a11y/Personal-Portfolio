export const PULL_THRESHOLD = 80;
export const MAX_PULL = 114;
export interface Motion { x: number; y: number; vx: number; vy: number; angle: number; angularVelocity: number }
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function dragTarget(dx: number, dy: number, maxX: number) {
  const x = maxX * Math.tanh(dx / (maxX * 1.15));
  const pull = dy > 0 ? MAX_PULL * Math.tanh(dy / 155) : Math.max(-16, dy * .12);
  return { x, y: pull - Math.abs(x) ** 2 / 1600 };
}
export function stepMotion(s: Motion, target: { x: number; y: number }, dt: number, dragging: boolean, length: number, reduced: boolean) {
  // Fixed substeps keep spring integration stable after dropped frames.
  const steps = Math.ceil(Math.min(dt, .04) / .008);
  const h = Math.min(dt, .04) / Math.max(1, steps);
  for (let i = 0; i < steps; i++) {
    const k = dragging ? 380 : 42;
    const damping = dragging ? 35 : 6.8;
    s.vx += ((target.x - s.x) * k - s.vx * damping) * h;
    s.vy += ((target.y - s.y) * (dragging ? 420 : 76) - s.vy * (dragging ? 35 : 11)) * h;
    s.x += s.vx * h; s.y += s.vy * h;
    const angleTarget = reduced ? 0 : -Math.atan2(s.x, length) * 180 / Math.PI * .6 + s.vx * .006;
    s.angularVelocity += ((angleTarget - s.angle) * 34 - s.angularVelocity * 7.8) * h;
    s.angle = clamp(s.angle + s.angularVelocity * h, -14, 14);
    s.x = clamp(s.x, -150, 150); s.y = clamp(s.y, -42, MAX_PULL);
  }
  return s;
}

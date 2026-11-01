import test from 'node:test';
import assert from 'node:assert/strict';
import { dragTarget, stepMotion, MAX_PULL, PULL_THRESHOLD } from '../src/utils/physics.ts';
const state = (values = {}) => ({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0, ...values });

test('horizontal and upward dragging never arm the pull switch', () => {
  for (const dx of [-100000, -300, 0, 300, 100000]) {
    const t = dragTarget(dx, 0, 100);
    assert.ok(Math.abs(t.x) <= 100);
    assert.ok(t.y < PULL_THRESHOLD);
    assert.ok(dragTarget(dx, -50000, 100).y < PULL_THRESHOLD);
  }
});
test('pulling has increasing resistance and a hard travel limit', () => {
  assert.ok(dragTarget(0, 40, 100).y < PULL_THRESHOLD);
  assert.ok(dragTarget(0, 170, 100).y > PULL_THRESHOLD);
  assert.ok(dragTarget(0, 100000, 100).y <= MAX_PULL);
  const first = dragTarget(0, 100, 100).y - dragTarget(0, 50, 100).y;
  const last = dragTarget(0, 350, 100).y - dragTarget(0, 300, 100).y;
  assert.ok(first > last);
});
test('released ID settles back to its attached resting point', () => {
  const s = state({ x: 100, y: 110, vx: 200, vy: -240, angle: 12 });
  for (let i = 0; i < 600; i++) stepMotion(s, { x: 0, y: 0 }, 1/60, false, 180, false);
  assert.ok(Math.abs(s.x) < .01 && Math.abs(s.y) < .01 && Math.abs(s.angle) < .01);
});
test('variable frame rates and long pauses stay finite and constrained', () => {
  for (const dt of [1/30, 1/60, 1/120, 3]) {
    const s = state();
    for (let i = 0; i < 1000; i++) {
      stepMotion(s, { x: 1000, y: 1000 }, dt, true, 150, false);
      assert.ok(Object.values(s).every(Number.isFinite));
      assert.ok(Math.abs(s.x) <= 150 && s.y <= MAX_PULL && Math.abs(s.angle) <= 14);
    }
  }
});
test('reduced motion suppresses rotation during dragging', () => {
  const s = state();
  for (let i = 0; i < 120; i++) stepMotion(s, { x: 100, y: 40 }, 1/60, true, 180, true);
  assert.equal(s.angle, 0);
});

test('release sway stays consistent between 60 Hz and 120 Hz', () => {
  const simulate = rate => {
    const s = state({ x: 85, vx: 30, angle: -7 });
    for (let i = 0; i < rate; i++) stepMotion(s, { x: 0, y: 0 }, 1/rate, false, 180, false);
    return s;
  };
  const slow = simulate(60), fast = simulate(120);
  assert.ok(Math.abs(slow.x - fast.x) < .5);
  assert.ok(Math.abs(slow.angle - fast.angle) < .25);
});

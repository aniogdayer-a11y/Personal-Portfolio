import test from 'node:test';
import assert from 'node:assert/strict';
import { dragTarget, pendulumRise, stepEntryDrop, stepMotion, MAX_PULL, PULL_THRESHOLD } from '../src/utils/physics.ts';
const state = (values = {}) => ({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularVelocity: 0, ...values });

test('horizontal and upward dragging never arm the pull switch', () => {
  for (const dx of [-100000, -300, 0, 300, 100000]) {
    const t = dragTarget(dx, 0, 100);
    assert.ok(Math.abs(t.x) <= 100);
    assert.ok(t.y < PULL_THRESHOLD);
    assert.ok(dragTarget(dx, -50000, 100).y < PULL_THRESHOLD);
  }
});
test('pull resistance increases smoothly before the lanyard travel limit', () => {
  assert.ok(dragTarget(0, 40, 100).y < PULL_THRESHOLD);
  assert.ok(dragTarget(0, 170, 100).y > PULL_THRESHOLD);
  assert.ok(dragTarget(0, 100000, 100).y <= MAX_PULL);
  const early = dragTarget(0, 75, 100).y - dragTarget(0, 25, 100).y;
  const late = dragTarget(0, 275, 100).y - dragTarget(0, 225, 100).y;
  assert.ok(early > late && late > 0);
  assert.ok(dragTarget(0, 50, 100).y > 0 && dragTarget(0, 50, 100).y < 50);
  assert.ok(dragTarget(0, -60, 100).y < 0);
});
test('released ID settles back to its attached resting point', () => {
  const s = state({ x: 100, y: 110, vx: 200, vy: -240, angle: 12 });
  for (let i = 0; i < 600; i++) stepMotion(s, { x: 0, y: 0 }, 1/60, false, 180, false);
  assert.ok(Math.abs(s.x) < .01 && Math.abs(s.y) < .01 && Math.abs(s.angle) < .01);
});

test('entry swing has inertia, crosses the rest point, then settles softly', () => {
  const s = state({ x: 28, y: -pendulumRise(28, 180), vx: -18, angle: -4 });
  let leftmost = s.x;
  for (let i = 0; i < 360; i++) {
    stepMotion(s, { x: 0, y: 0 }, 1/60, false, 180, false);
    leftmost = Math.min(leftmost, s.x);
    assert.ok(Math.abs(s.y) < 5, 'Side-to-side motion should not become a vertical bounce');
  }
  assert.ok(leftmost < -1 && leftmost > -8);
  assert.ok(Math.abs(s.x) < .01 && Math.abs(s.y) < .01 && Math.abs(s.angle) < .01);
});

test('entrance falls from above, is caught by the lanyard, and settles within its travel', () => {
  for (const startY of [-450, -700, -900]) {
    const s = { ...state({ y: startY }), caught: false };
    let previous = s.y, lowest = 0;
    for (let i = 0; i < 360; i++) {
      stepEntryDrop(s, 1/60, false);
      if (!s.caught) assert.ok(s.y >= previous && s.vy > 0);
      assert.ok(Math.abs(s.y - previous) < 30, 'Entrance must not snap at the catch');
      lowest = Math.max(lowest, s.y);
      previous = s.y;
    }
    assert.ok(s.caught && lowest > 5 && lowest < MAX_PULL);
    assert.ok(Math.abs(s.y) < .01 && Math.abs(s.vy) < .01);
  }
});

test('entrance trajectory is consistent across frame rates', () => {
  const sample = rate => {
    const s = { ...state({ y: -700 }), caught: false };
    for (let i = 0; i < rate; i++) stepEntryDrop(s, 1/rate, false);
    return s;
  };
  const reference = sample(120);
  for (const rate of [30, 60, 144]) {
    const s = sample(rate);
    assert.ok(Math.abs(s.y - reference.y) < .001 && Math.abs(s.vy - reference.vy) < .001);
  }
});

test('reduced motion skips the entrance fall', () => {
  const s = { ...state({ y: -700, vy: 400 }), caught: false };
  stepEntryDrop(s, 1/60, true);
  assert.equal(s.y, 0);
  assert.equal(s.vy, 0);
  assert.equal(s.caught, true);
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

test('horizontal targets follow a hanging arc rather than stretching the strap', () => {
  for (const dx of [-200, -80, 0, 80, 200]) {
    const t = dragTarget(dx, 0, 125, 180);
    assert.ok(Math.abs(Math.hypot(t.x, 180 + t.y) - 180) < .0001);
  }
});

test('frame rates from 30 to 144 Hz follow the same release trajectory', () => {
  const sample = rate => {
    const s = state({ x: 85, y: 70, vx: 30, vy: -50, angle: -7 });
    for (let i = 0; i < rate * 2; i++) stepMotion(s, { x: 0, y: 0 }, 1/rate, false, 180, false);
    return s;
  };
  const reference = sample(120);
  for (const rate of [30, 60, 144]) {
    const actual = sample(rate);
    for (const key of ['x', 'y', 'angle']) assert.ok(Math.abs(actual[key] - reference[key]) < .1, `${rate} Hz: ${key}`);
  }
});

test('resting ID does not acquire energy and invalid time steps do not move it', () => {
  const s = state();
  for (let i = 0; i < 300; i++) stepMotion(s, { x: 0, y: 0 }, 1/60, false, 180, false);
  assert.deepEqual(s, state());
  for (const dt of [0, -1, NaN, Infinity]) stepMotion(s, { x: 100, y: 100 }, dt, true, 180, false);
  assert.deepEqual(s, state());
});

test('reduced motion also cancels an existing angular swing', () => {
  const s = state({ x: 85, angle: 10, angularVelocity: 40 });
  stepMotion(s, { x: 0, y: 0 }, 1/60, false, 180, true);
  assert.equal(s.angle, 0);
  assert.equal(s.angularVelocity, 0);
});

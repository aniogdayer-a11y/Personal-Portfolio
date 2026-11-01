import test from 'node:test';
import assert from 'node:assert/strict';
import { work } from '../src/data/portfolioData.ts';
import { filterProjects } from '../src/utils/projectCatalog.ts';

test('All Work retains one unique record per project', () => {
  const all = filterProjects(work, 'All Work');
  assert.equal(new Set(all.map(project => project.id)).size, all.length);
  assert.equal(all.length, 9);
});

test('EduFocus appears in two relevant categories from the same record', () => {
  const design = filterProjects(work, 'UI/UX Design').find(project => project.id === 'edufocus');
  const development = filterProjects(work, 'Web Development').find(project => project.id === 'edufocus');
  assert.ok(design);
  assert.equal(design, development);
  assert.equal(filterProjects(work, 'UI/UX Design').length, 2);
  assert.equal(filterProjects(work, 'Design').length, 3);
  assert.equal(filterProjects(work, 'Graphic Design').length, 6);
});

test('Tiled contribution is third in Design and is not claimed as web development', () => {
  const game = filterProjects(work, 'Design')[2];
  assert.equal(game.id, 'the-last-ember');
  assert.equal(game.role, 'Map Design Contributor');
  assert.deepEqual(game.tools, ['Tiled']);
  assert.equal(filterProjects(work, 'Web Development', 'Tiled').length, 0);
  assert.equal(filterProjects(work, 'Design', 'Tiled')[0], game);
  assert.ok(game.video.src.endsWith('.mp4'));
  assert.ok(game.overview.includes('assisted a friend'));
});

test('Search combines with category membership and keeps AI references inside EduFocus', () => {
  assert.equal(filterProjects(work, 'UI/UX Design', '  edufocus ').length, 1);
  assert.equal(filterProjects(work, 'Graphic Design', 'edufocus').length, 0);
  assert.equal(filterProjects(work, 'Web Development', 'MySQL')[0].id, 'edufocus');
  const edu = work.find(project => project.id === 'edufocus');
  assert.equal(edu.images.length, 1);
  assert.ok(!edu.images.some(image => /ai-assistant/i.test(image.src)));
});

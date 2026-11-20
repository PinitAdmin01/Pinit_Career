import test from 'node:test';
import assert from 'node:assert/strict';
import { displayPuzzleLabel, seededScramble } from '../src/lib/puzzles/puzzleScramble';
import { generateLessonPuzzle } from '../src/lib/puzzles/lessonPuzzleEngine';
import { getLongLesson } from '../src/lib/data/longLessons';

const WEB = ['react-basics', 'node-web', 'sql-mastery', 'dsa-optim', 'devops', 'cloud', 'dist', 'cyber', 'ai', 'sre-web', 'stream-web', 'aideploy-web', 'fullstack-js'];

test('displayPuzzleLabel hides the position number', () => {
  assert.equal(displayPuzzleLabel('3. Foo bar'), 'Foo bar');
  assert.equal(displayPuzzleLabel('# 2. String Concatenation'), 'String Concatenation');
  assert.equal(displayPuzzleLabel('Decoy Trap: Anti-Pattern Violation'), 'Decoy Trap: Anti-Pattern Violation');
});

test('the pool is never in the correct order or its exact reverse, on every web lesson', () => {
  let checked = 0;
  for (const prefix of WEB) {
    for (let day = 1; day <= 60; day++) {
      const lesson = getLongLesson(prefix, day);
      if (!lesson) continue;
      const puzzle = generateLessonPuzzle(`${prefix}-lecture1-day-${day}`, prefix, day, lesson);
      if (puzzle.correctOrder.length < 3) continue;
      const pool = seededScramble(puzzle.blocks, puzzle.id, puzzle.correctOrder);
      const steps = pool.map((b) => b.id).filter((id) => puzzle.correctOrder.includes(id));
      assert.notDeepEqual(steps, puzzle.correctOrder, `${prefix} day ${day} pool is already solved`);
      assert.notDeepEqual(steps, [...puzzle.correctOrder].reverse(), `${prefix} day ${day} pool is exactly reversed`);
      assert.equal(pool.length, puzzle.blocks.length, 'no block lost');
      checked++;
    }
  }
  assert.ok(checked > 700, `expected to check most web lessons, checked ${checked}`);
});

test('the shuffle is deterministic for the same puzzle and differs between puzzles', () => {
  const lesson = getLongLesson('node-web', 5)!;
  const p = generateLessonPuzzle('node-web-lecture1-day-5', 'node-web', 5, lesson);
  const a = seededScramble(p.blocks, p.id, p.correctOrder).map((b) => b.id).join(',');
  const b = seededScramble(p.blocks, p.id, p.correctOrder).map((b) => b.id).join(',');
  assert.equal(a, b);
  const patterns = new Set<string>();
  for (let day = 1; day <= 30; day++) {
    const l = getLongLesson('node-web', day)!;
    const pz = generateLessonPuzzle(`node-web-lecture1-day-${day}`, 'node-web', day, l);
    patterns.add(seededScramble(pz.blocks, pz.id, pz.correctOrder).map((x) => (x.id.startsWith('decoy') ? 'D' : x.id.slice(-1))).join(''));
  }
  assert.ok(patterns.size > 5, `pools look the same every day (${patterns.size} distinct patterns)`);
});

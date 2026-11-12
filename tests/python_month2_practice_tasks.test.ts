/**
 * [FIX-STAGE: phase2d-m2-practice] Verification suite for Python Month 2 (Days 31-60) Practice Tasks.
 * Executes all 60 runnable Python tasks against CPython 3 + findForbiddenPython security filter:
 * - Registry wiring inside COURSES_REGISTRY ('course-python-backend': 60 lectures + 120 practices + 12 block tests)
 * - Zero findForbiddenPython hits across starters, reference answers, and test suites
 * - Every starter fails closed
 * - Every reference answer passes
 * - Constant-return cheats fail across all 60 tasks
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { PYTHON_MONTH2_CONFIGS, PYTHON_MONTH2_QUESTS } from '../src/lib/data/pythonMonth2Tasks';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';
import { resolveQuestLanguage } from '../src/components/quests/workspace/useWorkspaceState';

const pythonBin =
  spawnSync('python3', ['--version'], { stdio: ['ignore', 'pipe', 'pipe'] }).status === 0
    ? 'python3'
    : spawnSync('python', ['--version'], { stdio: ['ignore', 'pipe', 'pipe'] }).status === 0
    ? 'python'
    : null;

function gradeLikeServer(code: string, testSuite: string) {
  const blocked = findForbiddenPython(`${code}\n${testSuite}`);
  if (blocked) return { ok: false, out: `blocked by pythonGuard: ${blocked}` };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'py-m2-task-'));
  try {
    fs.writeFileSync(path.join(dir, 'solution.py'), code);
    const indented = testSuite.split('\n').map((line) => '    ' + line).join('\n');
    fs.writeFileSync(
      path.join(dir, 'runner.py'),
      `from solution import *\ntry:\n${indented}\n    print('PASSED')\nexcept AssertionError as e:\n    raise SystemExit(f'AssertionError: {e}')\n`
    );
    const r = spawnSync(pythonBin!, ['runner.py'], {
      cwd: dir,
      encoding: 'utf8',
      timeout: 10000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { ok: r.status === 0 && r.stdout.includes('PASSED'), out: `${r.stdout}${r.stderr}` };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('Python Month 2 defines 30 days (Days 31-60) with 60 coding tasks wired into course-python-backend', () => {
  assert.equal(PYTHON_MONTH2_CONFIGS.length, 30);
  assert.equal(PYTHON_MONTH2_QUESTS.length, 90); // 30 lectures + 60 practices
  assert.deepEqual(
    PYTHON_MONTH2_CONFIGS.map((c) => c.day),
    Array.from({ length: 30 }, (_, i) => 31 + i)
  );

  const course = COURSES_REGISTRY.find((c) => c.id === 'course-python-backend');
  assert.ok(course, 'course-python-backend must exist in COURSES_REGISTRY');
  // 60 lectures + 120 practices + 12 five-day block tests = 192
  assert.equal(course.quests.length, 192, `Expected 192 quests, got ${course.quests.length}`);

  const ids = course.quests.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate quest IDs detected in course-python-backend');

  for (let d = 31; d <= 60; d++) {
    const lecture = course.quests.find((q) => q.id === `python-lecture1-day-${d}`);
    const ex = course.quests.find((q) => q.id === `python-exam-day-${d}`);
    const assign = course.quests.find((q) => q.id === `python-assign-day-${d}`);
    assert.ok(lecture, `Missing python-lecture1-day-${d}`);
    assert.ok(ex && ex.testSuite, `Missing practice 1 for day ${d}`);
    assert.ok(assign && assign.testSuite, `Missing practice 2 for day ${d}`);
    assert.equal(resolveQuestLanguage(ex, ex.id), 'python');
    assert.equal(resolveQuestLanguage(assign, assign.id), 'python');
  }
});

test('All 60 Python Month 2 tasks pass pythonGuard and avoid browser-blocking input()', () => {
  for (const cfg of PYTHON_MONTH2_CONFIGS) {
    for (const [label, src] of [
      ['eStarter', cfg.eStarter],
      ['eHint', cfg.eHint],
      ['eTest', cfg.eTest],
      ['aStarter', cfg.aStarter],
      ['aHint', cfg.aHint],
      ['aTest', cfg.aTest],
    ] as const) {
      assert.ok(src && src.trim().length > 0, `Day ${cfg.day} ${label} is empty`);
      assert.ok(!/\binput\(/.test(src), `Day ${cfg.day} ${label} uses input()`);
      const blocked = findForbiddenPython(src);
      assert.equal(blocked, null, `Day ${cfg.day} ${label} tripped pythonGuard: ${blocked}`);
    }
  }
});

test('Every Python Month 2 practice task: reference solution passes and starter fails in Python', () => {
  assert.ok(pythonBin, 'Python interpreter must be installed to verify Month 2 tasks');
  for (const cfg of PYTHON_MONTH2_CONFIGS) {
    const tasks = [
      { name: 'Practice 1', starter: cfg.eStarter!, check: cfg.eTest!, solution: cfg.eHint! },
      { name: 'Practice 2', starter: cfg.aStarter!, check: cfg.aTest!, solution: cfg.aHint! },
    ];
    for (const t of tasks) {
      const label = `Day ${cfg.day} ${t.name} (${cfg.title})`;
      const good = gradeLikeServer(t.solution, t.check);
      assert.ok(good.ok, `${label}: reference solution failed:\n${good.out}`);
      const bad = gradeLikeServer(t.starter, t.check);
      assert.ok(!bad.ok, `${label}: unfinished starter already passed`);
    }
  }
});

test('All 60 Python Month 2 tasks reject constant-return pass-through stubs', () => {
  assert.ok(pythonBin, 'Python interpreter must be installed');
  for (const cfg of PYTHON_MONTH2_CONFIGS) {
    for (const [idx, pair] of [
      [1, { starter: cfg.eStarter!, check: cfg.eTest! }],
      [2, { starter: cfg.aStarter!, check: cfg.aTest! }],
    ] as const) {
      for (const constVal of ['None', 'True', 'False', '0', '[]', '{}']) {
        const rigged = pair.starter.replace(/\bpass\b/g, `return ${constVal}`);
        const res = gradeLikeServer(rigged, pair.check);
        assert.ok(!res.ok, `Day ${cfg.day} Practice ${idx} accepted trivial return ${constVal}`);
      }
    }
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { resolveQuestLanguage } from '../src/components/quests/workspace/useWorkspaceState';
import { buildJsTaskScript } from '../src/lib/code/runners/jsTaskScript';

type Quest = { id: string; category?: string; starterCode?: string; testSuite?: string };

/** Runs a JavaScript practice task the way the sandbox worker does (new Function(script)(), then waits). */
async function gradeJs(code: string, testSuite: string): Promise<{ passed: boolean; error?: string }> {
  // The browser worker has these too.
  const context = vm.createContext({ console: { log() {}, error() {} }, setTimeout, clearTimeout, Promise, URL, URLSearchParams, TextEncoder, TextDecoder });
  try {
    const result = vm.runInContext(`(function () {\n${buildJsTaskScript(code, testSuite)}\n})()`, context, { timeout: 3000 });
    await result;
    return { passed: true };
  } catch (err) {
    return { passed: false, error: String((err as Error)?.message ?? err) };
  }
}

function tasks(courseId: string): Quest[] {
  const course = (COURSES_REGISTRY as { id: string; quests: Quest[] }[]).find((c) => c.id === courseId);
  assert.ok(course, `${courseId} not found`);
  return course.quests.filter((q) => q.testSuite && String(q.testSuite).trim());
}

test('a correct JavaScript answer passes and a wrong one fails with the check message', async () => {
  const suite = "if (isGoodSalary(500000) !== true) throw new Error('500000 should be true');\nif (isGoodSalary(300000) !== false) throw new Error('300000 should be false');";
  assert.deepEqual(await gradeJs('function isGoodSalary(salary) { return salary >= 500000; }', suite), { passed: true });
  assert.deepEqual(await gradeJs('function isGoodSalary(salary) { return true; }', suite), { passed: false, error: '300000 should be false' });
  assert.equal((await gradeJs('function isGoodSalary(salary) {', suite)).passed, false);
});

test('checks that use await are waited for', async () => {
  const suite = "const v = await load();\nif (v !== 7) throw new Error('load() must resolve to 7');";
  assert.equal((await gradeJs('async function load() { return 7; }', suite)).passed, true);
  const wrong = await gradeJs('async function load() { return 6; }', suite);
  assert.deepEqual(wrong, { passed: false, error: 'load() must resolve to 7' });
});

test('the checks can reuse the student\'s variable names', async () => {
  const suite = "const total = sum([1, 2]);\nif (total !== 3) throw new Error('sum must add');";
  assert.equal((await gradeJs('const total = 0;\nfunction sum(a) { return a.reduce((x, y) => x + y, total); }', suite)).passed, true);
});

test('tasks written in JavaScript go to the JavaScript checker, other languages keep theirs', () => {
  for (const id of ['course-react-web', 'course-dsa-optim', 'course-devops-cicd', 'course-cloud-native', 'course-ai-eng', 'course-nlp']) {
    for (const q of tasks(id)) assert.equal(resolveQuestLanguage(q, q.id), 'javascript', q.id);
  }
  for (const q of tasks('course-python-backend')) assert.equal(resolveQuestLanguage(q, q.id), 'python', q.id);
  for (const q of tasks('course-database-eng')) assert.equal(resolveQuestLanguage(q, q.id), 'sql', q.id);
  for (const q of tasks('course-java-logic')) assert.equal(resolveQuestLanguage(q, q.id), 'java', q.id);
});

test('every React practice task fails when the student has not written the answer yet', async () => {
  const react = tasks('course-react-web');
  assert.equal(react.length, 60);
  for (const q of react) {
    const result = await gradeJs(String(q.starterCode || ''), String(q.testSuite));
    assert.equal(result.passed, false, `${q.id}: the starter code already passes`);
  }
});

/** Reference answers, kept out of the app so students never download them. */
const SOLUTIONS: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/practice_solutions.json'), 'utf8'));

const CHECKED_COURSES = ['course-design-systems', 'course-ai-eng', 'course-distributed-sys', 'course-cybersecurity', 'course-nlp', 'course-ai-prompt-literacy'];

test('every practice task in the checked courses: the reference answer passes, the starting code fails', async () => {
  // A check that forgets to wait for async code can throw after the test ends; count it as a failure there instead.
  let late = 0;
  const onLate = () => { late++; };
  process.on('unhandledRejection', onLate);
  try {
    for (const courseId of CHECKED_COURSES) {
      const list = tasks(courseId);
      assert.equal(list.length, 60, courseId);
      for (const q of list) {
        const solution = SOLUTIONS[q.id];
        assert.ok(solution, `${q.id}: no reference answer in tests/fixtures/practice_solutions.json`);
        const right = await gradeJs(solution, String(q.testSuite));
        assert.equal(right.passed, true, `${q.id}: the reference answer fails: ${right.error}`);
        const blank = await gradeJs(String(q.starterCode || ''), String(q.testSuite));
        assert.equal(blank.passed, false, `${q.id}: the starting code already passes`);
        assert.ok(!String(q.starterCode).includes(solution.trim()), `${q.id}: the starting code contains the answer`);
      }
    }
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(late, 0, 'a check threw after the task finished (missing await)');
  } finally {
    process.off('unhandledRejection', onLate);
  }
});

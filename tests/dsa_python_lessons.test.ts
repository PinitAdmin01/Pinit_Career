import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

import { DSA_PYTHON_PILOT_DAYS } from '../src/lib/data/dsaPythonPilotDays';
import { DSA_PILOT_DAYS } from '../src/lib/data/dsaPilotDays';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { CRASH_COURSE_PLANS } from '../src/lib/data/crashPlansData';
import { resolvePilotDay } from '../src/lib/data/curriculumEnricher';
import { getLongLessonLanguage } from '../src/lib/data/longLessons';
import { resolveQuestLanguage } from '../src/components/quests/workspace/useWorkspaceState';

const blocks = () => DSA_PYTHON_PILOT_DAYS.flatMap((d) => d.blocks);
const mediaOf = (type: string) => blocks().flatMap((b) => (b.media as any[]).filter((m) => m.type === type).map((m) => ({ id: b.id, m })));

test('every DSA-in-Python lesson example runs in python3 and prints its expected output', () => {
  const examples = mediaOf('runnable_code');
  assert.equal(examples.length, 90);
  for (const { id, m } of examples) {
    assert.match(m.filename, /\.py$/, id);
    const out = execFileSync('python3', ['-c', m.initialCode], { encoding: 'utf8' }).trimEnd();
    assert.equal(out, m.expectedOutput, id);
  }
});

test('DSA-in-Python lessons show no JavaScript', () => {
  const js = /console\.log|\bconst |\blet |===|=>|\bfunction\b|Math\.|\.length\b|\bnull\b|\bundefined\b|JavaScript/;
  for (const { id, m } of mediaOf('runnable_code')) assert.doesNotMatch(m.initialCode, js, id);
  for (const { id, m } of mediaOf('syntax_anatomy')) {
    assert.doesNotMatch(m.codeSnippet, js, id);
    const lines = m.codeSnippet.split('\n').length;
    for (const [line, note] of Object.entries(m.lineNotes || {})) {
      assert.ok(Number(line) <= lines, `${id}: note for line ${line} of ${lines}`);
      assert.doesNotMatch(String(note), js, id);
    }
  }
  const text = JSON.stringify(DSA_PYTHON_PILOT_DAYS.map((d) => ({ ...d, blocks: d.blocks.map((b) => ({ ...b, media: [] })) })));
  assert.doesNotMatch(text, /JavaScript|Math\.|===|\bnull\b/);
});

test('DSA in Python keeps the same days and blocks as the DSA course', () => {
  assert.deepEqual(
    DSA_PYTHON_PILOT_DAYS.map((d) => d.blocks.map((b) => b.id)),
    DSA_PILOT_DAYS.map((d) => d.blocks.map((b) => b.id)),
  );
  assert.equal(resolvePilotDay('dsa-py', 12)?.blocks[0].id, 'dsa-d12-b1-divide-and-conquer-halving');
  assert.equal(getLongLessonLanguage('dsa-py'), 'python');
});

test('DSA in Python is a registered course with Python practice, and the Python track uses it', () => {
  const course = COURSES_REGISTRY.find((c) => c.id === 'course-dsa-python');
  assert.ok(course, 'course-dsa-python is registered');
  const practice = course!.quests.filter((q: any) => /-(exam|assign)-day-\d+$/.test(q.id));
  assert.equal(practice.length, 60);
  for (const q of practice) assert.equal(resolveQuestLanguage(q, q.id), 'python', q.id);
  assert.ok(course!.quests.some((q: any) => q.id === 'dsa-py-test-days-1-5'), 'has the 5-day tests');

  for (const plan of CRASH_COURSE_PLANS) {
    const ids = JSON.stringify(plan.modulesByTrack.python_ai);
    assert.ok(!ids.includes('course-dsa-optim'), `${plan.id}: the Python track uses DSA in Python`);
  }
});

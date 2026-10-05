import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, execSync } from 'node:child_process';

import { DayLessonPlan } from '../src/lib/types/lessonEngine';
import { DSA_PYTHON_PILOT_DAYS } from '../src/lib/data/dsaPythonPilotDays';
import { DSA_PILOT_DAYS } from '../src/lib/data/dsaPilotDays';
import { AI_PYTHON_PILOT_DAYS } from '../src/lib/data/aiPythonPilotDays';
import { AI_PILOT_DAYS } from '../src/lib/data/aiPilotDays';
import { DIST_PYTHON_PILOT_DAYS } from '../src/lib/data/distPythonPilotDays';
import { DISTRIBUTED_PILOT_DAYS } from '../src/lib/data/distributedPilotDays';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { CRASH_COURSE_PLANS } from '../src/lib/data/crashPlansData';
import { resolvePilotDay } from '../src/lib/data/curriculumEnricher';
import { getLongLessonLanguage } from '../src/lib/data/longLessons';
import { resolveQuestLanguage } from '../src/components/quests/workspace/useWorkspaceState';

/* Check for python3 once at the top so tests skip visibly instead of silently. */
const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
let hasPython = false;
try {
  execSync(`${pythonCmd} --version`, { stdio: 'pipe' });
  hasPython = true;
} catch {
  hasPython = false;
}

/** Each Python-track course: its lessons, the JavaScript course they come from, and what it replaces in the plans. */
const COURSES = [
  { id: 'course-dsa-python', prefix: 'dsa-py', lessons: DSA_PYTHON_PILOT_DAYS, from: DSA_PILOT_DAYS, replaces: 'course-dsa-optim', examples: 90 },
  { id: 'course-ai-python', prefix: 'ai-py', lessons: AI_PYTHON_PILOT_DAYS, from: AI_PILOT_DAYS, replaces: 'course-ai-eng', examples: 90 },
  { id: 'course-distributed-python', prefix: 'dist-py', lessons: DIST_PYTHON_PILOT_DAYS, from: DISTRIBUTED_PILOT_DAYS, replaces: 'course-distributed-sys', examples: 90 },
];

const mediaOf = (days: DayLessonPlan[], type: string) =>
  days.flatMap((d) => d.blocks.flatMap((b) => (b.media as any[]).filter((m) => m.type === type).map((m) => ({ id: b.id, m }))));

const JS = /console\.log|\bconst |\blet |===|=>|\bfunction\s+\w+\s*\(|Math\.|\.length\b|\bnull\b|\bundefined\b|JavaScript|JSON\.parse|Promise\./;

for (const course of COURSES) {
  test(`${course.id}: every lesson example runs in python3 and prints its expected output`, { skip: !hasPython ? 'python3 not installed' : false }, () => {
    const examples = mediaOf(course.lessons, 'runnable_code');
    assert.equal(examples.length, course.examples);
    for (const { id, m } of examples) {
      assert.match(m.filename, /\.py$/, id);
      const out = execFileSync(pythonCmd, ['-c', m.initialCode], {
        encoding: 'utf8',
        env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' },
      }).replace(/\r\n/g, '\n').trimEnd();
      assert.equal(out, m.expectedOutput, id);
    }
  });

  test(`${course.id}: the lessons show no JavaScript`, () => {
    for (const { id, m } of mediaOf(course.lessons, 'runnable_code')) assert.doesNotMatch(m.initialCode, JS, id);
    for (const { id, m } of mediaOf(course.lessons, 'syntax_anatomy')) {
      assert.doesNotMatch(m.codeSnippet, JS, id);
      assert.doesNotMatch(m.codeSnippet, /^\s*\/\//m, `${id}: // comments are JavaScript; Python uses #`);
      const lines = m.codeSnippet.split('\n').length;
      for (const [line, note] of Object.entries(m.lineNotes || {})) {
        assert.ok(Number(line) <= lines, `${id}: note for line ${line} of ${lines}`);
        assert.doesNotMatch(String(note), JS, id);
      }
    }
    for (const day of course.lessons) {
      for (const block of day.blocks) {
        for (const m of block.media as any[]) {
          if (m.data?.type === 'broken_fixed_diff') assert.doesNotMatch(`${m.data.brokenCode}\n${m.data.fixedCode}`, /^\s*\/\/|\bfunction\b|\bconst /m, block.id);
        }
      }
    }
    const text = JSON.stringify(course.lessons.map((d) => ({ ...d, blocks: d.blocks.map((b) => ({ ...b, media: [] })) })));
    assert.doesNotMatch(text, /JavaScript|Math\.|===|\bnull\b|JSON\.parse|Promise\./);
  });

  test(`${course.id}: the same days and blocks as the course it comes from`, () => {
    assert.deepEqual(course.lessons.map((d) => d.blocks.map((b) => b.id)), course.from.map((d) => d.blocks.map((b) => b.id)));
    assert.equal(resolvePilotDay(course.prefix, 12)?.blocks[0].id, course.from[11].blocks[0].id);
    assert.equal(getLongLessonLanguage(course.prefix), 'python');
  });

  test(`${course.id}: registered with Python practice, and the Python track uses it`, () => {
    const registered = COURSES_REGISTRY.find((c) => c.id === course.id);
    assert.ok(registered, `${course.id} is registered`);
    const practice = registered!.quests.filter((q: any) => /-(exam|assign)-day-\d+$/.test(q.id));
    assert.equal(practice.length, 60);
    for (const q of practice) assert.equal(resolveQuestLanguage(q, q.id), 'python', q.id);
    assert.ok(registered!.quests.some((q: any) => q.id === `${course.prefix}-test-days-1-5`), 'has the 5-day tests');
    for (const plan of CRASH_COURSE_PLANS) {
      assert.ok(!JSON.stringify(plan.modulesByTrack.python_ai).includes(`'${course.replaces}'`) && !JSON.stringify(plan.modulesByTrack.python_ai).includes(`"${course.replaces}"`), `${plan.id}: the Python track uses ${course.id}`);
    }
  });
}

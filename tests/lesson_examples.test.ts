import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { parseQuestId, resolvePilotDay } from '../src/lib/data/curriculumEnricher';
import { getLongLesson } from '../src/lib/data/longLessons';
import { withLessonHelpers } from '../src/lib/code/sandbox/lessonHelpers';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

// The shorter lessons (every course without a long lesson) have runnable examples. The lesson page
// runs them in the browser sandbox: no require, Buffer or Node crypto; lesson helpers added when used;
// wrapped in an async function; output sent after pending timers finish. This runs them the same way.

const PLAN_COURSES = ['course-fullstack-js', 'course-dsa-optim', 'course-devops-cicd', 'course-cloud-native', 'course-design-systems', 'course-ai-eng', 'course-distributed-sys', 'course-cybersecurity', 'course-nlp', 'course-quant-systems', 'course-ai-prompt-literacy'];

type Example = { id: string; code: string; expected: string };

function examples(): Example[] {
  const out: Example[] = [];
  for (const courseId of PLAN_COURSES) {
    const course = COURSES_REGISTRY.find((c) => c.id === courseId)!;
    for (const quest of course.quests) {
      if (!/-lecture1-day-\d+$/.test(quest.id)) continue;
      const parsed = parseQuestId(quest.id)!;
      if (getLongLesson(parsed.prefix, parsed.dayNum)) continue;
      for (const block of resolvePilotDay(parsed.prefix, parsed.dayNum)?.blocks || []) {
        const media = Array.isArray(block.media) ? block.media : block.media ? [block.media] : [];
        for (const m of media) {
          if (m?.type === 'runnable_code' && m.initialCode) out.push({ id: `${quest.id} ${block.id}`, code: m.initialCode, expected: m.expectedOutput || '' });
        }
      }
    }
  }
  return out;
}

async function runLikeLessonPage(code: string): Promise<{ output: string; error: string }> {
  const logs: string[] = [];
  const pending = new Set<ReturnType<typeof setTimeout>>();
  const trackedSetTimeout = (fn: (...a: unknown[]) => void, ms?: number, ...args: unknown[]) => {
    const id = setTimeout(() => { pending.delete(id); fn(...args); }, ms);
    pending.add(id);
    return id;
  };
  const trackedClearTimeout = (id: ReturnType<typeof setTimeout>) => { pending.delete(id); clearTimeout(id); };
  const context = vm.createContext({
    console: { log: (...a: unknown[]) => logs.push(formatLogArgs(a)), error: (...a: unknown[]) => logs.push(formatLogArgs(a)), warn: () => {} },
    setTimeout: trackedSetTimeout, clearTimeout: trackedClearTimeout, Promise, URL, URLSearchParams, TextEncoder, TextDecoder, atob, btoa, crypto: globalThis.crypto, structuredClone,
  });
  try {
    await vm.runInContext(`(function () { return (async () => {\n${withLessonHelpers(code)}\n})(); })()`, context, { timeout: 4000 });
    // Like the worker: check on the next tick (so promise chains finish), then until timers are done.
    const deadline = Date.now() + 3000;
    do await new Promise((r) => setTimeout(r, 0));
    while (pending.size > 0 && Date.now() < deadline);
    return { output: logs.join('\n'), error: '' };
  } catch (err) {
    return { output: logs.join('\n'), error: String((err as Error)?.message ?? err) };
  }
}

/** Output that changes on every run (random ids, the current time) is not compared. */
const usesChance = (code: string) => /Math\.random|Date\.now|new Date\(|randomHex|getRandomValues|performance\.now/.test(code);
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

test('every lesson example in the plan courses runs in the browser sandbox', async () => {
  const list = examples();
  // Originally > 1000 before courses migrated from shorter pilot days to full 30-day long lessons (getLongLesson).
  // With 11 web courses now using long lessons, exactly 600 runnable code examples remain in the shorter
  // curriculum blocks across legacy courses (course-fullstack-js, course-nlp, course-quant-systems, course-ai-prompt-literacy).
  // Enforce the real count of 600 (reversing the unreported loosening to > 500 in commit 9ecd5bda per E-24 / F-17).
  assert.ok(list.length >= 600, `expected at least 600 runnable examples, found ${list.length}`);


  const broken: string[] = [];
  const wrongOutput: string[] = [];
  for (const ex of list) {
    const { output, error } = await runLikeLessonPage(ex.code);
    if (error) broken.push(`${ex.id}: ${error}`);
    else if (ex.expected && !usesChance(ex.code) && norm(output) !== norm(ex.expected)) wrongOutput.push(`${ex.id}\n    prints:  ${norm(output).slice(0, 120)}\n    lesson:  ${norm(ex.expected).slice(0, 120)}`);
  }
  assert.deepEqual(broken, [], 'examples that crash');
  assert.deepEqual(wrongOutput, [], 'examples that print something other than what the lesson says');
});

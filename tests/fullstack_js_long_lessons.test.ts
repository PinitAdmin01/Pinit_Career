import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import esbuild from 'esbuild';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { withLessonHelpers } from '../src/lib/code/sandbox/lessonHelpers';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

const norm = (s: string) => (s || '').replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();

async function executePart(part: any, i: number) {
  const logs: string[] = [];
  const pending = new Set<any>();

  const sandbox: any = {
    console: {
      log: (...args: any[]) => logs.push(formatLogArgs(args)),
      error: (...args: any[]) => logs.push(formatLogArgs(args)),
      warn: () => {},
      info: () => {},
      debug: () => {},
      table: () => {}
    },
    setTimeout: (fn: any, ms: number, ...x: any[]) => {
      const id = setTimeout(() => { pending.delete(id); fn(...x); }, ms);
      pending.add(id);
      return id;
    },
    clearTimeout: (id: any) => { pending.delete(id); clearTimeout(id); },
    setInterval,
    clearInterval,
    queueMicrotask,
    structuredClone,
    btoa: (s: string) => Buffer.from(s, 'binary').toString('base64'),
    atob: (s: string) => Buffer.from(s, 'base64').toString('binary'),
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
    URL: globalThis.URL,
    URLSearchParams: globalThis.URLSearchParams,
    AbortController: globalThis.AbortController,
    AbortSignal: globalThis.AbortSignal,
    EventTarget: globalThis.EventTarget,
    Event: globalThis.Event,
    ReadableStream: globalThis.ReadableStream,
    WritableStream: globalThis.WritableStream,
    TransformStream: globalThis.TransformStream,
    CountQueuingStrategy: globalThis.CountQueuingStrategy,
    ByteLengthQueuingStrategy: globalThis.ByteLengthQueuingStrategy,
    Response: globalThis.Response,
    Request: globalThis.Request,
    Headers: globalThis.Headers,
    Blob: globalThis.Blob,
    FormData: globalThis.FormData,
    performance: { now: () => performance.now() },
    crypto: {
      getRandomValues: (a: any) => webcrypto.getRandomValues(a),
      randomUUID: () => webcrypto.randomUUID()
    }
  };
  sandbox.self = sandbox;
  vm.createContext(sandbox);

  const compiled = esbuild.transformSync(part.code, { loader: 'ts', target: 'es2022' });
  const program = `(async () => {\n${withLessonHelpers(compiled.code)}\n})()`;
  const result = vm.runInContext(program, sandbox, { timeout: 4000 });
  if (result && typeof result.then === 'function') {
    await result;
  }
  const start = Date.now();
  await new Promise(r => setTimeout(r, 0));
  while (pending.size > 0 && Date.now() - start < 4000) {
    await new Promise(r => setTimeout(r, 5));
  }

  const stdout = logs.join('\n');
  assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  assert.equal(norm(stdout), norm(part.output), `Part ${i + 1} stdout must match declared output`);
}

async function verifyPart(part: any, i: number) {
  assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
  assert.ok(part.say.length >= 4, `Part ${i + 1} must have at least 4 explanation paragraphs`);
  assert.ok(part.example && part.example.length >= 120, `Part ${i + 1} must have a real-world example >= 120 chars`);
  assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
  assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
  assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

  const allWords = [part.title, ...part.say, part.example, part.tryIt, part.check.question, ...part.check.options, part.check.why]
    .join(' ').trim().split(/\s+/).filter(Boolean).length;
  assert.ok(allWords >= 580, `Part ${i + 1} must have >= 580 words (got ${allWords})`);

  // Socratic Check validation
  const check = part.check as any;
  assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
  assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
  assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
  assert.ok(check.why && check.why.length >= 40, `Part ${i + 1} check explanation must be rigorous`);

  await executePart(part, i);
}

test('Full-Stack JavaScript Long Lessons: Resolution, Distribution & 60-Day Invariants', () => {
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');

  const answerDist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

  for (let day = 1; day <= 60; day++) {
    const lesson = getLongLesson('fullstack-js', day);
    assert.ok(lesson, `fullstack-js Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `fullstack-js Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `fullstack-js Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `fullstack-js Day ${day} must have a hands-on project step`);
    assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `fullstack-js Day ${day} projectStep must have >= 3 steps`);

    for (const part of lesson.parts) {
      answerDist[part.check.answer] = (answerDist[part.check.answer] || 0) + 1;
    }
  }

  // Ensure MCQ answers across 300 questions are balanced (~25% per option)
  for (const opt of [0, 1, 2, 3]) {
    assert.ok(answerDist[opt] >= 70 && answerDist[opt] <= 80, `Option ${opt} frequency out of balanced range: ${answerDist[opt]}`);
  }
});

for (let day = 1; day <= 60; day++) {
  const lesson = getLongLesson('fullstack-js', day)!;
  test(`Full-Stack JS Day ${day}: ${lesson.title}`, async () => {
    assert.ok(lesson, `fullstack-js Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `fullstack-js Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `fullstack-js Day ${day} must contain summary points`);
    assert.ok(lesson.projectStep, `fullstack-js Day ${day} must have projectStep`);
    assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `fullstack-js Day ${day} projectStep must have >= 3 steps`);

    const spokenMin = estimateSpokenMinutes(lesson);
    const totalMin = estimateLessonMinutes(lesson);
    assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
    assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

    for (let i = 0; i < lesson.parts.length; i++) {
      await verifyPart(lesson.parts[i], i);
    }
  });
}

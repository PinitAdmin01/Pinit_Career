import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import crypto from 'node:crypto';
import stream from 'node:stream';
import util from 'node:util';
import esbuild from 'esbuild';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { withLessonHelpers } from '../src/lib/code/sandbox/lessonHelpers';

async function executePart(part: any, i: number) {
  let stdout = '';
  const sandbox: any = {
    console: {
      log: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; },
      warn: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; },
      error: (...args: any[]) => { stdout += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n'; }
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
    queueMicrotask: (fn: any) => fn(),
    Date,
    Map,
    Set,
    Array,
    JSON,
    Math,
    Number,
    isNaN,
    Object,
    Buffer,
    Uint32Array,
    parseInt,
    process: { env: {}, hrtime: { bigint: () => BigInt(Date.now()) * 1000000n } },
    crypto: globalThis.crypto || crypto,
    btoa: (s: string) => Buffer.from(s, 'binary').toString('base64'),
    atob: (s: string) => Buffer.from(s, 'base64').toString('binary'),
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
    ReadableStream: globalThis.ReadableStream,
    WritableStream: globalThis.WritableStream,
    TransformStream: globalThis.TransformStream,
    CountQueuingStrategy: globalThis.CountQueuingStrategy,
    ByteLengthQueuingStrategy: globalThis.ByteLengthQueuingStrategy,
    AbortController: globalThis.AbortController,
    Response: globalThis.Response,
    Request: globalThis.Request,
    Headers: globalThis.Headers,
    URL: globalThis.URL,
    require: (mod: string) => {
      if (mod === 'crypto' || mod === 'node:crypto') return crypto;
      if (mod === 'stream' || mod === 'node:stream') return stream;
      if (mod === 'util' || mod === 'node:util') return util;
      return {};
    }
  };
  vm.createContext(sandbox);

  // Sanitize any ESM import/export statements for clean VM script execution
  const sanitizedCode = part.code
    .replace(/import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"];?/g, (m: string, imports: string) => {
      if (m.includes('util')) return `const { ${imports} } = require('util');`;
      return `const { ${imports} } = require('stream');`;
    })
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+async\s+function\s+/g, 'async function ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+class\s+/g, 'class ')
    .replace(/export\s+interface\s+/g, 'interface ')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+/g, '');

  const withHelpers = withLessonHelpers(sanitizedCode);
  const compiled = esbuild.transformSync(withHelpers, { loader: 'ts', target: 'es2022' });
  const runnableCode = `(async () => {\n${compiled.code}\n})()`;
  const result = vm.runInContext(runnableCode, sandbox, { timeout: 3000 });
  if (result && typeof result.then === 'function') {
    await result;
  }
  await new Promise(r => setTimeout(r, 80));
  assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
}

async function verifyPart(part: any, i: number) {
  assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
  assert.ok(part.say.length >= 4, `Part ${i + 1} must have at least 4 explanation paragraphs`);
  assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
  assert.ok(part.code && part.code.includes('console.log('), `Part ${i + 1} code must print results`);
  assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
  assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

  // Socratic Check validation
  const check = part.check as any;
  assert.ok(check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
  assert.ok(check.options.length >= 4, `Part ${i + 1} check must have >= 4 options`);
  assert.ok(check.answer >= 0 && check.answer < check.options.length, `Part ${i + 1} answer must be valid`);
  assert.ok(check.why && check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

  await executePart(part, i);
}

test('Full-Stack JavaScript Long Lessons: Resolution & Language Invariants', () => {
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');

  for (let day = 1; day <= 30; day++) {
    const lesson = getLongLesson('fullstack-js', day);
    assert.ok(lesson, `fullstack-js Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `fullstack-js Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `fullstack-js Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `fullstack-js Day ${day} must have a hands-on project step`);
    assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `fullstack-js Day ${day} projectStep must have >= 3 steps`);
  }
});

for (let day = 1; day <= 30; day++) {
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

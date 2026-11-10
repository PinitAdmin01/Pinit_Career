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

test('Full-Stack JS Day 1: Full-Stack Architecture: Client vs Server Execution & Isomorphic JavaScript', async () => {
  const lesson = getLongLesson('fullstack-js', 1);
  assert.ok(lesson, 'fullstack-js Day 1 long lesson must resolve');
  assert.equal(lesson.day, 1);
  assert.equal(lesson.title, 'Full-Stack Architecture: Client vs Server Execution & Isomorphic JavaScript');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 1 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 1 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 1 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 1 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 2: Node.js Runtime Core: Asynchronous EventEmitters, Memory Buffers & Stream Physics', async () => {
  const lesson = getLongLesson('fullstack-js', 2);
  assert.ok(lesson, 'fullstack-js Day 2 long lesson must resolve');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.title, 'Node.js Runtime Core: Asynchronous EventEmitters, Memory Buffers & Stream Physics');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 2 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 2 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 2 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 2 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 3: REST API Architecture: HTTP Protocols, Semantic Verbs, Status Codes & Idempotency', async () => {
  const lesson = getLongLesson('fullstack-js', 3);
  assert.ok(lesson, 'fullstack-js Day 3 long lesson must resolve');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.title, 'REST API Architecture: HTTP Protocols, Semantic Verbs, Status Codes & Idempotency');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 3 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 3 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 3 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 3 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 4: Express Middleware Pipeline: Interceptors, Error Handling & Chain of Responsibility', async () => {
  const lesson = getLongLesson('fullstack-js', 4);
  assert.ok(lesson, 'fullstack-js Day 4 long lesson must resolve');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.title, 'Express Middleware Pipeline: Interceptors, Error Handling & Chain of Responsibility');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 4 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 4 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 4 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 4 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 5: Milestone 1: Architectural API Gateway, Route Dispatching & Token Bucket Rate Limiting', async () => {
  const lesson = getLongLesson('fullstack-js', 5);
  assert.ok(lesson, 'fullstack-js Day 5 long lesson must resolve');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.title, 'Milestone 1: Architectural API Gateway, Route Dispatching & Token Bucket Rate Limiting');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 5 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 5 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 5 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 5 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 6: Schema Validation & Runtime Boundary Safety: Zod, Type Coercion & Input Sanitization', async () => {
  const lesson = getLongLesson('fullstack-js', 6);
  assert.ok(lesson, 'fullstack-js Day 6 long lesson must resolve');
  assert.equal(lesson.day, 6);
  assert.equal(lesson.title, 'Schema Validation & Runtime Boundary Safety: Zod, Type Coercion & Input Sanitization');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 6 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 6 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 6 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 6 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 7: CORS Architecture & Web Security Headers: Same-Origin Policy, Preflights & Defense-in-Depth', async () => {
  const lesson = getLongLesson('fullstack-js', 7);
  assert.ok(lesson, 'fullstack-js Day 7 long lesson must resolve');
  assert.equal(lesson.day, 7);
  assert.equal(lesson.title, 'CORS Architecture & Web Security Headers: Same-Origin Policy, Preflights & Defense-in-Depth');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 7 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 7 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 7 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 7 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 8: REST Query Architecture: Pagination Physics, Cursor Streams & Multi-Field Sorting', async () => {
  const lesson = getLongLesson('fullstack-js', 8);
  assert.ok(lesson, 'fullstack-js Day 8 long lesson must resolve');
  assert.equal(lesson.day, 8);
  assert.equal(lesson.title, 'REST Query Architecture: Pagination Physics, Cursor Streams & Multi-Field Sorting');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 8 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 8 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 8 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 8 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 9: Authentication Architecture: Stateless JWTs, Cryptographic Signatures & Token Lifecycle', async () => {
  const lesson = getLongLesson('fullstack-js', 9);
  assert.ok(lesson, 'fullstack-js Day 9 long lesson must resolve');
  assert.equal(lesson.day, 9);
  assert.equal(lesson.title, 'Authentication Architecture: Stateless JWTs, Cryptographic Signatures & Token Lifecycle');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 9 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 9 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 9 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 9 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 10: Session Security & Token Transport: Secure HttpOnly Cookies, SameSite Policies & Refresh Token Rotation', async () => {
  const lesson = getLongLesson('fullstack-js', 10);
  assert.ok(lesson, 'fullstack-js Day 10 long lesson must resolve');
  assert.equal(lesson.day, 10);
  assert.equal(lesson.title, 'Session Security & Token Transport: Secure HttpOnly Cookies, SameSite Policies & Refresh Token Rotation');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 10 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 10 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 10 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 10 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 11: Password Hashing with Argon2/Bcrypt & Salt Invariants', async () => {
  const lesson = getLongLesson('fullstack-js', 11);
  assert.ok(lesson, 'fullstack-js Day 11 long lesson must resolve');
  assert.equal(lesson.day, 11);
  assert.equal(lesson.title, 'Password Hashing with Argon2/Bcrypt & Salt Invariants');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 11 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 11 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 11 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 11 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 12: Prisma ORM, Schema Migrations & Relational Modeling', async () => {
  const lesson = getLongLesson('fullstack-js', 12);
  assert.ok(lesson, 'fullstack-js Day 12 long lesson must resolve');
  assert.equal(lesson.day, 12);
  assert.equal(lesson.title, 'Prisma ORM, Schema Migrations & Relational Modeling');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 12 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 12 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 12 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 12 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 13: The N+1 Query Problem & DataLoader Batching', async () => {
  const lesson = getLongLesson('fullstack-js', 13);
  assert.ok(lesson, 'fullstack-js Day 13 long lesson must resolve');
  assert.equal(lesson.day, 13);
  assert.equal(lesson.title, 'The N+1 Query Problem & DataLoader Batching');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 13 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 13 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 13 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 13 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 14: Redis In-Memory Caching & Cache-Aside Invalidation', async () => {
  const lesson = getLongLesson('fullstack-js', 14);
  assert.ok(lesson, 'fullstack-js Day 14 long lesson must resolve');
  assert.equal(lesson.day, 14);
  assert.equal(lesson.title, 'Redis In-Memory Caching & Cache-Aside Invalidation');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 14 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 14 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 14 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 14 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 15: ⭐ Milestone 3 Capstone: Enterprise Multi-Tenant Authentication & Session Hub', async () => {
  const lesson = getLongLesson('fullstack-js', 15);
  assert.ok(lesson, 'fullstack-js Day 15 long lesson must resolve');
  assert.equal(lesson.day, 15);
  assert.equal(lesson.title, '⭐ Milestone 3 Capstone: Enterprise Multi-Tenant Authentication & Session Hub');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 15 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 15 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 15 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 15 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 16: WebSockets & Real-Time Event Architecture: Bi-directional Framing, Heartbeats & Room Multiplexing', async () => {
  const lesson = getLongLesson('fullstack-js', 16);
  assert.ok(lesson, 'fullstack-js Day 16 long lesson must resolve');
  assert.equal(lesson.day, 16);
  assert.equal(lesson.title, 'WebSockets & Real-Time Event Architecture: Bi-directional Framing, Heartbeats & Room Multiplexing');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 16 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 16 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 16 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 16 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 17: API Rate Limiting Architecture: Token Bucket Algorithms, Leaky Bucket & Sliding Window Traffic Shaping', async () => {
  const lesson = getLongLesson('fullstack-js', 17);
  assert.ok(lesson, 'fullstack-js Day 17 long lesson must resolve');
  assert.equal(lesson.day, 17);
  assert.equal(lesson.title, 'API Rate Limiting Architecture: Token Bucket Algorithms, Leaky Bucket & Sliding Window Traffic Shaping');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 17 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 17 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 17 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 17 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 18: Streaming File Processing & Cloud Storage Architecture: Multipart Form-Data, Busboy & S3 Presigned Uploads', async () => {
  const lesson = getLongLesson('fullstack-js', 18);
  assert.ok(lesson, 'fullstack-js Day 18 long lesson must resolve');
  assert.equal(lesson.day, 18);
  assert.equal(lesson.title, 'Streaming File Processing & Cloud Storage Architecture: Multipart Form-Data, Busboy & S3 Presigned Uploads');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 18 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 18 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 18 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 18 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 19: Message Queues & Background Job Processing with BullMQ, Redis & Dead-Letter Queues (DLQ)', async () => {
  const lesson = getLongLesson('fullstack-js', 19);
  assert.ok(lesson, 'fullstack-js Day 19 long lesson must resolve');
  assert.equal(lesson.day, 19);
  assert.equal(lesson.title, 'Message Queues & Background Job Processing with BullMQ, Redis & Dead-Letter Queues (DLQ)');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 19 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 19 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 19 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 19 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 20: ⭐ Milestone 4 Capstone: Real-Time Event-Driven Collaboration & Background Processing Engine', async () => {
  const lesson = getLongLesson('fullstack-js', 20);
  assert.ok(lesson, 'fullstack-js Day 20 long lesson must resolve');
  assert.equal(lesson.day, 20);
  assert.equal(lesson.title, '⭐ Milestone 4 Capstone: Real-Time Event-Driven Collaboration & Background Processing Engine');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 20 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 20 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 20 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 20 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 21: Next.js Route Handlers, Web Streams & Edge Streaming Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 21);
  assert.ok(lesson, 'fullstack-js Day 21 long lesson must resolve');
  assert.equal(lesson.day, 21);
  assert.equal(lesson.title, 'Next.js Route Handlers, Web Streams & Edge Streaming Architecture');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 21 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 21 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 21 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 21 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 22: Distributed Microservices, gRPC & Protocol Buffers (Protobuf)', async () => {
  const lesson = getLongLesson('fullstack-js', 22);
  assert.ok(lesson, 'fullstack-js Day 22 long lesson must resolve');
  assert.equal(lesson.day, 22);
  assert.equal(lesson.title, 'Distributed Microservices, gRPC & Protocol Buffers (Protobuf)');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 22 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 22 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 22 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 22 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 23: Event-Driven Architecture with Apache Kafka & Distributed Log Streaming', async () => {
  const lesson = getLongLesson('fullstack-js', 23);
  assert.ok(lesson, 'fullstack-js Day 23 long lesson must resolve');
  assert.equal(lesson.day, 23);
  assert.equal(lesson.title, 'Event-Driven Architecture with Apache Kafka & Distributed Log Streaming');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 23 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 23 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 23 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 23 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 24: Docker Containerization, Multi-Stage Production Builds & Alpine Security', async () => {
  const lesson = getLongLesson('fullstack-js', 24);
  assert.ok(lesson, 'fullstack-js Day 24 long lesson must resolve');
  assert.equal(lesson.day, 24);
  assert.equal(lesson.title, 'Docker Containerization, Multi-Stage Production Builds & Alpine Security');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 24 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 24 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 24 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 24 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 25: ⭐ Milestone 5 Capstone: Distributed Event-Driven Cloud Microservices Architecture', async () => {
  const lesson = getLongLesson('fullstack-js', 25);
  assert.ok(lesson, 'fullstack-js Day 25 long lesson must resolve');
  assert.equal(lesson.day, 25);
  assert.equal(lesson.title, '⭐ Milestone 5 Capstone: Distributed Event-Driven Cloud Microservices Architecture');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 25 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 25 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 25 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 25 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 26: Kubernetes Microservices Orchestration, Helm Charts, ConfigMaps & Secrets', async () => {
  const lesson = getLongLesson('fullstack-js', 26);
  assert.ok(lesson, 'fullstack-js Day 26 long lesson must resolve');
  assert.equal(lesson.day, 26);
  assert.equal(lesson.title, 'Kubernetes Microservices Orchestration, Helm Charts, ConfigMaps & Secrets');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 26 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 26 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 26 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 26 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 27: CI/CD Pipelines with GitHub Actions, Semantic Versioning & Automated Multi-Arch Docker Builds', async () => {
  const lesson = getLongLesson('fullstack-js', 27);
  assert.ok(lesson, 'fullstack-js Day 27 long lesson must resolve');
  assert.equal(lesson.day, 27);
  assert.equal(lesson.title, 'CI/CD Pipelines with GitHub Actions, Semantic Versioning & Automated Multi-Arch Docker Builds');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 27 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 27 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 27 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 27 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 28: Cloud Observability, OpenTelemetry (OTel), Prometheus Metrics & Distributed Tracing with Grafana/Jaeger', async () => {
  const lesson = getLongLesson('fullstack-js', 28);
  assert.ok(lesson, 'fullstack-js Day 28 long lesson must resolve');
  assert.equal(lesson.day, 28);
  assert.equal(lesson.title, 'Cloud Observability, OpenTelemetry (OTel), Prometheus Metrics & Distributed Tracing with Grafana/Jaeger');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 28 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 28 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 28 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 28 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 29: Cloud Infrastructure as Code (IaC) with Terraform, Cloudflare CDN & Edge Security', async () => {
  const lesson = getLongLesson('fullstack-js', 29);
  assert.ok(lesson, 'fullstack-js Day 29 long lesson must resolve');
  assert.equal(lesson.day, 29);
  assert.equal(lesson.title, 'Cloud Infrastructure as Code (IaC) with Terraform, Cloudflare CDN & Edge Security');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 29 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 29 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 29 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 29 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

test('Full-Stack JS Day 30: ⭐ Milestone 6 Capstone: Enterprise Cloud-Native Production Platform & Grand Master Full-Stack Certification', async () => {
  const lesson = getLongLesson('fullstack-js', 30);
  assert.ok(lesson, 'fullstack-js Day 30 long lesson must resolve');
  assert.equal(lesson.day, 30);
  assert.equal(lesson.title, '⭐ Milestone 6 Capstone: Enterprise Cloud-Native Production Platform & Grand Master Full-Stack Certification');
  assert.equal(lesson.parts.length, 5, 'fullstack-js Day 30 must contain exactly 5 parts');
  assert.ok(lesson.summary.length >= 4, 'fullstack-js Day 30 must contain summary points');
  assert.ok(lesson.projectStep, 'fullstack-js Day 30 must have projectStep');
  assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, 'fullstack-js Day 30 projectStep must have >= 3 steps');

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 15, `Spoken minutes should be >= 15 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
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

    // Execution verification
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
      crypto,
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

    const compiled = esbuild.transformSync(sanitizedCode, { loader: 'ts' });
    vm.runInContext(compiled.code, sandbox, { timeout: 2000 });
    await new Promise(r => setTimeout(r, 80));
    assert.ok(stdout.trim().length > 0, `Part ${i + 1} must produce non-empty stdout`);
  }
});

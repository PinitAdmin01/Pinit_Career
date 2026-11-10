import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 1 Full-Stack Certification Invariant Verification', () => {
  const day1Config = FULLSTACK_30_DAYS_CONFIGS[0];
  const day1Lesson = FULLSTACK_JS_LONG_LESSONS[0];

  it('Day 1 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day1Config.day, 1);
    assert.strictEqual(day1Lesson.day, 1);
    assert.strictEqual(day1Config.title, 'Full-Stack Architecture: Client vs Server Execution & Isomorphic JavaScript');
    assert.strictEqual(day1Lesson.title, 'Full-Stack Architecture: Client vs Server Execution & Isomorphic JavaScript');
    assert.strictEqual(day1Config.syllabus.length, 3);
  });

  it('Day 1 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day1Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day1Lesson.parts.forEach((part, idx) => {
      const fullText = [
        part.title,
        ...part.say,
        part.example,
        part.tryIt,
        part.check.question,
        ...part.check.options,
        part.check.why
      ].join(' ');

      const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
      assert.ok(
        wordCount >= 580,
        `Part ${idx + 1} (${part.title}) has only ${wordCount} words (minimum required: 580)`
      );

      forbiddenPhrases.forEach((phrase) => {
        assert.ok(
          !fullText.includes(phrase),
          `Part ${idx + 1} contains prohibited robotic filler: "${phrase}"`
        );
      });
    });
  });

  function runSandbox(code: string, testSuite: string) {
    const context = {
      console: { log: () => {}, error: () => {}, warn: () => {}, info: () => {} },
      assert: (cond: boolean, msg?: string) => { if (!cond) throw new Error(msg || 'Assertion failed'); },
      TextEncoder: global.TextEncoder,
      TextDecoder: global.TextDecoder,
      Buffer: Buffer,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      Promise: Promise,
      Map: Map,
      Set: Set,
      Date: Date,
      JSON: JSON,
      Math: Math,
      RegExp: RegExp,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      TypeError: TypeError,
      Error: Error
    };
    vm.createContext(context);
    const script = new vm.Script(`
      (async () => {
        ${code}
        ;
        ${testSuite}
      })()
    `);
    return script.runInContext(context);
  }

  it('Day 1 Exam (isServerRuntime): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function isServerRuntime(env) {
        if (!env || typeof env !== 'object') return false;
        return env.window === undefined && Boolean(env.process && env.process.versions && typeof env.process.versions.node === 'string' && env.process.versions.node.length > 0);
      }
    `;
    await assert.doesNotReject(runSandbox(studentCode, day1Config.eTest));
  });

  it('Day 1 Exam (isServerRuntime): buggy implementation fails automated test suite', async () => {
    const buggyCode = `
      function isServerRuntime(env) {
        return true; // Naive buggy implementation
      }
    `;
    await assert.rejects(runSandbox(buggyCode, day1Config.eTest));
  });

  it('Day 1 Assignment (sanitizeClientConfig): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function sanitizeClientConfig(cfg) {
        if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) {
          throw new TypeError('Invalid configuration: cfg must be a non-null object.');
        }
        const restricted = ['dbPassword', 'jwtSecret', 'stripeSecretKey', 'privateKey', 'internalHost'];
        const clean = {};
        for (const [k, v] of Object.entries(cfg)) {
          if (!restricted.includes(k)) {
            clean[k] = v;
          }
        }
        return clean;
      }
    `;
    await assert.doesNotReject(runSandbox(studentCode, day1Config.aTest));
  });

  it('Day 1 Assignment (sanitizeClientConfig): leaky implementation fails automated test suite', async () => {
    const leakyCode = `
      function sanitizeClientConfig(cfg) {
        return cfg; // Leaks raw secrets!
      }
    `;
    await assert.rejects(runSandbox(leakyCode, day1Config.aTest));
  });
});

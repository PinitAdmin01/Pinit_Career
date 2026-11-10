import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 3 Full-Stack Certification Invariant Verification', () => {
  const day3Config = FULLSTACK_30_DAYS_CONFIGS[2];
  const day3Lesson = FULLSTACK_JS_LONG_LESSONS[2];

  it('Day 3 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day3Config.day, 3);
    assert.strictEqual(day3Lesson.day, 3);
    assert.strictEqual(day3Config.title, 'REST API Architecture: HTTP Protocols, Semantic Verbs, Status Codes & Idempotency');
    assert.strictEqual(day3Lesson.title, 'REST API Architecture: HTTP Protocols, Semantic Verbs, Status Codes & Idempotency');
    assert.strictEqual(day3Config.syllabus.length, 3);
  });

  it('Day 3 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day3Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day3Lesson.parts.forEach((part, idx) => {
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

  it('Day 3 Exam (formatApiResponse): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function formatApiResponse(statusCode, data = null, errorMessage = null) {
        if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode > 599) {
          throw new TypeError('Invalid status code: ' + statusCode + '. Expected integer between 100 and 599.');
        }

        const isSuccess = statusCode >= 200 && statusCode <= 299;

        return {
          status: statusCode,
          success: isSuccess,
          data: isSuccess ? (data ?? null) : null,
          error: isSuccess ? null : (errorMessage || 'An error occurred during request processing'),
          timestamp: new Date().toISOString()
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day3Config.eTest);
    });
  });

  it('Day 3 Exam: catches non-2xx with lingering data or missing status codes', async () => {
    // Defective code that leaves data intact on 404
    const defectiveCode = `
      function formatApiResponse(statusCode, data = null, errorMessage = null) {
        return {
          status: statusCode,
          success: statusCode >= 200 && statusCode <= 299,
          data: data, // BUG: must be null on failure!
          error: errorMessage,
          timestamp: new Date().toISOString()
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day3Config.eTest);
    });
  });

  it('Day 3 Assignment (isMethodIdempotent): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function isMethodIdempotent(method) {
        if (typeof method !== 'string') {
          throw new TypeError('Method must be a string');
        }
        const normalized = method.trim().toUpperCase();
        if (normalized.length === 0) {
          throw new TypeError('Method cannot be an empty string');
        }
        const idempotentSet = new Set(['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE']);
        return idempotentSet.has(normalized);
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day3Config.aTest);
    });
  });

  it('Day 3 Assignment: catches implementation classifying POST or PATCH as idempotent', async () => {
    // Defective implementation classifying all methods as idempotent
    const defectiveCode = `
      function isMethodIdempotent(method) {
        if (typeof method !== 'string' || method.trim().length === 0) throw new TypeError('Invalid');
        return true; // BUG: claiming everything is idempotent
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day3Config.aTest);
    });
  });
});

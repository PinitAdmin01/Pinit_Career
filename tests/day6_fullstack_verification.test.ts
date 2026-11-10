import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 6 Full-Stack Certification Invariant Verification', () => {
  const day6Config = FULLSTACK_30_DAYS_CONFIGS[5];
  const day6Lesson = FULLSTACK_JS_LONG_LESSONS[5];

  it('Day 6 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day6Config.day, 6);
    assert.strictEqual(day6Lesson.day, 6);
    assert.strictEqual(day6Config.title, 'Schema Validation & Runtime Boundary Safety: Zod, Type Coercion & Input Sanitization');
    assert.strictEqual(day6Lesson.title, 'Schema Validation & Runtime Boundary Safety: Zod, Type Coercion & Input Sanitization');
    assert.strictEqual(day6Config.syllabus.length, 3);
  });

  it('Day 6 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day6Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day6Lesson.parts.forEach((part, idx) => {
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
      Error: Error,
      parseInt: parseInt
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

  it('Day 6 Exam (validateRequestBody): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function validateRequestBody(validatorFn) {
        return (req, res, next) => {
          const body = req ? req.body : undefined;
          const result = validatorFn(body);

          if (!result || !result.success) {
            res.status = 400;
            res.body = {
              error: 'VALIDATION_FAILED',
              details: result ? result.errors : ['Payload validation failed']
            };
            return;
          }

          req.validatedBody = result.data;
          next();
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day6Config.eTest);
    });
  });

  it('Day 6 Exam: catches leaky validator that invokes next() on invalid body', async () => {
    // Defective code that always calls next() even on validation error
    const defectiveCode = `
      function validateRequestBody(validatorFn) {
        return (req, res, next) => {
          const result = validatorFn(req.body);
          if (!result.success) {
            res.status = 400;
            res.body = { error: 'VALIDATION_FAILED' };
          }
          next(); // BUG: must NOT call next() on failure!
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day6Config.eTest);
    });
  });

  it('Day 6 Assignment (isEmailValid): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function isEmailValid(email) {
        if (typeof email !== 'string') return false;
        const trimmed = email.trim();
        if (trimmed.length === 0) return false;
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(trimmed);
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day6Config.aTest);
    });
  });

  it('Day 6 Assignment: catches naive validator that accepts missing @ or missing domain', async () => {
    // Defective validator that only checks typeof === 'string'
    const defectiveCode = `
      function isEmailValid(email) {
        return typeof email === 'string' && email.length > 0;
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day6Config.aTest);
    });
  });
});

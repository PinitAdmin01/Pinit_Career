import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 4 Full-Stack Certification Invariant Verification', () => {
  const day4Config = FULLSTACK_30_DAYS_CONFIGS[3];
  const day4Lesson = FULLSTACK_JS_LONG_LESSONS[3];

  it('Day 4 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day4Config.day, 4);
    assert.strictEqual(day4Lesson.day, 4);
    assert.strictEqual(day4Config.title, 'Express Middleware Pipeline: Interceptors, Error Handling & Chain of Responsibility');
    assert.strictEqual(day4Lesson.title, 'Express Middleware Pipeline: Interceptors, Error Handling & Chain of Responsibility');
    assert.strictEqual(day4Config.syllabus.length, 3);
  });

  it('Day 4 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day4Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day4Lesson.parts.forEach((part, idx) => {
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

  it('Day 4 Exam (runMiddlewarePipeline): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function runMiddlewarePipeline(req, res, middlewares) {
        if (!Array.isArray(middlewares)) {
          throw new TypeError('Middlewares must be an array');
        }

        let index = 0;

        function next(err) {
          if (index >= middlewares.length) {
            return;
          }

          const mw = middlewares[index++];

          if (err) {
            if (mw.length === 4) {
              try {
                mw(err, req, res, next);
              } catch (handlerErr) {
                next(handlerErr);
              }
            } else {
              next(err);
            }
          } else {
            if (mw.length === 4) {
              next();
            } else {
              try {
                mw(req, res, next);
              } catch (syncEx) {
                next(syncEx);
              }
            }
          }
        }

        next();
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day4Config.eTest);
    });
  });

  it('Day 4 Exam: catches defective implementation that fails to short-circuit on error', async () => {
    // Defective code that ignores errors and always executes all middlewares as regular
    const defectiveCode = `
      function runMiddlewarePipeline(req, res, middlewares) {
        for (const mw of middlewares) {
          if (mw.length < 4) mw(req, res, () => {});
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day4Config.eTest);
    });
  });

  it('Day 4 Assignment (timingMiddleware): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function timingMiddleware(req, res, next) {
        req._startTime = Date.now();
        const originalSend = res.send.bind(res);

        res.send = function (body) {
          if (typeof req._startTime === 'number') {
            const elapsed = Math.max(0, Date.now() - req._startTime);
            res.setHeader('X-Response-Time', elapsed + 'ms');
          }
          return originalSend(body);
        };

        next();
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day4Config.aTest);
    });
  });

  it('Day 4 Assignment: catches implementation that fails to call next() or set header', async () => {
    // Defective implementation that never calls next()
    const defectiveCode = `
      function timingMiddleware(req, res, next) {
        req._startTime = Date.now();
        // Missing next() call!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day4Config.aTest);
    });
  });
});

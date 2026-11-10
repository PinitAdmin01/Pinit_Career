import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 5 Full-Stack Certification Invariant Verification', () => {
  const day5Config = FULLSTACK_30_DAYS_CONFIGS[4];
  const day5Lesson = FULLSTACK_JS_LONG_LESSONS[4];

  it('Day 5 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day5Config.day, 5);
    assert.strictEqual(day5Lesson.day, 5);
    assert.strictEqual(day5Config.title, 'Milestone 1: Architectural API Gateway, Route Dispatching & Token Bucket Rate Limiting');
    assert.strictEqual(day5Lesson.title, 'Milestone 1: Architectural API Gateway, Route Dispatching & Token Bucket Rate Limiting');
    assert.strictEqual(day5Config.syllabus.length, 3);
  });

  it('Day 5 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day5Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day5Lesson.parts.forEach((part, idx) => {
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

  it('Day 5 Exam (ApiGateway): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class ApiGateway {
        constructor() {
          this.middlewares = [];
          this.routes = new Map();
        }

        use(mw) {
          this.middlewares.push(mw);
          return this;
        }

        get(path, handler) {
          this.routes.set('GET:' + path, handler);
          return this;
        }

        post(path, handler) {
          this.routes.set('POST:' + path, handler);
          return this;
        }

        async dispatch(req) {
          const res = {
            status: 200,
            headers: {},
            body: null
          };

          let mwIndex = 0;
          const next = () => {
            if (mwIndex < this.middlewares.length) {
              const mw = this.middlewares[mwIndex++];
              mw(req, res, next);
            }
          };

          next();

          if (res.status >= 400) {
            return res;
          }

          const routeKey = (req.method || 'GET').toUpperCase() + ':' + req.path;
          const handler = this.routes.get(routeKey);

          if (!handler) {
            res.status = 404;
            res.body = { error: 'Not Found' };
            return res;
          }

          try {
            await handler(req, res);
          } catch (err) {
            res.status = 500;
            res.body = { error: 'Internal Server Error', message: err.message };
          }

          return res;
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day5Config.eTest);
    });
  });

  it('Day 5 Exam: catches gateway that fails to short-circuit on unauthorized status', async () => {
    // Defective code that ignores middleware rejection and always executes routes
    const defectiveCode = `
      class ApiGateway {
        constructor() {
          this.routes = new Map();
        }
        use(mw) {}
        get(path, handler) { this.routes.set('GET:' + path, handler); }
        post(path, handler) { this.routes.set('POST:' + path, handler); }
        async dispatch(req) {
          const res = { status: 200, headers: {}, body: null };
          const handler = this.routes.get((req.method || 'GET') + ':' + req.path);
          if (handler) await handler(req, res);
          return res;
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day5Config.eTest);
    });
  });

  it('Day 5 Assignment (createHealthHandler): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function createHealthHandler() {
        return (req, res) => {
          res.status = 200;
          res.body = { status: 'UP', timestamp: Date.now() };
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day5Config.aTest);
    });
  });

  it('Day 5 Assignment: catches health handler returning DOWN or missing timestamp', async () => {
    // Defective health handler
    const defectiveCode = `
      function createHealthHandler() {
        return (req, res) => {
          res.status = 200;
          res.body = { status: 'DOWN' }; // Missing timestamp and wrong status
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day5Config.aTest);
    });
  });
});

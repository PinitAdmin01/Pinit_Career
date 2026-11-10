import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 7 Full-Stack Certification Invariant Verification', () => {
  const day7Config = FULLSTACK_30_DAYS_CONFIGS[6];
  const day7Lesson = FULLSTACK_JS_LONG_LESSONS[6];

  it('Day 7 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day7Config.day, 7);
    assert.strictEqual(day7Lesson.day, 7);
    assert.strictEqual(day7Config.title, 'CORS Architecture & Web Security Headers: Same-Origin Policy, Preflights & Defense-in-Depth');
    assert.strictEqual(day7Lesson.title, 'CORS Architecture & Web Security Headers: Same-Origin Policy, Preflights & Defense-in-Depth');
    assert.strictEqual(day7Config.syllabus.length, 3);
  });

  it('Day 7 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day7Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day7Lesson.parts.forEach((part, idx) => {
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

  it('Day 7 Exam (corsMiddleware): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function corsMiddleware(allowedOrigins = ['*']) {
        const allowAll = allowedOrigins.includes('*');
        const normalizedAllowed = new Set(allowedOrigins.map(o => o.toLowerCase()));

        return (req, res, next) => {
          if (!res.headers) res.headers = {};
          const origin = req.headers ? (req.headers['origin'] || req.headers['Origin']) : undefined;

          if (origin) {
            const isAllowed = allowAll || normalizedAllowed.has(origin.toLowerCase());
            if (isAllowed) {
              res.headers['Access-Control-Allow-Origin'] = allowAll ? '*' : origin;
              res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
              res.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            }
          } else if (allowAll) {
            res.headers['Access-Control-Allow-Origin'] = '*';
          }

          if (req.method && req.method.toUpperCase() === 'OPTIONS') {
            res.status = 204;
            return;
          }

          next();
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day7Config.eTest);
    });
  });

  it('Day 7 Exam: catches defective CORS middleware that calls next() on preflight OPTIONS', async () => {
    // Defective code that sets status 204 but calls next() anyway
    const defectiveCode = `
      function corsMiddleware(allowedOrigins = ['*']) {
        return (req, res, next) => {
          if (!res.headers) res.headers = {};
          res.headers['Access-Control-Allow-Origin'] = '*';
          res.headers['Access-Control-Allow-Methods'] = 'GET, POST';
          if (req.method === 'OPTIONS') res.status = 204;
          next(); // BUG: must NOT call next() on preflight OPTIONS!
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day7Config.eTest);
    });
  });

  it('Day 7 Assignment (securityHeadersMiddleware): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function securityHeadersMiddleware(req, res, next) {
        if (!res.headers) res.headers = {};
        res.headers['X-Content-Type-Options'] = 'nosniff';
        res.headers['X-Frame-Options'] = 'DENY';
        res.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
        res.headers['X-XSS-Protection'] = '0';
        next();
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day7Config.aTest);
    });
  });

  it('Day 7 Assignment: catches missing X-Frame-Options or X-Content-Type-Options', async () => {
    // Defective security header middleware missing X-Frame-Options
    const defectiveCode = `
      function securityHeadersMiddleware(req, res, next) {
        if (!res.headers) res.headers = {};
        res.headers['X-Content-Type-Options'] = 'nosniff';
        // Missing X-Frame-Options!
        next();
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day7Config.aTest);
    });
  });
});

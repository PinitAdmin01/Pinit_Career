import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 17 Full-Stack Certification Invariant Verification', () => {
  const day17Config = FULLSTACK_30_DAYS_CONFIGS[16];
  const day17Lesson = FULLSTACK_JS_LONG_LESSONS[16];

  it('Day 17 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day17Config.day, 17);
    assert.strictEqual(day17Lesson.day, 17);
    assert.strictEqual(day17Config.title, 'API Rate Limiting Architecture: Token Bucket Algorithms, Leaky Bucket & Sliding Window Traffic Shaping');
    assert.strictEqual(day17Lesson.title, 'API Rate Limiting Architecture: Token Bucket Algorithms, Leaky Bucket & Sliding Window Traffic Shaping');
    assert.strictEqual(day17Config.syllabus.length, 3);
  });

  it('Day 17 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day17Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day17Lesson.parts.forEach((part, idx) => {
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
      parseInt: parseInt,
      isNaN: isNaN
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

  it('Day 17 Exam (TokenBucketLimiter): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class TokenBucketLimiter {
        constructor(capacity, refillRatePerSec) {
          if (typeof capacity !== 'number' || capacity <= 0) throw new Error('Invalid capacity');
          if (typeof refillRatePerSec !== 'number' || refillRatePerSec <= 0) throw new Error('Invalid refillRate');
          this.capacity = capacity;
          this.refillRate = refillRatePerSec;
          this.tokens = capacity;
          this.lastRefill = Date.now();
        }

        _refill() {
          const now = Date.now();
          const elapsedSeconds = (now - this.lastRefill) / 1000;
          const newTokens = elapsedSeconds * this.refillRate;
          this.tokens = Math.min(this.capacity, this.tokens + newTokens);
          this.lastRefill = now;
        }

        allowRequest(cost = 1) {
          this._refill();
          if (this.tokens >= cost) {
            this.tokens -= cost;
            return true;
          }
          return false;
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day17Config.eTest);
    });
  });

  it('Day 17 Exam: catches defective TokenBucketLimiter that allows requests beyond capacity', async () => {
    // Defective code that always returns true without checking or deducting
    const defectiveCode = `
      class TokenBucketLimiter {
        constructor(capacity, refillRate) {}
        allowRequest(cost = 1) {
          return true; // BUG: infinite capacity!
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day17Config.eTest);
    });
  });

  it('Day 17 Assignment (formatRateLimitHeaders): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function formatRateLimitHeaders(limit, remaining, resetSeconds) {
        return {
          'X-RateLimit-Limit': String(Math.floor(limit)),
          'X-RateLimit-Remaining': String(Math.max(0, Math.floor(remaining))),
          'X-RateLimit-Reset': String(Math.max(0, Math.floor(resetSeconds))),
          'Retry-After': String(Math.max(0, Math.floor(resetSeconds)))
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day17Config.aTest);
    });
  });

  it('Day 17 Assignment: catches defective implementation that omits Retry-After or has wrong values', async () => {
    // Defective code that omits Retry-After
    const defectiveCode = `
      function formatRateLimitHeaders(limit, remaining, resetSeconds) {
        return {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining)
          // BUG: missing Retry-After!
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day17Config.aTest);
    });
  });
});

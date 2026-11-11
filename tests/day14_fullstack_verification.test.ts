import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 14 Full-Stack Certification Invariant Verification', () => {
  const day14Config = FULLSTACK_30_DAYS_CONFIGS[13];
  const day14Lesson = FULLSTACK_JS_LONG_LESSONS[13];

  it('Day 14 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day14Config.day, 14);
    assert.strictEqual(day14Lesson.day, 14);
    assert.strictEqual(day14Config.title, 'Redis In-Memory Caching & Cache-Aside Invalidation');
    assert.strictEqual(day14Lesson.title, 'Redis In-Memory Caching & Cache-Aside Invalidation');
    assert.strictEqual(day14Config.syllabus.length, 3);
  });

  it('Day 14 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day14Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day14Lesson.parts.forEach((part, idx) => {
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

  it('Day 14 Exam (getWithCacheAside): valid implementation passes automated test suite', async () => {
    const studentCode = `
      async function getWithCacheAside(cache, key, ttlMs = 1000, fetchFromDb) {
        const now = Date.now();
        const cached = cache.get(key);
        if (cached && cached.expiresAt > now) {
          return { data: cached.data, fromCache: true };
        }

        const data = await fetchFromDb();
        cache.set(key, { data, expiresAt: now + ttlMs });
        return { data, fromCache: false };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day14Config.eTest);
    });
  });

  it('Day 14 Exam: catches defective cache-aside that always hits DB and ignores cache', async () => {
    // Defective code that always fetches from DB
    const defectiveCode = `
      async function getWithCacheAside(cache, key, ttlMs = 1000, fetchFromDb) {
        const data = await fetchFromDb(); // BUG: never checks or sets cache!
        return { data, fromCache: false };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day14Config.eTest);
    });
  });

  it('Day 14 Assignment (buildCacheKey): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function buildCacheKey(entity, id, namespace = '') {
        if (namespace && typeof namespace === 'string' && namespace.trim()) {
          return namespace.trim() + ':' + entity + ':' + id;
        }
        return entity + ':' + id;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day14Config.aTest);
    });
  });

  it('Day 14 Assignment: catches defective cache key generator that ignores namespace', async () => {
    // Defective code that ignores namespace parameter
    const defectiveCode = `
      function buildCacheKey(entity, id, namespace = '') {
        return entity + ':' + id; // BUG: fails to prepend namespace!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day14Config.aTest);
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 13 Full-Stack Certification Invariant Verification', () => {
  const day13Config = FULLSTACK_30_DAYS_CONFIGS[12];
  const day13Lesson = FULLSTACK_JS_LONG_LESSONS[12];

  it('Day 13 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day13Config.day, 13);
    assert.strictEqual(day13Lesson.day, 13);
    assert.strictEqual(day13Config.title, 'The N+1 Query Problem & DataLoader Batching');
    assert.strictEqual(day13Lesson.title, 'The N+1 Query Problem & DataLoader Batching');
    assert.strictEqual(day13Config.syllabus.length, 3);
  });

  it('Day 13 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day13Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day13Lesson.parts.forEach((part, idx) => {
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

  it('Day 13 Exam (DataLoader): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class DataLoader {
        constructor(batchFn) {
          if (typeof batchFn !== 'function') throw new Error('batchFn must be a function');
          this.batchFn = batchFn;
          this.queue = [];
          this.cache = new Map();
        }

        load(key) {
          if (this.cache.has(key)) {
            return this.cache.get(key);
          }

          let resolve, reject;
          const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
          });

          this.cache.set(key, promise);
          this.queue.push({ key, resolve, reject });
          return promise;
        }

        async dispatch() {
          if (this.queue.length === 0) return;

          const currentQueue = this.queue;
          this.queue = [];

          const uniqueKeys = [...new Set(currentQueue.map(item => item.key))];

          try {
            const results = await this.batchFn(uniqueKeys);
            const resultMap = new Map();
            if (Array.isArray(results)) {
              results.forEach((item, idx) => {
                const k = (item && item.id !== undefined) ? item.id : uniqueKeys[idx];
                resultMap.set(k, item);
              });
            }

            currentQueue.forEach(({ key, resolve }) => {
              resolve(resultMap.get(key));
            });
          } catch (err) {
            currentQueue.forEach(({ reject }) => {
              reject(err);
            });
          }
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day13Config.eTest);
    });
  });

  it('Day 13 Exam: catches defective DataLoader that issues multiple unbatched queries', async () => {
    // Defective code that calls batchFn for every single item individually
    const defectiveCode = `
      class DataLoader {
        constructor(batchFn) {
          this.batchFn = batchFn;
        }
        async load(key) {
          const res = await this.batchFn([key]); // BUG: fires a query per key!
          return res[0];
        }
        async dispatch() {}
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day13Config.eTest);
    });
  });

  it('Day 13 Assignment (deduplicateIds): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function deduplicateIds(ids = []) {
        if (!Array.isArray(ids)) return [];
        return [...new Set(ids)];
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day13Config.aTest);
    });
  });

  it('Day 13 Assignment: catches defective implementation that retains duplicate IDs', async () => {
    // Defective code that fails to remove duplicates
    const defectiveCode = `
      function deduplicateIds(ids = []) {
        return ids; // BUG: fails to deduplicate!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day13Config.aTest);
    });
  });
});

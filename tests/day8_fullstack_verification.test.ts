import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 8 Full-Stack Certification Invariant Verification', () => {
  const day8Config = FULLSTACK_30_DAYS_CONFIGS[7];
  const day8Lesson = FULLSTACK_JS_LONG_LESSONS[7];

  it('Day 8 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day8Config.day, 8);
    assert.strictEqual(day8Lesson.day, 8);
    assert.strictEqual(day8Config.title, 'REST Query Architecture: Pagination Physics, Cursor Streams & Multi-Field Sorting');
    assert.strictEqual(day8Lesson.title, 'REST Query Architecture: Pagination Physics, Cursor Streams & Multi-Field Sorting');
    assert.strictEqual(day8Config.syllabus.length, 3);
  });

  it('Day 8 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day8Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day8Lesson.parts.forEach((part, idx) => {
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

  it('Day 8 Exam (paginateCollection): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function paginateCollection(items = [], query = {}) {
        const safeItems = Array.isArray(items) ? items : [];

        let page = typeof query.page === 'number' ? query.page : parseInt(query.page || '1', 10);
        if (isNaN(page) || page < 1) page = 1;

        let limit = typeof query.limit === 'number' ? query.limit : parseInt(query.limit || '10', 10);
        if (isNaN(limit) || limit < 1) limit = 10;

        const total = safeItems.length;
        const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

        const startIndex = (page - 1) * limit;
        const data = startIndex >= total ? [] : safeItems.slice(startIndex, startIndex + limit);

        const hasNext = page < totalPages;
        const hasPrev = page > 1 && totalPages > 0;

        return {
          data,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext,
            hasPrev
          }
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day8Config.eTest);
    });
  });

  it('Day 8 Exam: catches defective pagination that computes wrong page offset or totalPages', async () => {
    // Defective code that ignores offset and slices from 0
    const defectiveCode = `
      function paginateCollection(items = [], query = {}) {
        return {
          data: items.slice(0, 10),
          pagination: {
            page: 1,
            limit: 10,
            total: items.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day8Config.eTest);
    });
  });

  it('Day 8 Assignment (parseSortParam): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function parseSortParam(sortStr = 'id') {
        if (typeof sortStr !== 'string' || sortStr.trim().length === 0) {
          return { field: 'id', order: 'ASC' };
        }

        const trimmed = sortStr.trim();
        if (trimmed.startsWith('-')) {
          return { field: trimmed.slice(1).trim() || 'id', order: 'DESC' };
        }
        if (trimmed.startsWith('+')) {
          return { field: trimmed.slice(1).trim() || 'id', order: 'ASC' };
        }
        return { field: trimmed, order: 'ASC' };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day8Config.aTest);
    });
  });

  it('Day 8 Assignment: catches defective sort parser that ignores DESC prefix', async () => {
    // Defective parser that ignores '-' sign and returns ASC unconditionally
    const defectiveCode = `
      function parseSortParam(sortStr = 'id') {
        return { field: sortStr || 'id', order: 'ASC' };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day8Config.aTest);
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 12 Full-Stack Certification Invariant Verification', () => {
  const day12Config = FULLSTACK_30_DAYS_CONFIGS[11];
  const day12Lesson = FULLSTACK_JS_LONG_LESSONS[11];

  it('Day 12 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day12Config.day, 12);
    assert.strictEqual(day12Lesson.day, 12);
    assert.strictEqual(day12Config.title, 'Prisma ORM, Schema Migrations & Relational Modeling');
    assert.strictEqual(day12Lesson.title, 'Prisma ORM, Schema Migrations & Relational Modeling');
    assert.strictEqual(day12Config.syllabus.length, 3);
  });

  it('Day 12 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day12Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day12Lesson.parts.forEach((part, idx) => {
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

  it('Day 12 Exam (includeUserPosts): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function includeUserPosts(users = [], posts = []) {
        const safeUsers = Array.isArray(users) ? users : [];
        const safePosts = Array.isArray(posts) ? posts : [];

        const postsByUser = new Map();
        for (const post of safePosts) {
          if (!postsByUser.has(post.userId)) {
            postsByUser.set(post.userId, []);
          }
          postsByUser.get(post.userId).push(post);
        }

        return safeUsers.map(user => ({
          ...user,
          posts: postsByUser.get(user.id) || []
        }));
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day12Config.eTest);
    });
  });

  it('Day 12 Exam: catches defective implementation that attaches wrong posts or ignores foreign key', async () => {
    // Defective code that naively attaches all posts to every user
    const defectiveCode = `
      function includeUserPosts(users = [], posts = []) {
        return users.map(user => ({
          ...user,
          posts: posts // BUG: assigns all posts to every user!
        }));
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day12Config.eTest);
    });
  });

  it('Day 12 Assignment (getRequiredFields): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function getRequiredFields(schema = {}) {
        if (!schema || typeof schema !== 'object') return [];
        return Object.keys(schema).filter(key => schema[key] && schema[key].required === true);
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day12Config.aTest);
    });
  });

  it('Day 12 Assignment: catches defective implementation that returns optional fields', async () => {
    // Defective code that returns all keys regardless of required flag
    const defectiveCode = `
      function getRequiredFields(schema = {}) {
        return Object.keys(schema); // BUG: includes optional fields!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day12Config.aTest);
    });
  });
});

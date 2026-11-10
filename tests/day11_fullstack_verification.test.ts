import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 11 Full-Stack Certification Invariant Verification', () => {
  const day11Config = FULLSTACK_30_DAYS_CONFIGS[10];
  const day11Lesson = FULLSTACK_JS_LONG_LESSONS[10];

  it('Day 11 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day11Config.day, 11);
    assert.strictEqual(day11Lesson.day, 11);
    assert.strictEqual(day11Config.title, 'Password Hashing with Argon2/Bcrypt & Salt Invariants');
    assert.strictEqual(day11Lesson.title, 'Password Hashing with Argon2/Bcrypt & Salt Invariants');
    assert.strictEqual(day11Config.syllabus.length, 3);
  });

  it('Day 11 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day11Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day11Lesson.parts.forEach((part, idx) => {
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
      btoa: (str: string) => Buffer.from(str, 'binary').toString('base64'),
      atob: (b64: string) => Buffer.from(b64, 'base64').toString('binary'),
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

  it('Day 11 Exam (hashPassword & verifyPassword): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function hashPassword(password, salt) {
        if (typeof password !== 'string' || !password) throw new Error('Invalid password');
        if (typeof salt !== 'string' || !salt) throw new Error('Invalid salt');
        const hash = btoa(salt + ':' + password);
        return { salt, hash };
      }

      function verifyPassword(password, salt, storedHash) {
        if (!password || !salt || !storedHash) return false;
        try {
          const { hash } = hashPassword(password, salt);
          return hash === storedHash;
        } catch (e) {
          return false;
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day11Config.eTest);
    });
  });

  it('Day 11 Exam: catches defective implementation that ignores salt or accepts wrong password', async () => {
    // Defective code that ignores salt and returns constant hash
    const defectiveCode = `
      function hashPassword(password, salt) {
        return { salt: 'fixed-salt', hash: btoa(password) }; // BUG: ignores salt!
      }
      function verifyPassword(password, salt, storedHash) {
        return true; // BUG: always accepts!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day11Config.eTest);
    });
  });

  it('Day 11 Assignment (generateRandomSalt): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function generateRandomSalt(len = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let res = '';
        for (let i = 0; i < len; i++) {
          res += chars[Math.floor(Math.random() * chars.length)];
        }
        return res;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day11Config.aTest);
    });
  });

  it('Day 11 Assignment: catches defective salt generator that returns fixed string or wrong length', async () => {
    // Defective code that returns static string
    const defectiveCode = `
      function generateRandomSalt(len = 16) {
        return 'constant-salt-16'; // BUG: deterministic and fixed!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day11Config.aTest);
    });
  });
});

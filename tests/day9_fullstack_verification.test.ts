import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 9 Full-Stack Certification Invariant Verification', () => {
  const day9Config = FULLSTACK_30_DAYS_CONFIGS[8];
  const day9Lesson = FULLSTACK_JS_LONG_LESSONS[8];

  it('Day 9 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day9Config.day, 9);
    assert.strictEqual(day9Lesson.day, 9);
    assert.strictEqual(day9Config.title, 'Authentication Architecture: Stateless JWTs, Cryptographic Signatures & Token Lifecycle');
    assert.strictEqual(day9Lesson.title, 'Authentication Architecture: Stateless JWTs, Cryptographic Signatures & Token Lifecycle');
    assert.strictEqual(day9Config.syllabus.length, 3);
  });

  it('Day 9 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day9Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day9Lesson.parts.forEach((part, idx) => {
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

  it('Day 9 Exam (verifyJwtSignature): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function verifyJwtSignature(token, secret) {
        if (typeof token !== 'string') {
          throw new Error('Invalid token');
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Malformed token: token must contain exactly header, payload, and signature segments');
        }

        const [header, payload, signature] = parts;
        const expectedSig = btoa(header + '.' + payload + ':' + secret);
        if (signature !== expectedSig) {
          throw new Error('Invalid signature');
        }

        try {
          return JSON.parse(atob(payload));
        } catch (err) {
          throw new Error('Malformed payload JSON');
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day9Config.eTest);
    });
  });

  it('Day 9 Exam: catches defective implementation that accepts tampered signature or bad format', async () => {
    // Defective code that ignores signature verification and decodes blindly
    const defectiveCode = `
      function verifyJwtSignature(token, secret) {
        const parts = token.split('.');
        return JSON.parse(atob(parts[1]));
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day9Config.eTest);
    });
  });

  it('Day 9 Assignment (isJwtExpired): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function isJwtExpired(expTimestamp, toleranceSeconds = 0) {
        if (typeof expTimestamp !== 'number' || isNaN(expTimestamp)) {
          throw new Error('Invalid exp timestamp');
        }
        const now = Date.now() / 1000;
        return now >= (expTimestamp + toleranceSeconds);
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day9Config.aTest);
    });
  });

  it('Day 9 Assignment: catches defective implementation that treats expired token as valid or ignores leeway', async () => {
    // Defective code that always returns false (never expired)
    const defectiveCode = `
      function isJwtExpired(expTimestamp, toleranceSeconds = 0) {
        return false;
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day9Config.aTest);
    });
  });
});

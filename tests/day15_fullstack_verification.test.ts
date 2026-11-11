import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 15 Full-Stack Certification Invariant Verification', () => {
  const day15Config = FULLSTACK_30_DAYS_CONFIGS[14];
  const day15Lesson = FULLSTACK_JS_LONG_LESSONS[14];

  it('Day 15 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day15Config.day, 15);
    assert.strictEqual(day15Lesson.day, 15);
    assert.strictEqual(day15Config.title, '⭐ Milestone 3 Capstone: Enterprise Multi-Tenant Authentication & Session Hub');
    assert.strictEqual(day15Lesson.title, '⭐ Milestone 3 Capstone: Enterprise Multi-Tenant Authentication & Session Hub');
    assert.strictEqual(day15Config.syllabus.length, 3);
  });

  it('Day 15 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day15Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day15Lesson.parts.forEach((part, idx) => {
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

  it('Day 15 Exam (AuthHub): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class AuthHub {
        constructor(secret) {
          if (!secret || typeof secret !== 'string') throw new Error('Secret required');
          this.secret = secret;
          this.revokedTokens = new Set();
        }

        login(tenantId, userId) {
          const payload = JSON.stringify({ tenantId, userId, iat: Date.now() });
          const pB64 = btoa(payload);
          const sig = btoa(pB64 + ':' + this.secret);
          return pB64 + '.' + sig;
        }

        validate(token) {
          if (!token || typeof token !== 'string') {
            return { valid: false, error: 'INVALID_TOKEN' };
          }

          if (this.revokedTokens.has(token)) {
            return { valid: false, error: 'TOKEN_REVOKED' };
          }

          const parts = token.split('.');
          if (parts.length !== 2) {
            return { valid: false, error: 'MALFORMED_TOKEN' };
          }

          const [pB64, sig] = parts;
          const expectedSig = btoa(pB64 + ':' + this.secret);
          if (sig !== expectedSig) {
            return { valid: false, error: 'INVALID_SIGNATURE' };
          }

          try {
            const payload = JSON.parse(atob(pB64));
            return {
              valid: true,
              tenantId: payload.tenantId,
              userId: payload.userId
            };
          } catch (e) {
            return { valid: false, error: 'MALFORMED_PAYLOAD' };
          }
        }

        revoke(token) {
          if (typeof token === 'string' && token) {
            this.revokedTokens.add(token);
          }
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day15Config.eTest);
    });
  });

  it('Day 15 Exam: catches defective AuthHub that accepts revoked tokens or ignores validation', async () => {
    // Defective code that never checks revokedTokens set
    const defectiveCode = `
      class AuthHub {
        constructor(secret) {}
        login(tenantId, userId) {
          return btoa(JSON.stringify({ tenantId, userId })) + '.mock';
        }
        validate(token) {
          // BUG: accepts revoked tokens blindly!
          const payload = JSON.parse(atob(token.split('.')[0]));
          return { valid: true, tenantId: payload.tenantId, userId: payload.userId };
        }
        revoke(token) {}
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day15Config.eTest);
    });
  });

  it('Day 15 Assignment (extractBearerToken): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function extractBearerToken(authHeader = '') {
        if (!authHeader || typeof authHeader !== 'string') return null;
        const match = authHeader.match(/^Bearer\\s+(.+)$/i);
        return match ? match[1].trim() : null;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day15Config.aTest);
    });
  });

  it('Day 15 Assignment: catches defective implementation that accepts non-Bearer auth scheme', async () => {
    // Defective code that accepts Basic or arbitrary headers
    const defectiveCode = `
      function extractBearerToken(authHeader = '') {
        if (!authHeader) return '';
        return authHeader.split(' ')[1] || null; // BUG: accepts Basic dXNlcjpwYXNz!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day15Config.aTest);
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 10 Full-Stack Certification Invariant Verification', () => {
  const day10Config = FULLSTACK_30_DAYS_CONFIGS[9];
  const day10Lesson = FULLSTACK_JS_LONG_LESSONS[9];

  it('Day 10 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day10Config.day, 10);
    assert.strictEqual(day10Lesson.day, 10);
    assert.strictEqual(day10Config.title, 'Session Security & Token Transport: Secure HttpOnly Cookies, SameSite Policies & Refresh Token Rotation');
    assert.strictEqual(day10Lesson.title, 'Session Security & Token Transport: Secure HttpOnly Cookies, SameSite Policies & Refresh Token Rotation');
    assert.strictEqual(day10Config.syllabus.length, 3);
  });

  it('Day 10 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day10Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day10Lesson.parts.forEach((part, idx) => {
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
      isNaN: isNaN,
      decodeURIComponent: decodeURIComponent,
      encodeURIComponent: encodeURIComponent
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

  it('Day 10 Exam (buildSecureCookieHeader): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function buildSecureCookieHeader(name, value, maxAgeSeconds = 3600, options = {}) {
        if (!name || typeof name !== 'string') {
          throw new Error('Invalid cookie name');
        }
        if (typeof value !== 'string') {
          throw new Error('Invalid cookie value');
        }

        const directives = [];
        directives.push(name.trim() + '=' + value);

        if (typeof maxAgeSeconds === 'number' && !isNaN(maxAgeSeconds)) {
          directives.push('Max-Age=' + Math.max(0, Math.floor(maxAgeSeconds)));
        }

        const path = options.path || '/';
        directives.push('Path=' + path);

        if (options.domain) {
          directives.push('Domain=' + options.domain);
        }

        directives.push('HttpOnly');
        directives.push('Secure');

        const sameSite = options.sameSite || 'Strict';
        directives.push('SameSite=' + sameSite);

        return directives.join('; ');
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day10Config.eTest);
    });
  });

  it('Day 10 Exam: catches defective implementation that omits HttpOnly or Secure directives', async () => {
    // Defective code that sets insecure cookie without HttpOnly or Secure
    const defectiveCode = `
      function buildSecureCookieHeader(name, value, maxAgeSeconds = 3600, options = {}) {
        return name + '=' + value + '; Path=/; Max-Age=' + maxAgeSeconds;
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day10Config.eTest);
    });
  });

  it('Day 10 Assignment (parseCookieHeader): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function parseCookieHeader(cookieString = '') {
        const result = {};
        if (!cookieString || typeof cookieString !== 'string') {
          return result;
        }

        const pairs = cookieString.split(';');
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i].trim();
          if (!pair) continue;

          const eqIdx = pair.indexOf('=');
          if (eqIdx === -1) {
            result[pair] = '';
            continue;
          }

          const key = pair.slice(0, eqIdx).trim();
          const rawVal = pair.slice(eqIdx + 1).trim();

          try {
            result[key] = decodeURIComponent(rawVal);
          } catch (e) {
            result[key] = rawVal;
          }
        }

        return result;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day10Config.aTest);
    });
  });

  it('Day 10 Assignment: catches defective implementation that fails to trim whitespace or parse pairs', async () => {
    // Defective code that returns null on empty string
    const defectiveCode = `
      function parseCookieHeader(cookieString = '') {
        if (!cookieString) return null; // BUG: must return empty object {}
        return { user: 'Alex', session: 'abc123' };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day10Config.aTest);
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 2 Full-Stack Certification Invariant Verification', () => {
  const day2Config = FULLSTACK_30_DAYS_CONFIGS[1];
  const day2Lesson = FULLSTACK_JS_LONG_LESSONS[1];

  it('Day 2 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day2Config.day, 2);
    assert.strictEqual(day2Lesson.day, 2);
    assert.strictEqual(day2Config.title, 'Node.js Runtime Core: Asynchronous EventEmitters, Memory Buffers & Stream Physics');
    assert.strictEqual(day2Lesson.title, 'Node.js Runtime Core: Asynchronous EventEmitters, Memory Buffers & Stream Physics');
    assert.strictEqual(day2Config.syllabus.length, 3);
  });

  it('Day 2 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day2Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day2Lesson.parts.forEach((part, idx) => {
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
      Error: Error
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

  it('Day 2 Exam (EventBus): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class EventBus {
        constructor() {
          this.listeners = new Map();
        }
        on(event, callback) {
          if (typeof callback !== 'function') return this;
          const existing = this.listeners.get(event) || [];
          existing.push(callback);
          this.listeners.set(event, existing);
          return this;
        }
        once(event, callback) {
          if (typeof callback !== 'function') return this;
          const onceWrapper = (data) => {
            this.off(event, onceWrapper);
            callback(data);
          };
          return this.on(event, onceWrapper);
        }
        off(event, callback) {
          const existing = this.listeners.get(event);
          if (!existing) return this;
          const filtered = existing.filter(cb => cb !== callback);
          if (filtered.length > 0) {
            this.listeners.set(event, filtered);
          } else {
            this.listeners.delete(event);
          }
          return this;
        }
        emit(event, data) {
          const registered = this.listeners.get(event);
          if (!registered || registered.length === 0) return false;
          [...registered].forEach(cb => {
            try { cb(data); } catch (e) {}
          });
          return true;
        }
      }
    `;
    await assert.doesNotReject(runSandbox(studentCode, day2Config.eTest));
  });

  it('Day 2 Exam (EventBus): broken implementation fails automated test suite', async () => {
    const brokenCode = `
      class EventBus {
        on() {}
        off() {}
        emit() { return false; }
      }
    `;
    await assert.rejects(runSandbox(brokenCode, day2Config.eTest));
  });

  it('Day 2 Assignment (getPayloadByteSize): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function getPayloadByteSize(text) {
        if (typeof text !== 'string') {
          throw new TypeError('Invalid input: text must be a string.');
        }
        return new TextEncoder().encode(text).length;
      }
    `;
    await assert.doesNotReject(runSandbox(studentCode, day2Config.aTest));
  });

  it('Day 2 Assignment (getPayloadByteSize): naive length implementation fails on multi-byte characters', async () => {
    const naiveCode = `
      function getPayloadByteSize(text) {
        if (typeof text !== 'string') throw new TypeError();
        return text.length; // Naive: fails on emojis and multi-byte!
      }
    `;
    await assert.rejects(runSandbox(naiveCode, day2Config.aTest));
  });
});

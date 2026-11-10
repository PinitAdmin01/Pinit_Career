import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 21 Full-Stack Certification Invariant Verification', () => {
  const day21Config = FULLSTACK_30_DAYS_CONFIGS[20];
  const day21Lesson = FULLSTACK_JS_LONG_LESSONS[20];

  it('Day 21 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day21Config.day, 21);
    assert.strictEqual(day21Lesson.day, 21);
    assert.strictEqual(day21Config.title, 'Next.js Route Handlers, Web Streams & Edge Streaming Architecture');
    assert.strictEqual(day21Lesson.title, 'Next.js Route Handlers, Web Streams & Edge Streaming Architecture');
    assert.strictEqual(day21Config.syllabus.length, 3);
  });

  it('Day 21 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day21Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering',
      'in this section we will explore',
      'delve into',
      'testament to',
      'embark on',
      'it is important to note',
      'crucial to understand',
      'it is worth noting'
    ];

    day21Lesson.parts.forEach((part, idx) => {
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
          !fullText.toLowerCase().includes(phrase.toLowerCase()),
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

  it('Day 21 Exam (formatSseChunk): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function formatSseChunk(event, data, id) {
        if (!event || typeof event !== 'string' || event.trim().length === 0) {
          throw new Error('Event name must be a non-empty string');
        }

        const lines = ['event: ' + event.trim()];

        if (id !== undefined && id !== null) {
          lines.push('id: ' + String(id).trim());
        }

        const rawData = typeof data === 'object' && data !== null ? JSON.stringify(data) : String(data ?? '');
        const dataLines = rawData.split('\\n');
        for (const dLine of dataLines) {
          lines.push('data: ' + dLine);
        }

        return lines.join('\\n') + '\\n\\n';
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day21Config.eTest);
    });
  });

  it('Day 21 Exam: catches defective implementation that omits double newline termination or allows empty event', async () => {
    // Defective code that terminates with a single newline
    const defectiveCode = `
      function formatSseChunk(event, data, id) {
        return 'event: ' + event + '\\ndata: ' + JSON.stringify(data) + '\\n';
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day21Config.eTest);
    });
  });

  it('Day 21 Assignment (getSseHeaders): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function getSseHeaders() {
        return {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no'
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day21Config.aTest);
    });
  });

  it('Day 21 Assignment: catches defective implementation that omits X-Accel-Buffering or cache-control', async () => {
    // Defective code that omits X-Accel-Buffering
    const defectiveCode = `
      function getSseHeaders() {
        return {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day21Config.aTest);
    });
  });
});

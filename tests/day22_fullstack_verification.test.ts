import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 22 Full-Stack Certification Invariant Verification', () => {
  const day22Config = FULLSTACK_30_DAYS_CONFIGS[21];
  const day22Lesson = FULLSTACK_JS_LONG_LESSONS[21];

  it('Day 22 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day22Config.day, 22);
    assert.strictEqual(day22Lesson.day, 22);
    assert.strictEqual(day22Config.title, 'Distributed Microservices, gRPC & Protocol Buffers (Protobuf)');
    assert.strictEqual(day22Lesson.title, 'Distributed Microservices, gRPC & Protocol Buffers (Protobuf)');
    assert.strictEqual(day22Config.syllabus.length, 3);
  });

  it('Day 22 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day22Lesson.parts.length, 5);

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

    day22Lesson.parts.forEach((part, idx) => {
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

  it('Day 22 Exam (CircuitBreaker): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class CircuitBreaker {
        constructor(threshold = 3, resetTimeout = 1000) {
          this.threshold = threshold;
          this.resetTimeout = resetTimeout;
          this.state = 'CLOSED';
          this.failureCount = 0;
          this.lastStateChange = Date.now();
        }

        async execute(asyncFn) {
          const now = Date.now();
          if (this.state === 'OPEN') {
            if (now - this.lastStateChange > this.resetTimeout) {
              this.state = 'HALF_OPEN';
            } else {
              throw new Error('CIRCUIT_OPEN_FAST_FAIL');
            }
          }

          try {
            const result = await asyncFn();
            this.failureCount = 0;
            this.state = 'CLOSED';
            return result;
          } catch (err) {
            this.failureCount++;
            if (this.failureCount >= this.threshold || this.state === 'HALF_OPEN') {
              this.state = 'OPEN';
              this.lastStateChange = Date.now();
            }
            throw err;
          }
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day22Config.eTest);
    });
  });

  it('Day 22 Exam: catches defective implementation that fails to trip to OPEN or fast fail', async () => {
    // Defective code that always remains CLOSED and never trips to OPEN
    const defectiveCode = `
      class CircuitBreaker {
        constructor(threshold = 3, resetTimeout = 1000) {
          this.state = 'CLOSED';
        }
        async execute(asyncFn) {
          return await asyncFn();
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day22Config.eTest);
    });
  });

  it('Day 22 Assignment (registerService): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function registerService(registry, serviceName, endpointUrl) {
        if (!serviceName || typeof serviceName !== 'string' || serviceName.trim().length === 0) {
          throw new Error('Valid serviceName is required');
        }
        if (!endpointUrl || typeof endpointUrl !== 'string' || endpointUrl.trim().length === 0) {
          throw new Error('Valid endpointUrl is required');
        }
        const updated = { ...registry };
        updated[serviceName.trim()] = endpointUrl.trim();
        return updated;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day22Config.aTest);
    });
  });

  it('Day 22 Assignment: catches defective implementation that permits empty serviceName', async () => {
    // Defective code that does not validate empty serviceName
    const defectiveCode = `
      function registerService(registry, serviceName, endpointUrl) {
        registry[serviceName] = endpointUrl;
        return registry;
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day22Config.aTest);
    });
  });
});

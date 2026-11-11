import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 19 Full-Stack Certification Invariant Verification', () => {
  const day19Config = FULLSTACK_30_DAYS_CONFIGS[18];
  const day19Lesson = FULLSTACK_JS_LONG_LESSONS[18];

  it('Day 19 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day19Config.day, 19);
    assert.strictEqual(day19Lesson.day, 19);
    assert.strictEqual(day19Config.title, 'Message Queues & Background Job Processing with BullMQ, Redis & Dead-Letter Queues (DLQ)');
    assert.strictEqual(day19Lesson.title, 'Message Queues & Background Job Processing with BullMQ, Redis & Dead-Letter Queues (DLQ)');
    assert.strictEqual(day19Config.syllabus.length, 3);
  });

  it('Day 19 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day19Lesson.parts.length, 5);

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

    day19Lesson.parts.forEach((part, idx) => {
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

  it('Day 19 Exam (ResilientJobQueue): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class ResilientJobQueue {
        constructor() {
          this.queue = [];
          this.dlq = [];
        }

        enqueue(name, payload, options = {}) {
          const id = 'job_' + Math.random().toString(36).substring(2, 9);
          const item = {
            id,
            name,
            payload,
            attempts: 0,
            maxAttempts: options.maxAttempts ?? 3,
            backoffMs: options.backoffMs ?? 100
          };
          this.queue.push(item);
          return id;
        }

        async processNext(workerFn) {
          if (this.queue.length === 0) {
            return { status: 'FAILED', jobId: '', error: 'NO_JOBS' };
          }
          const job = this.queue.shift();
          job.attempts++;

          try {
            const result = await workerFn(job.payload);
            return { status: 'COMPLETED', jobId: job.id, result };
          } catch (err) {
            const errorMsg = err?.message || 'Worker failure';
            if (job.attempts >= job.maxAttempts) {
              this.dlq.push(job);
              return { status: 'FAILED', jobId: job.id, error: errorMsg };
            } else {
              this.queue.push(job);
              return { status: 'RETRY_SCHEDULED', jobId: job.id, error: errorMsg };
            }
          }
        }

        getDlq() {
          return [...this.dlq];
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day19Config.eTest);
    });
  });

  it('Day 19 Exam: catches defective implementation that fails to route exhausted jobs to DLQ', async () => {
    // Defective code that always reschedules retry and never quarantines to DLQ
    const defectiveCode = `
      class ResilientJobQueue {
        constructor() {
          this.queue = [];
          this.dlq = [];
        }
        enqueue(name, payload, options = {}) {
          const id = 'job_bad';
          this.queue.push({ id, name, payload, attempts: 0, maxAttempts: options.maxAttempts ?? 3 });
          return id;
        }
        async processNext(workerFn) {
          const job = this.queue.shift();
          job.attempts++;
          try {
            const result = await workerFn(job.payload);
            return { status: 'COMPLETED', jobId: job.id, result };
          } catch (e) {
            this.queue.push(job); // BUG: Always retries indefinitely!
            return { status: 'RETRY_SCHEDULED', jobId: job.id, error: e.message };
          }
        }
        getDlq() { return [...this.dlq]; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day19Config.eTest);
    });
  });

  it('Day 19 Assignment (generateJobIdempotencyKey): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function generateJobIdempotencyKey(jobName, payload) {
        if (!jobName || typeof jobName !== 'string') {
          throw new Error('jobName is required');
        }
        const keys = Object.keys(payload || {}).sort();
        const pairs = keys.map(k => k + '=' + JSON.stringify(payload[k]));
        const canonical = jobName + '::' + pairs.join('&');
        let hash = 0;
        for (let i = 0; i < canonical.length; i++) {
          hash = ((hash << 5) - hash + canonical.charCodeAt(i)) | 0;
        }
        const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
        return 'job:' + jobName + ':' + hexHash;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day19Config.aTest);
    });
  });

  it('Day 19 Assignment: catches defective implementation that ignores payload key ordering', async () => {
    // Defective code that does not sort keys before serializing
    const defectiveCode = `
      function generateJobIdempotencyKey(jobName, payload) {
        // BUG: Direct JSON serialization is sensitive to key ordering!
        return 'job:' + jobName + ':' + JSON.stringify(payload);
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day19Config.aTest);
    });
  });
});

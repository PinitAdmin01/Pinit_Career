import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 20 Full-Stack Certification Invariant Verification', () => {
  const day20Config = FULLSTACK_30_DAYS_CONFIGS[19];
  const day20Lesson = FULLSTACK_JS_LONG_LESSONS[19];

  it('Day 20 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day20Config.day, 20);
    assert.strictEqual(day20Lesson.day, 20);
    assert.strictEqual(day20Config.title, '⭐ Milestone 4 Capstone: Real-Time Event-Driven Collaboration & Background Processing Engine');
    assert.strictEqual(day20Lesson.title, '⭐ Milestone 4 Capstone: Real-Time Event-Driven Collaboration & Background Processing Engine');
    assert.strictEqual(day20Config.syllabus.length, 3);
  });

  it('Day 20 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day20Lesson.parts.length, 5);

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

    day20Lesson.parts.forEach((part, idx) => {
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

  it('Day 20 Exam (RealtimeCollaborationHub): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class RealtimeCollaborationHub {
        constructor(options = {}) {
          this.maxBurst = options.maxBurst ?? 5;
          this.rooms = new Map();
          this.clientTokens = new Map();
          this.backgroundJobs = [];
          this.dlq = [];
        }

        joinRoom(roomId, clientId) {
          if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
          }
          this.rooms.get(roomId).add(clientId);
          this.clientTokens.set(clientId, this.maxBurst);
        }

        broadcast(roomId, senderId, message) {
          const tokens = this.clientTokens.get(senderId) ?? 0;
          if (tokens <= 0) {
            return { error: 'Rate limit exceeded', rateLimited: true };
          }
          this.clientTokens.set(senderId, tokens - 1);

          const room = this.rooms.get(roomId);
          if (!room) return { deliveredCount: 0 };

          let count = 0;
          for (const member of room) {
            if (member !== senderId) {
              count++;
            }
          }
          return { deliveredCount: count };
        }

        dispatchBackgroundJob(taskName, payload, maxRetries = 2) {
          const id = 'job_' + Math.random().toString(36).substring(2, 8);
          this.backgroundJobs.push({
            id,
            taskName,
            payload,
            attempts: 0,
            maxRetries
          });
          return id;
        }

        async processNextJob(workerFn) {
          if (this.backgroundJobs.length === 0) {
            return { status: 'FAILED', jobId: '', error: 'NO_JOBS' };
          }
          const job = this.backgroundJobs.shift();
          job.attempts++;

          try {
            const result = await workerFn(job.payload);
            return { status: 'COMPLETED', jobId: job.id, result };
          } catch (err) {
            if (job.attempts >= job.maxRetries) {
              this.dlq.push(job);
              return { status: 'FAILED', jobId: job.id, error: err?.message };
            } else {
              this.backgroundJobs.push(job);
              return { status: 'RETRY_SCHEDULED', jobId: job.id, error: err?.message };
            }
          }
        }

        getRoomMembers(roomId) {
          return Array.from(this.rooms.get(roomId) || []);
        }

        getDlq() {
          return [...this.dlq];
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day20Config.eTest);
    });
  });

  it('Day 20 Exam: catches defective implementation that echoes broadcast to sender or ignores token limit', async () => {
    // Defective code that includes sender in delivered count
    const defectiveCode = `
      class RealtimeCollaborationHub {
        constructor() { this.rooms = new Map(); }
        joinRoom(r, c) { if (!this.rooms.has(r)) this.rooms.set(r, new Set()); this.rooms.get(r).add(c); }
        broadcast(r, s, m) { return { deliveredCount: this.rooms.get(r)?.size || 0 }; }
        dispatchBackgroundJob() { return 'j1'; }
        async processNextJob() { return { status: 'COMPLETED' }; }
        getRoomMembers(r) { return Array.from(this.rooms.get(r) || []); }
        getDlq() { return []; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day20Config.eTest);
    });
  });

  it('Day 20 Assignment (mergeStatePatches): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function mergeStatePatches(baseState, patchList) {
        const state = { ...baseState };
        let lastSeq = 0;
        let appliedCount = 0;
        let rejectedCount = 0;

        for (const patch of (patchList || [])) {
          if (typeof patch.seq === 'number' && patch.seq > lastSeq) {
            state[patch.key] = patch.value;
            lastSeq = patch.seq;
            appliedCount++;
          } else {
            rejectedCount++;
          }
        }

        return { state, appliedCount, rejectedCount };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day20Config.aTest);
    });
  });

  it('Day 20 Assignment: catches defective implementation that permits sequence regression', async () => {
    // Defective code that applies every patch regardless of sequence regression
    const defectiveCode = `
      function mergeStatePatches(baseState, patchList) {
        const state = { ...baseState };
        for (const p of patchList) { state[p.key] = p.value; }
        return { state, appliedCount: patchList.length, rejectedCount: 0 };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day20Config.aTest);
    });
  });
});

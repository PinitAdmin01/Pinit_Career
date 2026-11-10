import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 16 Full-Stack Certification Invariant Verification', () => {
  const day16Config = FULLSTACK_30_DAYS_CONFIGS[15];
  const day16Lesson = FULLSTACK_JS_LONG_LESSONS[15];

  it('Day 16 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day16Config.day, 16);
    assert.strictEqual(day16Lesson.day, 16);
    assert.strictEqual(day16Config.title, 'WebSockets & Real-Time Event Architecture: Bi-directional Framing, Heartbeats & Room Multiplexing');
    assert.strictEqual(day16Lesson.title, 'WebSockets & Real-Time Event Architecture: Bi-directional Framing, Heartbeats & Room Multiplexing');
    assert.strictEqual(day16Config.syllabus.length, 3);
  });

  it('Day 16 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day16Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering'
    ];

    day16Lesson.parts.forEach((part, idx) => {
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

  it('Day 16 Exam (WebSocketRoomHub): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class WebSocketRoomHub {
        constructor() {
          this.rooms = new Map();
        }

        join(room, socketId) {
          if (!room || !socketId) return;
          if (!this.rooms.has(room)) {
            this.rooms.set(room, new Set());
          }
          this.rooms.get(room).add(socketId);
        }

        leave(room, socketId) {
          if (!room || !socketId) return;
          if (this.rooms.has(room)) {
            const roomSet = this.rooms.get(room);
            roomSet.delete(socketId);
            if (roomSet.size === 0) {
              this.rooms.delete(room);
            }
          }
        }

        broadcast(room, message, senderId) {
          const roomSet = this.rooms.get(room);
          if (!roomSet || roomSet.size === 0) {
            return { room, message, senderId, recipients: [] };
          }

          const recipients = [];
          for (const socketId of roomSet) {
            if (socketId !== senderId) {
              recipients.push(socketId);
            }
          }

          return { room, message, senderId, recipients };
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day16Config.eTest);
    });
  });

  it('Day 16 Exam: catches defective WebSocketRoomHub that echoes message to sender', async () => {
    // Defective code that includes senderId in recipients
    const defectiveCode = `
      class WebSocketRoomHub {
        constructor() {
          this.rooms = new Map();
        }
        join(room, socketId) {
          if (!this.rooms.has(room)) this.rooms.set(room, new Set());
          this.rooms.get(room).add(socketId);
        }
        leave(room, socketId) {
          if (this.rooms.has(room)) this.rooms.get(room).delete(socketId);
        }
        broadcast(room, message, senderId) {
          const roomSet = this.rooms.get(room) || new Set();
          // BUG: includes senderId!
          return { room, message, senderId, recipients: Array.from(roomSet) };
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day16Config.eTest);
    });
  });

  it('Day 16 Assignment (isConnectionAlive): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function isConnectionAlive(lastPingTimestamp, timeoutMs = 30000) {
        if (typeof lastPingTimestamp !== 'number' || isNaN(lastPingTimestamp)) {
          return false;
        }
        return (Date.now() - lastPingTimestamp) < timeoutMs;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day16Config.aTest);
    });
  });

  it('Day 16 Assignment: catches defective implementation that accepts dead connections', async () => {
    // Defective code that always returns true
    const defectiveCode = `
      function isConnectionAlive(lastPingTimestamp, timeoutMs = 30000) {
        return true; // BUG: always true!
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day16Config.aTest);
    });
  });
});

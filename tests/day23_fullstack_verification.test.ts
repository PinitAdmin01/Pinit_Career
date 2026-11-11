import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 23 Full-Stack Certification Invariant Verification', () => {
  const day23Config = FULLSTACK_30_DAYS_CONFIGS[22];
  const day23Lesson = FULLSTACK_JS_LONG_LESSONS[22];

  it('Day 23 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day23Config.day, 23);
    assert.strictEqual(day23Lesson.day, 23);
    assert.strictEqual(day23Config.title, 'Event-Driven Architecture with Apache Kafka & Distributed Log Streaming');
    assert.strictEqual(day23Lesson.title, 'Event-Driven Architecture with Apache Kafka & Distributed Log Streaming');
    assert.strictEqual(day23Config.syllabus.length, 3);
  });

  it('Day 23 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day23Lesson.parts.length, 5);

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

    day23Lesson.parts.forEach((part, idx) => {
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

  it('Day 23 Exam (KafkaCommitLog): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class KafkaCommitLog {
        constructor(partitionCount = 3) {
          this.partitionCount = partitionCount;
          this.topics = new Map();
        }

        getPartition(key) {
          if (!key || typeof key !== 'string') return 0;
          let h = 0;
          for (let i = 0; i < key.length; i++) {
            h = ((h << 5) - h + key.charCodeAt(i)) | 0;
          }
          return Math.abs(h) % this.partitionCount;
        }

        append(topic, key, message) {
          if (!topic || typeof topic !== 'string') throw new Error('Topic is required');
          if (!this.topics.has(topic)) {
            const partitions = Array.from({ length: this.partitionCount }, () => []);
            this.topics.set(topic, partitions);
          }

          const partitions = this.topics.get(topic);
          const partition = this.getPartition(key);
          const log = partitions[partition];
          const offset = log.length;

          log.push({
            offset,
            key,
            message,
            timestamp: Date.now()
          });

          return { topic, partition, offset };
        }

        readPartition(topic, partition, fromOffset = 0) {
          const partitions = this.topics.get(topic);
          if (!partitions || !partitions[partition]) return [];
          return partitions[partition].slice(fromOffset);
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day23Config.eTest);
    });
  });

  it('Day 23 Exam: catches defective implementation that routes randomly or breaks monotonic offsets', async () => {
    // Defective code that assigns random partitions
    const defectiveCode = `
      class KafkaCommitLog {
        constructor(partitionCount = 3) {
          this.partitionCount = partitionCount;
          this.topics = new Map();
        }
        getPartition(key) {
          return Math.floor(Math.random() * this.partitionCount);
        }
        append(topic, key, message) {
          return { topic, partition: this.getPartition(key), offset: 0 };
        }
        readPartition() { return []; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day23Config.eTest);
    });
  });

  it('Day 23 Assignment (ConsumerGroupTracker): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class ConsumerGroupTracker {
        constructor() {
          this.offsets = new Map();
        }

        commitOffset(groupId, topic, partition, offset) {
          if (!groupId || !topic || typeof partition !== 'number' || typeof offset !== 'number') {
            throw new Error('Invalid commit arguments');
          }
          const key = groupId + ':' + topic + ':' + partition;
          const current = this.offsets.get(key);
          if (current !== undefined && offset < current) {
            throw new Error('Offset regression: cannot commit offset lower than current position');
          }
          this.offsets.set(key, offset);
        }

        getCommittedOffset(groupId, topic, partition) {
          const key = groupId + ':' + topic + ':' + partition;
          return this.offsets.get(key) ?? -1;
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day23Config.aTest);
    });
  });

  it('Day 23 Assignment: catches defective implementation that permits offset regressions', async () => {
    // Defective code that overwrites without checking regression
    const defectiveCode = `
      class ConsumerGroupTracker {
        constructor() { this.offsets = new Map(); }
        commitOffset(groupId, topic, partition, offset) {
          this.offsets.set(groupId + ':' + topic + ':' + partition, offset);
        }
        getCommittedOffset(groupId, topic, partition) {
          return this.offsets.get(groupId + ':' + topic + ':' + partition) ?? -1;
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day23Config.aTest);
    });
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 25 Full-Stack Certification Invariant Verification', () => {
  const day25Config = FULLSTACK_30_DAYS_CONFIGS[24];
  const day25Lesson = FULLSTACK_JS_LONG_LESSONS[24];

  it('Day 25 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day25Config.day, 25);
    assert.strictEqual(day25Lesson.day, 25);
    assert.strictEqual(day25Config.title, '⭐ Milestone 5 Capstone: Distributed Event-Driven Cloud Microservices Architecture');
    assert.strictEqual(day25Lesson.title, '⭐ Milestone 5 Capstone: Distributed Event-Driven Cloud Microservices Architecture');
    assert.strictEqual(day25Config.syllabus.length, 3);
  });

  it('Day 25 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day25Lesson.parts.length, 5);

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

    day25Lesson.parts.forEach((part, idx) => {
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

  it('Day 25 Exam (DistributedMicroserviceHub): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class DistributedMicroserviceHub {
        constructor(partitionCount = 3) {
          this.services = new Map();
          this.topics = new Map();
          this.partitionCount = partitionCount;
          this.isReady = true;
          this.isAlive = true;
        }

        registerService(name, handler, failureThreshold = 2, resetTimeout = 300) {
          this.services.set(name, {
            handler,
            failureThreshold,
            resetTimeout,
            consecutiveFailures: 0,
            state: 'CLOSED',
            nextAttempt: 0
          });
        }

        async dispatchRpc(serviceName, request) {
          const service = this.services.get(serviceName);
          if (!service) throw new Error("Service '" + serviceName + "' not found");

          const now = Date.now();
          if (service.state === 'OPEN') {
            if (now >= service.nextAttempt) {
              service.state = 'HALF_OPEN';
            } else {
              throw new Error('CIRCUIT_OPEN_FAST_FAIL');
            }
          }

          try {
            const result = await service.handler(request);
            if (service.state === 'HALF_OPEN') {
              service.state = 'CLOSED';
              service.consecutiveFailures = 0;
            }
            return result;
          } catch (err) {
            service.consecutiveFailures++;
            if (service.state === 'HALF_OPEN' || service.consecutiveFailures >= service.failureThreshold) {
              service.state = 'OPEN';
              service.nextAttempt = now + service.resetTimeout;
            }
            throw err;
          }
        }

        getServiceState(serviceName) {
          return this.services.get(serviceName)?.state;
        }

        publishEvent(topic, partitionKey, payload) {
          if (!this.topics.has(topic)) {
            this.topics.set(topic, Array.from({ length: this.partitionCount }, () => []));
          }

          let h = 0;
          if (partitionKey && typeof partitionKey === 'string') {
            for (let i = 0; i < partitionKey.length; i++) {
              h = ((h << 5) - h + partitionKey.charCodeAt(i)) | 0;
            }
          }
          const partition = Math.abs(h) % this.partitionCount;
          const log = this.topics.get(topic)[partition];
          const offset = log.length;

          log.push({
            offset,
            key: partitionKey,
            payload,
            timestamp: Date.now()
          });

          return { topic, partition, offset };
        }

        readPartition(topic, partition, fromOffset = 0) {
          return this.topics.get(topic)?.[partition]?.slice(fromOffset) || [];
        }

        getLiveness() {
          return { status: this.isAlive ? 'UP' : 'DOWN' };
        }

        getReadiness() {
          return { status: this.isReady ? 'READY' : 'NOT_READY' };
        }

        shutdown() {
          this.isReady = false;
          this.isAlive = false;
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day25Config.eTest);
    });
  });

  it('Day 25 Exam: catches defective implementation that trips circuit breaker at wrong threshold or drops offsets', async () => {
    // Defective code that ignores failures and leaves circuit CLOSED always
    const defectiveCode = `
      class DistributedMicroserviceHub {
        constructor() {}
        registerService() {}
        async dispatchRpc(name, req) {
          if (req.fail) throw new Error('Fail');
          return { success: true, txnId: 500 };
        }
        getServiceState() { return 'CLOSED'; }
        publishEvent() { return { topic: 'orders', partition: 0, offset: 0 }; }
        readPartition() { return []; }
        getLiveness() { return { status: 'UP' }; }
        getReadiness() { return { status: 'READY' }; }
        shutdown() {}
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day25Config.eTest);
    });
  });

  it('Day 25 Assignment (evaluateServiceMeshHealth): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function evaluateServiceMeshHealth(services) {
        if (!Array.isArray(services) || services.length === 0) {
          return { totalServices: 0, healthyCount: 0, avgLatencyMs: 0, clusterStatus: 'CRITICAL' };
        }

        let totalServices = services.length;
        let healthyCount = 0;
        let degradedCount = 0;
        let unhealthyCount = 0;
        let totalLatency = 0;

        for (const s of services) {
          totalLatency += (s.latencyMs || 0);
          if (s.status === 'HEALTHY') healthyCount++;
          else if (s.status === 'DEGRADED') degradedCount++;
          else unhealthyCount++;
        }

        const avgLatencyMs = Math.round((totalLatency / totalServices) * 100) / 100;

        let clusterStatus = 'OPERATIONAL';
        if (unhealthyCount > 0 || degradedCount > totalServices / 2) {
          clusterStatus = 'CRITICAL';
        } else if (degradedCount > 0 || avgLatencyMs >= 100) {
          clusterStatus = 'DEGRADED';
        }

        return {
          totalServices,
          healthyCount,
          avgLatencyMs,
          clusterStatus
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day25Config.aTest);
    });
  });

  it('Day 25 Assignment: catches defective implementation that marks cluster OPERATIONAL despite unhealthy services', async () => {
    // Defective code that always returns OPERATIONAL
    const defectiveCode = `
      function evaluateServiceMeshHealth(services) {
        return {
          totalServices: services.length,
          healthyCount: services.length,
          avgLatencyMs: 20,
          clusterStatus: 'OPERATIONAL'
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day25Config.aTest);
    });
  });
});

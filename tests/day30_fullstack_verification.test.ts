import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 30 Full-Stack Certification Invariant Verification', () => {
  const day30Config = FULLSTACK_30_DAYS_CONFIGS[29];
  const day30Lesson = FULLSTACK_JS_LONG_LESSONS[29];

  it('Day 30 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day30Config.day, 30);
    assert.strictEqual(day30Lesson.day, 30);
    assert.strictEqual(day30Config.title, '⭐ Milestone 6 Capstone: Enterprise Cloud-Native Production Platform & Grand Master Full-Stack Certification');
    assert.strictEqual(day30Lesson.title, '⭐ Milestone 6 Capstone: Enterprise Cloud-Native Production Platform & Grand Master Full-Stack Certification');
    assert.strictEqual(day30Config.syllabus.length, 3);
  });

  it('Day 30 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day30Lesson.parts.length, 5);

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

    day30Lesson.parts.forEach((part, idx) => {
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

  it('Day 30 Exam (EnterprisePlatformHub): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function generateHex(bytes) {
        let res = '';
        const hex = '0123456789abcdef';
        for (let i = 0; i < bytes * 2; i++) {
          res += hex[Math.floor(Math.random() * 16)];
        }
        return res;
      }

      class EnterprisePlatformHub {
        constructor(clusterName = 'production-mesh', partitionCount = 3) {
          this.clusterName = clusterName;
          this.partitionCount = partitionCount;
          this.deployments = new Map();
          this.topics = new Map();
          this.wafBlockList = new Set();
          this.metrics = {
            requests: 0,
            serverErrors: 0,
            securityBlocks: 0,
            durations: []
          };
        }

        setWafBlockList(ips) {
          this.wafBlockList = new Set(ips);
        }

        deployService(name, desiredReplicas = 3) {
          const pods = [];
          for (let i = 1; i <= desiredReplicas; i++) {
            pods.push({ id: name + '-pod-' + i, status: 'RUNNING' });
          }
          this.deployments.set(name, { desired: desiredReplicas, activePods: pods });
          return this.deployments.get(name);
        }

        publishKafkaEvent(topic, partitionKey, payload) {
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

        handleIngressRequest(req) {
          const startTime = Date.now();
          this.metrics.requests++;

          if (this.wafBlockList.has(req.ip)) {
            this.metrics.securityBlocks++;
            this.metrics.durations.push(Date.now() - startTime);
            return {
              statusCode: 403,
              body: { error: 'WAF_FORBIDDEN' },
              traceparent: null
            };
          }

          const authHeader = req.headers?.authorization || '';
          if (!authHeader.startsWith('Bearer ') || authHeader.length < 15) {
            this.metrics.securityBlocks++;
            this.metrics.durations.push(Date.now() - startTime);
            return {
              statusCode: 401,
              body: { error: 'UNAUTHORIZED' },
              traceparent: null
            };
          }

          const traceId = generateHex(16);
          const spanId = generateHex(8);
          const traceparent = '00-' + traceId + '-' + spanId + '-01';

          this.metrics.durations.push(Date.now() - startTime);

          return {
            statusCode: 200,
            body: { status: 'SUCCESS', cluster: this.clusterName },
            traceparent
          };
        }

        certify5GateDefense() {
          const gates = {
            gate1_edgeWaf: this.wafBlockList.size > 0,
            gate2_k8sDeployments: this.deployments.size > 0 && Array.from(this.deployments.values()).every(d => d.activePods.length >= d.desired),
            gate3_kafkaPartitions: this.topics.size > 0,
            gate4_observabilityTracing: this.metrics.requests > 0,
            gate5_sliCompliance: false
          };

          const serverErrorRate = this.metrics.requests > 0 ? (this.metrics.serverErrors / this.metrics.requests) : 0;
          gates.gate5_sliCompliance = serverErrorRate < 0.05;

          const certified = Object.values(gates).every(Boolean);
          return {
            clusterName: this.clusterName,
            certified,
            gates
          };
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day30Config.eTest);
    });
  });

  it('Day 30 Exam: catches defective implementation that permits blocked WAF IPs or fails 5-Gate certification', async () => {
    // Defective code that ignores WAF blocklist
    const defectiveCode = `
      class EnterprisePlatformHub {
        constructor() {}
        setWafBlockList() {}
        deployService() { return { desired: 0, activePods: [] }; }
        publishKafkaEvent() { return { topic: 'orders', partition: 0, offset: 0 }; }
        handleIngressRequest() { return { statusCode: 200, traceparent: '00-fake-01' }; }
        certify5GateDefense() { return { certified: false, gates: {} }; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day30Config.eTest);
    });
  });

  it('Day 30 Assignment (evaluateClusterSloCompliance): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function evaluateClusterSloCompliance(metrics, targetAvailabilityPercent = 99.9) {
        const { totalRequests = 0, successfulRequests = 0, latenciesMs = [] } = metrics || {};

        if (totalRequests === 0) {
          return {
            availabilityPercent: 100,
            p99LatencyMs: 0,
            errorRate: 0,
            errorBudgetRemainingPercent: 100,
            status: 'COMPLIANT'
          };
        }

        const availabilityPercent = Math.round((successfulRequests / totalRequests) * 100000) / 1000;
        const errorRate = Math.round(((totalRequests - successfulRequests) / totalRequests) * 10000) / 10000;

        const allowedErrorPercent = 100 - targetAvailabilityPercent;
        const actualErrorPercent = Math.max(0, 100 - availabilityPercent);
        const errorBudgetRemainingPercent = Math.max(0, Math.round(((allowedErrorPercent - actualErrorPercent) / allowedErrorPercent) * 10000) / 100);

        const sorted = [...latenciesMs].sort((a, b) => a - b);
        const p99Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99));
        const p99LatencyMs = sorted.length > 0 ? sorted[p99Index] : 0;

        const status = (availabilityPercent >= targetAvailabilityPercent && p99LatencyMs < 200) ? 'COMPLIANT' : 'BREACHED';

        return {
          availabilityPercent,
          p99LatencyMs,
          errorRate,
          errorBudgetRemainingPercent,
          status
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day30Config.aTest);
    });
  });

  it('Day 30 Assignment: catches defective implementation that marks cluster COMPLIANT despite high latency or low availability', async () => {
    // Defective code that always returns COMPLIANT
    const defectiveCode = `
      function evaluateClusterSloCompliance() {
        return {
          availabilityPercent: 90,
          p99LatencyMs: 500,
          errorRate: 0.1,
          errorBudgetRemainingPercent: 0,
          status: 'COMPLIANT'
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day30Config.aTest);
    });
  });
});

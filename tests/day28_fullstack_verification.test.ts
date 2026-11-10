import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 28 Full-Stack Certification Invariant Verification', () => {
  const day28Config = FULLSTACK_30_DAYS_CONFIGS[27];
  const day28Lesson = FULLSTACK_JS_LONG_LESSONS[27];

  it('Day 28 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day28Config.day, 28);
    assert.strictEqual(day28Lesson.day, 28);
    assert.strictEqual(day28Config.title, 'Cloud Observability, OpenTelemetry (OTel), Prometheus Metrics & Distributed Tracing with Grafana/Jaeger');
    assert.strictEqual(day28Lesson.title, 'Cloud Observability, OpenTelemetry (OTel), Prometheus Metrics & Distributed Tracing with Grafana/Jaeger');
    assert.strictEqual(day28Config.syllabus.length, 3);
  });

  it('Day 28 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day28Lesson.parts.length, 5);

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

    day28Lesson.parts.forEach((part, idx) => {
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

  it('Day 28 Exam (OTelTracer): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function generateHex(bytes) {
        let res = '';
        const hex = '0123456789abcdef';
        for (let i = 0; i < bytes * 2; i++) {
          res += hex[Math.floor(Math.random() * 16)];
        }
        return res;
      }

      class Span {
        constructor(name, traceId, spanId, parentSpanId, tracer) {
          this.name = name;
          this.traceId = traceId;
          this.spanId = spanId;
          this.parentSpanId = parentSpanId;
          this.tracer = tracer;
          this.startTime = Date.now();
          this.endTime = null;
          this.durationMs = 0;
          this.status = 'UNSET';
          this.attributes = {};
        }

        setAttribute(k, v) {
          this.attributes[k] = v;
          return this;
        }

        end(status = 'OK') {
          this.endTime = Date.now();
          this.durationMs = Math.max(0, this.endTime - this.startTime);
          this.status = status;
          this.tracer.endedSpans.push(this);
          return this;
        }
      }

      class OTelTracer {
        constructor() {
          this.endedSpans = [];
        }

        startSpan(name, parentContext) {
          let traceId;
          let parentSpanId = null;

          if (parentContext && parentContext.traceId && parentContext.spanId) {
            traceId = parentContext.traceId;
            parentSpanId = parentContext.spanId;
          } else {
            traceId = generateHex(16);
          }

          const spanId = generateHex(8);
          return new Span(name, traceId, spanId, parentSpanId, this);
        }

        injectTraceparent(span) {
          if (!span || !span.traceId || !span.spanId) {
            throw new Error('Invalid span');
          }
          return '00-' + span.traceId + '-' + span.spanId + '-01';
        }

        extractTraceparent(header) {
          if (typeof header !== 'string') {
            throw new Error('Invalid traceparent header');
          }
          const match = header.trim().match(/^00-([a-f0-9]{32})-([a-f0-9]{16})-([a-f0-9]{2})$/i);
          if (!match) {
            throw new Error('Malformed W3C traceparent header');
          }
          return {
            traceId: match[1].toLowerCase(),
            spanId: match[2].toLowerCase(),
            sampled: match[3] === '01'
          };
        }

        exportSpans() {
          return this.endedSpans.map(s => ({
            name: s.name,
            traceId: s.traceId,
            spanId: s.spanId,
            parentSpanId: s.parentSpanId,
            durationMs: s.durationMs,
            status: s.status,
            attributes: { ...s.attributes }
          }));
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day28Config.eTest);
    });
  });

  it('Day 28 Exam: catches defective implementation that alters traceId on child spans or generates malformed headers', async () => {
    // Defective code that creates fresh traceId for every span, breaking distributed tracing tree
    const defectiveCode = `
      class OTelTracer {
        constructor() { this.endedSpans = []; }
        startSpan(name) {
          return {
            name,
            traceId: '12345',
            spanId: '67890',
            parentSpanId: null,
            setAttribute() {},
            end() {}
          };
        }
        injectTraceparent() { return 'invalid-header'; }
        extractTraceparent() { return { traceId: '123', spanId: '456', sampled: false }; }
        exportSpans() { return []; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day28Config.eTest);
    });
  });

  it('Day 28 Assignment (PrometheusRedMetrics): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class PrometheusRedMetrics {
        constructor() {
          this.routes = new Map();
        }

        recordRequest(route, statusCode, durationMs) {
          if (!this.routes.has(route)) {
            this.routes.set(route, { requests: 0, errors: 0, durations: [] });
          }
          const data = this.routes.get(route);
          data.requests++;
          if (statusCode >= 500) {
            data.errors++;
          }
          data.durations.push(durationMs);
        }

        getMetrics(route) {
          const data = this.routes.get(route);
          if (!data || data.requests === 0) {
            return null;
          }

          const totalRequests = data.requests;
          const errorCount = data.errors;
          const errorRate = Math.round((errorCount / totalRequests) * 10000) / 10000;

          const sorted = [...data.durations].sort((a, b) => a - b);
          const sum = sorted.reduce((acc, d) => acc + d, 0);
          const avgDurationMs = Math.round((sum / sorted.length) * 100) / 100;

          const p95Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
          const p99Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99));

          return {
            totalRequests,
            errorCount,
            errorRate,
            avgDurationMs,
            p95DurationMs: sorted[p95Index],
            p99DurationMs: sorted[p99Index]
          };
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day28Config.aTest);
    });
  });

  it('Day 28 Assignment: catches defective implementation that ignores error codes or computes incorrect percentiles', async () => {
    // Defective code that always returns 0 errors
    const defectiveCode = `
      class PrometheusRedMetrics {
        constructor() {}
        recordRequest() {}
        getMetrics() {
          return {
            totalRequests: 100,
            errorCount: 0,
            errorRate: 0,
            avgDurationMs: 50,
            p95DurationMs: 50,
            p99DurationMs: 50
          };
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day28Config.aTest);
    });
  });
});

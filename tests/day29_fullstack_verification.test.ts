import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 29 Full-Stack Certification Invariant Verification', () => {
  const day29Config = FULLSTACK_30_DAYS_CONFIGS[28];
  const day29Lesson = FULLSTACK_JS_LONG_LESSONS[28];

  it('Day 29 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day29Config.day, 29);
    assert.strictEqual(day29Lesson.day, 29);
    assert.strictEqual(day29Config.title, 'Cloud Infrastructure as Code (IaC) with Terraform, Cloudflare CDN & Edge Security');
    assert.strictEqual(day29Lesson.title, 'Cloud Infrastructure as Code (IaC) with Terraform, Cloudflare CDN & Edge Security');
    assert.strictEqual(day29Config.syllabus.length, 3);
  });

  it('Day 29 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day29Lesson.parts.length, 5);

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

    day29Lesson.parts.forEach((part, idx) => {
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

  it('Day 29 Exam (TerraformGraphEngine): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class TerraformGraphEngine {
        constructor() {
          this.resources = new Map();
        }

        addResource(id, type, config, dependencies = []) {
          this.resources.set(id, { id, type, config, dependencies: [...dependencies] });
          return this;
        }

        detectCycles() {
          const visited = new Set();
          const recStack = new Set();

          const dfs = (nodeId) => {
            visited.add(nodeId);
            recStack.add(nodeId);

            const res = this.resources.get(nodeId);
            if (res && res.dependencies) {
              for (const depId of res.dependencies) {
                if (!visited.has(depId)) {
                  if (dfs(depId)) return true;
                } else if (recStack.has(depId)) {
                  return true;
                }
              }
            }

            recStack.delete(nodeId);
            return false;
          };

          for (const [id] of this.resources) {
            if (!visited.has(id)) {
              if (dfs(id)) return true;
            }
          }
          return false;
        }

        getTopologicalOrder() {
          if (this.detectCycles()) {
            throw new Error('Cyclic dependency detected in Terraform resource graph');
          }

          const visited = new Set();
          const order = [];

          const visit = (nodeId) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);

            const res = this.resources.get(nodeId);
            if (res && res.dependencies) {
              for (const depId of res.dependencies) {
                visit(depId);
              }
            }
            order.push(nodeId);
          };

          for (const [id] of this.resources) {
            visit(id);
          }

          return order;
        }

        computePlan(currentState, desiredState) {
          const currentKeys = Object.keys(currentState || {});
          const desiredKeys = Object.keys(desiredState || {});

          const toCreate = [];
          const toUpdate = [];
          const toDestroy = [];
          const noOp = [];

          for (const id of desiredKeys) {
            if (!currentState || !(id in currentState)) {
              toCreate.push(id);
            } else {
              const currJson = JSON.stringify(currentState[id]);
              const desJson = JSON.stringify(desiredState[id]);
              if (currJson !== desJson) {
                toUpdate.push(id);
              } else {
                noOp.push(id);
              }
            }
          }

          for (const id of currentKeys) {
            if (!desiredState || !(id in desiredState)) {
              toDestroy.push(id);
            }
          }

          const hasChanges = toCreate.length > 0 || toUpdate.length > 0 || toDestroy.length > 0;
          return {
            toCreate,
            toUpdate,
            toDestroy,
            noOp,
            hasChanges
          };
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day29Config.eTest);
    });
  });

  it('Day 29 Exam: catches defective implementation that ignores cycles or computes incorrect execution order', async () => {
    // Defective code that never detects cycles and returns wrong order
    const defectiveCode = `
      class TerraformGraphEngine {
        constructor() { this.resources = new Map(); }
        addResource(id) { this.resources.set(id, {}); return this; }
        detectCycles() { return false; }
        getTopologicalOrder() { return Array.from(this.resources.keys()).reverse(); }
        computePlan() { return { hasChanges: false, toCreate: [], toUpdate: [], toDestroy: [], noOp: [] }; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day29Config.eTest);
    });
  });

  it('Day 29 Assignment (evaluateCloudflareEdge): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function evaluateCloudflareEdge(request, edgeConfig) {
        const { path, method, ip } = request;
        const { wafRules = [], cacheRules = [] } = edgeConfig || {};

        for (const rule of wafRules) {
          if (rule.blockedIps && rule.blockedIps.includes(ip)) {
            return { disposition: 'BLOCKED', statusCode: 403, reason: 'WAF_IP_BLOCK' };
          }
          if (rule.blockedPaths) {
            for (const bp of rule.blockedPaths) {
              if (path.startsWith(bp) || path === bp) {
                return { disposition: 'BLOCKED', statusCode: 403, reason: 'WAF_PATH_BLOCK' };
              }
            }
          }
        }

        for (const rule of cacheRules) {
          if (rule.bypassMethods && rule.bypassMethods.includes(method)) {
            return { disposition: 'CACHE_BYPASS', ttl: 0, statusCode: 200 };
          }

          const pattern = rule.pathPattern.replace(/\\*/g, '.*');
          const regex = new RegExp('^' + pattern + '$');
          if (regex.test(path)) {
            return { disposition: 'CACHE_HIT', ttl: rule.ttl || 3600, statusCode: 200 };
          }
        }

        return { disposition: 'DYNAMIC_ORIGIN', ttl: 0, statusCode: 200 };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day29Config.aTest);
    });
  });

  it('Day 29 Assignment: catches defective implementation that fails to block WAF-restricted IPs or paths', async () => {
    // Defective code that always returns CACHE_HIT
    const defectiveCode = `
      function evaluateCloudflareEdge() {
        return { disposition: 'CACHE_HIT', ttl: 3600, statusCode: 200 };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day29Config.aTest);
    });
  });
});

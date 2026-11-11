import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 26 Full-Stack Certification Invariant Verification', () => {
  const day26Config = FULLSTACK_30_DAYS_CONFIGS[25];
  const day26Lesson = FULLSTACK_JS_LONG_LESSONS[25];

  it('Day 26 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day26Config.day, 26);
    assert.strictEqual(day26Lesson.day, 26);
    assert.strictEqual(day26Config.title, 'Kubernetes Microservices Orchestration, Helm Charts, ConfigMaps & Secrets');
    assert.strictEqual(day26Lesson.title, 'Kubernetes Microservices Orchestration, Helm Charts, ConfigMaps & Secrets');
    assert.strictEqual(day26Config.syllabus.length, 3);
  });

  it('Day 26 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day26Lesson.parts.length, 5);

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

    day26Lesson.parts.forEach((part, idx) => {
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

  it('Day 26 Exam (K8sDeploymentReconciler): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class K8sDeploymentReconciler {
        constructor(name = 'web-deployment', initialReplicas = 3, image = 'node:20-alpine') {
          this.name = name;
          this.desiredReplicas = initialReplicas;
          this.image = image;
          this.labels = { app: name };
          this.pods = [];
          this.podCounter = 1;
          this.reconcile();
        }

        setDeployment(spec) {
          if (spec.name) this.name = spec.name;
          if (typeof spec.replicas === 'number') this.desiredReplicas = spec.replicas;
          if (spec.image) this.image = spec.image;
          if (spec.labels) {
            this.labels = { ...spec.labels };
            for (const pod of this.pods) {
              pod.labels = { ...this.labels };
              pod.image = this.image;
            }
          }
          return this.reconcile();
        }

        scale(replicas) {
          if (typeof replicas !== 'number' || replicas < 0) {
            throw new Error('Replicas must be a non-negative number');
          }
          this.desiredReplicas = replicas;
          return this.reconcile();
        }

        reconcile() {
          const diff = this.desiredReplicas - this.pods.length;
          let action = 'NO_OP';

          if (diff > 0) {
            action = 'SCALED_UP';
            for (let i = 0; i < diff; i++) {
              const pod = {
                id: this.name + '-' + (this.podCounter++),
                image: this.image,
                status: 'RUNNING',
                labels: { ...this.labels }
              };
              this.pods.push(pod);
            }
          } else if (diff < 0) {
            action = 'SCALED_DOWN';
            const toRemove = Math.abs(diff);
            for (let i = 0; i < toRemove; i++) {
              this.pods.pop();
            }
          }

          return {
            desired: this.desiredReplicas,
            active: this.pods.length,
            action
          };
        }

        getActivePods() {
          return [...this.pods];
        }

        getPodsBySelector(selector) {
          return this.pods.filter(pod => {
            for (const [key, val] of Object.entries(selector)) {
              if (pod.labels[key] !== val) return false;
            }
            return true;
          });
        }

        getStatus() {
          return {
            name: this.name,
            desiredReplicas: this.desiredReplicas,
            readyReplicas: this.pods.length,
            availableReplicas: this.pods.length
          };
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day26Config.eTest);
    });
  });

  it('Day 26 Exam: catches defective implementation that fails to reconcile desired replicas or updates', async () => {
    // Defective reconciler that doesn't scale active pods
    const defectiveCode = `
      class K8sDeploymentReconciler {
        constructor() { this.pods = []; }
        setDeployment() { return { desired: 3, active: 0, action: 'NO_OP' }; }
        scale() { return { desired: 5, active: 0, action: 'NO_OP' }; }
        reconcile() { return { desired: 0, active: 0, action: 'NO_OP' }; }
        getActivePods() { return []; }
        getPodsBySelector() { return []; }
        getStatus() { return { desiredReplicas: 0, readyReplicas: 0 }; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day26Config.eTest);
    });
  });

  it('Day 26 Assignment (injectK8sEnv): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function injectK8sEnv(containerEnvFrom, configMaps, secrets) {
        const env = {};
        if (!Array.isArray(containerEnvFrom)) return env;

        for (const ref of containerEnvFrom) {
          if (ref.configMapRef && ref.configMapRef.name) {
            const cm = configMaps[ref.configMapRef.name];
            if (cm && typeof cm === 'object') {
              for (const [k, v] of Object.entries(cm)) {
                env[k] = String(v);
              }
            }
          }

          if (ref.secretRef && ref.secretRef.name) {
            const sec = secrets[ref.secretRef.name];
            if (sec && typeof sec === 'object') {
              for (const [k, v] of Object.entries(sec)) {
                try {
                  env[k] = typeof atob !== 'undefined' ? atob(String(v)) : Buffer.from(String(v), 'base64').toString('utf8');
                } catch {
                  env[k] = String(v);
                }
              }
            }
          }
        }

        return env;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day26Config.aTest);
    });
  });

  it('Day 26 Assignment: catches defective implementation that fails to decode base64 Secret values', async () => {
    // Defective implementation that leaves base64 strings raw
    const defectiveCode = `
      function injectK8sEnv(containerEnvFrom, configMaps, secrets) {
        const env = {};
        for (const ref of containerEnvFrom || []) {
          if (ref.configMapRef?.name && configMaps[ref.configMapRef.name]) {
            Object.assign(env, configMaps[ref.configMapRef.name]);
          }
          if (ref.secretRef?.name && secrets[ref.secretRef.name]) {
            Object.assign(env, secrets[ref.secretRef.name]); // Does not decode base64
          }
        }
        return env;
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day26Config.aTest);
    });
  });
});

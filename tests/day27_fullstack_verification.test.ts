import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 27 Full-Stack Certification Invariant Verification', () => {
  const day27Config = FULLSTACK_30_DAYS_CONFIGS[26];
  const day27Lesson = FULLSTACK_JS_LONG_LESSONS[26];

  it('Day 27 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day27Config.day, 27);
    assert.strictEqual(day27Lesson.day, 27);
    assert.strictEqual(day27Config.title, 'CI/CD Pipelines with GitHub Actions, Semantic Versioning & Automated Multi-Arch Docker Builds');
    assert.strictEqual(day27Lesson.title, 'CI/CD Pipelines with GitHub Actions, Semantic Versioning & Automated Multi-Arch Docker Builds');
    assert.strictEqual(day27Config.syllabus.length, 3);
  });

  it('Day 27 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day27Lesson.parts.length, 5);

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

    day27Lesson.parts.forEach((part, idx) => {
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

  it('Day 27 Exam (SemanticReleaseEngine): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class SemanticReleaseEngine {
        parseCommit(message) {
          const raw = (message || '').trim();
          if (!raw) {
            return { type: 'unknown', scope: null, subject: '', isBreaking: false, bump: 'NONE' };
          }

          const firstLine = raw.split('\\n')[0].trim();
          const hasBreakingFooter = /BREAKING\\s+CHANGE:\\s+/i.test(raw);

          const match = firstLine.match(/^([a-zA-Z]+)(\\([a-zA-Z0-9_\\-.]+\\))?(!)?\\s*:\\s*(.+)$/);

          if (!match) {
            return {
              type: 'chore',
              scope: null,
              subject: firstLine,
              isBreaking: hasBreakingFooter,
              bump: hasBreakingFooter ? 'MAJOR' : 'NONE'
            };
          }

          const type = match[1].toLowerCase();
          const scope = match[2] ? match[2].slice(1, -1) : null;
          const isBreakingFlag = !!match[3];
          const subject = match[4].trim();
          const isBreaking = isBreakingFlag || hasBreakingFooter;

          let bump = 'NONE';
          if (isBreaking) {
            bump = 'MAJOR';
          } else if (type === 'feat') {
            bump = 'MINOR';
          } else if (type === 'fix' || type === 'perf') {
            bump = 'PATCH';
          }

          return { type, scope, subject, isBreaking, bump };
        }

        computeNextVersion(currentVersion, commitMessages) {
          const parts = currentVersion.replace(/^v/, '').split('.').map(Number);
          let [major, minor, patch] = parts;
          if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
            throw new Error('Invalid SemVer format: ' + currentVersion);
          }

          let highestBump = 'NONE';
          for (const msg of commitMessages) {
            const parsed = this.parseCommit(msg);
            if (parsed.bump === 'MAJOR') {
              highestBump = 'MAJOR';
              break;
            } else if (parsed.bump === 'MINOR') {
              highestBump = 'MINOR';
            } else if (parsed.bump === 'PATCH' && highestBump === 'NONE') {
              highestBump = 'PATCH';
            }
          }

          if (highestBump === 'MAJOR') {
            return (major + 1) + '.0.0';
          } else if (highestBump === 'MINOR') {
            return major + '.' + (minor + 1) + '.0';
          } else if (highestBump === 'PATCH') {
            return major + '.' + minor + '.' + (patch + 1);
          }
          return major + '.' + minor + '.' + patch;
        }

        generateRelease(currentVersion, commitMessages) {
          const features = [];
          const fixes = [];
          const breaking = [];
          let highestBump = 'NONE';

          for (const msg of commitMessages) {
            const p = this.parseCommit(msg);
            if (p.isBreaking) {
              breaking.push(p.subject);
              highestBump = 'MAJOR';
            } else if (p.type === 'feat') {
              features.push(p.subject);
              if (highestBump !== 'MAJOR') highestBump = 'MINOR';
            } else if (p.type === 'fix' || p.type === 'perf') {
              fixes.push(p.subject);
              if (highestBump === 'NONE') highestBump = 'PATCH';
            }
          }

          const nextVersion = this.computeNextVersion(currentVersion, commitMessages);
          return {
            version: nextVersion,
            bump: highestBump,
            features,
            fixes,
            breaking
          };
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day27Config.eTest);
    });
  });

  it('Day 27 Exam: catches defective implementation that misses breaking change major bumps', async () => {
    // Defective code that treats breaking changes as minor
    const defectiveCode = `
      class SemanticReleaseEngine {
        parseCommit(m) {
          return { type: 'feat', scope: null, subject: m, isBreaking: false, bump: 'MINOR' };
        }
        computeNextVersion(v) { return '1.3.0'; }
        generateRelease(v) { return { version: '1.3.0', bump: 'MINOR', features: [] }; }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day27Config.eTest);
    });
  });

  it('Day 27 Assignment (validateWorkflowMatrix): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function validateWorkflowMatrix(matrixConfig) {
        if (!matrixConfig || typeof matrixConfig !== 'object') {
          throw new Error('Invalid matrix configuration');
        }

        const { os, node, arch } = matrixConfig;
        const allowedOs = ['ubuntu-latest', 'windows-latest', 'macos-latest'];
        const allowedArch = ['amd64', 'arm64'];

        if (!Array.isArray(os) || os.length === 0 || !os.every(o => allowedOs.includes(o))) {
          throw new Error('Invalid OS matrix dimension');
        }
        if (!Array.isArray(node) || node.length === 0 || !node.every(n => typeof n === 'number' && n >= 18)) {
          throw new Error('Invalid Node.js matrix dimension');
        }
        if (!Array.isArray(arch) || arch.length === 0 || !arch.every(a => allowedArch.includes(a))) {
          throw new Error('Invalid Architecture matrix dimension');
        }

        const combinations = [];
        for (const o of os) {
          for (const n of node) {
            for (const a of arch) {
              combinations.push({ os: o, node: n, arch: a });
            }
          }
        }

        return {
          valid: true,
          totalJobs: combinations.length,
          combinations
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day27Config.aTest);
    });
  });

  it('Day 27 Assignment: catches defective implementation that accepts unsupported operating systems', async () => {
    // Defective implementation that never throws errors
    const defectiveCode = `
      function validateWorkflowMatrix(matrixConfig) {
        return {
          valid: true,
          totalJobs: 1,
          combinations: [{ os: 'centos-7', node: 20, arch: 'amd64' }]
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day27Config.aTest);
    });
  });
});

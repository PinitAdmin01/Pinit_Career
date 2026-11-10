import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 24 Full-Stack Certification Invariant Verification', () => {
  const day24Config = FULLSTACK_30_DAYS_CONFIGS[23];
  const day24Lesson = FULLSTACK_JS_LONG_LESSONS[23];

  it('Day 24 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day24Config.day, 24);
    assert.strictEqual(day24Lesson.day, 24);
    assert.strictEqual(day24Config.title, 'Docker Containerization, Multi-Stage Production Builds & Alpine Security');
    assert.strictEqual(day24Lesson.title, 'Docker Containerization, Multi-Stage Production Builds & Alpine Security');
    assert.strictEqual(day24Config.syllabus.length, 3);
  });

  it('Day 24 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day24Lesson.parts.length, 5);

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

    day24Lesson.parts.forEach((part, idx) => {
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

  it('Day 24 Exam (DockerfileAnalyzer): valid implementation passes automated test suite', async () => {
    const studentCode = `
      class DockerfileAnalyzer {
        constructor(dockerfile) {
          this.raw = dockerfile || '';
          this.lines = this.raw
            .split('\\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));
        }

        parseStages() {
          const stages = [];
          for (const line of this.lines) {
            const match = line.match(/^FROM\\s+\\S+(?:\\s+[aA][sS]\\s+(\\S+))?/i);
            if (match) {
              stages.push(match[1] || 'stage_' + stages.length);
            }
          }
          return stages;
        }

        isCacheOptimized() {
          let pkgCopied = false;
          let fullCopied = false;
          for (const line of this.lines) {
            if (/^FROM\\s+/i.test(line)) {
              pkgCopied = false;
              fullCopied = false;
              continue;
            }
            if (/^COPY\\s+.*package.*\\.json/i.test(line)) {
              pkgCopied = true;
            }
            if (/^COPY\\s+\\.\\s+/i.test(line) || /^COPY\\s+\\.\\s*\\./i.test(line) || /^ADD\\s+\\.\\s+/i.test(line)) {
              fullCopied = true;
            }
            if (/^RUN\\s+(?:npm|yarn|pnpm)\\s+(?:install|ci)/i.test(line)) {
              if (fullCopied && !pkgCopied) {
                return false;
              }
            }
          }
          return true;
        }

        hasNonRootUser() {
          let lastUser = null;
          for (const line of this.lines) {
            const match = line.match(/^USER\\s+(\\S+)/i);
            if (match) {
              lastUser = match[1];
            }
          }
          return lastUser !== null && lastUser !== 'root' && lastUser !== '0';
        }

        hasHealthcheck() {
          return this.lines.some(line => /^HEALTHCHECK\\s+/i.test(line));
        }

        analyze() {
          return {
            stages: this.parseStages(),
            cacheOptimized: this.isCacheOptimized(),
            hasNonRootUser: this.hasNonRootUser(),
            hasHealthcheck: this.hasHealthcheck()
          };
        }
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day24Config.eTest);
    });
  });

  it('Day 24 Exam: catches defective implementation that ignores cache invalidation or root execution', async () => {
    const defectiveCode = `
      class DockerfileAnalyzer {
        constructor() {}
        parseStages() { return ['deps', 'runner']; }
        isCacheOptimized() { return true; }
        hasNonRootUser() { return true; }
        hasHealthcheck() { return true; }
        analyze() {
          return {
            stages: this.parseStages(),
            cacheOptimized: true,
            hasNonRootUser: true,
            hasHealthcheck: true
          };
        }
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day24Config.eTest);
    });
  });

  it('Day 24 Assignment (isDockerIgnored): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function isDockerIgnored(filePath, patterns) {
        const norm = filePath.replace(/\\\\/g, '/').replace(/^\\.\\//, '');
        let ignored = false;

        for (let raw of patterns) {
          let p = raw.trim();
          if (!p || p.startsWith('#')) continue;

          let isNeg = p.startsWith('!');
          if (isNeg) p = p.slice(1).trim();
          if (p.startsWith('/')) p = p.slice(1);

          const regexStr = p
            .replace(/[.+^\\$\\{\\}()|[\\]\\\\]/g, '\\\\$&')
            .replace(/\\*\\*/g, '___GLOB___')
            .replace(/\\*/g, '[^/]*')
            .replace(/\\?/g, '[^/]')
            .replace(/___GLOB___/g, '.*');

          const re = new RegExp('^(?:.*/)?' + regexStr + '(?:/.*)?$|\\\\b' + regexStr + '\\\\b');
          if (re.test(norm)) {
            ignored = !isNeg;
          }
        }

        return ignored;
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day24Config.aTest);
    });
  });

  it('Day 24 Assignment: catches defective implementation that ignores negation rules (!)', async () => {
    const defectiveCode = `
      function isDockerIgnored(filePath, patterns) {
        return filePath.includes('.env') || filePath.includes('node_modules') || filePath.includes('.git') || filePath.endsWith('.log');
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day24Config.aTest);
    });
  });
});

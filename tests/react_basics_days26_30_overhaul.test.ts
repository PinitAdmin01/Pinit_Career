import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { REACT_30_DAYS_CONFIGS } from '../src/lib/data/react30DayData';
import { loadDayFile, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';

function formatLogArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        return JSON.stringify(arg);
      }
      return String(arg);
    })
    .join(' ');
}

function runLikeSandbox(code: string): string {
  const out: string[] = [];
  const sandbox = {
    console: { log: (...args: unknown[]) => out.push(formatLogArgs(args)) },
    Buffer,
    URLSearchParams,
    require,
    crypto
  };
  vm.runInNewContext(code, sandbox, { timeout: 2000 });
  return out.join('\n');
}

test('Block 6 (Days 26–30) React Modernization: Invariants, Word Counts & Pedagogical Depth', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = REACT_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson, `Day ${day} must exist in REACT_LONG_LESSONS`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(
      lesson.minutes && lesson.minutes >= 38 && lesson.minutes <= 40,
      `Day ${day} minutes (${lesson.minutes}) must be 38-40`
    );
    assert.ok(
      lesson.summary && lesson.summary.length >= 3,
      `Day ${day} summary must contain at least 3 bullets`
    );
    assert.ok(
      lesson.projectStep &&
        (Array.isArray(lesson.projectStep)
          ? lesson.projectStep.length >= 3
          : Array.isArray(lesson.projectStep.steps) && lesson.projectStep.steps.length >= 3),
      `Day ${day} projectStep must contain at least 3 steps`
    );

    let totalWords = 0;
    lesson.parts.forEach((part, partIdx) => {
      const partWords = Array.isArray(part.say)
        ? part.say.join(' ').split(/\s+/).filter(Boolean).length
        : String(part.say).split(/\s+/).filter(Boolean).length;
      totalWords += partWords;

      assert.ok(
        partWords >= 580,
        `Day ${day} Part ${partIdx + 1} (${part.title}) has ${partWords} words; expected >= 580`
      );

      // Verify code and output match sandbox execution
      if (part.code) {
        const actual = runLikeSandbox(part.code);
        const expected = (part.output || '').trim();
        assert.equal(
          actual,
          expected,
          `Day ${day} Part ${partIdx + 1} (${part.title}) output mismatch in runLikeSandbox`
        );
      }

      // Socratic diagnostic check validation
      if (part.check) {
        assert.equal(part.check.options.length, 4, `Day ${day} Part ${partIdx + 1} check must have 4 options`);
        assert.equal(part.check.answer, 0, `Day ${day} Part ${partIdx + 1} check answer must be 0`);
        assert.equal(part.check.answerIndex, 0, `Day ${day} Part ${partIdx + 1} check answerIndex must be 0`);
        assert.ok(
          part.check.why && part.check.why.length >= 20,
          `Day ${day} Part ${partIdx + 1} check why must be >= 20 chars`
        );
        assert.ok(
          part.check.explanation && part.check.explanation.length >= 20,
          `Day ${day} Part ${partIdx + 1} check explanation must be >= 20 chars`
        );
      }
    });

    assert.ok(
      totalWords >= 2900,
      `Day ${day} total words (${totalWords}) must be >= 2900 (Senior Systems Architect depth)`
    );
  }
});

test('Block 6 (Days 26–30) React Modernization: Visual Envelopes, Schema & Gate v2 Captions', async () => {
  clearDayFileCache();
  assert.equal(isCourseVisualsEnabled('react-basics'), true, 'react-basics course visuals must be enabled');

  for (let day = 26; day <= 30; day++) {
    const lesson = REACT_LONG_LESSONS.find((l) => l.day === day)!;
    const dayFile = await loadDayFile('react-basics', day);
    assert.ok(dayFile, `Visual day file for Day ${day} must load successfully`);
    assert.equal(dayFile.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
    assert.equal(dayFile.prefix, 'react-basics', `Day ${day} prefix must be react-basics`);
    assert.equal(dayFile.day, day, `Day ${day} day number must match`);
    assert.equal(dayFile.visuals.length, 5, `Day ${day} must contain exactly 5 visual definitions`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      const visual = dayFile.visuals[i];
      assert.ok(visual, `Visual for Day ${day} Part ${i + 1} must exist`);
      assert.equal(visual.part, i + 1, `Visual part index must be ${i + 1}`);

      // Verify SHA-256 Code Binding
      assert.ok(visual.codeBinding, `Day ${day} Part ${i + 1} must have codeBinding`);
      assert.equal(visual.codeBinding.type, 'sha256', `Code binding type must be sha256`);

      const expectedHash = crypto
        .createHash('sha256')
        .update(part.code || '')
        .digest('hex');
      assert.equal(
        visual.codeBinding.hash,
        expectedHash,
        `Day ${day} Part ${i + 1} visual codeBinding hash mismatch`
      );

      assert.ok(
        ['flow', 'boxes', 'compare', 'states', 'component-tree'].includes(visual.template),
        `Day ${day} Part ${i + 1} template "${visual.template}" is invalid`
      );
      assert.ok(
        visual.title && visual.title.length >= 5,
        `Day ${day} Part ${i + 1} visual title must be substantial`
      );
      assert.equal(
        visual.steps.length,
        4,
        `Day ${day} Part ${i + 1} must have exactly 4 synchronized steps`
      );

      // Gate v2 Caption Invariants
      for (let sIdx = 0; sIdx < visual.steps.length; sIdx++) {
        const step = visual.steps[sIdx];
        assert.equal(step.step, sIdx + 1, `Step index must match 1..4`);
        assert.ok(
          step.caption && step.caption.length >= 10,
          `Day ${day} Part ${i + 1} Step ${sIdx + 1} caption must be >= 10 chars`
        );
        assert.ok(
          step.caption.length <= 75,
          `Day ${day} Part ${i + 1} Step ${sIdx + 1} caption exceeds 75 chars: "${step.caption}"`
        );
        assert.ok(
          step.caption.endsWith('.'),
          `Day ${day} Part ${i + 1} Step ${sIdx + 1} caption must end with period: "${step.caption}"`
        );
        assert.ok(
          !/\d/.test(step.caption),
          `Day ${day} Part ${i + 1} Step ${sIdx + 1} caption must not contain numeric digits: "${step.caption}"`
        );
      }
    }
  }
});

function buildRunnable(starter: string, hint: string): string {
  const lastBrace = starter.lastIndexOf('}');
  const head = starter.substring(0, lastBrace);
  const cleaned = head.replace(/return\s*[^;]*;\s*$/, '');
  return `${cleaned}\n  ${hint}\n}\n`;
}

test('Block 6 (Days 26–30) React Modernization: Course Configs, Titles & Exam/Assignment Sandbox Tests', () => {
  for (let day = 26; day <= 30; day++) {
    const cfg = REACT_30_DAYS_CONFIGS[day - 1];
    assert.ok(cfg, `Day ${day} config must exist in REACT_30_DAYS_CONFIGS`);
    assert.ok(
      cfg.title && cfg.title.length >= 20,
      `Day ${day} config title must be senior-grade: "${cfg.title}"`
    );
    assert.ok(
      cfg.desc && cfg.desc.length >= 40,
      `Day ${day} config desc must be substantial`
    );
    assert.ok(
      cfg.syllabus && cfg.syllabus.length >= 3,
      `Day ${day} syllabus must contain at least 3 topics`
    );

    // Verify Exam Sandbox Execution
    const eRunnable = buildRunnable(cfg.eStarter, cfg.eHint);
    assert.doesNotThrow(() => {
      const sandbox = { console: { log: () => {} } };
      vm.runInNewContext(eRunnable + '\n' + cfg.eTest, sandbox, { timeout: 2000 });
    }, `Day ${day} exam runnable failed test in sandbox`);

    // Verify Assignment Sandbox Execution
    const aRunnable = buildRunnable(cfg.aStarter, cfg.aHint);
    assert.doesNotThrow(() => {
      const sandbox = { console: { log: () => {} } };
      vm.runInNewContext(aRunnable + '\n' + cfg.aTest, sandbox, { timeout: 2000 });
    }, `Day ${day} assignment runnable failed test in sandbox`);
  }
});

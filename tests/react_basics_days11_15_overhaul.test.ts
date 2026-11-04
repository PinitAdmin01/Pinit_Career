import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { REACT_30_DAYS_CONFIGS } from '../src/lib/data/react30DayData';
import { getLongLesson } from '../src/lib/data/longLessons';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

function runLikeSandbox(code: string): string {
  const out: string[] = [];
  const sandbox = {
    console: { log: (...args: unknown[]) => out.push(formatLogArgs(args)) },
    URLSearchParams
  };
  vm.runInNewContext(code, sandbox, { timeout: 2000 });
  return out.join('\n');
}

test('Block 3 (Days 11–15) React Modernization: Invariants, Word Counts & Pedagogical Depth', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = REACT_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson, `Day ${day} must exist in REACT_LONG_LESSONS`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(
      lesson.minutes && lesson.minutes >= 38 && lesson.minutes <= 40,
      `Day ${day} minutes (${lesson.minutes}) must be 38-40`
    );
    assert.ok(lesson.summary.length >= 3, `Day ${day} summary must have at least 3 points`);
    assert.ok(
      lesson.projectStep && lesson.projectStep.steps.length >= 3,
      `Day ${day} must have projectStep with at least 3 steps`
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
      assert.ok(part.code, `Day ${day} Part ${partIdx + 1} must have code snippet`);
      assert.ok(part.output !== undefined, `Day ${day} Part ${partIdx + 1} must have expected output`);
      assert.equal(
        runLikeSandbox(part.code),
        part.output,
        `Day ${day} Part ${partIdx + 1} code output mismatch`
      );
      assert.ok(
        part.codeNotes && part.codeNotes.length >= 1,
        `Day ${day} Part ${partIdx + 1} must have codeNotes`
      );
      assert.ok(part.tryIt, `Day ${day} Part ${partIdx + 1} must have tryIt`);

      // Socratic 4-option check assertions
      assert.ok(part.check, `Day ${day} Part ${partIdx + 1} must have check object`);
      assert.equal(
        part.check.options.length,
        4,
        `Day ${day} Part ${partIdx + 1} check must have exactly 4 options`
      );
      assert.equal(
        part.check.answer,
        0,
        `Day ${day} Part ${partIdx + 1} check.answer must be 0`
      );
      assert.equal(
        part.check.answerIndex,
        0,
        `Day ${day} Part ${partIdx + 1} check.answerIndex must be 0`
      );
      assert.ok(
        part.check.why && part.check.why.length >= 20,
        `Day ${day} Part ${partIdx + 1} check.why must be >= 20 chars`
      );
      assert.ok(
        part.check.explanation && part.check.explanation.length >= 20,
        `Day ${day} Part ${partIdx + 1} check.explanation must be >= 20 chars`
      );
    });

    assert.ok(
      totalWords >= 2900,
      `Day ${day} total words (${totalWords}) must be >= 2900 words`
    );
  }
});

test('Block 3 (Days 11–15) React Modernization: Gate v2 Visual Envelopes, Schemas & Captions', async () => {
  clearDayFileCache();
  assert.ok(
    isCourseVisualsEnabled('react-basics'),
    'react-basics must be enabled in enabledCourses.ts'
  );

  for (let day = 11; day <= 15; day++) {
    const dayFile = await loadDayFile('react-basics', day);
    assert.ok(dayFile, `Visual file for react-basics Day ${day} must load successfully`);
    assert.equal(dayFile.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
    assert.equal(dayFile.prefix, 'react-basics', `Day ${day} prefix must be react-basics`);
    assert.equal(dayFile.day, day, `Day ${day} envelope day must match`);
    assert.equal(dayFile.visuals.length, 5, `Day ${day} must have exactly 5 visual envelopes`);

    const lesson = REACT_LONG_LESSONS.find((l) => l.day === day)!;

    for (let i = 0; i < 5; i++) {
      const visual = dayFile.visuals[i];
      const part = lesson.parts[i];

      assert.equal(visual.part, i + 1, `Visual part mismatch at index ${i}`);
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
        assert.ok(
          !/\d/.test(step.caption),
          `Day ${day} Part ${i + 1} Step ${sIdx + 1} caption contains digits: "${step.caption}"`
        );
        assert.ok(
          step.caption.endsWith('.'),
          `Day ${day} Part ${i + 1} Step ${sIdx + 1} caption must end with period: "${step.caption}"`
        );
        assert.ok(
          step.caption.length <= 75,
          `Day ${day} Part ${i + 1} Step ${sIdx + 1} caption length (${step.caption.length}) must be <= 75`
        );
      }
    }
  }
});

test('Block 3 (Days 11–15) React Modernization: Course Configs, Titles & Exam/Assignment Sandbox Tests', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = REACT_LONG_LESSONS.find((l) => l.day === day)!;
    const config = REACT_30_DAYS_CONFIGS[day - 1];
    assert.ok(config, `Config for Day ${day} must exist in REACT_30_DAYS_CONFIGS`);
    assert.equal(
      config.title,
      lesson.title,
      `Day ${day} title mismatch between config ("${config.title}") and lesson ("${lesson.title}")`
    );
    assert.ok(config.syllabus.length >= 3, `Day ${day} syllabus must have >= 3 points`);

    function buildRunnable(starter: string, hint: string): string {
      const lastBrace = starter.lastIndexOf('}');
      const head = starter.substring(0, lastBrace);
      const cleaned = head.replace(/return\s*[^;]*;\s*$/, '');
      return `${cleaned}\n  ${hint}\n}\n`;
    }

    // Verify non-TSX exam and assignment tests execute cleanly against hints
    if (config.eStarter && config.eHint && config.eTest && !config.eLanguage) {
      const runExam = `${buildRunnable(config.eStarter, config.eHint)}\n${config.eTest}`;
      vm.runInNewContext(runExam, { console });
    }

    if (config.aStarter && config.aHint && config.aTest && !config.aLanguage) {
      const runAssign = `${buildRunnable(config.aStarter, config.aHint)}\n${config.aTest}`;
      vm.runInNewContext(runAssign, { console });
    }
  }
});

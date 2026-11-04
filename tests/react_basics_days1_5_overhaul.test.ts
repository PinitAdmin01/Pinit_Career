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

test('Block 1 (Days 1–5) React Modernization: Invariants, Word Counts & Pedagogical Depth', () => {
  for (let day = 1; day <= 5; day++) {
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
      `Day ${day} total words (${totalWords}) must be >= 2900`
    );
  }
});

test('Block 1 (Days 1–5) React Modernization: On-Disk Visuals and Gate Contracts', () => {
  clearDayFileCache();
  assert.equal(
    isCourseVisualsEnabled('react-basics'),
    true,
    'react-basics must be enabled in enabledCourses'
  );

  for (let day = 1; day <= 5; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(
      process.cwd(),
      `src/lib/data/lessonVisuals/react-basics/day-${dayPadded}.json`
    );
    assert.ok(fs.existsSync(filePath), `Visual file must exist on disk: ${filePath}`);

    const dayFile = loadDayFile('react-basics', day);
    assert.ok(dayFile, `loadDayFile must return parsed visual file for Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'react-basics');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Day ${day} visual must have 5 entries`);

    const lesson = getLongLesson('react-basics', day);
    assert.ok(lesson, `getLongLesson must resolve for Day ${day}`);

    for (let i = 0; i < 5; i++) {
      const entry = dayFile.entries[i];
      const part = lesson.parts[i];
      assert.equal(entry.partTitle, part.title, `Day ${day} Part ${i + 1} partTitle mismatch`);

      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(
        entry.codeHash,
        expectedHash,
        `Day ${day} Part ${i + 1} SHA-256 hash mismatch`
      );

      const visual = getVisual('react-basics', day, i);
      assert.ok(visual, `getVisual must resolve for Day ${day} Part ${i + 1}`);
      assert.ok(
        ['component-tree', 'wireframe', 'flow', 'boxes', 'compare', 'states'].includes(
          visual.template
        ),
        `Template "${visual.template}" must be allowed`
      );
      assert.equal(
        visual.steps.length,
        4,
        `Day ${day} Part ${i + 1} must have 4 synchronized steps`
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

test('Block 1 (Days 1–5) React Modernization: Course Configs, Titles & Exam/Assignment Sandbox Tests', () => {
  for (let day = 1; day <= 5; day++) {
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

    // Verify exam and assignment tests execute cleanly against hints
    const runExam = `${buildRunnable(config.eStarter, config.eHint)}\n${config.eTest}`;
    vm.runInNewContext(runExam, { console });

    const runAssign = `${buildRunnable(config.aStarter, config.aHint)}\n${config.aTest}`;
    vm.runInNewContext(runAssign, { console });
  }
});

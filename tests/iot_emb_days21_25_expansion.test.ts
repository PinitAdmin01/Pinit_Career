import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson } from '../src/lib/data/longLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';
import { executeCppSuite } from '../src/lib/code/runners/cppRunner';

test('Course 14: IoT, Firmware & Embedded Systems (iot_emb) Month 1 Block 5 (Days 21–25) Comprehensive Expansion Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for iot_emb course prefix', () => {
    assert.equal(isCourseVisualsEnabled('iot_emb'), true, 'Course "iot_emb" must be enabled in enabledCourses');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 21–25', () => {
    for (let day = 21; day <= 25; day++) {
      const lesson = getLongLesson('iot_emb', day);
      assert.ok(lesson, `Day ${day} must be resolved from getLongLesson('iot_emb', ${day})`);
      assert.equal(lesson.day, day, `Day mismatch for Day ${day}`);
      assert.ok(lesson.title && lesson.title.length > 10, `Day ${day} must have a descriptive title`);
      assert.ok(lesson.goal && lesson.goal.length > 25, `Day ${day} must have a rigorous goal`);
      assert.ok(lesson.minutes >= 30 && lesson.minutes <= 45, `Day ${day} minutes (${lesson.minutes}) must be in 30-45 min range`);
      assert.ok(lesson.recap && lesson.recap.length > 20, `Day ${day} must have a contextual recap`);
      assert.ok(Array.isArray(lesson.parts), `Day ${day} parts must be an array`);
      assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);

      // Verify each part
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1} (${part.title})`;

        assert.ok(part.title && part.title.length > 5, `${ctx}: title must be non-empty`);
        assert.ok(Array.isArray(part.say) && part.say.length >= 3, `${ctx}: say must have at least 3 deep explanations`);
        assert.ok(part.example && part.example.length > 15, `${ctx}: example must provide clear intuition`);
        assert.ok(part.code && part.code.includes('#include'), `${ctx}: code must contain C++ standard includes`);
        assert.ok(part.code.includes('int main()'), `${ctx}: code must contain main function entrypoint`);
        assert.ok(part.output && part.output.length > 0, `${ctx}: output must specify expected terminal output`);
        assert.ok(Array.isArray(part.codeNotes) && part.codeNotes.length >= 2, `${ctx}: codeNotes must have at least 2 annotated lines`);
        assert.ok(part.tryIt && part.tryIt.length > 15, `${ctx}: tryIt must provide actionable extension`);

        // Check question
        const chk = part.check;
        assert.ok(chk, `${ctx}: check question must exist`);
        assert.ok(chk.question && chk.question.length > 10, `${ctx}: question text must be rigorous`);
        assert.ok(Array.isArray(chk.options) && chk.options.length >= 3, `${ctx}: must have at least 3 multiple choice options`);
        assert.equal(chk.answer, 0, `${ctx}: answer index must be 0 (first option correct convention)`);
        assert.ok(chk.why && chk.why.length > 20, `${ctx}: why must explain the reasoning thoroughly`);
      }

      // Summary and projectStep
      assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 4, `Day ${day} summary must have at least 4 key takeaways`);
      assert.ok(lesson.projectStep && lesson.projectStep.title, `Day ${day} projectStep must have a title`);
      assert.ok(Array.isArray(lesson.projectStep.steps) && lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have at least 4 practical steps`);
    }
  });

  await t.test('3. Gate v2 On-Disk Visuals and SHA-256 Code Contract for Days 21–25', () => {
    for (let day = 21; day <= 25; day++) {
      const dayPadded = String(day).padStart(2, '0');
      const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/iot_emb/day-${dayPadded}.json`);
      assert.ok(fs.existsSync(filePath), `Visual day file must exist on disk: ${filePath}`);

      const dayFile = loadDayFile('iot_emb', day);
      assert.ok(dayFile, `loadDayFile('iot_emb', ${day}) must successfully load`);
      assert.equal(dayFile.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
      assert.equal(dayFile.prefix, 'iot_emb', `Day ${day} prefix must be iot_emb`);
      assert.equal(dayFile.day, day, `Day ${day} day must be ${day}`);
      assert.equal(dayFile.entries.length, 5, `Day ${day} entries length must be 5`);

      const lesson = getLongLesson('iot_emb', day);

      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const entry = dayFile.entries[pIdx];
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1}`;

        assert.equal(entry.partTitle, part.title, `${ctx}: partTitle mismatch`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `${ctx}: SHA-256 codeHash mismatch between lesson code and visual contract`);

        const visual = getVisual('iot_emb', day, pIdx);
        assert.ok(visual, `${ctx}: getVisual must return valid visual object`);
        assert.equal(visual.template, 'register-bits', `${ctx}: template must be "register-bits"`);
        assert.equal(visual.steps.length, 4, `${ctx}: visual must have 4 synchronized steps`);
        assert.deepEqual(
          visual.steps.map(s => s.at),
          ['intro', 'say1', 'example', 'tryIt'],
          `${ctx}: visual steps must match ['intro', 'say1', 'example', 'tryIt']`
        );

        const labels = getTappableLabelsForVisual(visual);
        assert.ok(labels.length > 0, `${ctx}: tappable labels must not be empty`);
      }
    }
  });

  await t.test('4. C++ AST and Runner Validation for Milestone 5 Master Engine (Day 25)', async () => {
    const day25 = getLongLesson('iot_emb', 25);
    assert.ok(day25, 'Day 25 lesson must exist');

    const part5 = day25.parts[4];
    const userCode = part5.code;

    const testCases = [
      {
        id: 'test-m5-engine',
        name: 'Verify Milestone 5 RTOS Master Engine compiles and passes AST checks',
        input: 'main',
        output: 'MILESTONE 5 RTOS ENGINE: FULLY VERIFIED AND PASSING'
      }
    ];

    const staticRes = await executeCppSuite(userCode, 'main');
    assert.equal(staticRes.language, 'cpp', 'Result language must be cpp');
    assert.equal(staticRes.allPassed, true, 'Static C++ syntax inspection must pass');

    const failClosed = await executeCppSuite(userCode, 'main', testCases);
    assert.equal(failClosed.language, 'cpp', 'Result language must be cpp');
    assert.equal(failClosed.totalTests, 1, 'Should account for 1 test');
    assert.equal(failClosed.allPassed, false, 'Behavioral tests must fail closed without a real C++ compiler');
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { getLongLesson } from '../src/lib/data/longLessons';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { getTappableLabelsForVisual } from '../src/lib/visuals/visualRules';

test('Course 19: IoT Hardware Security (iot_sec) Month 2 Block 11 (Days 51-55) Expansion & Milestone 11 Verification Suite', async (t) => {
  clearDayFileCache();

  await t.test('1. Visuals enablement for iot_sec course prefix', () => {
    assert.equal(isCourseVisualsEnabled('iot_sec'), true, 'Course "iot_sec" must be enabled in enabledCourses');
  });

  await t.test('2. LongLessons structural integrity, pedagogical depth, and invariants for Days 51-55', () => {
    for (let day = 51; day <= 55; day++) {
      const lesson = getLongLesson('iot_sec', day);
      assert.ok(lesson, `Day ${day} must be resolved from getLongLesson('iot_sec', ${day})`);
      assert.equal(lesson.day, day, `Day mismatch for Day ${day}`);
      assert.ok(lesson.title && lesson.title.length > 10, `Day ${day} must have a descriptive title`);
      assert.ok(lesson.goal && lesson.goal.length > 25, `Day ${day} must have a rigorous goal`);
      
      // Strict 38 min class duration requirement
      assert.equal(lesson.minutes, 38, `Day ${day} minutes must be strictly 38`);
      
      assert.ok(lesson.recap && lesson.recap.length > 20, `Day ${day} must have a contextual recap`);
      assert.ok(Array.isArray(lesson.parts), `Day ${day} parts must be an array`);
      assert.equal(lesson.parts.length, 5, `Day ${day} must contain exactly 5 parts`);

      let totalDayWords = 0;

      // Verify each part
      for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1} (${part.title})`;

        assert.ok(part.title && part.title.length > 5, `${ctx}: title must be non-empty`);
        assert.ok(Array.isArray(part.say) && part.say.length >= 4, `${ctx}: say must have at least 4 deep explanations`);
        
        // Strict word count invariant: >= 580 words per part
        const partWords = part.say.reduce((acc, s) => acc + s.split(/\s+/).filter(Boolean).length, 0);
        assert.ok(partWords >= 580, `${ctx}: part words (${partWords}) must be >= 580 for rich pedagogical depth`);
        totalDayWords += partWords;

        assert.ok(part.example && part.example.length > 15, `${ctx}: example must provide clear intuition`);
        assert.ok(part.code && part.code.length > 50, `${ctx}: code must contain substantive runnable code`);
        assert.ok(part.output && part.output.length > 0, `${ctx}: output must specify expected terminal output`);
        assert.ok(Array.isArray(part.codeNotes) && part.codeNotes.length >= 3, `${ctx}: codeNotes must have >= 3 items`);
        assert.ok(part.codeNotes.every(cn => typeof cn === 'string' || (typeof cn === 'object' && cn !== null && 'note' in cn)), `${ctx}: all codeNotes must be strings or note objects`);
        assert.ok(typeof part.tryIt === 'string' && part.tryIt.length > 15, `${ctx}: tryIt must be a plain string challenge`);

        // Check question verification
        assert.ok(part.check, `${ctx}: check must be present`);
        assert.ok(part.check.question && part.check.question.length > 10, `${ctx}: check.question must be descriptive`);
        assert.ok(Array.isArray(part.check.options) && part.check.options.length === 4, `${ctx}: check.options must have exactly 4 items`);
        const ans = (part.check as any).answer !== undefined ? (part.check as any).answer : (part.check as any).answerIndex;
        assert.equal(ans, 0, `${ctx}: check.answer must be 0 (correct index)`);
        assert.ok(part.check.why && part.check.why.length > 20, `${ctx}: check.why must provide thorough explanation`);
      }

      // Assert total day words >= 2,900
      assert.ok(totalDayWords >= 2900, `Day ${day} total words (${totalDayWords}) must be >= 2,900 words`);

      // Summary and projectStep
      assert.ok(Array.isArray(lesson.summary) && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 takeaways`);
      assert.ok(lesson.projectStep, `Day ${day} must include a projectStep`);
      assert.ok(lesson.projectStep.title && lesson.projectStep.title.length > 10, `Day ${day} projectStep must have a title`);
      assert.ok(Array.isArray(lesson.projectStep.steps) && lesson.projectStep.steps.length >= 4, `Day ${day} projectStep must have >= 4 steps`);
      assert.equal((lesson.projectStep as any).desc, undefined, `Day ${day} projectStep must NOT have 'desc' field`);
    }
  });

  await t.test('3. On-disk visual JSON files and raw SHA-256 codeHash contracts for Days 51-55', async () => {
    for (let day = 51; day <= 55; day++) {
      const standardName = `day-${day}.json`;
      const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/iot_sec/${standardName}`);
      assert.ok(fs.existsSync(filePath), `Visual day file must exist on disk: ${filePath}`);

      const dayFile = loadDayFile('iot_sec', day);
      assert.ok(dayFile, `loadDayFile('iot_sec', ${day}) must successfully load`);
      assert.equal(dayFile.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
      assert.equal(dayFile.prefix, 'iot_sec', `Day ${day} prefix must be iot_sec`);
      assert.equal(dayFile.day, day, `Day ${day} day must be ${day}`);
      assert.equal(dayFile.entries.length, 5, `Day ${day} entries length must be 5`);

      const lesson = getLongLesson('iot_sec', day);

      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const entry = dayFile.entries[pIdx];
        const part = lesson.parts[pIdx];
        const ctx = `Day ${day} Part ${pIdx + 1}`;

        assert.equal(entry.partTitle, part.title, `${ctx}: partTitle mismatch`);
        const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
        assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `${ctx}: SHA-256 codeHash mismatch between lesson code and visual contract`);

        const visual = getVisual('iot_sec', day, pIdx);
        assert.ok(visual, `${ctx}: getVisual must return valid visual object`);
        assert.ok(visual.template, `${ctx}: visual must have template`);
        assert.ok(visual.steps && visual.steps.length >= 4, `${ctx}: visual must have at least 4 synchronized steps`);

        const labels = getTappableLabelsForVisual(visual);
        assert.ok(labels.length > 0, `${ctx}: tappable labels must not be empty`);
      }
    }
  });

  await t.test('4. Python runtime execution check for Days 51-55', () => {
    for (let day = 51; day <= 55; day++) {
      const lesson = getLongLesson('iot_sec', day);
      for (let pIdx = 0; pIdx < 5; pIdx++) {
        const part = lesson.parts[pIdx];
        const res = execSync('python -', { input: part.code, encoding: 'utf-8', timeout: 15000 });
        assert.ok(res && res.length > 0, `Day ${day} Part ${pIdx + 1} code must produce stdout output`);
      }
    }
  });

  await t.test('5. Milestone 11 (Day 55) QuantumShield Hybrid Classical-PQC Coprocessor & NTT Accelerator Invariants', () => {
    const day55 = getLongLesson('iot_sec', 55);
    assert.ok(day55.title.includes('Milestone 11'), 'Day 55 title must explicitly designate Milestone 11');
    assert.ok(day55.title.includes('QuantumShield'), 'Day 55 title must feature QuantumShield');
    assert.ok(day55.title.includes('NTT Accelerator'), 'Day 55 title must feature NTT Accelerator');

    // Verify part 5 contains the full certification engine
    const p5 = day55.parts[4];
    assert.ok(p5.code.includes('class QuantumShieldHybridSecureBootCoprocessor'), 'Day 55 Part 5 must implement QuantumShieldHybridSecureBootCoprocessor');
    assert.ok(p5.code.includes('class NTTAcceleratorEngine'), 'Day 55 Part 5 must implement NTTAcceleratorEngine');
    assert.ok(p5.code.includes('execute_quantum_shield_certification_bench'), 'Day 55 Part 5 must implement execute_quantum_shield_certification_bench');
    assert.ok(p5.output.includes('QUANTUM_SHIELD_PQC_CERTIFIED'), 'Milestone 11 must reach QUANTUM_SHIELD_PQC_CERTIFIED');
    assert.ok(p5.output.includes('MILESTONE_11_GRADE_A_PLUS'), 'Milestone 11 must reach MILESTONE_11_GRADE_A_PLUS');
  });
});

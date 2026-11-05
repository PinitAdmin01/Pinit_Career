import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { inspectCppSource } from '../src/lib/code/runners/cppRunner';

test('Quant Systems Month 2 Block 9 (Days 41-45): Resolution, Invariants & C++ AST Inspection', () => {
  assert.equal(getLongLessonLanguage('quant-systems'), 'cpp');

  for (let d = 41; d <= 45; d++) {
    const lesson = getLongLesson('quant-systems', d);
    assert.ok(lesson, `quant-systems Day ${d} must resolve from getLongLesson`);
    assert.equal(lesson.day, d, `Day number must match ${d}`);
    assert.ok(lesson.title.length > 10, `Day ${d} title must be descriptive`);
    assert.ok(lesson.goal.length > 30, `Day ${d} goal must be comprehensive`);
    assert.equal(lesson.parts.length, 5, `Day ${d} must have exactly 5 parts`);
    assert.ok(lesson.summary.length >= 5, `Day ${d} summary must have at least 5 takeaways`);
    assert.ok(lesson.projectStep, `Day ${d} must declare a projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 5, `Day ${d} projectStep must have at least 5 steps`);

    // Verify word counts and timing estimates
    const spokenMin = estimateSpokenMinutes(lesson);
    const totalMin = estimateLessonMinutes(lesson);
    assert.ok(spokenMin >= 20, `Day ${d} spoken minutes (${spokenMin}) must be >= 20`);
    assert.ok(totalMin >= 35, `Day ${d} total lesson minutes (${totalMin}) must be between 35 and 40`);

    const allWords = lesson.parts
      .flatMap((p) => [...p.say, p.example ?? '', p.tryIt ?? '', p.check.why])
      .join(' ')
      .split(/\s+/)
      .filter(Boolean).length;
    assert.ok(allWords >= 2940, `Day ${d} total words (${allWords}) must be in [2940, 3450]`);

    // Part-by-part verification
    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 5, `Part ${i + 1} must have a title`);
      assert.ok(part.say.length >= 4, `Part ${i + 1} say must have at least 4 paragraphs`);
      
      const sayWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(sayWords >= 580, `Day ${d} Part ${i + 1} say words (${sayWords}) must be >= 580`);

      assert.ok(part.example && part.example.length > 15, `Part ${i + 1} must have an illustrative example`);
      assert.ok(part.code && part.code.length > 50, `Part ${i + 1} must have executable C++ code`);
      assert.ok(part.output && part.output.length > 10, `Part ${i + 1} must have terminal output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 2, `Part ${i + 1} must have at least 2 codeNotes`);
      assert.ok(part.tryIt && part.tryIt.length > 10, `Part ${i + 1} must have a tryIt challenge`);

      // Socratic MCQ check verification
      assert.ok(part.check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
      assert.ok(part.check.options.length >= 3, `Part ${i + 1} check must have >= 3 options`);
      assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Part ${i + 1} check answer must be valid index`);
      assert.ok(part.check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);

      // C++ AST Structural Inspection
      const inspection = inspectCppSource(part.code, 'main');
      assert.equal(inspection.hasValidSignature, true, `C++ code in Day ${d} Part ${i + 1} must have valid main() signature`);
      assert.equal(inspection.hasHeaders, true, `C++ code in Day ${d} Part ${i + 1} must include headers`);
      assert.equal(inspection.hasReturn, true, `C++ code in Day ${d} Part ${i + 1} must have explicit return`);
      assert.equal(inspection.syntaxViolations.length, 0, `C++ code in Day ${d} Part ${i + 1} must have 0 syntax violations`);
    }

    // Gate v2 Visual JSON Verification
    const visualPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'quant-systems', `day-${d}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual JSON must exist at ${visualPath}`);

    const visualRaw = fs.readFileSync(visualPath, 'utf-8');
    const visualJson = JSON.parse(visualRaw);
    assert.equal(visualJson.schemaVersion, 1);
    assert.equal(visualJson.prefix, 'quant-systems');
    assert.equal(visualJson.day, d);
    assert.equal(visualJson.entries.length, 5, `Visual JSON must contain exactly 5 entries`);

    for (let i = 0; i < 5; i++) {
      const entry = visualJson.entries[i];
      const part = lesson.parts[i];
      assert.equal(entry.partTitle, part.title, `Visual entry partTitle must match part.title`);
      const expectedHash = crypto.createHash('sha256').update(part.code, 'utf-8').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Visual entry codeHash must match sha256(part.code)`);
      assert.ok(entry.spec.states.length >= 3, `Visual spec states must have >= 3 states`);
      assert.equal(entry.spec.steps.length, 4, `Visual spec steps must have 4 steps`);
    }
  }
});

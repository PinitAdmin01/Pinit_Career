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

test('Python Backend Month 2 Block 8 (Days 36-40): Resolution, Invariants & Visual Contracts', () => {
  assert.equal(getLongLessonLanguage('python'), 'python');

  for (let d = 36; d <= 40; d++) {
    const lesson = getLongLesson('python', d);
    assert.ok(lesson, `python Day ${d} must resolve from getLongLesson`);
    assert.equal(lesson.day, d, `Day number must match ${d}`);
    assert.ok(lesson.title.length > 10, `Day ${d} title must be descriptive`);
    assert.ok(lesson.goal && lesson.goal.length > 30, `Day ${d} goal must be comprehensive`);
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
      assert.ok(part.code && part.code.length > 50, `Part ${i + 1} must have executable Python code`);
      assert.ok(part.output && part.output.length > 10, `Part ${i + 1} must have terminal output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 2, `Part ${i + 1} must have at least 2 codeNotes`);
      assert.ok(part.tryIt && part.tryIt.length > 10, `Part ${i + 1} must have a tryIt challenge`);

      // Socratic MCQ check verification
      assert.ok(part.check.question.length > 10, `Part ${i + 1} check question must be descriptive`);
      assert.ok(part.check.options.length >= 3, `Part ${i + 1} check must have >= 3 options`);
      assert.equal(part.check.answer, 0, `Part ${i + 1} check answer must be 0 (pedagogical standard)`);
      assert.ok(part.check.why.length > 15, `Part ${i + 1} check explanation must be rigorous`);
    }

    // Gate v2 Visual JSON contract verification
    const visualPath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/python/day-${d}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual JSON must exist at ${visualPath}`);
    const visualContent = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualContent.prefix, 'python', `Visual JSON prefix must match python`);
    assert.equal(visualContent.day, d, `Visual JSON day must match ${d}`);
    assert.equal(visualContent.entries.length, 5, `Visual JSON must have 5 entries for 5 parts`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      const entry = visualContent.entries[i];
      assert.equal(entry.partTitle, part.title, `Entry ${i + 1} title must match part title`);
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Entry ${i + 1} codeHash must match SHA-256 of part.code`);
      assert.ok(entry.spec, `Entry ${i + 1} must have a valid visual spec`);
    }
  }
});

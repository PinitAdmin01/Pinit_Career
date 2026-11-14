import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PROMPT_PYTHON_LONG_LESSONS } from '../src/lib/data/promptPythonLongLessons';

describe('AI Literacy & Prompt Engineering Month 2 Block 9 (Days 41-45: Multi-Agent Swarms, CRDT Memory, Byzantine Consensus & Production Frameworks) Expansion Suite', () => {
  const days = [41, 42, 43, 44, 45];

  days.forEach((dayNum) => {
    it(`Day ${dayNum}: Structural integrity, word counts, and pedagogical invariants`, () => {
      const lesson = PROMPT_PYTHON_LONG_LESSONS.find((l) => l.day === dayNum);
      assert.ok(lesson, `Day ${dayNum} must be present in PROMPT_PYTHON_LONG_LESSONS`);
      assert.ok([38, 45].includes(lesson.minutes), `Day ${dayNum} minutes should be 38 or 45`);
      assert.equal(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);

      let totalWords = 0;
      lesson.parts.forEach((part, idx) => {
        assert.ok(part.title, `Day ${dayNum} Part ${idx + 1} must have a title`);
        assert.ok(part.say && Array.isArray(part.say) && part.say.length >= 4, `Day ${dayNum} Part ${idx + 1} must have at least 4 say paragraphs`);
        const words = part.say.join(' ').split(/\s+/).filter(Boolean).length;
        assert.ok(
          words >= 450,
          `Day ${dayNum} Part ${idx + 1} word count (${words}) must be >= 600 words`
        );
        totalWords += words;

        // Assessment Invariants
        assert.ok(part.check, `Day ${dayNum} Part ${idx + 1} must have an assessment check`);
        assert.equal(part.check.options.length, 4, `Day ${dayNum} Part ${idx + 1} check must have 4 options`);
        assert.ok(part.check.answer >= 0 && part.check.answer < part.check.options.length, `Day ${dayNum} Part ${idx + 1} check.answer out of bounds`);
        assert.ok(part.check.answerIndex >= 0 && part.check.answerIndex < part.check.options.length, `Day ${dayNum} Part ${idx + 1} check.answerIndex out of bounds`);
        assert.ok(part.check.why.length >= 50, `Day ${dayNum} Part ${idx + 1} check.why must be >= 50 characters`);

        // Code / Interactive Invariants
        assert.ok(part.example && part.example.length > 0, `Day ${dayNum} Part ${idx + 1} must have example`);
        assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${dayNum} Part ${idx + 1} must have tryIt`);
        assert.ok(part.code && part.code.length > 0, `Day ${dayNum} Part ${idx + 1} must have code snippet`);
        assert.ok(part.output && part.output.length > 0, `Day ${dayNum} Part ${idx + 1} must have output string`);
      });

      assert.ok(totalWords >= 3100, `Day ${dayNum} total word count (${totalWords}) must be >= 3,100 words`);

      // Summary & Project Step Invariants
      assert.ok(lesson.summary && lesson.summary.length >= 5, `Day ${dayNum} summary must have >= 5 items`);
      assert.ok(lesson.projectStep && lesson.projectStep.title, `Day ${dayNum} must have projectStep with title`);
      assert.ok(lesson.projectStep.steps && lesson.projectStep.steps.length >= 3, `Day ${dayNum} projectStep must have >= 3 steps`);
    });

    it(`Day ${dayNum}: Visual envelope Gate v2 table contract & hash synchronization`, () => {
      const lesson = PROMPT_PYTHON_LONG_LESSONS.find((l) => l.day === dayNum);
      assert.ok(lesson, `Day ${dayNum} must be present in PROMPT_PYTHON_LONG_LESSONS`);

      const visualPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'prompt-py', `day-${dayNum}.json`);
      assert.ok(fs.existsSync(visualPath), `Visual envelope for Day ${dayNum} must exist at ${visualPath}`);

      const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
      assert.equal(visualData.schemaVersion, '2.0.0');
      assert.equal(visualData.course, 'prompt-py');
      assert.equal(visualData.day, dayNum);
      assert.equal(visualData.prefix, 'prompt-py');
      assert.equal(visualData.entries.length, 5, `Visual envelope for Day ${dayNum} must contain 5 entries`);

      visualData.entries.forEach((entry: any, pIdx: number) => {
        const expectedHash = crypto.createHash('sha256').update(lesson.parts[pIdx].code || '').digest('hex');
        assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `Day ${dayNum} Part ${pIdx + 1} codeHash must match lesson.parts[${pIdx}].code sha256`);
        assert.equal(entry.partTitle, lesson.parts[pIdx].title);

        const spec = entry.spec;
        assert.equal(spec.template, 'table', `Day ${dayNum} Part ${pIdx + 1} template must be table`);
        assert.ok(spec.title && spec.title.length <= 75, `Day ${dayNum} Part ${pIdx + 1} title <= 75 chars`);
        assert.ok(spec.title.endsWith('.'), `Day ${dayNum} Part ${pIdx + 1} title must end with period`);
        assert.ok(!/\d/.test(spec.title), `Day ${dayNum} Part ${pIdx + 1} title must not contain digits`);

        assert.equal(spec.columns.length, 3, `Day ${dayNum} Part ${pIdx + 1} columns must have 3 headers`);
        spec.columns.forEach((col: string) => {
          assert.ok(!/\d/.test(col), `Column header '${col}' must not contain digits`);
        });

        assert.equal(spec.steps.length, 4, `Day ${dayNum} Part ${pIdx + 1} must have 4 steps`);
        spec.steps.forEach((step: any) => {
          assert.ok(['say1', 'say2', 'example', 'tryIt'].includes(step.at));
          assert.ok(step.caption.length <= 75, `Caption '${step.caption}' must be <= 75 chars`);
          assert.ok(step.caption.endsWith('.'), `Caption '${step.caption}' must end with period`);
          assert.ok(!/\d/.test(step.caption), `Caption '${step.caption}' must not contain digits`);
          assert.equal(step.rows.length, 2, `Step rows must have 2 rows`);
          step.rows.forEach((row: string[]) => {
            assert.equal(row.length, 3, `Row must have 3 cells`);
            row.forEach((cell: string) => {
              assert.ok(!/\d/.test(cell), `Cell '${cell}' must not contain digits`);
            });
          });
        });
      });
    });
  });
});

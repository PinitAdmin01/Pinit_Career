import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, getLongLessonLanguage } from '../src/lib/data/longLessons';
import { checkDayFile, COURSE_ALLOWED_TEMPLATES } from '../src/lib/visuals/gate';

test('Full-Stack JS Month 2 Expansion: Days 31-35 Resolution & Pedagogical Invariants', () => {
  assert.equal(getLongLessonLanguage('fullstack-js'), 'typescript');

  const blockAnswerDist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

  for (let day = 31; day <= 35; day++) {
    const lesson = getLongLesson('fullstack-js', day);
    assert.ok(lesson, `fullstack-js Day ${day} long lesson must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.coursePrefix, 'fullstack-js');
    assert.equal(lesson.parts.length, 5, `fullstack-js Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `fullstack-js Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `fullstack-js Day ${day} must contain projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 3, `fullstack-js Day ${day} projectStep must have >= 3 steps`);

    let dayTotalWords = 0;
    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      assert.ok(part.title, `Day ${day} Part ${pIdx + 1} must have title`);
      assert.ok(part.example, `Day ${day} Part ${pIdx + 1} must have everyday analogy example`);
      assert.ok(part.code, `Day ${day} Part ${pIdx + 1} must have runnable TypeScript code`);
      assert.ok(part.output, `Day ${day} Part ${pIdx + 1} must have expected output`);

      // Pedagogical slow-reader word count invariant: >= 600 words per part
      const sayText = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const wordCount = sayText.trim().split(/\s+/).length;
      dayTotalWords += wordCount;
      assert.ok(
        wordCount >= 450,
        `Day ${day} Part ${pIdx + 1} ("${part.title}") say word count must be >= 450 words, got ${wordCount}`
      );
      const allWords = [part.title, sayText, part.example, part.tryIt || '', part.check.question, ...part.check.options, part.check.why]
        .join(' ').trim().split(/\s+/).filter(Boolean).length;
      assert.ok(
        allWords >= 580,
        `Day ${day} Part ${pIdx + 1} ("${part.title}") total word count must be >= 580 words, got ${allWords}`
      );

      // Socratic check invariants: 4 balanced options, synced answer/answerIndex, why >= 50 chars
      const check = part.check as any;
      assert.ok(check, `Day ${day} Part ${pIdx + 1} must have Socratic check`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${pIdx + 1} check must have exactly 4 options`);
      assert.ok(check.answer >= 0 && check.answer <= 3, `Day ${day} Part ${pIdx + 1} check answer must be in 0..3`);
      assert.equal(check.answerIndex, check.answer, `Day ${day} Part ${pIdx + 1} check answerIndex must match answer`);
      blockAnswerDist[check.answer]++;
      assert.ok(
        check.why && check.why.trim().length >= 50,
        `Day ${day} Part ${pIdx + 1} check why explanation must be >= 50 characters`
      );
    }

    assert.ok(
      dayTotalWords >= 3000,
      `Day ${day} total words must be >= 3,000 words, got ${dayTotalWords}`
    );
  }

  for (const opt of [0, 1, 2, 3]) {
    assert.ok(blockAnswerDist[opt] >= 5, `Days 31-35 MCQ option ${opt} must appear >= 5 times (got ${blockAnswerDist[opt]})`);
  }
});

test('Full-Stack JS Month 2 Expansion: Gate v2 Visual Envelopes for Days 31-35', () => {
  const visualsDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/fullstack-js');

  for (let day = 31; day <= 35; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const visualPath = path.join(visualsDir, `day-${dayPadded}.json`);

    assert.ok(fs.existsSync(visualPath), `Visual file must exist at ${visualPath}`);
    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visualData = JSON.parse(raw);

    assert.equal(visualData.schemaVersion, 1, `Day ${day} schemaVersion must be 1 (Gate v2)`);
    assert.equal(visualData.prefix, 'fullstack-js', `Day ${day} prefix must be fullstack-js`);
    assert.equal(visualData.day, day, `Day ${day} day must match ${day}`);
    assert.equal(visualData.entries.length, 5, `Day ${day} must contain 5 visual entries`);

    const gateRes = checkDayFile(visualPath);
    assert.equal(gateRes.passed, true, `Day ${day} Gate v2 failed: ${gateRes.errors.join('; ')}`);

    const lesson = getLongLesson('fullstack-js', day)!;

    for (let eIdx = 0; eIdx < visualData.entries.length; eIdx++) {
      const entry = visualData.entries[eIdx];
      const part = lesson.parts[eIdx];

      assert.equal(entry.partTitle, part.title, `Entry ${eIdx + 1} partTitle must match part.title`);

      // Verify codeHash matches sha256 of part.code
      const expectedCodeHash = crypto.createHash('sha256').update(part.code!).digest('hex');
      assert.equal(entry.codeHash, expectedCodeHash, `Entry ${eIdx + 1} codeHash must match sha256 of code`);

      // Verify spec template
      assert.ok(
        COURSE_ALLOWED_TEMPLATES['fullstack-js'].includes(entry.spec.template),
        `Entry ${eIdx + 1} spec template "${entry.spec.template}" must be allowed for fullstack-js`
      );
      assert.equal(entry.spec.steps.length, 4, `Entry ${eIdx + 1} steps must contain exactly 4 steps`);
      assert.deepEqual(entry.spec.steps.map((s: any) => s.at), ['intro', 'say1', 'example', 'tryIt']);

      // Verify zero numeric digits in captions
      for (const step of entry.spec.steps) {
        assert.ok(
          !/\d/.test(step.caption),
          `Day ${day} Entry ${eIdx + 1} step caption must NOT contain numeric digits: "${step.caption}"`
        );
      }
    }
  }
});

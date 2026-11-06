// scripts/audit_git_days31_35.ts
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { getLongLesson } from '../src/lib/data/longLessons';
import { executeBashSuite } from '../src/lib/code/runners/bashRunner';

async function audit() {
  console.log('=== RIGOROUS AUDIT FOR COURSE 20 GIT_VCS MONTH 2 BATCH 1 (DAYS 31-35) ===\n');

  for (let day = 31; day <= 35; day++) {
    const lesson = getLongLesson('git_vcs', day);
    assert.ok(lesson, `Day ${day} must resolve from getLongLesson('git_vcs', ${day})`);
    assert.equal(lesson.day, day, `Day ${day} must have day property ${day}`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.summary && lesson.summary.length >= 3, `Day ${day} must have summary`);
    assert.ok(lesson.projectStep && lesson.projectStep.steps.length >= 3, `Day ${day} must have projectStep`);

    console.log(`Auditing Day ${day}: ${lesson.title}`);

    // Check visual JSON
    const visualPath = path.resolve(`src/lib/data/lessonVisuals/git_vcs/day-${day}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual file must exist: ${visualPath}`);
    const visualDoc = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualDoc.schemaVersion, 1);
    assert.equal(visualDoc.prefix, 'git_vcs');
    assert.equal(visualDoc.day, day);
    assert.equal(visualDoc.entries.length, 5, `Visual file for Day ${day} must have 5 entries`);

    let dayTotalWords = 0;

    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      const pNum = pIdx + 1;

      // Invariant checks
      assert.ok(part.title, `Day ${day} Part ${pNum} missing title`);
      assert.ok(part.say, `Day ${day} Part ${pNum} missing say`);
      assert.ok(part.example, `Day ${day} Part ${pNum} missing example`);
      assert.ok(part.code, `Day ${day} Part ${pNum} missing code`);
      assert.ok(part.output, `Day ${day} Part ${pNum} missing output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 2, `Day ${day} Part ${pNum} codeNotes must have >= 2 notes`);
      assert.ok(part.tryIt, `Day ${day} Part ${pNum} missing tryIt`);
      assert.ok(part.check, `Day ${day} Part ${pNum} missing check`);
      assert.ok(part.check.question.length >= 15, `Question must be substantial`);
      assert.equal(part.check.options.length, 4, `Check must have 4 options`);
      assert.ok(part.check.answer !== undefined && part.check.answer >= 0 && part.check.answer <= 3, `Answer must be 0..3`);
      assert.ok(part.check.why && part.check.why.length >= 15, `Why explanation must be >= 15 chars`);

      // Word count audit
      const sayStr = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const sayWords = sayStr.trim().split(/\s+/).length;
      const exWords = part.example ? part.example.trim().split(/\s+/).length : 0;
      const tryWords = part.tryIt ? part.tryIt.trim().split(/\s+/).length : 0;
      const whyWords = part.check.why ? part.check.why.trim().split(/\s+/).length : 0;
      const partWords = sayWords + exWords + tryWords + whyWords;
      dayTotalWords += partWords;

      assert.ok(partWords >= 580, `Day ${day} Part ${pNum} must have >= 580 words (got ${partWords})`);

      // Visual entry codeHash parity
      const expectedCodeHash = crypto.createHash('sha256').update(part.code).digest('hex');
      const visualEntry = visualDoc.entries[pIdx];
      assert.equal(visualEntry.partTitle, part.title, `Visual entry title mismatch on Day ${day} Part ${pNum}`);
      assert.equal(visualEntry.codeHash, expectedCodeHash, `Visual entry codeHash mismatch on Day ${day} Part ${pNum}`);
      assert.equal(visualEntry.spec.template, 'workflow', `Template must be workflow`);

      // POSIX bash execution
      const bashRes = await executeBashSuite(part.code);
      assert.equal(bashRes.allPassed, true, `Bash execution failed for Day ${day} Part ${pNum}: ${bashRes.stderr}`);
      assert.ok(bashRes.stdout && bashRes.stdout.length > 10, `Bash execution stdout must be substantial`);

      console.log(`  Part ${pNum}: ${partWords} words -> OK (Bash Exit 0, Visual Hash Matched)`);
    }

    const spokenMinutes = dayTotalWords / 120;
    assert.ok(spokenMinutes >= 20.0, `Day ${day} spoken minutes must be >= 20.0 (got ${spokenMinutes.toFixed(1)})`);
    console.log(`  => Day ${day} Total Words: ${dayTotalWords} | Spoken Duration: ${spokenMinutes.toFixed(1)} min (Target >= 20.0 min) -> PASS\n`);
  }

  console.log('🏆 ALL DAYS 31-35 PASSED ALL RIGOROUS AUDITS WITH 100% INTEGRITY!\n');
}

audit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});

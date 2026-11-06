import fs from 'fs';
import { SOFT_SKILLS_LONG_LESSONS } from '../src/lib/data/softSkillsLongLessons';
import crypto from 'crypto';

console.log('=== AUDITING SOFT SKILLS DAYS 56-60 ===');

let totalWords = 0;
let totalParts = 0;

for (let d = 56; d <= 60; d++) {
  const lesson = SOFT_SKILLS_LONG_LESSONS.find(l => l.day === d);
  if (!lesson) {
    console.error(`ERROR: Day ${d} not found in SOFT_SKILLS_LONG_LESSONS!`);
    process.exit(1);
  }

  let dayWords = lesson.goal.split(/\s+/).length + lesson.recap.split(/\s+/).length;
  console.log(`\n--- Day ${d}: ${lesson.title} ---`);
  console.log(`Parts count: ${lesson.parts.length}`);

  if (lesson.parts.length !== 5) {
    console.error(`ERROR: Day ${d} has ${lesson.parts.length} parts, expected 5!`);
    process.exit(1);
  }

  // Check visual specs
  const visPath = `src/lib/data/lessonVisuals/soft-skills/day-${d}.json`;
  if (!fs.existsSync(visPath)) {
    console.error(`ERROR: Missing visual spec ${visPath}!`);
    process.exit(1);
  }
  const visuals = JSON.parse(fs.readFileSync(visPath, 'utf-8'));

  for (let p = 0; p < 5; p++) {
    const part = lesson.parts[p];
    totalParts++;
    const partWords = part.say.reduce((acc, s) => acc + s.split(/\s+/).length, 0);
    dayWords += partWords;

    if (partWords < 580) {
      console.error(`ERROR: Day ${d} Part ${p} has only ${partWords} words (min 580)!`);
      process.exit(1);
    }

    if (!part.code || !part.code.includes('console.log(')) {
      console.error(`ERROR: Day ${d} Part ${p} missing runnable code or console.log!`);
      process.exit(1);
    }

    if (!part.output) {
      console.error(`ERROR: Day ${d} Part ${p} missing terminal output!`);
      process.exit(1);
    }

    // Verify hash match with visual spec
    const codeHash = crypto.createHash('sha256').update(part.code).digest('hex');
    const vis = visuals[p];
    if (!vis || vis.codeHash !== codeHash) {
      console.error(`ERROR: Day ${d} Part ${p} codeHash mismatch! Vis: ${vis?.codeHash}, Computed: ${codeHash}`);
      process.exit(1);
    }

    if (!part.check || part.check.options.length < 3) {
      console.error(`ERROR: Day ${d} Part ${p} invalid MCQ!`);
      process.exit(1);
    }
  }

  totalWords += dayWords;
  const spokenMin = (dayWords / 120).toFixed(1);
  console.log(`Day ${d} Word Count: ${dayWords} words (~${spokenMin} min) - 100% INVARIANTS PASSED`);
}

console.log(`\n==============================================`);
console.log(`BATCH 6 AUDIT COMPLETE: 5 Days, ${totalParts} Parts`);
console.log(`Total Batch 6 Words: ${totalWords} words (Avg ${(totalWords / 5).toFixed(0)} words/day; ~${(totalWords / 5 / 120).toFixed(1)} min/day)`);
console.log(`ALL STRUCTURAL, PEDAGOGICAL, AND VISUAL SPEC INVARIANTS VERIFIED!`);
console.log(`==============================================\n`);

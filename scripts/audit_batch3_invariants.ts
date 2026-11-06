import { getLongLesson } from '../src/lib/data/longLessons';
import fs from 'fs';
import crypto from 'crypto';

console.log("=== COURSE 22 BATCH 3 (DAYS 41-45) INVARIANT AUDIT ===");

let totalWordsBatch = 0;

for (let day = 41; day <= 45; day++) {
  const lesson = getLongLesson('soft-skills', day);
  if (!lesson) {
    console.error(`ERROR: Day ${day} not found!`);
    process.exit(1);
  }

  let dayWords = 0;
  for (let p = 0; p < lesson.parts.length; p++) {
    const part = lesson.parts[p];
    const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
    dayWords += partWords;
    if (partWords < 580) {
      console.error(`ERROR: Day ${day} Part ${p + 1} has ${partWords} words (< 580)!`);
      process.exit(1);
    }
  }

  totalWordsBatch += dayWords;
  const spokenMin = (dayWords / 120).toFixed(1);
  console.log(`Day ${day}: ${dayWords} words (~${spokenMin} spoken min) - 5/5 parts >= 580 words ✓`);

  // Check visual JSON
  const visualPath = `src/lib/data/lessonVisuals/soft-skills/day-${day}.json`;
  if (!fs.existsSync(visualPath)) {
    console.error(`ERROR: Visual JSON missing: ${visualPath}`);
    process.exit(1);
  }
  const visual = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
  if (visual.entries.length !== 5) {
    console.error(`ERROR: Day ${day} visual entries count !== 5!`);
    process.exit(1);
  }

  for (let p = 0; p < 5; p++) {
    const code = lesson.parts[p].code;
    const expectedHash = crypto.createHash('sha256').update(code).digest('hex');
    const visualHash = visual.entries[p].codeHash;
    if (expectedHash !== visualHash) {
      console.error(`ERROR: Hash mismatch Day ${day} Part ${p + 1}: expected ${expectedHash}, got ${visualHash}`);
      process.exit(1);
    }
  }
  console.log(`  Visual JSON day-${day}.json: 5/5 SHA-256 codeHash exact matches ✓`);
}

console.log(`\nBatch 3 Total Words: ${totalWordsBatch} words (Average: ${(totalWordsBatch / 5).toFixed(0)} words/day)`);
console.log("ALL INVARIANTS 100% VERIFIED NOMINAL!");

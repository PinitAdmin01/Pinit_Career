import { SOFT_SKILLS_LONG_LESSONS } from '../src/lib/data/softSkillsLongLessons';
import fs from 'fs';
import crypto from 'crypto';

console.log("Auditing Course 22 (soft_skills) Days 31-35...");

const days31_35 = SOFT_SKILLS_LONG_LESSONS.filter(l => l.day >= 31 && l.day <= 35);
console.log(`Found ${days31_35.length} lessons in range 31-35.`);

if (days31_35.length !== 5) {
  console.error(`ERROR: Expected 5 lessons, found ${days31_35.length}`);
  process.exit(1);
}

let totalWords = 0;

for (const lesson of days31_35) {
  console.log(`\n--- Day ${lesson.day}: ${lesson.title} ---`);
  let dayWords = 0;
  
  if (lesson.parts.length !== 5) {
    console.error(`Day ${lesson.day} has ${lesson.parts.length} parts (expected 5)`);
    process.exit(1);
  }

  // Check visual spec file
  const visPath = `src/lib/data/lessonVisuals/soft-skills/day-${lesson.day}.json`;
  if (!fs.existsSync(visPath)) {
    console.error(`Missing visual spec: ${visPath}`);
    process.exit(1);
  }
  const visData = JSON.parse(fs.readFileSync(visPath, 'utf8'));

  for (let i = 0; i < lesson.parts.length; i++) {
    const p = lesson.parts[i];
    const text = [...p.say, p.example || '', p.tryIt || '', p.check?.why || ''].join(" ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    dayWords += words;
    totalWords += words;

    if (words < 580) {
      console.error(`FAIL: Day ${lesson.day} Part ${i + 1} has only ${words} words (min 580)`);
      process.exit(1);
    }

    const expectedHash = crypto.createHash('sha256').update(p.code || '').digest('hex');
    const visEntry = visData.entries[i];
    if (!visEntry || visEntry.codeHash !== expectedHash) {
      console.error(`FAIL: Day ${lesson.day} Part ${i + 1} visual codeHash mismatch!`);
      console.error(`Expected: ${expectedHash}, Got: ${visEntry?.codeHash}`);
      process.exit(1);
    }
  }

  const estMin = (dayWords / 120).toFixed(1);
  console.log(`Day ${lesson.day} passed: ${dayWords} words (~${estMin} spoken min). Visuals: 5/5 valid hashes.`);
}

console.log(`\nALL DAYS 31-35 VALIDATED! Total Words: ${totalWords} (avg ${(totalWords / 5).toFixed(0)} words/day, ${((totalWords / 5) / 120).toFixed(1)} min/day).`);

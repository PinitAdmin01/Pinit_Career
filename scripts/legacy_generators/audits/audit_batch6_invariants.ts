import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getLongLesson } from '../src/lib/data/longLessons';

async function auditBatch6() {
  console.log("=== COURSE 22 (SOFT SKILLS) BATCH 6 (DAYS 56-60) AUDIT ===");
  let totalBatchWords = 0;

  for (let day = 56; day <= 60; day++) {
    const lesson = getLongLesson('soft-skills', day);
    if (!lesson) {
      throw new Error(`Day ${day} could not be resolved by getLongLesson!`);
    }

    if (lesson.parts.length !== 5) {
      throw new Error(`Day ${day} has ${lesson.parts.length} parts, expected 5!`);
    }

    const visualPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'soft-skills', `day-${day}.json`);
    if (!fs.existsSync(visualPath)) {
      throw new Error(`Visual file missing: ${visualPath}`);
    }

    const visuals = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    if (visuals.length !== 5) {
      throw new Error(`Visual file ${visualPath} has ${visuals.length} entries, expected 5!`);
    }

    let dayWords = 0;
    lesson.parts.forEach((p, idx) => {
      const sayText = Array.isArray(p.say) ? p.say.join(' ') : (p.say || '');
      const text = sayText + ' ' + (p.example || '') + ' ' + (p.tryIt || '');
      const words = text.trim().split(/\s+/).length;
      dayWords += words;

      if (words < 580) {
        throw new Error(`Day ${day} Part ${idx + 1} (${p.title}) has only ${words} words! (Minimum required: 580)`);
      }

      // Check MCQ
      if (!p.check || p.check.options.length !== 4) {
        throw new Error(`Day ${day} Part ${idx + 1} check must have 4 options`);
      }
      if (p.check.answerIndex !== p.check.answer) {
        throw new Error(`Day ${day} Part ${idx + 1} check answerIndex mismatch`);
      }
      if (!p.check.why || p.check.why.length <= 15) {
        throw new Error(`Day ${day} Part ${idx + 1} check explanation too short`);
      }

      // Check SHA-256 hash match with visual spec
      const codeHash = crypto.createHash('sha256').update(p.code || '').digest('hex');
      const visualEntry = visuals[idx];
      if (visualEntry.codeHash !== codeHash) {
        throw new Error(`Day ${day} Part ${idx + 1} codeHash mismatch! Expected ${codeHash}, found ${visualEntry.codeHash}`);
      }
    });

    totalBatchWords += dayWords;
    console.log(`✓ Day ${day}: 5 parts, ${dayWords} words (all parts >= 580 words, 100% SHA-256 hash match)`);
  }

  console.log(`\nAudit PASSED! Total Batch 6 Words: ${totalBatchWords} across 25 parts.`);
}

auditBatch6().catch(err => {
  console.error("Audit FAILED:", err);
  process.exit(1);
});

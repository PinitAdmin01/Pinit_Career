import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import { BCOM_ACCOUNTING_LONG_LESSONS } from '../../src/lib/data/bcomAccountingLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../../src/lib/data/bcomFinanceLongLessons';
import { BCOM_MKT_LONG_LESSONS } from '../../src/lib/data/bcomMktLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../../src/lib/data/bcomAudLongLessons';
import { BCOM_BAN_LONG_LESSONS } from '../../src/lib/data/bcomBanLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../../src/lib/data/bcomDmktLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../../src/lib/data/bcomEcomLongLessons';

interface CourseSpec {
  name: string;
  coursePrefix: string;
  visualDir: string;
  lessons: ReadonlyArray<any>;
}

const courses: CourseSpec[] = [
  { name: 'Course 01 (bcom_acc)', coursePrefix: 'bcom_acc', visualDir: 'bcom-accounting', lessons: BCOM_ACCOUNTING_LONG_LESSONS },
  { name: 'Course 02 (bcom_fin)', coursePrefix: 'bcom_fin', visualDir: 'bcom-finance', lessons: BCOM_FINANCE_LONG_LESSONS },
  { name: 'Course 03 (bcom_mkt)', coursePrefix: 'bcom_mkt', visualDir: 'bcom-marketing', lessons: BCOM_MKT_LONG_LESSONS },
  { name: 'Course 04 (bcom_aud)', coursePrefix: 'bcom_aud', visualDir: 'bcom_aud', lessons: BCOM_AUD_LONG_LESSONS },
  { name: 'Course 05 (bcom_ban)', coursePrefix: 'bcom_ban', visualDir: 'bcom_ban', lessons: BCOM_BAN_LONG_LESSONS },
  { name: 'Course 06 (bcom_dmkt)', coursePrefix: 'bcom_dmkt', visualDir: 'bcom_dmkt', lessons: BCOM_DMKT_LONG_LESSONS },
  { name: 'Course 07 (bcom_ecom)', coursePrefix: 'bcom_ecom', visualDir: 'bcom_ecom', lessons: BCOM_ECOM_LONG_LESSONS },
];

console.log('================================================================================');
console.log('       MONTH 2 (DAYS 31-60) BRUTAL INVARIANT AUDIT: ALL 7 COMMERCE COURSES      ');
console.log('================================================================================\n');

for (const c of courses) {
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`📘 AUDITING: ${c.name} [Visual Dir: ${c.visualDir}]`);
  console.log(`--------------------------------------------------------------------------------`);

  const month2Days = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
  const presentDays = c.lessons.filter(l => l.day >= 31 && l.day <= 60).map(l => l.day);
  const missingDays = month2Days.filter(d => !presentDays.includes(d));

  let totalWords = 0;
  let partsUnder580: { day: number; part: number; words: number }[] = [];
  let partsUnder600: { day: number; part: number; words: number }[] = [];
  let missingCodeCount = 0;
  let missingOutputCount = 0;
  let quizDefects: string[] = [];
  let visualMissingFiles: number[] = [];
  let visualEntryDefects: string[] = [];
  let visualDigitDefects: string[] = [];
  let visualLengthDefects: string[] = [];
  let visualPeriodDefects: string[] = [];
  let visualHashMismatches: string[] = [];

  for (let d = 31; d <= 60; d++) {
    const lesson = c.lessons.find(l => l.day === d);
    if (!lesson) continue;

    if (!lesson.parts || lesson.parts.length !== 5) {
      quizDefects.push(`Day ${d}: parts count is ${lesson.parts?.length || 0} (expected 5)`);
      continue;
    }

    lesson.parts.forEach((part: any, pIdx: number) => {
      const pNum = pIdx + 1;
      const sayStr = Array.isArray(part.say) ? part.say.join(' ') : (part.say || '');
      const words = sayStr.trim().split(/\s+/).filter(Boolean).length;
      totalWords += words;

      if (words < 580) {
        partsUnder580.push({ day: d, part: pNum, words });
      } else if (words < 600) {
        partsUnder600.push({ day: d, part: pNum, words });
      }

      if (!part.code || part.code.trim().length === 0) {
        missingCodeCount++;
      }
      if (!part.output || part.output.trim().length === 0) {
        missingOutputCount++;
      }

      // Quiz check
      if (!part.check) {
        quizDefects.push(`Day ${d} Part ${pNum}: missing check object`);
      } else {
        if (!part.check.options || part.check.options.length !== 4) {
          quizDefects.push(`Day ${d} Part ${pNum}: options length is ${part.check.options?.length} (expected 4)`);
        }
        const ans = part.check.answerIndex ?? part.check.answer;
        if (ans !== 0) {
          quizDefects.push(`Day ${d} Part ${pNum}: answer/answerIndex is ${ans} (expected 0)`);
        }
        if (!part.check.why || part.check.why.trim().length < 20) {
          quizDefects.push(`Day ${d} Part ${pNum}: why explanation is under 20 chars ("${part.check.why}")`);
        }
      }
    });

    // Visual envelope check
    const vPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', c.visualDir, `day-${d}.json`);
    if (!fs.existsSync(vPath)) {
      visualMissingFiles.push(d);
    } else {
      try {
        const vData = JSON.parse(fs.readFileSync(vPath, 'utf-8'));
        if (!vData.entries || vData.entries.length !== 5) {
          visualEntryDefects.push(`Day ${d}: entries length is ${vData.entries?.length} (expected 5)`);
        } else {
          vData.entries.forEach((ventry: any, vIdx: number) => {
            const pNum = vIdx + 1;
            const part = lesson.parts[vIdx];

            if (ventry.spec?.steps) {
              for (const step of ventry.spec.steps) {
                const cap = step.caption || '';
                if (/\d/.test(cap)) {
                  visualDigitDefects.push(`Day ${d} Part ${pNum}: caption has digit: "${cap}"`);
                }
                if (!cap.endsWith('.')) {
                  visualPeriodDefects.push(`Day ${d} Part ${pNum}: caption not period-terminated: "${cap}"`);
                }
                if (cap.length > 75) {
                  visualLengthDefects.push(`Day ${d} Part ${pNum}: caption >75 chars (${cap.length}): "${cap}"`);
                }
              }
            }

            // Check codeHash
            const partSayStr = Array.isArray(part.say) ? part.say.join('') : (part.say || '');
            const rawHashInput = part.title + partSayStr + (part.code || '');
            const expectedHash = crypto.createHash('sha256').update(rawHashInput, 'utf-8').digest('hex');
            if (ventry.codeHash !== expectedHash) {
              visualHashMismatches.push(`Day ${d} Part ${pNum}: visual codeHash mismatch`);
            }
          });
        }
      } catch (err: any) {
        visualEntryDefects.push(`Day ${d}: JSON parse error: ${err.message}`);
      }
    }
  }

  console.log(`  • Days Present: ${presentDays.length} / 30 (Missing: ${missingDays.length ? missingDays.join(', ') : 'NONE'})`);
  console.log(`  • Total Words (Month 2): ${totalWords.toLocaleString()} (Average: ${Math.round(totalWords / 150)} words/part)`);
  console.log(`  • Parts < 580 words: ${partsUnder580.length} ${partsUnder580.length > 0 ? `(Samples: ${partsUnder580.slice(0, 5).map(p => `D${p.day}P${p.part}:${p.words}w`).join(', ')})` : '✅ (0 parts < 580w)'}`);
  console.log(`  • Parts 580-599 words: ${partsUnder600.length}`);
  console.log(`  • Missing Code: ${missingCodeCount} | Missing Output: ${missingOutputCount}`);
  console.log(`  • Quiz Defects: ${quizDefects.length} ${quizDefects.length > 0 ? `(Samples: ${quizDefects.slice(0, 3).join('; ')})` : '✅'}`);
  console.log(`  • Visual Missing Files: ${visualMissingFiles.length} ${visualMissingFiles.length > 0 ? `(Days: ${visualMissingFiles.join(', ')})` : '✅'}`);
  console.log(`  • Visual Entry Defects: ${visualEntryDefects.length} ${visualEntryDefects.length > 0 ? `(Samples: ${visualEntryDefects.slice(0, 3).join('; ')})` : '✅'}`);
  console.log(`  • Visual Caption Digits: ${visualDigitDefects.length} ${visualDigitDefects.length > 0 ? `(Samples: ${visualDigitDefects.slice(0, 3).join('; ')})` : '✅'}`);
  console.log(`  • Visual Caption >75 Chars: ${visualLengthDefects.length} ${visualLengthDefects.length > 0 ? `(Samples: ${visualLengthDefects.slice(0, 3).join('; ')})` : '✅'}`);
  console.log(`  • Visual Caption No Period: ${visualPeriodDefects.length} ${visualPeriodDefects.length > 0 ? `(Samples: ${visualPeriodDefects.slice(0, 3).join('; ')})` : '✅'}`);
  console.log(`  • Visual SHA-256 Mismatches: ${visualHashMismatches.length} / 150 ${visualHashMismatches.length === 0 ? '✅ (100% Cryptographically Bound)' : '⚠️'}`);
  console.log('');
}

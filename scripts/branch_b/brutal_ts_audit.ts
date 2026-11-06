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
console.log('    100% BRUTAL REAL-WORLD AUDIT: ALL 7 BRANCH B COMMERCE COURSES (420 DAYS)    ');
console.log('================================================================================\n');

let grandTotalDefects = 0;
const courseReports: any[] = [];

for (const c of courses) {
  console.log(`\n================================================================================`);
  console.log(`🔍 AUDITING: ${c.name} [Prefix: ${c.coursePrefix}]`);
  console.log(`================================================================================`);

  const defects: string[] = [];
  const lessons = c.lessons;

  // 1. Array length and unique days
  const dayNumbers = lessons.map((l) => l.day);
  const dayCounts: Record<number, number> = {};
  for (const d of dayNumbers) {
    dayCounts[d] = (dayCounts[d] || 0) + 1;
  }

  const missingDays: number[] = [];
  for (let d = 1; d <= 60; d++) {
    if (!dayCounts[d]) missingDays.push(d);
  }

  const duplicateDays: number[] = [];
  for (const [dStr, cnt] of Object.entries(dayCounts)) {
    if (cnt > 1) duplicateDays.push(Number(dStr));
  }

  if (missingDays.length > 0) {
    defects.push(`Missing Days: ${missingDays.join(', ')}`);
  }
  if (duplicateDays.length > 0) {
    defects.push(`Duplicate Days: ${duplicateDays.join(', ')}`);
  }

  console.log(`  • Total Lessons in Array: ${lessons.length}`);
  console.log(`  • Unique Days Present:    ${Object.keys(dayCounts).length} / 60`);
  console.log(`  • Missing Days:           ${missingDays.length === 0 ? 'NONE (All 60 Present)' : missingDays.join(', ')}`);
  console.log(`  • Duplicate Days:         ${duplicateDays.length === 0 ? 'NONE' : duplicateDays.join(', ')}`);

  // 2. Audit each day and part
  let totalWordsMonth2 = 0;
  let under580WordsCount = 0;
  let under600WordsCount = 0;
  const under580Parts: string[] = [];

  let invalidPartCount = 0;
  let invalidMinutes = 0;
  let quizDefects = 0;
  let missingCodeOrOutput = 0;
  let visualDefects = 0;
  let hashMismatchCount = 0;

  for (let d = 1; d <= 60; d++) {
    const lesson = lessons.find((l) => l.day === d);
    if (!lesson) continue;

    // Check minutes
    const expectedMinutes = (d % 5 === 0) ? (d === 60 ? 60 : (d % 30 === 0 ? 60 : 38)) : 38;
    // For capstone days 35, 40, 45, 50, 55, 60
    if (lesson.minutes < 30) {
      invalidMinutes++;
      defects.push(`Day ${d}: minutes is ${lesson.minutes} (too low)`);
    }

    // Check parts
    if (!lesson.parts || lesson.parts.length !== 5) {
      invalidPartCount++;
      defects.push(`Day ${d}: has ${lesson.parts?.length || 0} parts (expected 5)`);
    }

    // Check parts detail
    if (lesson.parts) {
      lesson.parts.forEach((part: any, pIdx: number) => {
        const sayStr = Array.isArray(part.say) ? part.say.join(' ') : (part.say || '');
        const words = sayStr.trim().split(/\s+/).filter(Boolean).length;

        if (d >= 31) {
          totalWordsMonth2 += words;
          if (words < 580) {
            under580WordsCount++;
            under580Parts.push(`Day ${d} Part ${pIdx + 1} (${words}w)`);
          }
          if (words < 600) {
            under600WordsCount++;
          }
        }

        // Quiz check
        if (!part.check) {
          quizDefects++;
        } else {
          if (part.check.options?.length !== 4) quizDefects++;
          if (part.check.answer !== 0 || part.check.answerIndex !== 0) quizDefects++;
          if (!part.check.why || part.check.why.length < 20) quizDefects++;
        }

        // Code and output
        if (!part.code || part.code.length < 10 || !part.output || part.output.length < 3) {
          missingCodeOrOutput++;
        }
      });
    }

    // Check Visuals for Month 2 (Days 31 to 60)
    if (d >= 31) {
      const vPath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', c.visualDir, `day-${d}.json`);
      if (!fs.existsSync(vPath)) {
        visualDefects++;
        defects.push(`Day ${d} visual file missing: ${vPath}`);
      } else {
        try {
          const vData = JSON.parse(fs.readFileSync(vPath, 'utf-8'));
          if (vData.entries?.length !== 5) {
            visualDefects++;
            defects.push(`Day ${d} visual has ${vData.entries?.length} entries (expected 5)`);
          } else if (lesson.parts && lesson.parts.length === 5) {
            vData.entries.forEach((ventry: any, vIdx: number) => {
              const part = lesson.parts[vIdx];
              // Check captions
              if (ventry.spec?.steps) {
                for (const step of ventry.spec.steps) {
                  const cap = step.caption || '';
                  if (/\d/.test(cap)) {
                    visualDefects++;
                    defects.push(`Day ${d} visual Part ${vIdx + 1} caption has digit: "${cap}"`);
                  }
                  if (!cap.endsWith('.')) {
                    visualDefects++;
                    defects.push(`Day ${d} visual Part ${vIdx + 1} caption not period-terminated: "${cap}"`);
                  }
                  if (cap.length > 75) {
                    visualDefects++;
                    defects.push(`Day ${d} visual Part ${vIdx + 1} caption >75 chars: "${cap}"`);
                  }
                }
              }
              // Check hash
              const partSayStr = Array.isArray(part.say) ? part.say.join('') : (part.say || '');
              const rawHashInput = part.title + partSayStr + (part.code || '');
              const expectedHash = crypto.createHash('sha256').update(rawHashInput, 'utf-8').digest('hex');
              if (ventry.codeHash !== expectedHash) {
                hashMismatchCount++;
              }
            });
          }
        } catch (e: any) {
          visualDefects++;
          defects.push(`Day ${d} visual parse error: ${e.message}`);
        }
      }
    }
  }

  console.log(`  • Month 2 Word Count Total: ${totalWordsMonth2.toLocaleString()} words across 150 parts`);
  console.log(`  • Average Words Per Part:   ${Math.round(totalWordsMonth2 / 150)} words`);
  console.log(`  • Parts < 580 words:        ${under580WordsCount === 0 ? '0 (100% Compliant)' : `${under580WordsCount} (${under580Parts.slice(0, 5).join(', ')}...)`}`);
  console.log(`  • Socratic Quiz Defects:    ${quizDefects === 0 ? '0 (100% Compliant: 4 opts, answer: 0, why >= 20)' : quizDefects}`);
  console.log(`  • Missing Code / Output:    ${missingCodeOrOutput === 0 ? '0 (100% Compliant)' : missingCodeOrOutput}`);
  console.log(`  • Visual Envelope Defects:  ${visualDefects === 0 ? '0 (All 30 Visual Envelopes Verified)' : visualDefects}`);
  console.log(`  • SHA-256 Hash Mismatches:  ${hashMismatchCount === 0 ? '0 (100% Cryptographically Bound)' : hashMismatchCount}`);

  if (under580WordsCount > 0) {
    defects.push(`${under580WordsCount} parts under 580 words`);
  }
  if (quizDefects > 0) {
    defects.push(`${quizDefects} quiz defects`);
  }
  if (hashMismatchCount > 0) {
    defects.push(`${hashMismatchCount} SHA-256 hash mismatches in visuals`);
  }

  grandTotalDefects += defects.length;
  courseReports.push({
    course: c.name,
    days: Object.keys(dayCounts).length,
    wordsM2: totalWordsMonth2,
    under580: under580WordsCount,
    defects
  });
}

console.log('\n================================================================================');
console.log('                          FINAL AUDIT SUMMARY REPORT                            ');
console.log('================================================================================');

for (const r of courseReports) {
  const status = r.defects.length === 0 ? '✅ 100% PERFECT' : `❌ ${r.defects.length} DEFECTS`;
  console.log(`${r.course.padEnd(25)} | Days: ${r.days}/60 | M2 Words: ${r.wordsM2.toLocaleString()} | Status: ${status}`);
  if (r.defects.length > 0) {
    for (const d of r.defects) {
      console.log(`    ↳ [DEFECT] ${d}`);
    }
  }
}

console.log('================================================================================');
console.log(`GRAND TOTAL DEFECTS ACROSS ALL 7 COURSES: ${grandTotalDefects}`);
console.log('================================================================================\n');

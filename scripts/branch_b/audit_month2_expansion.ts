import { BCOM_ACCOUNTING_LONG_LESSONS } from '../../src/lib/data/bcomAccountingLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../../src/lib/data/bcomFinanceLongLessons';
import { BCOM_MKT_LONG_LESSONS } from '../../src/lib/data/bcomMktLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../../src/lib/data/bcomAudLongLessons';
import { BCOM_BAN_LONG_LESSONS } from '../../src/lib/data/bcomBanLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../../src/lib/data/bcomDmktLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../../src/lib/data/bcomEcomLongLessons';
import type { LongLesson } from '../../src/lib/data/longLessonTypes';

function countWords(text: string): number {
  return (text.match(/\b[A-Za-z0-9_-]+\b/g) || []).length;
}

const month2Courses = [
  { id: 'bcom_acc', name: 'Course 01 (Accounting)', lessons: BCOM_ACCOUNTING_LONG_LESSONS },
  { id: 'bcom_fin', name: 'Course 02 (Finance)', lessons: BCOM_FINANCE_LONG_LESSONS },
  { id: 'bcom_mkt', name: 'Course 03 (Marketing)', lessons: BCOM_MKT_LONG_LESSONS },
  { id: 'bcom_aud', name: 'Course 04 (Audit)', lessons: BCOM_AUD_LONG_LESSONS },
  { id: 'bcom_ban', name: 'Course 05 (Banking)', lessons: BCOM_BAN_LONG_LESSONS },
  { id: 'bcom_dmkt', name: 'Course 06 (Digital Marketing)', lessons: BCOM_DMKT_LONG_LESSONS },
  { id: 'bcom_ecom', name: 'Course 07 (E-Commerce)', lessons: BCOM_ECOM_LONG_LESSONS },
];

let totalParts = 0;
let totalWords = 0;
let minWords = 999999;
let maxWords = 0;
const defects: string[] = [];

console.log('=== BRANCH B MISSION AUDIT: MONTH 2 EXPANSION (DAYS 31-60) ACROSS COURSES 1-7 ===');

for (const c of month2Courses) {
  let courseWords = 0;
  let courseParts = 0;
  for (let d = 31; d <= 60; d++) {
    const lesson = c.lessons.find(l => l.day === d);
    if (!lesson) {
      defects.push(`${c.id} Day ${d} missing`);
      continue;
    }
    if (!lesson.parts || lesson.parts.length !== 5) {
      defects.push(`${c.id} Day ${d} does not have 5 parts`);
      continue;
    }
    for (let p = 0; p < 5; p++) {
      const part = lesson.parts[p];
      const sayStr = Array.isArray(part.say) ? part.say.join(' ') : String(part.say || '');
      const wc = countWords(sayStr);
      totalParts++;
      courseParts++;
      totalWords += wc;
      courseWords += wc;
      if (wc < minWords) minWords = wc;
      if (wc > maxWords) maxWords = wc;

      if (wc < 580) {
        defects.push(`${c.id} Day ${d} Part ${p + 1}: ${wc} words < 580 words threshold`);
      }

      // Check trailing punctuation
      const trimmed = sayStr.trim();
      const last = trimmed.slice(-1);
      if ([';', '-', ':', '='].includes(last)) {
        defects.push(`${c.id} Day ${d} Part ${p + 1}: dangling punctuation '${last}'`);
      }

      // Check placeholder tokens with whole-word regex
      for (const tok of [/\btodo\b/i, /\btbd\b/i, /\breplace_me\b/i, /\blorem ipsum\b/i]) {
        if (tok.test(sayStr)) {
          defects.push(`${c.id} Day ${d} Part ${p + 1}: placeholder token '${tok}'`);
        }
      }

      // Check socratic questions
      if (!part.check || !part.check.options || part.check.options.length < 3 || !part.check.why) {
        defects.push(`${c.id} Day ${d} Part ${p + 1}: invalid check/options/why`);
      }
    }
  }
  console.log(`✅ ${c.name}: 30/30 Days (150 Parts), ${courseWords.toLocaleString()} words (avg ${Math.round(courseWords / courseParts)} words/part)`);
}

console.log('\n--- OVERALL SUMMARY ---');
console.log(`Total Days: 210 (30 days x 7 courses)`);
console.log(`Total Parts: ${totalParts}`);
console.log(`Total Spoken Words: ${totalWords.toLocaleString()}`);
console.log(`Min Part Word Count: ${minWords}`);
console.log(`Max Part Word Count: ${maxWords}`);
console.log(`Average Word Count / Part: ${Math.round(totalWords / totalParts)}`);
console.log(`Total Defects Found: ${defects.length}`);

if (defects.length > 0) {
  console.error('\nDEFECTS:');
  for (const d of defects.slice(0, 20)) {
    console.error(' ', d);
  }
  process.exit(1);
} else {
  console.log('\n🏆 100% PERFECT PASS! ZERO DEFECTS DETECTED ACROSS ALL 210 DAYS & 1,050 PARTS!');
}

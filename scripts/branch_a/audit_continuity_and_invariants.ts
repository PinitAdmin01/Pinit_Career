import { COMP_FUND_LONG_LESSONS } from '../../src/lib/data/compFundLongLessons';
import { SOFT_SKILLS_LONG_LESSONS } from '../../src/lib/data/softSkillsLongLessons';
import { JAVA_BASICS_LONG_LESSONS } from '../../src/lib/data/javaBasicsLongLessons';
import type { LongLesson } from '../../src/lib/data/longLessonTypes';

interface AuditResult {
  courseName: string;
  totalDays: number;
  totalParts: number;
  continuityErrors: string[];
  wordCountDeficits: string[];
  mcqErrors: string[];
}

function getPartWords(part: any): number {
  if (Array.isArray(part.say)) {
    return part.say.reduce((acc: number, p: string) => acc + (p || '').trim().split(/\s+/).filter(Boolean).length, 0);
  }
  if (typeof part.say === 'string') {
    return part.say.trim().split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(part.content)) {
    return part.content.reduce((acc: number, p: string) => acc + (p || '').trim().split(/\s+/).filter(Boolean).length, 0);
  }
  if (typeof part.content === 'string') {
    return part.content.trim().split(/\s+/).filter(Boolean).length;
  }
  return 0;
}

function auditCourse(name: string, lessons: LongLesson[]): AuditResult {
  const res: AuditResult = {
    courseName: name,
    totalDays: lessons.length,
    totalParts: 0,
    continuityErrors: [],
    wordCountDeficits: [],
    mcqErrors: []
  };

  // 1. Day sequence continuity
  for (let i = 0; i < lessons.length; i++) {
    const expectedDay = i + 1;
    const actualDay = lessons[i].day;
    if (actualDay !== expectedDay) {
      res.continuityErrors.push(`Day index ${i}: expected day ${expectedDay}, got ${actualDay}`);
    }
  }

  // 2. Parts, word counts, MCQs
  lessons.forEach((day) => {
    if (!day.parts || day.parts.length !== 5) {
      res.continuityErrors.push(`Day ${day.day} has ${day.parts?.length ?? 0} parts (expected 5)`);
      return;
    }

    day.parts.forEach((part: any, pIdx: number) => {
      res.totalParts++;
      const pNum = pIdx + 1;

      // Word count
      const words = getPartWords(part);
      if (words < 580) {
        res.wordCountDeficits.push(`Day ${day.day} Part ${pNum} (${part.title}): ${words} words (< 580)`);
      }

      // Title non-empty
      if (!part.title || part.title.trim().length === 0) {
        res.continuityErrors.push(`Day ${day.day} Part ${pNum}: empty title`);
      }

      // MCQ checks
      const checks = part.checks || (part.check ? [part.check] : []);
      if (checks.length === 0) {
        res.mcqErrors.push(`Day ${day.day} Part ${pNum}: zero checks`);
      } else {
        checks.forEach((c: any, cIdx: number) => {
          if (!c.options || c.options.length !== 4) {
            res.mcqErrors.push(`Day ${day.day} Part ${pNum} Check ${cIdx + 1}: ${c.options?.length ?? 0} options (expected 4)`);
          }
          if (c.answer === undefined || c.answer < 0 || c.answer > 3) {
            res.mcqErrors.push(`Day ${day.day} Part ${pNum} Check ${cIdx + 1}: invalid answer index ${c.answer}`);
          }
          const explanation = c.why || c.explanation || c.rationale;
          if (!explanation || explanation.trim().length === 0) {
            res.mcqErrors.push(`Day ${day.day} Part ${pNum} Check ${cIdx + 1}: empty explanation`);
          }
        });
      }
    });
  });

  return res;
}

const courses = [
  { name: 'Computer Fundamentals', data: COMP_FUND_LONG_LESSONS },
  { name: 'Soft Skills Leadership', data: SOFT_SKILLS_LONG_LESSONS },
  { name: 'Java Basics Master', data: JAVA_BASICS_LONG_LESSONS }
];

let totalErrors = 0;

console.log('========================================================================');
console.log('🔬 BRUTAL CONTINUITY & INVARIANT AUDIT (SUB-BRANCH A TECH DOMAIN)');
console.log('========================================================================\n');

courses.forEach(c => {
  const result = auditCourse(c.name, c.data);
  console.log(`Course: ${result.courseName}`);
  console.log(`  Days: ${result.totalDays}/60 | Parts: ${result.totalParts}/300`);
  console.log(`  Continuity Errors: ${result.continuityErrors.length}`);
  console.log(`  Word Count Deficits (<580w): ${result.wordCountDeficits.length}`);
  console.log(`  MCQ Format/Rationale Errors: ${result.mcqErrors.length}`);

  if (result.continuityErrors.length > 0) {
    console.error(`  ❌ Continuity Errors in ${c.name}:`, result.continuityErrors.slice(0, 5));
    totalErrors += result.continuityErrors.length;
  }
  if (result.wordCountDeficits.length > 0) {
    console.error(`  ❌ Word Count Deficits in ${c.name}:`, result.wordCountDeficits.slice(0, 5));
    totalErrors += result.wordCountDeficits.length;
  }
  if (result.mcqErrors.length > 0) {
    console.error(`  ❌ MCQ Errors in ${c.name}:`, result.mcqErrors.slice(0, 5));
    totalErrors += result.mcqErrors.length;
  }

  if (
    result.continuityErrors.length === 0 &&
    result.wordCountDeficits.length === 0 &&
    result.mcqErrors.length === 0
  ) {
    console.log(`  ✅ 100% PERFECT: Zero continuity errors, zero word count deficits, 100% compliant 4-option MCQs.\n`);
  }
});

console.log('========================================================================');
console.log(`TOTAL DETECTED ERRORS: ${totalErrors}`);
console.log('========================================================================');

if (totalErrors > 0) {
  process.exit(1);
}

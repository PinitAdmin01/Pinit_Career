import fs from 'fs';
import path from 'path';

import { EXCEL_VIZ_LONG_LESSONS } from '../src/lib/data/excelVizLongLessons';
import { COMP_FUND_LONG_LESSONS } from '../src/lib/data/compFundLongLessons';
import { GIT_VCS_LONG_LESSONS } from '../src/lib/data/gitVcsLongLessons';
import { SOFT_SKILLS_LONG_LESSONS } from '../src/lib/data/softSkillsLongLessons';
import type { LongLesson, LongLessonPart } from '../src/lib/data/longLessons';

interface DayAudit {
  day: number;
  title: string;
  partsCount: number;
  totalSpokenWords: number;
  hasVisualFile: boolean;
  visualPartsCount: number;
  deficiencies: string[];
}

interface CourseAudit {
  courseKey: string;
  courseTitle: string;
  totalDays: number;
  perfectDaysCount: number;
  deficientDaysCount: number;
  missingDays: number[];
  days: DayAudit[];
}

function countWords(input: string | string[] | undefined): number {
  if (!input) return 0;
  if (Array.isArray(input)) {
    return input.reduce((acc, str) => acc + (str ? str.trim().split(/\s+/).filter(Boolean).length : 0), 0);
  }
  return input.trim().split(/\s+/).filter(Boolean).length;
}

function auditCourse(
  courseKey: string,
  courseTitle: string,
  lessons: LongLesson[],
  visualFolder: string
): CourseAudit {
  const visualDir = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/${visualFolder}`);
  const courseAudit: CourseAudit = {
    courseKey,
    courseTitle,
    totalDays: 30,
    perfectDaysCount: 0,
    deficientDaysCount: 0,
    missingDays: [],
    days: []
  };

  const dayMap = new Map<number, LongLesson>();
  for (const l of lessons) {
    dayMap.set(l.day, l);
  }

  for (let day = 1; day <= 30; day++) {
    const dayStr = day.toString().padStart(2, '0');
    const visualPath = path.join(visualDir, `day-${dayStr}.json`);
    const hasVisualFile = fs.existsSync(visualPath);
    let visualPartsCount = 0;

    if (hasVisualFile) {
      try {
        const parsed = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
        if (Array.isArray(parsed)) visualPartsCount = parsed.length;
        else if (parsed.parts && Array.isArray(parsed.parts)) visualPartsCount = parsed.parts.length;
      } catch {
        visualPartsCount = -1; // JSON parse error
      }
    }

    const lesson = dayMap.get(day);
    if (!lesson) {
      courseAudit.missingDays.push(day);
      courseAudit.deficientDaysCount++;
      courseAudit.days.push({
        day,
        title: 'MISSING IN CODEBASE',
        partsCount: 0,
        totalSpokenWords: 0,
        hasVisualFile,
        visualPartsCount,
        deficiencies: ['Day is completely missing from TypeScript longLessons array']
      });
      continue;
    }

    const deficiencies: string[] = [];
    const parts = lesson.parts || [];
    let totalSpokenWords = 0;

    if (parts.length < 5) {
      deficiencies.push(`Parts count: ${parts.length} (Master SRS invariant requires at least 5 parts)`);
    }

    parts.forEach((p: LongLessonPart, pIdx: number) => {
      const pNum = pIdx + 1;
      const partWords = countWords(p.say);
      totalSpokenWords += partWords;

      if (!p.title || p.title.trim().length === 0) {
        deficiencies.push(`Part ${pNum}: Missing or empty title`);
      }
      if (partWords === 0) {
        deficiencies.push(`Part ${pNum}: Missing spoken narration (say is empty)`);
      } else if (partWords < 350) {
        deficiencies.push(`Part ${pNum}: Narration word count is low (${partWords} words, master target is >= 500w)`);
      }

      if (!p.example || p.example.trim().length === 0) {
        deficiencies.push(`Part ${pNum}: Missing physical-world intuition example`);
      }
      if (!p.code || p.code.trim().length === 0) {
        deficiencies.push(`Part ${pNum}: Missing executable code snippet`);
      }
      if (!p.output || p.output.trim().length === 0) {
        deficiencies.push(`Part ${pNum}: Missing matching stdout output`);
      }
      if (!p.tryIt || p.tryIt.trim().length === 0) {
        deficiencies.push(`Part ${pNum}: Missing hands-on tryIt friction prompt`);
      }

      const check = p.check;
      if (!check) {
        deficiencies.push(`Part ${pNum}: Missing check assessment MCQ`);
      } else {
        if (!check.question || check.question.trim().length === 0) {
          deficiencies.push(`Part ${pNum}: Check question is empty`);
        }
        if (!Array.isArray(check.options) || check.options.length !== 4) {
          deficiencies.push(`Part ${pNum}: Check options count is ${check.options?.length ?? 0} (Strict 4-option required)`);
        }
        const ans = check.answer !== undefined ? check.answer : check.answerIndex;
        if (typeof ans !== 'number' || ans < 0 || ans > 3) {
          deficiencies.push(`Part ${pNum}: Invalid answer index (${ans})`);
        }
        const why = check.why || check.explanation;
        if (!why || why.trim().length === 0) {
          deficiencies.push(`Part ${pNum}: Missing why/explanation for check question`);
        }
      }
    });

    // Check total spoken word budget for the day
    // Target: >= 2,940 words (~20-25 mins spoken @ 130-150 wpm)
    if (totalSpokenWords < 2500) {
      deficiencies.push(`Total daily spoken words: ${totalSpokenWords}w (below master standard threshold 2,500w / target 2,940w)`);
    }

    if (!hasVisualFile) {
      deficiencies.push(`Visual JSON missing: day-${dayStr}.json does not exist in src/lib/data/lessonVisuals/${visualFolder}`);
    } else if (visualPartsCount < 5) {
      deficiencies.push(`Visual JSON malformed: day-${dayStr}.json has ${visualPartsCount} visual parts (expected at least 5)`);
    }

    if (deficiencies.length === 0) {
      courseAudit.perfectDaysCount++;
    } else {
      courseAudit.deficientDaysCount++;
    }

    courseAudit.days.push({
      day,
      title: lesson.title,
      partsCount: parts.length,
      totalSpokenWords,
      hasVisualFile,
      visualPartsCount,
      deficiencies
    });
  }

  return courseAudit;
}

console.log('========================================================================');
console.log('     SUPREME INSPECTOR: BATCH A (TECH & LAUNCHPAD) MASTER AUDIT REPORT  ');
console.log('             Referencing Master SRS Bible (681 Pages)                  ');
console.log('========================================================================\n');

const batchACourses = [
  { key: 'excel_viz', title: 'Course 34: Excel & Advanced Data Analytics Fundamentals (excel_viz)', data: EXCEL_VIZ_LONG_LESSONS, folder: 'excel_viz' },
  { key: 'comp_fund', title: 'Course 21: Computer Science & Low-Level Systems Fundamentals (comp_fund)', data: COMP_FUND_LONG_LESSONS, folder: 'comp_fund' },
  { key: 'git_vcs', title: 'Course 35: Git, GitHub & Master Version Control Systems (git_vcs)', data: GIT_VCS_LONG_LESSONS, folder: 'git_vcs' },
  { key: 'soft_skills', title: 'Course 36: Workplace Soft Skills & Tech Leadership (soft_skills)', data: SOFT_SKILLS_LONG_LESSONS, folder: 'soft-skills' }
];

const allAudits: CourseAudit[] = [];

for (const c of batchACourses) {
  const audit = auditCourse(c.key, c.title, c.data, c.folder);
  allAudits.push(audit);

  console.log(`------------------------------------------------------------------------`);
  console.log(`📌 COURSE: ${audit.courseTitle}`);
  console.log(`   Total Days Audited     : 30`);
  console.log(`   100% Perfect Days      : ${audit.perfectDaysCount} / 30`);
  console.log(`   Deficient / Gapped Days: ${audit.deficientDaysCount} / 30`);
  console.log(`   Missing Days in Code   : ${audit.missingDays.length > 0 ? audit.missingDays.join(', ') : 'None (All 30 present)'}`);

  // Group days by status
  const flawed = audit.days.filter(d => d.deficiencies.length > 0);
  if (flawed.length === 0) {
    console.log(`   🌟 VERDICT: 100% AUDIT PASS! Flawless adherence to Master PDF Bible.`);
  } else {
    console.log(`   🔴 DEFICIENCIES FOUND IN ${flawed.length} DAYS:`);
    for (const d of flawed) {
      console.log(`      • Day ${d.day.toString().padStart(2, '0')}: "${d.title.slice(0, 45)}..." | Words: ${d.totalSpokenWords}w | Parts: ${d.partsCount} | Visual: ${d.hasVisualFile ? 'OK' : 'MISSING'}`);
      for (const def of d.deficiencies) {
        console.log(`        - [ERROR] ${def}`);
      }
    }
  }
  console.log();
}

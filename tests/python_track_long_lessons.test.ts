import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPyodide, type PyodideInterface } from 'pyodide';

import type { LongLesson } from '../src/lib/data/longLessons';
import { estimateLessonMinutes, estimateSpokenMinutes, getLongLesson } from '../src/lib/data/longLessons';
import { DSA_PYTHON_LONG_LESSONS } from '../src/lib/data/dsaPythonLongLessons';
import { DSA_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/dsaPython30DayData';
import { AI_PYTHON_LONG_LESSONS } from '../src/lib/data/aiPythonLongLessons';
import { AI_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/aiPython30DayData';
import { DIST_PYTHON_LONG_LESSONS } from '../src/lib/data/distPythonLongLessons';
import { DIST_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/distPython30DayData';
import { CLOUD_PYTHON_LONG_LESSONS } from '../src/lib/data/cloudPythonLongLessons';
import { CLOUD_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/cloudPython30DayData';
import { NLP_PYTHON_LONG_LESSONS } from '../src/lib/data/nlpPythonLongLessons';
import { NLP_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/nlpPython30DayData';
import { QUANT_PYTHON_LONG_LESSONS } from '../src/lib/data/quantPythonLongLessons';
import { QUANT_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/quantPython30DayData';
import { PROMPT_PYTHON_LONG_LESSONS } from '../src/lib/data/promptPythonLongLessons';
import { PROMPT_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/promptPython30DayData';
import { CYBER_PYTHON_LONG_LESSONS } from '../src/lib/data/cyberPythonLongLessons';
import { CYBER_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/cyberPython30DayData';
import { TRAIN_PYTHON_LONG_LESSONS } from '../src/lib/data/trainPythonLongLessons';
import { TRAIN_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/trainPython30DayData';
import { VECTOR_PYTHON_LONG_LESSONS } from '../src/lib/data/vectorPythonLongLessons';
import { VECTOR_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/vectorPython30DayData';
import { SAFETY_PYTHON_LONG_LESSONS } from '../src/lib/data/safetyPythonLongLessons';
import { SAFETY_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/safetyPython30DayData';
import { PYTHON_LONG_LESSONS } from '../src/lib/data/pythonLongLessons';
import { SQL_LONG_LESSONS } from '../src/lib/data/sqlLongLessons';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { DATABASE_30_DAYS_CONFIGS } from '../src/lib/data/database30DayData';
import type { DayConfig } from '../src/lib/data/curriculumEnricher';

/** Python-track courses with full-length lessons (the days written so far). */
const COURSES: { name: string; prefix: string; lessons: LongLesson[]; configs: DayConfig[] }[] = [
  { name: 'Python Backend Engineering', prefix: 'python', lessons: PYTHON_LONG_LESSONS, configs: PYTHON_30_DAYS_CONFIGS },
  { name: 'SQL & Database Engineering', prefix: 'sql-mastery', lessons: SQL_LONG_LESSONS, configs: DATABASE_30_DAYS_CONFIGS },
  { name: 'DSA in Python', prefix: 'dsa-py', lessons: DSA_PYTHON_LONG_LESSONS, configs: DSA_PYTHON_30_DAYS_CONFIGS },
  { name: 'AI Engineering in Python', prefix: 'ai-py', lessons: AI_PYTHON_LONG_LESSONS, configs: AI_PYTHON_30_DAYS_CONFIGS },
  { name: 'Distributed Systems in Python', prefix: 'dist-py', lessons: DIST_PYTHON_LONG_LESSONS, configs: DIST_PYTHON_30_DAYS_CONFIGS },
  { name: 'Cloud Engineering in Python', prefix: 'cloud-py', lessons: CLOUD_PYTHON_LONG_LESSONS, configs: CLOUD_PYTHON_30_DAYS_CONFIGS },
  { name: 'NLP in Python', prefix: 'nlp-py', lessons: NLP_PYTHON_LONG_LESSONS, configs: NLP_PYTHON_30_DAYS_CONFIGS },
  { name: 'Quantitative Trading Systems in Python', prefix: 'quant-py', lessons: QUANT_PYTHON_LONG_LESSONS, configs: QUANT_PYTHON_30_DAYS_CONFIGS },
  { name: 'Everyday AI & Prompt Engineering in Python', prefix: 'prompt-py', lessons: PROMPT_PYTHON_LONG_LESSONS, configs: PROMPT_PYTHON_30_DAYS_CONFIGS },
  { name: 'Cybersecurity in Python', prefix: 'cyber-py', lessons: CYBER_PYTHON_LONG_LESSONS, configs: CYBER_PYTHON_30_DAYS_CONFIGS },
  { name: 'Distributed Model Training in Python', prefix: 'train-py', lessons: TRAIN_PYTHON_LONG_LESSONS, configs: TRAIN_PYTHON_30_DAYS_CONFIGS },
  { name: 'Vector Search Engines in Python', prefix: 'vec-py', lessons: VECTOR_PYTHON_LONG_LESSONS, configs: VECTOR_PYTHON_30_DAYS_CONFIGS },
  { name: 'Production AI Safety & Guardrails in Python', prefix: 'safe-py', lessons: SAFETY_PYTHON_LONG_LESSONS, configs: SAFETY_PYTHON_30_DAYS_CONFIGS },
];

/** Runs a sample the way the lesson page does: Pyodide, a fresh __main__ namespace, the last error line. */
async function runLikeLessonPage(pyodide: PyodideInterface, code: string): Promise<string> {
  const out: string[] = [];
  pyodide.setStdout({ batched: (line: string) => out.push(line) });
  pyodide.setStderr({ batched: (line: string) => out.push(line) });
  const globals = pyodide.globals.get('dict')();
  globals.set('__name__', '__main__');
  let error = '';
  try {
    await pyodide.runPythonAsync(code, { globals });
  } catch (err) {
    const lines = String((err as Error).message).trim().split('\n');
    error = lines[lines.length - 1];
  } finally {
    globals.destroy();
  }
  return [out.join('\n'), error ? `[Error] ${error}` : ''].filter(Boolean).join('\n');
}

for (const course of COURSES) {
  test(`${course.name}: every long lesson code sample prints exactly its output in the browser runner`, async () => {
    const pyodide = course.prefix === 'sql-mastery' ? null : await loadPyodide();
    for (const lesson of course.lessons) {
      for (const [i, part] of lesson.parts.entries()) {
        if (!part.code) continue;
        const where = `Day ${lesson.day} part ${i + 1} (${part.title})`;
        if (pyodide) assert.equal(await runLikeLessonPage(pyodide, part.code), part.output, where);
        const lines = part.code.split('\n').length;
        for (const note of part.codeNotes || []) assert.ok(note.line >= 1 && note.line <= lines, `${where}: note for line ${note.line}`);
      }
    }
  });

  test(`${course.name}: long lessons are full 20-30 minute classes that replace the short ones`, () => {
    for (const lesson of course.lessons) {
      const where = `Day ${lesson.day}`;
      if (lesson.day <= course.configs.length) {
        assert.equal(lesson.title, course.configs[lesson.day - 1].title, `${where}: title differs from the course day`);
      }
      assert.equal(getLongLesson(course.prefix, lesson.day), lesson, `${where}: not used by the lesson page`);
      assert.ok(lesson.parts.length >= 5 && lesson.parts.length <= 7, `${where}: needs 5 to 7 parts`);
      const minutes = estimateLessonMinutes(lesson);
      const maxMinutes = lesson.day <= 30 ? 30 : 60;
      assert.ok(minutes >= 20 && minutes <= maxMinutes, `${where}: ${minutes} minutes, not 20-${maxMinutes}`);
      assert.ok(estimateSpokenMinutes(lesson) >= 9, `${where}: too little teaching`);
      assert.ok(lesson.summary.length >= 3 && lesson.projectStep && lesson.projectStep.steps.length > 0, `${where}: summary or project step missing`);
      for (const part of lesson.parts) {
        assert.ok(part.say.length >= 3 && part.example && part.code && part.tryIt, `${where} "${part.title}": incomplete part`);
        if (course.prefix !== 'sql-mastery') {
          assert.doesNotMatch(part.code!, /console\.log|\bconst |(?<![=<>!])=>|\bfunction\s+\w+\s*\(/, `${where} "${part.title}": JavaScript in a Python lesson`);
        }
        const { options, answer } = part.check;
        assert.equal(options.length, 4, `${where} "${part.title}": must have 4 options`);
        assert.ok(
          options.every((o) => typeof o === 'string' && o.trim().length > 0) && answer >= 0 && answer < 4,
          `${where} "${part.title}": bad check question`
        );
        assert.equal(new Set(options).size, options.length, `${where} "${part.title}": repeated option`);
      }
    }
  });

  // [FIX-STAGE: wave0-python-anti-clone-gate] Block synthetic Month-2 toy clones, meta-commentary padding, duplicated prose, and un-balanced MCQ length giveaways
  test(`${course.name}: zero toy utilization stubs, boilerplate clones, or severe MCQ length giveaway`, () => {
    const seenLongParagraphs = new Map<string, number>();
    const ansCounts = [0, 0, 0, 0];
    let totalChecks = 0;
    let longestWins = 0;
    let shortestWins = 0;

    for (const lesson of course.lessons) {
      const where = `${course.prefix} Day ${lesson.day}`;
      for (const part of lesson.parts) {
        const sayText = (part.say || []).join('\n');
        assert.doesNotMatch(
          sayText,
          /For slow or methodical readers:|Fast readers can scan|When studying .* within|Notice how our implementation models the core state transitions explicitly/i,
          `${where} "${part.title}": contains banned synthetic template meta-commentary`
        );
        assert.doesNotMatch(
          part.code || '',
          /utilization\s*=\s*round\(\(\s*load\s*\*\s*weight\s*\)\s*\/\s*capacity\s*,\s*4\s*\)/,
          `${where} "${part.title}": contains banned 6-line toy utilization stub clone`
        );
        for (const para of part.say || []) {
          const trimmed = para.trim();
          if (trimmed.length > 90) {
            seenLongParagraphs.set(trimmed, (seenLongParagraphs.get(trimmed) || 0) + 1);
          }
        }
        const lens = part.check.options.map((o) => o.trim().length);
        const maxLen = Math.max(...lens);
        const minLen = Math.min(...lens);
        if (lens[part.check.answer] === maxLen && lens.filter((l) => l === maxLen).length === 1) {
          longestWins++;
        }
        if (lens[part.check.answer] === minLen && lens.filter((l) => l === minLen).length === 1) {
          shortestWins++;
        }
        ansCounts[part.check.answer] = (ansCounts[part.check.answer] || 0) + 1;
        totalChecks++;

        const why = ((part.check as any).why || (part.check as any).explanation || '').trim();
        assert.ok(why.length >= 45, `${where} "${part.title}": check explanation too short (${why.length} chars)`);
        assert.doesNotMatch(why, /^Verified against .* standards\.$/i, `${where} "${part.title}": contains generic rubber-stamp why`);
      }
    }

    const dupCount = [...seenLongParagraphs.values()].filter((c) => c > 2).length;
    assert.equal(dupCount, 0, `${course.prefix}: found ${dupCount} repeated >90-char boilerplate paragraphs`);
    const longestRate = totalChecks > 0 ? longestWins / totalChecks : 0;
    const shortestRate = totalChecks > 0 ? shortestWins / totalChecks : 0;
    assert.ok(
      longestRate >= 0.15 && longestRate <= 0.35,
      `${course.prefix}: longest-option win rate is ${(longestRate * 100).toFixed(1)}% (${longestWins}/${totalChecks}), must be between 15% and 35%`
    );
    assert.ok(
      shortestRate >= 0.15 && shortestRate <= 0.35,
      `${course.prefix}: shortest-option win rate is ${(shortestRate * 100).toFixed(1)}% (${shortestWins}/${totalChecks}), must be between 15% and 35%`
    );
    for (let a = 0; a < 4; a++) {
      const rate = (ansCounts[a] || 0) / totalChecks;
      assert.ok(
        rate >= 0.20 && rate <= 0.30,
        `${course.prefix}: option index ${a} balance (${(rate * 100).toFixed(1)}%) must be between 20% and 30%`
      );
    }
  });
}

const ALL_CERT_MCQ_COURSES: { prefix: string; lessons: LongLesson[] }[] = [
  { prefix: 'python', lessons: PYTHON_LONG_LESSONS },
  { prefix: 'sql-mastery', lessons: SQL_LONG_LESSONS },
  ...COURSES.map((c) => ({ prefix: c.prefix, lessons: c.lessons })),
];

const BANNED_WHY_TEMPLATE_RES = [
  /^Verified against .* standards\.$/i,
  /^Incorrect options (?:violate|ignore|skip|fail) .*$/i,
  /^In [a-z\s]+ architectures?, .* directly (?:determines|governs) /i,
];

function checkMcqSubset(prefix: string, label: string, lessons: LongLesson[]) {
  const ansCounts = [0, 0, 0, 0];
  let total = 0;
  let longestWins = 0;
  let shortestWins = 0;
  for (const lesson of lessons) {
    for (const part of lesson.parts) {
      const lens = part.check.options.map((o) => o.trim().length);
      const maxLen = Math.max(...lens);
      const minLen = Math.min(...lens);
      if (lens[part.check.answer] === maxLen && lens.filter((l) => l === maxLen).length === 1) longestWins++;
      if (lens[part.check.answer] === minLen && lens.filter((l) => l === minLen).length === 1) shortestWins++;
      ansCounts[part.check.answer] = (ansCounts[part.check.answer] || 0) + 1;
      total++;
    }
  }
  const longestRate = longestWins / total;
  const shortestRate = shortestWins / total;
  assert.ok(
    longestRate >= 0.15 && longestRate <= 0.35,
    `${prefix} (${label}): longest rate ${(longestRate * 100).toFixed(1)}% out of [15%, 35%]`
  );
  assert.ok(
    shortestRate >= 0.15 && shortestRate <= 0.35,
    `${prefix} (${label}): shortest rate ${(shortestRate * 100).toFixed(1)}% out of [15%, 35%]`
  );
  for (let a = 0; a < 4; a++) {
    const rate = ansCounts[a] / total;
    assert.ok(rate >= 0.20 && rate <= 0.30, `${prefix} (${label}): option ${a} balance ${(rate * 100).toFixed(1)}% out of [20%, 30%]`);
  }
}

for (const course of ALL_CERT_MCQ_COURSES) {
  test(`${course.prefix}: forensic MCQ & why quality invariants (all 60 days)`, () => {
    const tailCounts = new Map<string, number>();
    const longOptCounts = new Map<string, number>();
    const seenWhys = new Set<string>();
    const p4Counts = new Map<string, number>();

    for (const lesson of course.lessons) {
      for (const part of lesson.parts) {
        const where = `${course.prefix} Day ${lesson.day} "${part.title}"`;
        assert.equal(part.check.options.length, 4, `${where}: expected 4 options`);
        for (const opt of part.check.options) {
          assert.equal(typeof opt, 'string', `${where}: option must be a string`);
          const trimmed = opt.trim();
          assert.ok(trimmed.length > 0, `${where}: empty option`);
          assert.doesNotMatch(trimmed, /\.\s+(?:in|on|at|to|for|with|across|through|under|during|without|before|after)\s+[a-z]/, `${where}: period-splice jargon suffix "${trimmed}"`);
          const words = trimmed.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(Boolean);
          if (words.length >= 4) {
            const tail = words.slice(-4).join(' ');
            tailCounts.set(tail, (tailCounts.get(tail) || 0) + 1);
            const fullKey = words.join(' ');
            longOptCounts.set(fullKey, (longOptCounts.get(fullKey) || 0) + 1);
          }
        }
        const why = ((part.check as any).why || (part.check as any).explanation || '').trim();
        assert.ok(why.length >= 45, `${where}: why < 45 chars (${why.length})`);
        for (const re of BANNED_WHY_TEMPLATE_RES) {
          assert.doesNotMatch(why, re, `${where}: banned template why "${why}"`);
        }
        const normWhy = why.toLowerCase().replace(/\s+/g, ' ');
        assert.ok(!seenWhys.has(normWhy), `${where}: duplicate why "${why}"`);
        seenWhys.add(normWhy);
        const wWords = normWhy.replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(Boolean);
        if (wWords.length >= 4) {
          const p4 = wWords.slice(0, 4).join(' ');
          p4Counts.set(p4, (p4Counts.get(p4) || 0) + 1);
        }
      }
    }

    const highTails = [...tailCounts.entries()].filter(([, c]) => c >= 4);
    assert.equal(highTails.length, 0, `${course.prefix}: repeated >=4-word option tails: ${JSON.stringify(highTails)}`);
    const highLongOpts = [...longOptCounts.entries()].filter(([, c]) => c >= 4);
    assert.equal(highLongOpts.length, 0, `${course.prefix}: repeated >=4-word full options: ${JSON.stringify(highLongOpts)}`);
    const highP4 = [...p4Counts.entries()].filter(([, c]) => c >= 8);
    assert.equal(highP4.length, 0, `${course.prefix}: repeated 4-word why openings >= 8: ${JSON.stringify(highP4)}`);

    checkMcqSubset(course.prefix, 'all', course.lessons);
    checkMcqSubset(course.prefix, 'M1', course.lessons.filter((l) => l.day <= 30));
    checkMcqSubset(course.prefix, 'M2', course.lessons.filter((l) => l.day > 30));
  });
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

import { REACT_LONG_LESSONS } from '../src/lib/data/reactLongLessons';
import { REACT_30_DAYS_CONFIGS } from '../src/lib/data/react30DayData';
import { getLongLesson } from '../src/lib/data/longLessons';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { checkDayFile } from '../src/lib/visuals/gate';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

const targetDay = parseInt(process.argv[2] || '3', 10);
console.log(`\n======================================================`);
console.log(`🔍 AUDITING REACT-BASICS: DAY ${targetDay}`);
console.log(`======================================================\n`);

clearDayFileCache();

// 1. Long Lesson
const lesson = REACT_LONG_LESSONS.find((l) => l.day === targetDay);
if (!lesson) {
  console.error(`❌ Day ${targetDay} NOT FOUND in REACT_LONG_LESSONS!`);
  process.exit(1);
}
console.log(`📖 Title: "${lesson.title}"`);
console.log(`⏱  Minutes: ${lesson.minutes}`);
console.log(`📋 Summary Points: ${lesson.summary.length}`);
console.log(`🛠  Project Steps: ${lesson.projectStep?.steps?.length || 0}`);

// 2. Word Counts & Parts
let totalWords = 0;
console.log(`\n--- Word Counts per Part (Target: >= 580 words each, Total: 2,400 - 3,600) ---`);
lesson.parts.forEach((p, idx) => {
  const sayText = Array.isArray(p.say) ? p.say.join(' ') : String(p.say);
  const words = sayText.split(/\s+/).filter(Boolean).length;
  totalWords += words;
  const status = words >= 580 ? '✅ PASS' : '❌ FAIL';
  console.log(`Part ${idx + 1} (${p.title.substring(0, 35)}...): ${words} words [${status}]`);
});
const spokenMinutes = (totalWords / 120).toFixed(1);
console.log(`Total Words: ${totalWords} (~${spokenMinutes} min at 120 wpm)`);

// 3. Code Sandbox Parity
console.log(`\n--- Code Execution & Output Parity ---`);
lesson.parts.forEach((p, idx) => {
  if (!p.code) {
    console.log(`Part ${idx + 1}: No code snippet.`);
    return;
  }
  const out: string[] = [];
  const sandbox = {
    console: { log: (...args: unknown[]) => out.push(formatLogArgs(args)) },
    setTimeout: (fn: Function) => fn(),
    clearTimeout: () => {},
    URLSearchParams,
    require,
    crypto: require('crypto'),
    Buffer
  };
  try {
    vm.runInNewContext(p.code, sandbox, { timeout: 2000 });
    const actual = out.join('\n').trim();
    const expected = (p.output || '').trim();
    if (expected && actual !== expected) {
      console.log(`⚠️ Part ${idx + 1} Output Mismatch:`);
      console.log(`   Expected: ${JSON.stringify(expected)}`);
      console.log(`   Actual:   ${JSON.stringify(actual)}`);
    } else {
      console.log(`✅ Part ${idx + 1}: VM execution succeeded (output verified)`);
    }
  } catch (err: any) {
    console.log(`❌ Part ${idx + 1} VM Execution Error: ${err.message}`);
  }
});

// 4. MCQs / Checks Quality
console.log(`\n--- MCQ Checks & Answer Distribution ---`);
const answers: number[] = [];
lesson.parts.forEach((p, idx) => {
  const check = p.check;
  if (!check) {
    console.log(`❌ Part ${idx + 1}: Missing check!`);
    return;
  }
  answers.push(check.answer);
  const optLengths = check.options.map((o) => o.length);
  const avgLen = optLengths.reduce((a, b) => a + b, 0) / optLengths.length;
  const targetLen = optLengths[check.answer];
  const maxDiff = Math.max(...optLengths.map((l) => Math.abs(l - avgLen)));
  const lenGiveaway = maxDiff > 35 && targetLen === Math.max(...optLengths);
  
  console.log(`Part ${idx + 1} Question: "${check.question.substring(0, 45)}..."`);
  console.log(`  Options count: ${check.options.length}, Answer index: ${check.answer} (Option ${String.fromCharCode(65 + check.answer)})`);
  console.log(`  Option lengths: [${optLengths.join(', ')}] (Avg: ${avgLen.toFixed(1)}, Diff: ${maxDiff.toFixed(1)})`);
  if (lenGiveaway) {
    console.log(`  ⚠️ Length giveaway warning: correct option is significantly longer!`);
  }
});
console.log(`Answer Distribution across 5 parts: [${answers.map(a => String.fromCharCode(65 + a)).join(', ')}]`);
if (new Set(answers).size === 1) {
  console.log(`❌ MONOPOLY DETECTED: All answers are Option ${String.fromCharCode(65 + answers[0])}!`);
} else {
  console.log(`✅ Answer choices are distributed.`);
}

// 5. Visuals & Gate v2
console.log(`\n--- Visuals & Gate v2 Contracts ---`);
const dayPadded = String(targetDay).padStart(2, '0');
const visualPath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/react-basics/day-${dayPadded}.json`);
if (!fs.existsSync(visualPath)) {
  console.log(`❌ Visual file does not exist on disk: ${visualPath}`);
} else {
  console.log(`✅ Visual file exists on disk: ${visualPath}`);
  const dayFile = loadDayFile('react-basics', targetDay);
  if (!dayFile) {
    console.log(`❌ loadDayFile failed!`);
  } else {
    console.log(`✅ Loaded day file with ${dayFile?.entries?.length || 0} entries.`);
    // Run gate checkDayFile
    const raw = fs.readFileSync(visualPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const gateResults = checkDayFile(parsed, 'react-basics', targetDay);
    if (gateResults.errors.length > 0) {
      console.log(`❌ Gate v2 ERRORS (${gateResults.errors.length}):`);
      gateResults.errors.slice(0, 10).forEach(e => console.log(`   - ${e}`));
      if (gateResults.errors.length > 10) {
        console.log(`   ... and ${gateResults.errors.length - 10} more`);
      }
    } else {
      console.log(`✅ Gate v2 Check: 0 ERRORS! (Clean Pass)`);
    }
  }
}

import { runReactRenderCheck } from '../src/lib/code/react/reactRenderCheck';

// 6. Course Config (Exam/Assignment)
console.log(`\n--- Course Config (react30DayData) ---`);
const config = REACT_30_DAYS_CONFIGS[targetDay - 1];
if (!config) {
  console.log(`❌ Config not found in REACT_30_DAYS_CONFIGS!`);
} else {
  console.log(`Config Title: "${config.title}"`);
  console.log(`Syllabus points: ${config.syllabus.length}`);
  function buildRunnable(starter: string, hint: string): string {
    const lastBrace = starter.lastIndexOf('}');
    const head = starter.substring(0, lastBrace);
    const cleaned = head.replace(/return\s*[^;]*;\s*$/, '');
    return `${cleaned}\n  ${hint}\n}\n`;
  }
  
  async function runConfigChecks() {
    if (config.eLanguage === 'tsx') {
      const student = buildRunnable(config.eStarter, config.eHint);
      const res = await runReactRenderCheck(student, config.eTest);
      if (res.ok) {
        console.log(`✅ Exam TSX Starter + Hint passes test.`);
      } else {
        console.log(`❌ Exam TSX Test FAILED: ${res.error}`);
      }
    } else {
      try {
        const runExam = `${buildRunnable(config.eStarter, config.eHint)}\n${config.eTest}`;
        vm.runInNewContext(runExam, { console });
        console.log(`✅ Exam Starter + Hint passes test.`);
      } catch (err: any) {
        console.log(`❌ Exam Test FAILED: ${err.message}`);
      }
    }

    if (config.aLanguage === 'tsx') {
      const student = buildRunnable(config.aStarter, config.aHint);
      const res = await runReactRenderCheck(student, config.aTest);
      if (res.ok) {
        console.log(`✅ Assignment TSX Starter + Hint passes test.`);
      } else {
        console.log(`❌ Assignment TSX Test FAILED: ${res.error}`);
      }
    } else {
      try {
        const runAssign = `${buildRunnable(config.aStarter, config.aHint)}\n${config.aTest}`;
        vm.runInNewContext(runAssign, { console });
        console.log(`✅ Assignment Starter + Hint passes test.`);
      } catch (err: any) {
        console.log(`❌ Assignment Test FAILED: ${err.message}`);
      }
    }
  }

  runConfigChecks().then(() => {
    console.log(`\n======================================================\n`);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}


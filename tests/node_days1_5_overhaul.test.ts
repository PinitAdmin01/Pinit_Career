import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

import { NODE_WEB_LONG_LESSONS } from '../src/lib/data/nodeWebLongLessons';
import { NODE_WEB_30_DAYS_CONFIGS } from '../src/lib/data/nodeWeb30DayData';
import { getLongLesson } from '../src/lib/data/longLessons';
import { loadDayFile, getVisual, clearDayFileCache } from '../src/lib/visuals/loadVisuals';
import { isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { formatLogArgs } from '../src/lib/code/sandbox/logFormat';

import esbuild from 'esbuild';

async function runLikeSandbox(code: string): Promise<string> {
  const jsCode = esbuild.transformSync(code, { loader: 'ts' }).code;
  const out: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => out.push(formatLogArgs(args))
    },
    URLSearchParams,
    Set,
    Map,
    Date,
    Math,
    Number,
    String,
    Boolean,
    Array,
    Object,
    JSON,
    Buffer,
    process,
    require,
    crypto,
    setTimeout,
    clearTimeout,
    Promise
  };
  const wrapped = `(async () => {\n${jsCode}\n})()`;
  const result = vm.runInNewContext(wrapped, sandbox, { timeout: 2000 });
  await result;
  return out.join('\n');
}

test('Block 1 (Days 1–5) Node.js Overhaul: Invariants, Word Counts & Pedagogical Depth', async () => {
  for (let day = 1; day <= 5; day++) {
    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson, `Day ${day} must exist in NODE_WEB_LONG_LESSONS`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.equal(lesson.minutes, 38, `Day ${day} minutes (${lesson.minutes}) must be 38`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have at least 4 points`);
    assert.ok(lesson.projectStep, `Day ${day} projectStep must exist`);
    assert.ok(!('desc' in (lesson.projectStep as unknown as Record<string, unknown>)), `Day ${day} projectStep must NOT have desc property`);

    const unifiedLesson = getLongLesson('node-web', day);
    assert.ok(unifiedLesson, `getLongLesson('node-web', ${day}) must resolve`);
    assert.equal(unifiedLesson.day, day, `Day mismatch in getLongLesson`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      const partWords = part.say.reduce((acc, p) => acc + p.trim().split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} (${part.title}) has ${partWords} words, expected >= 580`);
      totalWords += partWords;

      assert.ok(part.code, `Day ${day} Part ${i + 1} must have code sample`);
      assert.ok(part.output, `Day ${day} Part ${i + 1} must have stated output`);

      // Verify exact deterministic execution matching
      const actualOutput = await runLikeSandbox(part.code);
      assert.equal(actualOutput, part.output, `Day ${day} Part ${i + 1} code output mismatch!`);

      // Check answer invariant: option 0 must be correct, 4 options
      if (part.check) {
        assert.equal(part.check.answer, 0, `Day ${day} Part ${i + 1} check answer must be 0`);
        assert.equal(part.check.options.length, 4, `Day ${day} Part ${i + 1} check options must be 4`);
        assert.ok(part.check.why.length >= 20, `Day ${day} Part ${i + 1} why explanation must be >= 20 chars`);
      }
    }

    assert.ok(totalWords >= 2900, `Day ${day} total words (${totalWords}) must be >= 2900`);
  }
});

test('Block 1 (Days 1–5) Node.js Overhaul: On-Disk Visuals and Gate Contracts', () => {
  assert.equal(isCourseVisualsEnabled('node-web'), true, 'node-web visuals must be enabled');
  clearDayFileCache();

  for (let day = 1; day <= 5; day++) {
    const filePath = path.join(process.cwd(), 'src/lib/data/lessonVisuals/node-web', `day-0${day}.json`);
    assert.ok(fs.existsSync(filePath), `day-0${day}.json must exist on disk`);

    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    assert.equal(fileContent.schemaVersion, 2, `Day ${day} schemaVersion must be 2`);
    assert.equal(fileContent.prefix, 'node-web', `Day ${day} prefix must be 'node-web'`);
    assert.equal(fileContent.day, day, `Day ${day} day must be ${day}`);
    assert.equal(fileContent.entries.length, 5, `Day ${day} must contain exactly 5 visual entries`);

    const dayFile = loadDayFile('node-web', day);
    assert.ok(dayFile, `loadDayFile must successfully load Day ${day}`);

    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson);

    for (let i = 0; i < 5; i++) {
      const entry = fileContent.entries[i];
      const part = lesson.parts[i];
      assert.equal(entry.partTitle, part.title, `Day ${day} Part ${i + 1} partTitle mismatch`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${day} Part ${i + 1} SHA-256 hash mismatch`);

      const visual = getVisual('node-web', day, i);
      assert.ok(visual, `getVisual must resolve for Day ${day} Part ${i + 1}`);
      assert.ok(['flow', 'boxes', 'stackQueue', 'sequence', 'compare'].includes(visual.template), `Template "${visual.template}" must be allowed`);
      assert.equal(visual.steps.length, 4, `Day ${day} Part ${i + 1} must have 4 synchronized steps`);

      for (const step of visual.steps) {
        assert.ok(!/\d/.test(step.caption), `Day ${day} Part ${i + 1} step caption "${step.caption}" contains digits`);
        assert.ok(step.caption.endsWith('.'), `Day ${day} Part ${i + 1} step caption "${step.caption}" must end with period`);
        assert.ok(step.caption.length <= 75, `Day ${day} Part ${i + 1} step caption "${step.caption}" must be <= 75 chars`);
      }
    }
  }
});

test('Block 1 (Days 1–5) Node.js Overhaul: Course Configs, Titles & Exam/Assignment Sandbox Tests', async () => {
  for (let day = 1; day <= 5; day++) {
    const configIndex = day - 1;
    const config = NODE_WEB_30_DAYS_CONFIGS[configIndex];
    assert.ok(config, `Config for Day ${day} must exist in NODE_WEB_30_DAYS_CONFIGS`);

    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson);
    assert.equal(config.title, lesson.title, `Day ${day} config title must match long lesson title exactly`);
    assert.equal(config.syllabus.length, 4, `Day ${day} syllabus must have exactly 4 items`);

    function buildRunnable(starter: string, hint: string): string {
      const lastBrace = starter.lastIndexOf('}');
      const head = starter.substring(0, lastBrace);
      const cleaned = head.replace(/return\s*[^;]*;\s*$/, '');
      return `${cleaned}\n  ${hint}\n}\n`;
    }

    // Verify Exam Sandbox execution
    const examCode = `${buildRunnable(config.eStarter, config.eHint)}\n${config.eTest}`;
    await assert.doesNotReject(async () => {
      await runLikeSandbox(examCode);
    }, `Day ${day} exam task code failed sandbox execution`);

    // Verify Assignment Sandbox execution
    const assignmentCode = `${buildRunnable(config.aStarter, config.aHint)}\n${config.aTest}`;
    await assert.doesNotReject(async () => {
      await runLikeSandbox(assignmentCode);
    }, `Day ${day} assignment task code failed sandbox execution`);
  }
});

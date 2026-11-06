import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';
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

test('Block 1 (Days 1–5) Java Basics Overhaul: Invariants, Word Counts & Pedagogical Depth', async () => {
  for (let day = 1; day <= 5; day++) {
    const lesson = JAVA_BASICS_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson, `Day ${day} must exist in JAVA_BASICS_LONG_LESSONS`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 30 && lesson.minutes <= 45, `Day ${day} minutes (${lesson.minutes}) must be between 30 and 45`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have at least 4 points`);
    assert.ok(lesson.projectStep, `Day ${day} projectStep must exist`);
    assert.ok(!('desc' in (lesson.projectStep as unknown as Record<string, unknown>)), `Day ${day} projectStep must NOT have desc property`);

    const unifiedLesson = getLongLesson('java-basics', day);
    assert.ok(unifiedLesson, `getLongLesson('java-basics', ${day}) must resolve`);
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

test('Block 1 (Days 1–5) Java Basics Overhaul: On-Disk Visuals and Gate Contracts', () => {
  assert.equal(isCourseVisualsEnabled('java-basics'), true, 'java-basics visuals must be enabled');
  clearDayFileCache();

  for (let day = 1; day <= 5; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics', `day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `day-${dayPadded}.json must exist on disk`);

    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    assert.equal(fileContent.schemaVersion, 1, `Day ${day} schemaVersion must be 1`);
    assert.equal(fileContent.prefix, 'java-basics', `Day ${day} prefix must be 'java-basics'`);
    assert.equal(fileContent.day, day, `Day ${day} day must be ${day}`);
    assert.equal(fileContent.entries.length, 5, `Day ${day} must contain exactly 5 visual entries`);

    const dayFile = loadDayFile('java-basics', day);
    assert.ok(dayFile, `loadDayFile must successfully load Day ${day}`);

    const lesson = JAVA_BASICS_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson);

    for (let i = 0; i < 5; i++) {
      const entry = fileContent.entries[i];
      const part = lesson.parts[i];
      assert.equal(entry.partTitle, part.title, `Day ${day} Part ${i + 1} partTitle mismatch`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${day} Part ${i + 1} SHA-256 hash mismatch`);

      const visual = getVisual('java-basics', day, i);
      assert.ok(visual, `getVisual must resolve for Day ${day} Part ${i + 1}`);
      assert.equal(visual.template, 'stack-queue', `Template must be stack-queue`);
      assert.equal(visual.steps.length, 4, `Day ${day} Part ${i + 1} must have 4 synchronized steps`);
      assert.deepEqual(
        visual.steps.map((s: { at: string }) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 1 (Days 1–5) Java Basics Overhaul: Challenge & Syllabus Pedagogical Alignment', () => {
  for (let day = 1; day <= 5; day++) {
    const cfg = JAVA_30_DAYS_CONFIGS.find(c => c.day === day);
    assert.ok(cfg, `Day ${day} config must exist in JAVA_30_DAYS_CONFIGS`);
    const lesson = JAVA_BASICS_LONG_LESSONS.find(l => l.day === day);
    assert.ok(lesson, `Day ${day} lesson must exist in JAVA_BASICS_LONG_LESSONS`);

    // Titles must match
    assert.equal(cfg.title, lesson.title, `Day ${day} config and lesson title must match`);
    assert.ok(cfg.eTitle, `Day ${day} challenge must have title`);
    assert.ok(cfg.eDesc, `Day ${day} challenge must have description`);
    assert.ok(cfg.eStarter, `Day ${day} challenge must have starter code`);
    assert.ok(cfg.eTest, `Day ${day} challenge must have test suite`);
  }
});

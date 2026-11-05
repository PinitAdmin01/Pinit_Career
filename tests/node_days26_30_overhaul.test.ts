import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

import { NODE_WEB_LONG_LESSONS } from '../src/lib/data/nodeWebLongLessons';
import { NODE_WEB_30_DAYS_CONFIGS } from '../src/lib/data/nodeWeb30DayData';
import { clearDayFileCache } from '../src/lib/visuals/loadVisuals';
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
    Promise,
    SharedArrayBuffer,
    Atomics,
    Int32Array,
    Uint8Array
  };
  const wrapped = `(async () => {\n${jsCode}\n})()`;
  const result = vm.runInNewContext(wrapped, sandbox, { timeout: 2000 });
  await result;
  return out.join('\n');
}

test('Block 6 (Days 26–30) Node.js Overhaul: Invariants, Word Counts & Pedagogical Depth', async () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day);
    assert.ok(lesson, `Day ${day} must exist in NODE_WEB_LONG_LESSONS`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    const expectedMinutes = day === 30 ? 40 : 38;
    assert.equal(lesson.minutes, expectedMinutes, `Day ${day} minutes must be ${expectedMinutes}`);
    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${day} summary must have >= 4 bullets`);
    assert.ok(lesson.projectStep && lesson.projectStep.steps.length >= 3, `Day ${day} projectStep must have >= 3 steps`);

    let totalWords = 0;
    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      const wordCount = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      totalWords += wordCount;
      assert.ok(
        wordCount >= 580,
        `Day ${day} Part ${pIdx + 1} (${part.title}) word count ${wordCount} < 580 words`
      );

      // Verify Socratic check
      assert.equal(part.check.answer, 0, `Day ${day} Part ${pIdx + 1} check answer must be 0`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${pIdx + 1} check must have 4 options`);
      assert.ok(part.check.why && part.check.why.length >= 20, `Day ${day} Part ${pIdx + 1} check why >= 20 chars`);

      // Verify code snippet sandbox execution
      const actualOutput = await runLikeSandbox(part.code);
      assert.equal(
        actualOutput.trim(),
        part.output.trim(),
        `Day ${day} Part ${pIdx + 1} (${part.title}) output mismatch in sandbox`
      );
    }

    assert.ok(
      totalWords >= 2900,
      `Day ${day} total words ${totalWords} < 2900 words across 5 parts`
    );
  }
});

test('Block 6 (Days 26–30) Visuals: Gate v2 On-Disk Files, Zero Digits & SHA-256 Code Hash Binding', async () => {
  assert.equal(isCourseVisualsEnabled('node-web'), true, 'node-web must be enabled in CourseVisuals');

  clearDayFileCache();

  for (let day = 26; day <= 30; day++) {
    const dayStr = String(day).padStart(2, '0');
    const diskPath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/node-web/day-${dayStr}.json`);
    assert.ok(fs.existsSync(diskPath), `Visual file must exist on disk at ${diskPath}`);

    const raw = fs.readFileSync(diskPath, 'utf-8');
    const dayVisuals = JSON.parse(raw);
    assert.equal(dayVisuals.length, 5, `Day ${day} visual file must have exactly 5 parts`);

    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day)!;

    for (let pIdx = 0; pIdx < 5; pIdx++) {
      const v = dayVisuals[pIdx];
      assert.equal(v.schemaVersion, 2, `Day ${day} Part ${pIdx + 1} visual schemaVersion must be 2`);
      assert.equal(v.partIndex, pIdx + 1, `Day ${day} Part ${pIdx + 1} visual partIndex must be ${pIdx + 1}`);

      // Verify SHA-256 code hash binding
      const expectedCode = lesson.parts[pIdx].code;
      const expectedHash = crypto.createHash('sha256').update(expectedCode).digest('hex');
      assert.equal(v.codeHash, expectedHash, `Day ${day} Part ${pIdx + 1} codeHash must match lesson code`);

      // Verify captions invariants
      assert.ok(v.steps && v.steps.length >= 4, `Day ${day} Part ${pIdx + 1} visual must have >= 4 steps`);
      for (const s of v.steps) {
        assert.ok(!/\d/.test(s.caption), `Day ${day} Part ${pIdx + 1} step caption "${s.caption}" must have NO digits`);
        assert.ok(/\.$/.test(s.caption), `Day ${day} Part ${pIdx + 1} step caption "${s.caption}" must end with period`);
        assert.ok(s.caption.length <= 75, `Day ${day} Part ${pIdx + 1} step caption length ${s.caption.length} > 75`);
      }
    }
  }
});

test('Block 6 (Days 26–30) Configs: 30DayData & Days Alignment and Sandbox Execution', async () => {
  for (let day = 26; day <= 30; day++) {
    const cfg = NODE_WEB_30_DAYS_CONFIGS.find((c) => c.day === day);
    assert.ok(cfg, `Day ${day} must exist in NODE_WEB_30_DAYS_CONFIGS`);
    assert.ok(cfg.syllabus && cfg.syllabus.length >= 4, `Day ${day} syllabus in config must have >= 4 items`);

    const lesson = NODE_WEB_LONG_LESSONS.find((l) => l.day === day)!;
    assert.equal(cfg.title, lesson.title, `Day ${day} config title must match lesson title`);

    // Verify eHint + eTest in sandbox
    const eFull = `${cfg.eStarter.replace(/\n\s*return[^;]*;?\s*\}/, `\n${cfg.eHint}\n}`)}\n${cfg.eTest}`;
    await runLikeSandbox(eFull);

    // Verify aHint + aTest in sandbox
    const aFull = `${cfg.aStarter.replace(/\n\s*return[^;]*;?\s*\}/, `\n${cfg.aHint}\n}`)}\n${cfg.aTest}`;
    await runLikeSandbox(aFull);
  }
});

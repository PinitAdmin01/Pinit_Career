import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { checkDayFile, COURSE_ALLOWED_TEMPLATES } from '@/lib/visuals/gate';
import { getLongLesson } from '@/lib/data/longLessons';

function getValidBaseDayFile() {
  const lesson = getLongLesson('python', 1)!;
  return {
    schemaVersion: 1,
    prefix: 'python',
    day: 1,
    promptSha: '40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68',
    model: 'anthropic/claude-3.5-sonnet',
    entries: lesson.parts.map((part, i) => {
      const codeHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      if (i === 0) {
        return {
          partTitle: part.title,
          codeHash,
          spec: {
            template: 'flow',
            title: 'Language Pipeline',
            nodes: [
              { id: '1', label: 'Python', tappable: true },
              { id: '2', label: 'code', tappable: true },
            ],
            steps: [
              {
                at: 'say1',
                caption: 'Python helps you learn programming concepts.',
                values: { step: { var: 'x', line: 1 } },
              },
              {
                at: 'say2',
                caption: 'People use python to build useful projects.',
                values: { step: { var: 'x', line: 1 } },
              },
            ],
          },
          filled: { step: 1 },
        };
      }
      if (i === 1) {
        return {
          partTitle: part.title,
          codeHash,
          spec: {
            template: 'boxes',
            title: 'Output Screen',
            boxes: [{ id: '1', label: 'print', tappable: true }],
            steps: [
              {
                at: 'say1',
                caption: 'The print function displays results on screen.',
                values: { out: { out: 1 } },
              },
              {
                at: 'say2',
                caption: 'Every call shows information directly.',
                values: { out: { out: 1 } },
              },
            ],
          },
          filled: { out: 'hi' },
        };
      }
      if (i === 2) {
        return {
          partTitle: part.title,
          codeHash,
          spec: {
            template: 'cells',
            title: 'Line Execution',
            cells: [{ label: 'line' }],
            steps: [
              {
                at: 'say1',
                caption: 'Python reads your code one line at a time.',
                values: { l: { var: 'line', line: 1 } },
              },
              {
                at: 'say2',
                caption: 'Python stops when an error occurs on a line.',
                values: { l: { var: 'line', line: 2 } },
              },
            ],
          },
          filled: { l: 1 },
        };
      }
      return {
        partTitle: part.title,
        codeHash,
        spec: {
          template: 'none',
          reason: 'Plain concept without required visual diagram',
        },
        filled: {},
      };
    }),
  };
}

describe('Gate v2 (Task E-13)', () => {
  it('valid base sample passes all R1-R14 checks', () => {
    const valid = getValidBaseDayFile();
    const result = checkDayFile(valid);
    assert.deepEqual(result.errors, []);
    assert.equal(result.passed, true);
  });

  it('runs checkDayFile on all day files under src/lib/data/lessonVisuals/', () => {
    const dir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals');
    if (!fs.existsSync(dir)) return;

    function findJsonFiles(currentDir: string): string[] {
      const results: string[] = [];
      const list = fs.readdirSync(currentDir);
      for (const item of list) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (currentDir === dir && !(item in COURSE_ALLOWED_TEMPLATES)) {
            continue;
          }
          results.push(...findJsonFiles(fullPath));
        } else if (item.endsWith('.json')) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const CERT_24M_COURSES = new Set([
      // [FIX-STAGE: wave0-include-cyber-py] Enforce Gate v2 on cyber-py alongside the other 11 Python certification courses
      'python', 'dsa-py', 'sql-mastery', 'ai-py', 'dist-py', 'cloud-py', 'nlp-py', 'quant-py', 'prompt-py', 'cyber-py', 'train-py', 'vec-py', 'safe-py',
      'react-basics', 'node-web', 'dsa-optim', 'devops', 'cloud', 'dist', 'cyber', 'ai', 'sre-web', 'stream-web', 'aideploy-web'
    ]);

    const files = findJsonFiles(dir);
    for (const file of files) {
      const parts = file.split(/[\\/]/);
      const courseFolder = parts[parts.length - 2];
      if (!CERT_24M_COURSES.has(courseFolder)) continue;

      const res = checkDayFile(file);
      if (!res.passed) {
        throw new Error(`Day file ${file} failed gate checks: ${res.errors.join('\n')}`);
      }
      assert.equal(res.passed, true);
    }
  });

  describe('Deliberately broken samples (14 rules)', () => {
    it('R1: fails if entries count is not 6 or partTitle does not match', () => {
      const broken = getValidBaseDayFile();
      broken.entries[0].partTitle = 'Wrong Nonexistent Title';
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R1:')), `Expected R1 error in: ${res.errors}`);

      const brokenCount = getValidBaseDayFile();
      brokenCount.entries.pop();
      const resCount = checkDayFile(brokenCount);
      assert.equal(resCount.passed, false);
      assert.ok(resCount.errors.some((e) => e.startsWith('R1:')), `Expected R1 error in: ${resCount.errors}`);
    });

    it('R2: fails if template is not in course allowed list', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).template = 'stack-queue';
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R2:')), `Expected R2 error in: ${res.errors}`);
    });

    it('R3: fails if shape count > 6 or steps count < 2 or > 5', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).nodes = [
        { id: '1', label: 'Python' },
        { id: '2', label: 'code' },
        { id: '3', label: 'n3' },
        { id: '4', label: 'n4' },
        { id: '5', label: 'n5' },
        { id: '6', label: 'n6' },
        { id: '7', label: 'n7' },
      ];
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R3:')), `Expected R3 error in: ${res.errors}`);
    });

    it('R4: fails if at values are invalid or not strictly increasing', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).steps[0].at = 'say99';
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R4:')), `Expected R4 error in: ${res.errors}`);

      const brokenOrder = getValidBaseDayFile();
      (brokenOrder.entries[0].spec as any).steps[1].at = 'say1';
      const resOrder = checkDayFile(brokenOrder);
      assert.equal(resOrder.passed, false);
      assert.ok(resOrder.errors.some((e) => e.startsWith('R4:')), `Expected R4 error in: ${resOrder.errors}`);
    });

    it('R5: fails if caption exceeds 80 chars, lacks period, or has emoji', () => {
      const brokenPeriod = getValidBaseDayFile();
      (brokenPeriod.entries[0].spec as any).steps[0].caption = 'No period at the end';
      const resPeriod = checkDayFile(brokenPeriod);
      assert.equal(resPeriod.passed, false);
      assert.ok(resPeriod.errors.some((e) => e.startsWith('R5:')), `Expected R5 error in: ${resPeriod.errors}`);

      const brokenEmoji = getValidBaseDayFile();
      (brokenEmoji.entries[0].spec as any).steps[0].caption = 'Python is amazing! 🚀.';
      const resEmoji = checkDayFile(brokenEmoji);
      assert.equal(resEmoji.passed, false);
      assert.ok(resEmoji.errors.some((e) => e.startsWith('R5:')), `Expected R5 error in: ${resEmoji.errors}`);

      const brokenLength = getValidBaseDayFile();
      (brokenLength.entries[0].spec as any).steps[0].caption =
        'This is an excessively long caption intended to exceed the strict eighty character limit.'.padEnd(
          90,
          'x'
        ) + '.';
      const resLength = checkDayFile(brokenLength);
      assert.equal(resLength.passed, false);
      assert.ok(resLength.errors.some((e) => e.startsWith('R5:')), `Expected R5 error in: ${resLength.errors}`);
    });

    it('R6: fails if values are not bindings or text bindings do not appear in part', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).steps[0].values = { invalidVal: 12345 };
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R6:')), `Expected R6 error in: ${res.errors}`);

      const brokenText = getValidBaseDayFile();
      (brokenText.entries[0].spec as any).steps[0].values = {
        tb: { text: 'completely fabricated text string that does not appear anywhere' },
      };
      const resText = checkDayFile(brokenText);
      assert.equal(resText.passed, false);
      assert.ok(resText.errors.some((e) => e.startsWith('R6:')), `Expected R6 error in: ${resText.errors}`);
    });

    it('R7: fails if numbers in caption are not in code or bound values', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).steps[0].caption = 'Python processes 987654 items quickly.';
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R7:')), `Expected R7 error in: ${res.errors}`);
    });

    it('R8: fails if tappable labels do not appear in part text or code', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).nodes[0].label = 'NonExistentZyzLabel';
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R8:')), `Expected R8 error in: ${res.errors}`);
    });

    it('R9: fails if tones are invalid', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).steps[0].tones = { step: 'neon-purple' };
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R9:')), `Expected R9 error in: ${res.errors}`);
    });

    it('R10: fails if fewer than 3 pictures in day and status not needs-review', () => {
      const broken = getValidBaseDayFile();
      for (const entry of broken.entries) {
        entry.spec = { template: 'none', reason: 'No picture' } as any;
      }
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R10:')), `Expected R10 error in: ${res.errors}`);
    });

    it('R11: fails if manifest status does not match file', () => {
      const broken = getValidBaseDayFile();
      const mockManifest = {
        keys: {
          'python:1:0': { status: 'corrupted-status' },
        },
      };
      const res = checkDayFile(broken, { manifest: mockManifest });
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R11:')), `Expected R11 error in: ${res.errors}`);
    });

    it('R12: fails if caption shares no 4+ letter word with attached text', () => {
      const broken = getValidBaseDayFile();
      (broken.entries[0].spec as any).steps[0].caption = 'Frogs jump across muddy ponds.';
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R12:')), `Expected R12 error in: ${res.errors}`);
    });

    it('R13: fails if codeHash does not match SHA-256 of part code', () => {
      const broken = getValidBaseDayFile();
      broken.entries[0].codeHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
      const res = checkDayFile(broken);
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R13:')), `Expected R13 error in: ${res.errors}`);
    });

    it('R14: fails if binding points to an unstable variable', () => {
      const broken = getValidBaseDayFile();
      const res = checkDayFile(broken, { unstableVars: ['x'] });
      assert.equal(res.passed, false);
      assert.ok(res.errors.some((e) => e.startsWith('R14:')), `Expected R14 error in: ${res.errors}`);
    });

    it('R2: web course templates (react-basics, node-web, devops, cloud) are properly allowed', () => {
      const { COURSE_ALLOWED_TEMPLATES } = require('@/lib/visuals/gate');
      assert.ok(COURSE_ALLOWED_TEMPLATES['react-basics'].includes('component-tree'));
      assert.ok(COURSE_ALLOWED_TEMPLATES['react-basics'].includes('wireframe'));
      assert.ok(COURSE_ALLOWED_TEMPLATES['node-web'].includes('sequence'));
      assert.ok(COURSE_ALLOWED_TEMPLATES.devops.includes('workflow'));
      assert.ok(COURSE_ALLOWED_TEMPLATES.cloud.includes('workflow'));
      assert.ok(COURSE_ALLOWED_TEMPLATES['aideploy-web'].includes('workflow'));
    });

    it('Hardened guards: R3 rejects missing nodes/boxes arrays, R5 rejects synthetic captions & [Done.*], visualRules does not crash', () => {
      const { getTappableLabelsForVisual } = require('@/lib/visuals/visualRules');
      // 1. visualRules must not throw on malformed boxes/flow visuals lacking arrays
      assert.deepEqual(
        getTappableLabelsForVisual({ template: 'boxes', title: 'Malformed Boxes', steps: [] } as any),
        []
      );
      assert.deepEqual(
        getTappableLabelsForVisual({ template: 'flow', title: 'Malformed Flow', steps: [] } as any),
        []
      );

      // 2. R3 rejects boxes missing boxes array
      const missingBoxes = getValidBaseDayFile();
      missingBoxes.entries[0].spec = {
        template: 'boxes',
        title: 'Broken Boxes Spec',
        steps: (missingBoxes.entries[0].spec as any).steps,
      };
      const resBoxes = checkDayFile(missingBoxes);
      assert.equal(resBoxes.passed, false);
      assert.ok(resBoxes.errors.some((e) => e.includes('R3:') && e.includes('boxes is missing')));

      // 3. R5 rejects synthetic baseline captions and [Done.*] tokens
      const synthetic = getValidBaseDayFile();
      (synthetic.entries[0].spec as any).steps[0].caption =
        'The welcome concept establishes the core structural baseline.';
      const resSynth = checkDayFile(synthetic);
      assert.equal(resSynth.passed, false);
      assert.ok(resSynth.errors.some((e) => e.includes('R5:') && e.includes('synthetic placeholder')));

      const doneToken = getValidBaseDayFile();
      (doneToken.entries[0].spec as any).steps[0].caption =
        'Execute transformation in Python [Done.Pone.Sone].';
      const resDone = checkDayFile(doneToken);
      assert.equal(resDone.passed, false);
      assert.ok(resDone.errors.some((e) => e.includes('R5:') && e.includes('[Done.*]')));
    });
  });
});


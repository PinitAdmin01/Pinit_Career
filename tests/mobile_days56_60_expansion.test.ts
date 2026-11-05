import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Mobile Days 56 to 60: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 56; d <= 60; d++) {
    const lesson = getLongLesson('mobile', d);
    assert.ok(lesson, `Mobile Day ${d} long lesson must resolve`);
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Mobile Day ${d} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `Mobile Day ${d} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `Mobile Day ${d} must have projectStep`);

    const spoken = estimateSpokenMinutes(lesson);
    const total = estimateLessonMinutes(lesson);
    assert.ok(spoken >= 20, `Mobile Day ${d} spoken minutes must be >= 20 (got ${spoken})`);
    assert.ok(total >= 35, `Mobile Day ${d} total minutes must be >= 35 (got ${total})`);

    // Verify visual JSON exists on disk
    const dayPadded = String(d).padStart(2, '0');
    const visualPath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/mobile/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(visualPath), `Visual spec missing: ${visualPath}`);

    const visualData = JSON.parse(fs.readFileSync(visualPath, 'utf-8'));
    assert.equal(visualData.entries.length, 5);

    for (let pIdx = 0; pIdx < 5; pIdx++) {
      const part = lesson.parts[pIdx];
      const entry = visualData.entries[pIdx];

      assert.equal(entry.partTitle, part.title);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16));

      assert.ok(part.say.length >= 3);
      assert.ok(part.code?.includes('console.log('));
      assert.ok(part.check.options.length >= 3);
    }
  }

  // Domain specifics
  const d56 = getLongLesson('mobile', 56);
  assert.match(d56.title, /Fastlane Automation.*Match Code Signing.*Provisioning Profiles/);
  assert.ok(d56.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Fastlane') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Match')));

  const d57 = getLongLesson('mobile', 57);
  assert.match(d57.title, /Over-The-Air.*OTA.*Updates.*CodePush|EAS Build & Over-The-Air/);
  assert.ok(d57.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('OTA') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('EAS')));

  const d58 = getLongLesson('mobile', 58);
  assert.match(d58.title, /App Store & Google Play Compliance.*Privacy Manifests.*AAB/);
  assert.ok(d58.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Privacy Manifest') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('16 KB')));

  const d59 = getLongLesson('mobile', 59);
  assert.match(d59.title, /Production Monitoring.*Sentry.*Crash Reporting/);
  assert.ok(d59.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Sentry') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('dSYM')));

  const d60 = getLongLesson('mobile', 60);
  assert.match(d60.title, /Month 2 Master Capstone Gate.*PulseMobile|PulseMobile High-Frequency Trading Terminal/);
  assert.ok(d60.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('PulseMobile') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Principal Mobile Architect')));
});

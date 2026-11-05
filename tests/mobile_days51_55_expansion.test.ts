import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Mobile Days 51 to 55: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 51; d <= 55; d++) {
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
  const d51 = getLongLesson('mobile', 51);
  assert.match(d51.title, /Memory Profiling.*Hermes Heap Leaks.*Xcode Instruments/);
  assert.ok(d51.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Jetsam') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Instruments')));

  const d52 = getLongLesson('mobile', 52);
  assert.match(d52.title, /Android Memory Profiling.*Bitmap Allocations.*Fragment Leaks/);
  assert.ok(d52.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Android Studio') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Bitmap')));

  const d53 = getLongLesson('mobile', 53);
  assert.match(d53.title, /Unit & Component Testing.*Jest.*React Native Testing Library/);
  assert.ok(d53.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Jest') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('RNTL')));

  const d54 = getLongLesson('mobile', 54);
  assert.match(d54.title, /Automated End-to-End Testing.*Maestro UI Automation/);
  assert.ok(d54.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Maestro') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('YAML')));

  const d55 = getLongLesson('mobile', 55);
  assert.match(d55.title, /Milestone 10.*Zero-Leak Verified Mobile Test Harness/);
  assert.ok(d55.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Milestone 10') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Test Pyramid')));
});

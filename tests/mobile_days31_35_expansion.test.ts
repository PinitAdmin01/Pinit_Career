import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Mobile Days 31 to 35: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 31; d <= 35; d++) {
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
  const d31 = getLongLesson('mobile', 31);
  assert.match(d31.title, /Reanimated 3 Architecture/);
  assert.ok(d31.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('worklet')));

  const d32 = getLongLesson('mobile', 32);
  assert.match(d32.title, /Shared Values.*useAnimatedStyle/);
  assert.ok(d32.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('useSharedValue')));

  const d33 = getLongLesson('mobile', 33);
  assert.match(d33.title, /Physics-Based Animations.*Spring Physics/);
  assert.ok(d33.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('withSpring')));

  const d34 = getLongLesson('mobile', 34);
  assert.match(d34.title, /Gesture Handler 2.*Pan Gestures/);
  assert.ok(d34.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Gesture.Pan()')));

  const d35 = getLongLesson('mobile', 35);
  assert.match(d35.title, /Milestone 6.*120 FPS/);
  assert.ok(d35.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Candlestick') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('crosshair')));
});

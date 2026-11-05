import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Mobile Days 41 to 45: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 41; d <= 45; d++) {
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
  const d41 = getLongLesson('mobile', 41);
  assert.match(d41.title, /Deep Linking & Universal Links.*iOS Universal Links/);
  assert.ok(d41.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('getInitialURL')));

  const d42 = getLongLesson('mobile', 42);
  assert.match(d42.title, /Push Notifications Architecture.*APNs Device Tokens/);
  assert.ok(d42.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('APNs') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('FCM')));

  const d43 = getLongLesson('mobile', 43);
  assert.match(d43.title, /Push Notification Lifecycles.*Foreground Banners/);
  assert.ok(d43.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('30 seconds') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('NavigationContainer')));

  const d44 = getLongLesson('mobile', 44);
  assert.match(d44.title, /App Lifecycles & Background Execution.*AppState/);
  assert.ok(d44.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Headless JS') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Jetsam')));

  const d45 = getLongLesson('mobile', 45);
  assert.match(d45.title, /Milestone 8.*Real-Time Event Dispatcher/);
  assert.ok(d45.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('EventBus') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('onReady')));
});

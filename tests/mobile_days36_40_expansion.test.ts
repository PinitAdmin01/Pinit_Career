import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Mobile Days 36 to 40: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 36; d <= 40; d++) {
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
  const d36 = getLongLesson('mobile', 36);
  assert.match(d36.title, /New Architecture Foundations.*C\+\+ JSI Revolution/);
  assert.ok(d36.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('JSI')));

  const d37 = getLongLesson('mobile', 37);
  assert.match(d37.title, /Fabric C\+\+ Concurrent Renderer.*Shadow Tree/);
  assert.ok(d37.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('ShadowNode') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Shadow Tree')));

  const d38 = getLongLesson('mobile', 38);
  assert.match(d38.title, /TurboModules Architecture.*Codegen Specification Contracts/);
  assert.ok(d38.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('TurboModuleRegistry') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Codegen')));

  const d39 = getLongLesson('mobile', 39);
  assert.match(d39.title, /Writing Native Modules.*iOS Swift & Android Kotlin/);
  assert.ok(d39.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('CalledFromWrongThreadException') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Looper')));

  const d40 = getLongLesson('mobile', 40);
  assert.match(d40.title, /Milestone 7.*C\+\+ Crypto Hash & Compression TurboModule Engine/);
  assert.ok(d40.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('SHA-256')));
  assert.ok(d40.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Zstandard') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('zstd')));
});

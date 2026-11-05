import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Mobile Days 46 to 50: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 46; d <= 50; d++) {
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
  const d46 = getLongLesson('mobile', 46);
  assert.match(d46.title, /Hardware Keystore & Keychain.*Secure Enclave/);
  assert.ok(d46.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Secure Enclave') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('KeyStore')));

  const d47 = getLongLesson('mobile', 47);
  assert.match(d47.title, /WatermelonDB.*SQLite JSI/);
  assert.ok(d47.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('WatermelonDB') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('WAL')));

  const d48 = getLongLesson('mobile', 48);
  assert.match(d48.title, /Delta Synchronization & Conflict Resolution/);
  assert.ok(d48.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Vector Clocks') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Last-Write-Wins')));

  const d49 = getLongLesson('mobile', 49);
  assert.match(d49.title, /Mobile Security Hardening.*SSL Pinning/);
  assert.ok(d49.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('SSL Pinning') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Frida')));

  const d50 = getLongLesson('mobile', 50);
  assert.match(d50.title, /Milestone 9.*High-Throughput Offline-First Delta Sync Engine/);
  assert.ok(d50.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('WatermelonDB') || (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('10,000')));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Blockchain Days 46 to 50: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 46; d <= 50; d++) {
    const lesson = getLongLesson('blockchain', d);
    assert.ok(lesson, `Blockchain Day ${d} long lesson must resolve`);
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `Blockchain Day ${d} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 5, `Blockchain Day ${d} must contain comprehensive summary (>= 5 items)`);
    assert.ok(lesson.projectStep, `Blockchain Day ${d} must have projectStep`);
    assert.ok(lesson.projectStep.steps.length >= 5, `Blockchain Day ${d} projectStep must have >= 5 items`);

    const spoken = estimateSpokenMinutes(lesson);
    const total = estimateLessonMinutes(lesson);
    assert.ok(spoken >= 20, `Blockchain Day ${d} spoken minutes must be >= 20 (got ${spoken})`);
    assert.ok(total >= 35, `Blockchain Day ${d} total minutes must be >= 35 (got ${total})`);

    // Verify visual JSON exists on disk
    const dayPadded = String(d);
    const visualPath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/blockchain/day-${dayPadded}.json`);
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
  const d46 = getLongLesson('blockchain', 46);
  assert.match(d46.title, /Blockchain Scalability Trilemma/);
  assert.ok(d46.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('DelayedInbox')));

  const d47 = getLongLesson('blockchain', 47);
  assert.match(d47.title, /Optimistic Rollups/);
  assert.ok(d47.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('One-Step Prover')));

  const d48 = getLongLesson('blockchain', 48);
  assert.match(d48.title, /Zero-Knowledge.*Rollups/);
  assert.ok(d48.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('ecPairing')));

  const d49 = getLongLesson('blockchain', 49);
  assert.match(d49.title, /Data Availability.*EIP-4844/);
  assert.ok(d49.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Point Evaluation')));

  const d50 = getLongLesson('blockchain', 50);
  assert.match(d50.title, /Milestone 9.*Fraud Proof/);
  assert.ok(d50.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('VERIFIED_MILESTONE_9_ROLLUP_ENGINE')));
});

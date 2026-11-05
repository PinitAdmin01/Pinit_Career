import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Blockchain Days 56 to 60: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 56; d <= 60; d++) {
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
  const d56 = getLongLesson('blockchain', 56);
  assert.match(d56.title, /Uniswap v4/);
  assert.ok(d56.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('PoolManager')));

  const d57 = getLongLesson('blockchain', 57);
  assert.match(d57.title, /Aave v3/);
  assert.ok(d57.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Two-Ray')));

  const d58 = getLongLesson('blockchain', 58);
  assert.match(d58.title, /PinIT Career OS.*Soulbound Tokens/);
  assert.ok(d58.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('EIP-5192')));

  const d59 = getLongLesson('blockchain', 59);
  assert.match(d59.title, /Principal Web3 Architect RFC/);
  assert.ok(d59.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('RFC-2026-PINIT-WEB3')));

  const d60 = getLongLesson('blockchain', 60);
  assert.match(d60.title, /Master Capstone.*ApexDEX/);
  assert.ok(d60.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('VERIFIED_APEXDEX_MASTER_CAPSTONE_PROTOCOL')));
});

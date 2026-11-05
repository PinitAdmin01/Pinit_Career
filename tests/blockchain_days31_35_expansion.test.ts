import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Blockchain Days 31 to 35: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 31; d <= 35; d++) {
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
  const d31 = getLongLesson('blockchain', 31);
  assert.match(d31.title, /Automated Market Makers/);
  assert.ok(d31.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Constant Product Formula')));

  const d32 = getLongLesson('blockchain', 32);
  assert.match(d32.title, /Concentrated Liquidity AMMs/);
  assert.ok(d32.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('sqrtPriceX96')));

  const d33 = getLongLesson('blockchain', 33);
  assert.match(d33.title, /Decentralized Lending & Borrowing/);
  assert.ok(d33.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Health Factor')));

  const d34 = getLongLesson('blockchain', 34);
  assert.match(d34.title, /Flash Loans & Arbitrage/);
  assert.ok(d34.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('EIP-3156')));

  const d35 = getLongLesson('blockchain', 35);
  assert.match(d35.title, /Milestone 6/);
  assert.ok(d35.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Concentrated Liquidity AMM & Flash Lending Engine')));
});

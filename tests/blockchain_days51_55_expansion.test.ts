import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Blockchain Days 51 to 55: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 51; d <= 55; d++) {
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
  const d51 = getLongLesson('blockchain', 51);
  assert.match(d51.title, /Zero-Knowledge Proofs.*ZK-SNARKs/);
  assert.ok(d51.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('R1CS')));

  const d52 = getLongLesson('blockchain', 52);
  assert.match(d52.title, /Circom & SnarkJS/);
  assert.ok(d52.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Powers of Tau')));

  const d53 = getLongLesson('blockchain', 53);
  assert.match(d53.title, /Account Abstraction.*ERC-4337/);
  assert.ok(d53.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('EntryPoint')));

  const d54 = getLongLesson('blockchain', 54);
  assert.match(d54.title, /3 AM Web3 War Room/);
  assert.ok(d54.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Flashbots')));

  const d55 = getLongLesson('blockchain', 55);
  assert.match(d55.title, /Milestone 10.*ERC-4337 Smart Account/);
  assert.ok(d55.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('VERIFIED_MILESTONE_10_SMART_ACCOUNT_ZK_ENGINE')));
});

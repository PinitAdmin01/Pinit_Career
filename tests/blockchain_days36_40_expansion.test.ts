import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Blockchain Days 36 to 40: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 36; d <= 40; d++) {
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
  const d36 = getLongLesson('blockchain', 36);
  assert.match(d36.title, /Price Oracle Architectures/);
  assert.ok(d36.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('AggregatorV3Interface')));

  const d37 = getLongLesson('blockchain', 37);
  assert.match(d37.title, /Oracle Manipulation Attacks/);
  assert.ok(d37.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Oracle Manipulation')));

  const d38 = getLongLesson('blockchain', 38);
  assert.match(d38.title, /Cross-Chain Bridges/);
  assert.ok(d38.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Ronin Bridge Hack')));

  const d39 = getLongLesson('blockchain', 39);
  assert.match(d39.title, /Cross-Chain Protocols.*CCIP.*LayerZero/);
  assert.ok(d39.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('messageId')));

  const d40 = getLongLesson('blockchain', 40);
  assert.match(d40.title, /Milestone 7/);
  assert.ok(d40.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('Multi-Oracle Aggregator & Cross-Chain Bridge Engine')));
});

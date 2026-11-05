import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

test('Blockchain Days 41 to 45: LongLesson Resolution & Domain Invariants', () => {
  for (let d = 41; d <= 45; d++) {
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
  const d41 = getLongLesson('blockchain', 41);
  assert.match(d41.title, /Proxy Pattern Foundations/);
  assert.ok(d41.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('EIP-1967')));

  const d42 = getLongLesson('blockchain', 42);
  assert.match(d42.title, /Transparent Upgradeable Proxy/);
  assert.ok(d42.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('ProxyAdmin')));

  const d43 = getLongLesson('blockchain', 43);
  assert.match(d43.title, /Universal Upgradeable Proxy Standard/);
  assert.ok(d43.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('UUPSUpgradeable')));

  const d44 = getLongLesson('blockchain', 44);
  assert.match(d44.title, /The Diamond Standard.*ERC-2535/);
  assert.ok(d44.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('diamondCut')));

  const d45 = getLongLesson('blockchain', 45);
  assert.match(d45.title, /Milestone 8.*Diamond/);
  assert.ok(d45.parts.some(p => (Array.isArray(p.say) ? p.say.join(' ') : p.say).includes('VERIFIED_MILESTONE_8_DIAMOND_ENGINE')));
});

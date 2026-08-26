/**
 * Runtime Binding Regression Test
 *
 * Guards against the FATAL class of defect found by the Stage 0 content-qa
 * harness: a course silently rendering ANOTHER course's curriculum because
 * course identity was inferred by substring search instead of exact match.
 *
 * Root cause (fixed in src/lib/data/curriculumEnricher.ts):
 *   'blockchain'.includes('ai') === true (the "ai" inside "ch-AI-n"), and the
 *   generic `ai` branch was checked before the `blockchain` branch in a 36-way
 *   if/else chain — so EVERY Blockchain quest, for all 30 days, was served
 *   AI_PILOT_DAYS content instead of BLOCKCHAIN_PILOT_DAYS content. The exact
 *   same chain was independently duplicated in src/app/quests/lesson/page.tsx
 *   and had the identical collision.
 *
 * IoT Security had a second, distinct bug in the same lines: `(source as
 * any)[dayNum]` indexed a 0-based array as if it were keyed by the 1-based
 * `day` field, silently shifting Days 1-29 forward by one.
 *
 * This test exercises the ACTUAL production functions — parseQuestId() and
 * resolvePilotDay() from curriculumEnricher.ts — not a re-implementation, so
 * it fails if either dispatch site drifts from the shared resolver again.
 *
 * Run:  node scripts/runtime-binding.test.js
 */

import { parseQuestId, resolvePilotDay } from '../src/lib/data/curriculumEnricher';
import { BLOCKCHAIN_PILOT_DAYS } from '../src/lib/data/blockchainPilotDays';
import { IOT_SECURITY_PILOT_DAYS } from '../src/lib/data/iotSecurityPilotDays';
import { AI_PILOT_DAYS } from '../src/lib/data/aiPilotDays';
import { CYBER_PILOT_DAYS } from '../src/lib/data/cybersecurityPilotDays';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

let failures = 0;
let passed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
  } else {
    failures++;
    console.error(`  FAIL: ${message}`);
  }
}

function ok(message: string): void {
  passed++;
  console.log(`  ok:   ${message}`);
}

/** All misconception IDs actually used in a day's blocks. */
function misconceptionIdsForDay(day: any): string[] {
  return (day?.blocks ?? [])
    .map((b: any) => b?.diagnosticCheck?.primaryMisconceptionId)
    .filter(Boolean);
}

/** All block titles in a day, plus the day title itself. */
function allTitlesForDay(day: any): string[] {
  return [day?.title ?? '', ...(day?.blocks ?? []).map((b: any) => b?.title ?? '')];
}

// ── 1. Direct resolver test: exact prefix + day → exact expected source ────
//
// This is the core regression guard. It calls the SAME function both
// production dispatch sites now share.

console.log('\n[1] resolvePilotDay() — exact source per (prefix, day)\n');

const blockchainDay1 = resolvePilotDay('blockchain', 1);
const blockchainDay2 = resolvePilotDay('blockchain', 2);
const iotSecDay1 = resolvePilotDay('iot_sec', 1);
const iotSecDay2 = resolvePilotDay('iot_sec', 2);

const expectedBlockchainDay1 = BLOCKCHAIN_PILOT_DAYS.find((d) => d.day === 1)!;
const expectedBlockchainDay2 = BLOCKCHAIN_PILOT_DAYS.find((d) => d.day === 2)!;
const expectedIotSecDay1 = IOT_SECURITY_PILOT_DAYS.find((d) => d.day === 1)!;
const expectedIotSecDay2 = IOT_SECURITY_PILOT_DAYS.find((d) => d.day === 2)!;

assert(blockchainDay1?.title === expectedBlockchainDay1.title,
  `Blockchain Day 1 title === BLOCKCHAIN_PILOT_DAYS[day=1].title (got "${blockchainDay1?.title}")`);
assert(blockchainDay2?.title === expectedBlockchainDay2.title,
  `Blockchain Day 2 title === BLOCKCHAIN_PILOT_DAYS[day=2].title (got "${blockchainDay2?.title}")`);
assert(iotSecDay1?.title === expectedIotSecDay1.title,
  `IoT Security Day 1 title === IOT_SECURITY_PILOT_DAYS[day=1].title (got "${iotSecDay1?.title}")`);
assert(iotSecDay2?.title === expectedIotSecDay2.title,
  `IoT Security Day 2 title === IOT_SECURITY_PILOT_DAYS[day=2].title (got "${iotSecDay2?.title}")`);

if (failures === 0) ok('all 4 (course, day) pairs resolve to their own authoritative source');

// ── 2. Negative control: prove the OLD bug is actually gone, not coincidence ─
//
// If these ever start passing, the collision has come back.

console.log('\n[2] Negative control — the historical wrong answers must NOT reappear\n');

assert(blockchainDay1?.title !== AI_PILOT_DAYS.find((d) => d.day === 1)?.title,
  'Blockchain Day 1 no longer equals AI_PILOT_DAYS Day 1 ("Generative AI Foundations...")');
assert(iotSecDay1?.title !== expectedIotSecDay2.title,
  'IoT Security Day 1 no longer equals its own Day 2 (the [dayNum] off-by-one)');

if (blockchainDay1?.title !== AI_PILOT_DAYS.find((d) => d.day === 1)?.title &&
    iotSecDay1?.title !== expectedIotSecDay2.title) {
  ok('neither historical failure mode reproduces');
}

// ── 3. Cross-contamination sweep — ID and title vocabulary must not leak ───

console.log('\n[3] Cross-contamination — no foreign course IDs/titles in either course\n');

function assertNoForeignVocabulary(
  label: string,
  day: any,
  forbiddenIdPrefixes: string[],
  forbiddenTitleSubstrings: string[],
): void {
  const ids = misconceptionIdsForDay(day);
  const titles = allTitlesForDay(day).join(' | ').toLowerCase();

  for (const prefix of forbiddenIdPrefixes) {
    const leaked = ids.filter((id: string) => id.startsWith(prefix));
    assert(leaked.length === 0,
      `${label}: no misconception IDs starting with "${prefix}" (found: ${leaked.join(', ') || 'none'})`);
  }
  for (const substr of forbiddenTitleSubstrings) {
    assert(!titles.includes(substr.toLowerCase()),
      `${label}: no title/block-title containing "${substr}"`);
  }
}

assertNoForeignVocabulary(
  'Blockchain Day 1',
  blockchainDay1,
  ['MC_CYBER_', 'MC_AI_', 'MC_IOTSEC_'],
  ['Generative AI', 'Transformer Self-Attention', 'IoT Security', 'Root of Trust'],
);
assertNoForeignVocabulary(
  'Blockchain Day 2',
  blockchainDay2,
  ['MC_CYBER_', 'MC_AI_', 'MC_IOTSEC_'],
  ['Generative AI', 'Tokenization', 'IoT Security'],
);
assertNoForeignVocabulary(
  'IoT Security Day 1',
  iotSecDay1,
  ['MC_CHAIN_', 'MC_AI_'],
  ['Blockchain Fundamentals', 'Distributed Ledgers', 'Generative AI', 'Smart Contract'],
);
assertNoForeignVocabulary(
  'IoT Security Day 2',
  iotSecDay2,
  ['MC_CHAIN_', 'MC_AI_'],
  ['Blockchain', 'Merkle Tree', 'Generative AI'],
);

// Positive control: each course's OWN vocabulary must actually be present —
// otherwise an empty/broken source would trivially "pass" the negative checks above.
// (Blockchain's real taxonomy prefix is MC_CHAIN_, e.g. MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING.)
assert(misconceptionIdsForDay(blockchainDay1).some((id: string) => id.startsWith('MC_CHAIN_')),
  'Blockchain Day 1 DOES contain its own MC_CHAIN_* misconception IDs (positive control)');
assert(misconceptionIdsForDay(iotSecDay1).length > 0,
  'IoT Security Day 1 DOES contain misconception IDs at all (positive control)');

// ── 4. End-to-end via real quest IDs — exercises parseQuestId() too ────────

console.log('\n[4] parseQuestId() → resolvePilotDay() — full production path\n');

const e2eCases: Array<{ questId: string; expectedTitle: string }> = [
  { questId: 'blockchain-lecture1-day-1', expectedTitle: expectedBlockchainDay1.title },
  { questId: 'blockchain-lecture1-day-2', expectedTitle: expectedBlockchainDay2.title },
  { questId: 'iot_sec-lecture1-day-1', expectedTitle: expectedIotSecDay1.title },
  { questId: 'iot_sec-lecture1-day-2', expectedTitle: expectedIotSecDay2.title },
  { questId: 'blockchain-exam-day-5', expectedTitle: BLOCKCHAIN_PILOT_DAYS.find((d) => d.day === 5)!.title },
  { questId: 'iot_sec-assign-day-7', expectedTitle: IOT_SECURITY_PILOT_DAYS.find((d) => d.day === 7)!.title },
];

for (const { questId, expectedTitle } of e2eCases) {
  const parsed = parseQuestId(questId);
  const day = parsed ? resolvePilotDay(parsed.prefix, parsed.dayNum) : null;
  assert(day?.title === expectedTitle,
    `${questId} → "${day?.title}" (expected "${expectedTitle}")`);
}

// ── 5. COURSES_REGISTRY — the baked data students actually receive ────────
//
// curriculumEnricher.buildEnrichedDayQuests() runs at module import time and
// bakes title/desc/syllabus into COURSES_REGISTRY.quests permanently. This
// checks the ACTUAL exported registry, not just the resolver in isolation —
// closing the loop on the layer that was silently wrong even before a student
// opened the lesson page.

console.log('\n[5] COURSES_REGISTRY — baked quest data matches the authoritative source\n');

const blockchainCourse = COURSES_REGISTRY.find((c) => c.id === 'course-blockchain-web3');
const iotSecCourse = COURSES_REGISTRY.find((c) => c.id === 'course-iot-security');

assert(!!blockchainCourse, 'course-blockchain-web3 exists in COURSES_REGISTRY');
assert(!!iotSecCourse, 'course-iot-security exists in COURSES_REGISTRY');

const blockchainLecture1 = blockchainCourse?.quests.find((q) => q.id === 'blockchain-lecture1-day-1');
const iotSecLecture1 = iotSecCourse?.quests.find((q) => q.id === 'iot_sec-lecture1-day-1');

assert(blockchainLecture1?.title === `Day 1: ${expectedBlockchainDay1.title}`,
  `COURSES_REGISTRY blockchain Day 1 quest title is baked correctly (got "${blockchainLecture1?.title}")`);
assert(iotSecLecture1?.title === `Day 1: ${expectedIotSecDay1.title}`,
  `COURSES_REGISTRY iot-security Day 1 quest title is baked correctly (got "${iotSecLecture1?.title}")`);
assert(!(blockchainLecture1?.title || '').includes('Generative AI'),
  'COURSES_REGISTRY blockchain Day 1 quest title does not contain "Generative AI"');
assert(!(iotSecLecture1?.title || '').includes('Symmetric Encryption'),
  `COURSES_REGISTRY iot-security Day 1 quest title does not contain Day 2's "Symmetric Encryption" (off-by-one)`);

// ── Summary ─────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(70));
console.log(`Runtime binding test: ${passed} passed, ${failures} failed`);
if (failures > 0) {
  console.log('FAIL');
  process.exitCode = 1;
} else {
  console.log('PASS');
}

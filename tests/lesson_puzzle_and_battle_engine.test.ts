import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateLessonPuzzle,
  generateRapidFireBattle,
  detectCourseDomain,
  extractLessonConceptSummary,
} from '../src/lib/puzzles/lessonPuzzleEngine';
import { LONG_LESSON_SOURCES, getLongLesson } from '../src/lib/data/longLessons';

const sampleTracks = [
  { prefix: 'py', day: 1, expectedDomain: 'python' },
  { prefix: 'py', day: 4, expectedDomain: 'python' },
  { prefix: 'py', day: 12, expectedDomain: 'python' },
  { prefix: 'react', day: 5, expectedDomain: 'react' },
  { prefix: 'sql', day: 3, expectedDomain: 'sql' },
  { prefix: 'java', day: 1, expectedDomain: 'java' },
  { prefix: 'bcom_acc', day: 1, expectedDomain: 'accounting' },
  { prefix: 'bcom_fin', day: 5, expectedDomain: 'finance' },
  { prefix: 'bcom_ban', day: 10, expectedDomain: 'banking' },
  { prefix: 'bcom_aud', day: 8, expectedDomain: 'auditing' },
  { prefix: 'bcom_tax', day: 15, expectedDomain: 'taxation' },
  { prefix: 'bcom_law', day: 20, expectedDomain: 'corporate-law' },
  { prefix: 'bcom_ops', day: 12, expectedDomain: 'supply-chain' },
  { prefix: 'bcom_dmkt', day: 7, expectedDomain: 'digital-marketing' },
  { prefix: 'bcom_ecom', day: 14, expectedDomain: 'ecommerce' },
  { prefix: 'devops', day: 6, expectedDomain: 'devops-cloud' },
  { prefix: 'iot', day: 2, expectedDomain: 'embedded-iot' },
  { prefix: 'blockchain', day: 11, expectedDomain: 'blockchain' },
  { prefix: 'cyber', day: 9, expectedDomain: 'cybersecurity' },
  { prefix: 'node', day: 4, expectedDomain: 'nodejs' },
  { prefix: 'git', day: 3, expectedDomain: 'git-vcs' },
];

test('correctly classifies domain for every key track prefix', () => {
  for (const track of sampleTracks) {
    const domain = detectCourseDomain(track.prefix, `Day ${track.day} Lesson`);
    assert.equal(domain, track.expectedDomain);
  }
});

test('generates a structurally robust 3D puzzle and 60s battle for every sample track', () => {
  for (const track of sampleTracks) {
    const longLesson = getLongLesson(track.prefix, track.day);
    const puzzle = generateLessonPuzzle(`quest-${track.prefix}-${track.day}`, track.prefix, track.day, longLesson);

    assert.ok(puzzle.id);
    assert.ok(puzzle.title.length > 5);
    assert.ok(puzzle.missionPrompt.length > 15);
    assert.ok(puzzle.blocks.length >= 3);
    assert.ok(puzzle.correctOrder.length >= 3);
    assert.ok(puzzle.hint.length > 10);
    assert.ok(puzzle.successExplanation.length > 10);

    const blockIdSet = new Set(puzzle.blocks.map((b) => b.id));
    for (const targetId of puzzle.correctOrder) {
      assert.ok(blockIdSet.has(targetId));
    }

    if (puzzle.decoyBlockIds && puzzle.decoyBlockIds.length > 0) {
      for (const decoyId of puzzle.decoyBlockIds) {
        assert.ok(!puzzle.correctOrder.includes(decoyId));
        assert.ok(blockIdSet.has(decoyId));
      }
    }

    const battle = generateRapidFireBattle(`quest-${track.prefix}-${track.day}`, track.prefix, track.day, longLesson);
    assert.equal(battle.timeLimitSeconds, 60);
    assert.equal(battle.passScore, 4);
    assert.equal(battle.questions.length, 5);
  }
});

test('all 2,820 lessons across all 53 canonical courses generate unique per-lesson 3D puzzles and 5-question battles', () => {
  const seenArrays = new Set<any>();
  let totalLessonsVerified = 0;

  for (const [prefix, lessons] of Object.entries(LONG_LESSON_SOURCES)) {
    if (seenArrays.has(lessons)) continue;
    seenArrays.add(lessons);

    const titlesSeen = new Set<string>();
    for (const lesson of lessons) {
      const puzzle = generateLessonPuzzle(`${prefix}-lesson-day-${lesson.day}`, prefix, lesson.day, lesson);
      assert.ok(puzzle.blocks.length >= 5, `${prefix} Day ${lesson.day}: expected >= 5 blocks (4+ valid + 1 decoy)`);
      assert.ok(puzzle.correctOrder.length >= 4, `${prefix} Day ${lesson.day}: expected >= 4 ordered blocks`);
      assert.ok(puzzle.decoyBlockIds && puzzle.decoyBlockIds.length >= 1, `${prefix} Day ${lesson.day}: missing decoy`);

      // Verify slow-reader (analogy/explanation) and fast-reader (subtext/badge) fields on every valid block
      for (const validId of puzzle.correctOrder) {
        const blk = puzzle.blocks.find((b) => b.id === validId);
        assert.ok(blk, `${prefix} Day ${lesson.day}: missing block ${validId}`);
        assert.ok(blk.subtext && blk.subtext.length > 0, `${prefix} Day ${lesson.day}: missing fast-reader subtext`);
        assert.ok(blk.explanation && blk.explanation.length > 5, `${prefix} Day ${lesson.day}: missing slow-reader explanation`);
        assert.ok(blk.badge && blk.badge.length > 0, `${prefix} Day ${lesson.day}: missing domain badge`);
      }

      // Ensure puzzle title is unique per day within the course
      assert.ok(!titlesSeen.has(puzzle.title), `${prefix} Day ${lesson.day}: duplicate puzzle title "${puzzle.title}"`);
      titlesSeen.add(puzzle.title);

      const battle = generateRapidFireBattle(`${prefix}-lesson-day-${lesson.day}`, prefix, lesson.day, lesson);
      assert.equal(battle.questions.length, 5, `${prefix} Day ${lesson.day}: expected 5 battle questions`);
      totalLessonsVerified++;
    }
  }

  assert.equal(totalLessonsVerified, 2820, `Expected 2,820 total lessons verified across 53 courses, got ${totalLessonsVerified}`);
});

test('extracts concept summaries accurately from dynamic lessons', () => {
  const mockLesson = {
    title: 'Asynchronous Node.js Streams and Backpressure',
    parts: [
      { title: 'Part 1: Readable Stream Lifecycle', code: "const stream = fs.createReadStream('data.csv');", check: { question: 'What event fires on EOF?' } },
      { title: 'Part 2: Writable Stream Drainage', code: 'stream.pipe(res);', check: { question: 'When does drain fire?' } },
      { title: 'Part 3: Transform Stream Pipeline', code: 'pipeline(src, gzip, dst, err => {});', check: { question: 'Why use pipeline()?' } },
    ],
  };

  const summary = extractLessonConceptSummary(mockLesson, 'node');
  assert.equal(summary.domain, 'nodejs');
  assert.equal(summary.concepts.length, 3);
  assert.equal(summary.codeSnippets.length, 3);
  assert.equal(summary.firstCodeLines.length, 3);
});

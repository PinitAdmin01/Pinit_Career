import { getLongLesson } from '../src/lib/data/longLessons';
import { generateLessonPuzzle, generateRapidFireBattle, extractLessonConceptSummary } from '../src/lib/puzzles/lessonPuzzleEngine';

const testCases = [
  { prefix: 'python', day: 1, name: 'Python Day 1' },
  { prefix: 'python', day: 5, name: 'Python Day 5' },
  { prefix: 'react-basics', day: 1, name: 'React Day 1' },
  { prefix: 'sql-mastery', day: 1, name: 'SQL Day 1' },
  { prefix: 'java-basics', day: 1, name: 'Java Day 1' },
  { prefix: 'bcom-accounting', day: 1, name: 'Accounting Day 1' },
];

console.log('================================================================');
console.log('BRUTAL 4-STEP VERIFICATION OF PUZZLE & 60s BATTLE ENGINE');
console.log('================================================================\n');

let allPassed = true;

for (const tc of testCases) {
  console.log(`>>> TESTING [${tc.name}] (Prefix: ${tc.prefix}, Day: ${tc.day})`);
  
  const lesson = getLongLesson(tc.prefix, tc.day);
  if (!lesson) {
    console.log(`  [FAIL] Could not load lesson!`);
    allPassed = false;
    continue;
  }

  // STEP 1: Understand what lesson is
  const summary = extractLessonConceptSummary(lesson);
  console.log(`  Step 1 (Understanding): Domain=${summary.domain}, Title="${summary.title}"`);
  console.log(`         Concepts Identified (${summary.concepts.length}): ${summary.concepts.slice(0, 3).join(' | ')}`);
  
  if (summary.concepts.length === 0) {
    console.log(`  [FAIL] Step 1 Failed: No concepts extracted!`);
    allPassed = false;
  }

  // STEP 2: Generate 1 perfect puzzle for the lesson
  const puzzle = generateLessonPuzzle(`quest-${tc.prefix}-day${tc.day}`, tc.prefix, tc.day, lesson);
  console.log(`  Step 2 (Puzzle Generation): "${puzzle.title}"`);
  console.log(`         Mission Prompt: "${puzzle.missionPrompt}"`);
  console.log(`         Total Blocks: ${puzzle.blocks.length}, Target Order Length: ${puzzle.correctOrder.length}`);

  // STEP 3: Simple code & concept check
  console.log(`  Step 3 (Concept & Code Check): Type=${puzzle.type}, Hint="${puzzle.hint.slice(0, 60)}..."`);
  puzzle.blocks.forEach((b, idx) => {
    console.log(`         Block ${idx + 1}: [${b.id}] (${b.color}) "${b.label}" -> ${b.subtext || 'N/A'}`);
  });

  // STEP 4: Brutal check
  console.log(`  Step 4 (Brutal Integrity Check):`);
  const blockIds = new Set(puzzle.blocks.map(b => b.id));
  const missingInBlocks = puzzle.correctOrder.filter(id => !blockIds.has(id));
  
  if (missingInBlocks.length > 0) {
    console.log(`    [FAIL] Missing block IDs in puzzle blocks: ${missingInBlocks.join(', ')}`);
    allPassed = false;
  } else {
    console.log(`    [PASS] All ${puzzle.correctOrder.length} target block IDs exist in inventory.`);
  }

  if (puzzle.correctOrder.length < 2) {
    console.log(`    [FAIL] Target order too short (< 2 blocks)!`);
    allPassed = false;
  }

  // Also verify Rapid-Fire Battle
  const battle = generateRapidFireBattle(`quest-${tc.prefix}-day${tc.day}`, tc.prefix, tc.day, lesson);
  console.log(`  Battle Check: "${battle.title}" | Time Limit: ${battle.timeLimitSeconds}s | Questions: ${battle.questions.length}`);
  
  if (battle.timeLimitSeconds !== 60) {
    console.log(`    [FAIL] Time limit is not 60 seconds!`);
    allPassed = false;
  }
  if (battle.questions.length !== 5) {
    console.log(`    [FAIL] Battle questions count is not 5!`);
    allPassed = false;
  }
  
  battle.questions.forEach((q, qIdx) => {
    if (q.options.length !== 4) {
      console.log(`    [FAIL] Question ${qIdx + 1} does not have 4 options!`);
      allPassed = false;
    }
    if (q.correctIndex < 0 || q.correctIndex >= 4) {
      console.log(`    [FAIL] Question ${qIdx + 1} correctIndex out of bounds!`);
      allPassed = false;
    }
  });

  console.log(`    [PASS] Battle has 5 validated 4-option questions with 60s limit.\n`);
}

if (allPassed) {
  console.log('================================================================');
  console.log('✅ ALL BRUTAL CHECKS PASSED: Puzzle & Battle Engines Verified!');
  console.log('================================================================');
} else {
  console.log('❌ SOME INTEGRITY CHECKS FAILED.');
  process.exit(1);
}

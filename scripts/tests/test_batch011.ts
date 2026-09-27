// scripts/test_batch011.ts
// Invariant & Technical Audit Test Suite for PinIT Batch 011 (Days 51–55: Month 3 Week 11)
// Automated Testing Foundations, pytest Mechanics & Regression Defense

import {
  BATCH_011_MANIFEST,
  DAY_51_MANIFEST,
  DAY_52_MANIFEST,
  DAY_53_MANIFEST,
  DAY_54_MANIFEST,
  DAY_55_MANIFEST,
  DAY_55_ASSESSMENT,
  COMPETENCY_ID_TESTING_FOUNDATIONS,
} from '../src/lib/curriculum/pythonFullStack/batch011';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] ${message}`);
}

async function runBatch011Tests() {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 011 (DAYS 51–55) TECHNICAL AUDIT TEST SUITE');
  console.log('Automated Testing Foundations, pytest Mechanics & Regression Defense');
  console.log('========================================================================\n');

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_011_MANIFEST.batchCode === 'P1-M3-W11-BATCH011', 'Batch code is P1-M3-W11-BATCH011');
  assert(BATCH_011_MANIFEST.days.length === 5, 'Batch contains exactly 5 days (Days 51–55)');

  let manifestValid = true;
  try {
    ContentValidator.validateBatchManifest(BATCH_011_MANIFEST);
  } catch (e: any) {
    console.error('Manifest validation error:', e.message);
    manifestValid = false;
  }
  assert(manifestValid, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(DAY_51_MANIFEST.dayNumber === 1 && DAY_51_MANIFEST.pedagogicalIntent === 'UNDERSTAND', 'Day 51 is Day 1 of batch with UNDERSTAND intent');
  assert(DAY_52_MANIFEST.dayNumber === 2 && DAY_52_MANIFEST.pedagogicalIntent === 'APPLY', 'Day 52 is Day 2 of batch with APPLY intent');
  assert(DAY_53_MANIFEST.dayNumber === 3 && DAY_53_MANIFEST.pedagogicalIntent === 'BUILD', 'Day 53 is Day 3 of batch with BUILD intent');
  assert(DAY_54_MANIFEST.dayNumber === 4 && DAY_54_MANIFEST.pedagogicalIntent === 'DEBUG', 'Day 54 is Day 4 of batch with DEBUG intent');
  assert(DAY_55_MANIFEST.dayNumber === 5 && DAY_55_MANIFEST.pedagogicalIntent === 'TRANSFER', 'Day 55 is Day 5 of batch with TRANSFER intent');

  // ── GROUP 2: Pedagogical Content Blocks & Quality Audit ──
  console.log('\n── GROUP 2: Pedagogical Content Blocks & Quality Audit ──');
  const allBlocks = BATCH_011_MANIFEST.days.flatMap(d => d.blocks);
  assert(allBlocks.length >= 18, `Batch 011 contains ${allBlocks.length} comprehensive content blocks across 5 days (Found: ${allBlocks.length})`);

  // Day 51: The Testing Mindset, Project Setup & pytest Mechanics
  const d51Theory1 = DAY_51_MANIFEST.blocks[0] as any;
  assert(d51Theory1.mentalModel.includes('Arrange-Act-Assert') || d51Theory1.whatItIs.includes('Arrange-Act-Assert'), 'Day 51 teaches Arrange-Act-Assert (AAA) pattern');
  
  const d51Theory2 = DAY_51_MANIFEST.blocks[1] as any;
  assert(d51Theory2.summary.includes('interpret exit codes') && d51Theory2.mentalModel.includes('Exit Status Code'), 'Day 51 explicitly teaches project test setup, CLI invocation, and exit codes (0, 1, 4)');
  assert(d51Theory2.whatItIs.includes('AST') || d51Theory2.summary.includes('AST'), 'Day 51 teaches pytest bare assert and AST rewriting introspection');

  // Day 52: Testing Exceptions, Failure Modes & Parameterized Tests
  const d52Theory1 = DAY_52_MANIFEST.blocks[0] as any;
  assert(d52Theory1.whatItIs.includes('pytest.raises'), 'Day 52 teaches testing failure conditions with pytest.raises');
  assert(d52Theory1.commonMistakes.some((m: string) => m.includes('Exception')), 'Day 52 warns against catching generic Exception');

  const d52Theory2 = DAY_52_MANIFEST.blocks[1] as any;
  assert(d52Theory2.whatItIs.includes('@pytest.mark.parametrize'), 'Day 52 teaches parameterized testing with @pytest.mark.parametrize');

  const d52Quiz = DAY_52_MANIFEST.blocks.find(b => b.type === 'KNOWLEDGE_CHECK') as any;
  assert(d52Quiz.diagnosticQuestion.includes('Test A') && d52Quiz.explanation.includes('Failure') && d52Quiz.explanation.includes('Error'), 'Day 52 includes diagnostic check distinguishing Test Failure from Test Error');

  // Day 53: Fixtures, Test Setup & State Management
  const d53Theory1 = DAY_53_MANIFEST.blocks[0] as any;
  assert(d53Theory1.summary.includes('reusable test setup') && !d53Theory1.summary.includes('Dependency injection for test data'), 'Day 53 grounds fixtures as reusable test setup without premature DI theory');

  const d53Theory2 = DAY_53_MANIFEST.blocks[1] as any;
  assert(d53Theory2.whatItIs.includes('conftest.py') && d53Theory2.whatItIs.includes('tmp_path'), 'Day 53 teaches conftest.py sharing and tmp_path filesystem isolation');

  // Day 54: Test Isolation, Mocking & Flaky Test Diagnostics
  const d54Theory1 = DAY_54_MANIFEST.blocks[0] as any;
  assert(d54Theory1.commonMisconceptions.some((m: string) => m.includes('optional testing tool')), 'Day 54 explicitly clarifies test-order shuffling is an optional tool, not a core language feature');
  assert(d54Theory1.commonMistakes.some((m: string) => m.includes('pytest.approx')), 'Day 54 teaches floating-point precision comparisons with pytest.approx');

  const d54Theory2 = DAY_54_MANIFEST.blocks[1] as any;
  assert(d54Theory2.whatItIs.includes('monkeypatch'), 'Day 54 teaches safe environment & attribute patching with monkeypatch');

  // Day 55: Comprehensive Contract-Focused Testing Capstone
  const d55Theory = DAY_55_MANIFEST.blocks[0] as any;
  assert(d55Theory.title.includes('Behavior over Blind Line Coverage') || d55Theory.summary.includes('Contract-Focused Testing'), 'Day 55 teaches contract-focused testing over blind line coverage');

  const d55Challenge = DAY_55_MANIFEST.blocks[1] as any;
  assert(d55Challenge.constraints.some((c: string) => c.includes('behavioral contract')), 'Day 55 assessment criteria requires encoding behavioral contract and defect detection');
  assert(!d55Challenge.starterArtifact.includes('timezone'), 'Day 55 contains zero prerequisite-leaking timezone bugs');

  // ── GROUP 3: Day 55 Formative Assessment Security & Rubric Validation ──
  console.log('\n── GROUP 3: Day 55 Formative Assessment Security & Rubric Validation ──');
  assert(DAY_55_ASSESSMENT.mode === 'FORMATIVE', 'Day 55 Assessment is strictly designated as FORMATIVE');
  assert(DAY_55_ASSESSMENT.targetCompetencyId === COMPETENCY_ID_TESTING_FOUNDATIONS, `Target competency is ${COMPETENCY_ID_TESTING_FOUNDATIONS}`);
  assert(DAY_55_ASSESSMENT.passingScore === 80, 'Passing score is standard 80%');
  assert(DAY_55_ASSESSMENT.timeLimitMinutes === 65, 'Time limit is 65 minutes');

  let assessmentValid = true;
  try {
    AssessmentValidator.validateAssessment(DAY_55_ASSESSMENT);
  } catch (e: any) {
    console.error('Assessment validation error:', e.message);
    assessmentValid = false;
  }
  assert(assessmentValid, 'AssessmentValidator.validateAssessment() passes with 0 schema violations');

  const item = DAY_55_ASSESSMENT.items[0];
  assert(item.rubricDimensions !== undefined, 'Assessment item contains explicit weighted rubric dimensions');

  const dimensions = item.rubricDimensions || [];
  assert(dimensions.length === 7, `Rubric contains 7 comprehensive dimensions (Found: ${dimensions.length})`);

  const weightSum = dimensions.reduce((acc, d) => acc + d.weight, 0);
  assert(Math.abs(weightSum - 1.0) < 0.0001, `Rubric dimension weights sum exactly to 1.0 (Sum: ${weightSum})`);

  const pointsSum = dimensions.reduce((acc, d) => acc + d.maxPoints, 0);
  assert(pointsSum === 100, `Rubric maxPoints sum to exactly 100 (Sum: ${pointsSum})`);

  // Verify multi-tier test cases
  assert((item.visibleTests || []).length >= 2, `Item contains at least 2 visible tests (Found: ${(item.visibleTests || []).length})`);
  assert((item.privateTests || []).length >= 3, `Item contains at least 3 private tests (Found: ${(item.privateTests || []).length})`);
  assert((item.integrityTests || []).length >= 1, `Item contains at least 1 anti-cheat integrity test (Found: ${(item.integrityTests || []).length})`);

  // ── GROUP 4: Workload Feasibility Audit ──
  console.log('\n── GROUP 4: Workload Feasibility Audit ──');
  let totalMinutes = 0;
  BATCH_011_MANIFEST.days.forEach(d => {
    let dayMin = 0;
    d.blocks.forEach(b => {
      dayMin += b.estimatedMinutes;
      totalMinutes += b.estimatedMinutes;
    });
    console.log(`  ℹ️  Day ${d.dayNumber} (${d.pedagogicalIntent}): ${(dayMin / 60).toFixed(1)}h (${dayMin} min)`);
  });

  const totalHours = totalMinutes / 60;
  console.log(`  ℹ️  Batch 011 Total Estimated Learning Time: ${totalHours.toFixed(2)} hours`);
  assert(totalHours >= 6.5 && totalHours <= 7.5, `Batch 011 workload is balanced between 6.5h and 7.5h (Actual: ${totalHours.toFixed(2)}h)`);

  console.log('\n========================================================================');
  console.log('✅ ALL BATCH 011 TECHNICAL AUDIT & INVARIANT CHECKS PASSED CLEANLY');
  console.log('========================================================================\n');
}

runBatch011Tests().catch(err => {
  console.error('\n❌ BATCH 011 TEST SUITE FAILED:', err);
  process.exit(1);
});

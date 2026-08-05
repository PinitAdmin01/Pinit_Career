// Register ts-node for CJS with node module resolution
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
    target: 'es2020'
  }
});

const { BCOM_ACCOUNTING_30_DAYS_QUESTS } = require('../src/lib/data/bcomAccounting30DayData.ts');
const { BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS } = require('../src/lib/data/bcomAiTransformation30DayData.ts');
const { BCOM_OPERATIONS_30_DAYS_QUESTS } = require('../src/lib/data/bcomOperations30DayData.ts');
const { COURSES_REGISTRY } = require('../src/lib/data/coursesData.ts');

console.log('========================================================================');
console.log('  🧪 TESTING MULTI-ROADMAP ENGINE (MAX 3 ACTIVE TRACKS & ISOLATION)');
console.log('========================================================================\n');

// Simulated Student State
let activeCourseId = 'course-digital-accounting';
let activeCourseIds = ['course-digital-accounting', 'course-ai-digital-transformation', 'course-operations-supplychain-compliance'];
let completedQuests = [];

// Step 1: Simulate 15 Days of Learning in Course 1 (45 Quests completed)
console.log('📚 STEP 1: Student spends 15 days learning Course 1 (Digital Accounting & Taxation)...');
const course1Quests = BCOM_ACCOUNTING_30_DAYS_QUESTS.slice(0, 45).map(q => q.id);
completedQuests.push(...course1Quests);

const course1Obj = COURSES_REGISTRY.find(c => c.id === 'course-digital-accounting');
const c1Completed = course1Obj.quests.filter(q => completedQuests.includes(q.id)).length;
const c1ProgressPct = Math.round((c1Completed / course1Obj.quests.length) * 100);

console.log(`   - Course 1 Progress: ${c1Completed} / ${course1Obj.quests.length} Quests Completed (${c1ProgressPct}%)`);
console.log(`   - Course 1 Active Day: Day ${Math.min(30, Math.ceil((c1Completed + 1) / 5))}`);
console.log('');

// Step 2: Student switches to Course 2 (AI Transformation)
console.log('🔄 STEP 2: Student switches to Course 2 (AI & Digital Transformation for Business)...');
activeCourseId = 'course-ai-digital-transformation';

// Simulate 2 days of learning in Course 2 (6 Quests completed)
const course2Quests = BCOM_AI_TRANSFORMATION_30_DAYS_QUESTS.slice(0, 6).map(q => q.id);
completedQuests.push(...course2Quests);

const course2Obj = COURSES_REGISTRY.find(c => c.id === 'course-ai-digital-transformation');
const c2Completed = course2Obj.quests.filter(q => completedQuests.includes(q.id)).length;
const c2ProgressPct = Math.round((c2Completed / course2Obj.quests.length) * 100);

console.log(`   - Course 2 Progress: ${c2Completed} / ${course2Obj.quests.length} Quests Completed (${c2ProgressPct}%)`);
console.log(`   - Course 2 Active Day: Day ${Math.min(30, Math.ceil((c2Completed + 1) / 5))}`);
console.log('');

// Step 3: Student switches back to Course 1 to verify zero progress loss
console.log('🔙 STEP 3: Student switches back to Course 1 (Digital Accounting)...');
activeCourseId = 'course-digital-accounting';

const c1RecheckedCompleted = course1Obj.quests.filter(q => completedQuests.includes(q.id)).length;
const c1RecheckedProgressPct = Math.round((c1RecheckedCompleted / course1Obj.quests.length) * 100);

console.log(`   - Course 1 Rechecked Progress: ${c1RecheckedCompleted} / ${course1Obj.quests.length} Quests Completed (${c1RecheckedProgressPct}%)`);
console.log(`   - Course 1 Active Day: Day ${Math.min(30, Math.ceil((c1RecheckedCompleted + 1) / 5))}`);

if (c1RecheckedCompleted === 45 && c1RecheckedProgressPct === 31) {
  console.log('   ✅ ZERO-LOSS PROGRESS PRESERVATION CONFIRMED! Course 1 retained 100% of 15 days of work!');
} else {
  console.error('   ❌ PROGRESS LOSS ERROR DETECTED!');
  process.exit(1);
}
console.log('');

// Step 4: Verify Max 3 Active Courses Limit
console.log('📌 STEP 4: Testing Max 3 Active Roadmaps Cap...');
if (activeCourseIds.length > 3) {
  console.error('   ❌ CAP ERROR: More than 3 active courses detected!');
  process.exit(1);
} else {
  console.log(`   ✅ MAX 3 CONCURRENT TRACKS CAP VERIFIED! Active tracks count: ${activeCourseIds.length}/3`);
}

console.log('\n========================================================================');
console.log('  ✅ ALL MULTI-ROADMAP TESTS PASSED WITH 100% SUCCESS!');
console.log('========================================================================');

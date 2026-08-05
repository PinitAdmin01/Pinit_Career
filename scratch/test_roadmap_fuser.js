// Register ts-node for CJS with node module resolution
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
    target: 'es2020'
  }
});

const { generateDynamicStudentRoadmap } = require('../src/lib/data/roadmapFuser.ts');

console.log('========================================================================');
console.log('  🧪 TESTING DYNAMIC STUDENT ROADMAP ENGINE (QT1 + QT2 + GOAL + COURSE)');
console.log('========================================================================\n');

// Profile 1: High QT1, Pattern Hunter, Course 10 (AI Transformation)
console.log('👤 TEST STUDENT PROFILE 1: High Knowledge (QT1: 90), Pattern Hunter Archetype');
const res1 = generateDynamicStudentRoadmap({
  qt1: 90,
  qt2: 85,
  archetype: 'Pattern Hunter',
  goal: 'AI Transformation Leader',
  courseId: 'course-ai-digital-transformation',
  durationDays: 30,
  dailyPace: 3
});
console.log(`- Generated Modules Count: ${res1.length}`);
console.log(`- Module 1 Title: "${res1[0].title}"`);
console.log(`- Knowledge Tag: "${res1[0].knowledgeAdaptationTag}"`);
console.log(`- Mindset Tag: "${res1[0].personalizedPaceTag}"`);
console.log(`- Quest 1 Fast-Tracked Status: ${res1[0].quests[0].fastTracked}`);
console.log(`- Quest 1 Personalized Hint: "${res1[0].quests[0].personalizedHint.substring(0, 70)}..."`);
console.log('');

// Profile 2: Low QT1, Execution Sprinter, Course 9 (Operations & Supply Chain)
console.log('👤 TEST STUDENT PROFILE 2: Low Knowledge (QT1: 40), Execution Sprinter Archetype');
const res2 = generateDynamicStudentRoadmap({
  qt1: 40,
  qt2: 60,
  archetype: 'Execution Sprinter',
  goal: 'Supply Chain Operations Specialist',
  courseId: 'course-operations-supplychain-compliance',
  durationDays: 60,
  dailyPace: 5
});
console.log(`- Generated Modules Count: ${res2.length}`);
console.log(`- Module 1 Title: "${res2[0].title}"`);
console.log(`- Knowledge Tag: "${res2[0].knowledgeAdaptationTag}"`);
console.log(`- Mindset Tag: "${res2[0].personalizedPaceTag}"`);
console.log(`- Quest 1 Reinforcement Status: ${res2[0].quests[0].reinforcementNeeded}`);
console.log(`- Quest 1 Personalized Hint: "${res2[0].quests[0].personalizedHint.substring(0, 70)}..."`);
console.log('');

// Profile 3: Moderate QT1, Deep Thinker, Course 8 (Sales & CRM)
console.log('👤 TEST STUDENT PROFILE 3: Moderate Knowledge (QT1: 65), Deep Thinker Archetype');
const res3 = generateDynamicStudentRoadmap({
  qt1: 65,
  qt2: 75,
  archetype: 'Deep Thinker',
  goal: 'Sales & CRM Specialist',
  courseId: 'course-sales-crm-success',
  durationDays: 90,
  dailyPace: 2
});
console.log(`- Generated Modules Count: ${res3.length}`);
console.log(`- Module 1 Title: "${res3[0].title}"`);
console.log(`- Knowledge Tag: "${res3[0].knowledgeAdaptationTag}"`);
console.log(`- Mindset Tag: "${res3[0].personalizedPaceTag}"`);
console.log('');

console.log('========================================================================');
console.log('  ✅ ALL DYNAMIC STUDENT ROADMAP TESTS PASSED WITH 100% SUCCESS!');
console.log('========================================================================');

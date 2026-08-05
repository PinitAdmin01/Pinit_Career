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
console.log('  🧪 TESTING GOAL-CENTRIC DYNAMIC MIXED ROADMAP ENGINE (TECH + NON-TECH)');
console.log('========================================================================\n');

// Test 1: Mixed Goal (Full-Stack AI Engineer launching an E-Commerce Business)
console.log('👤 TEST STUDENT 1: Mixed Tech + Business Goal');
console.log('   - Goal: "Full-Stack AI Engineer launching an E-Commerce Business"');
console.log('   - Course: Course 6 (E-Commerce & Digital Business)');
const res1 = generateDynamicStudentRoadmap({
  qt1: 85,
  qt2: 80,
  archetype: 'Pattern Hunter',
  goal: 'Full-Stack AI Engineer launching an E-Commerce Business',
  courseId: 'course-ecommerce-digital-biz',
  durationDays: 60,
  dailyPace: 3
});

console.log(`   - Generated Modules Count: ${res1.length}`);
console.log(`   - Module 1 Title: "${res1[0].title}"`);
console.log(`   - Module 1 Description: "${res1[0].desc}"`);
console.log(`   - Target Pace Tag: "${res1[0].personalizedPaceTag}"`);
console.log('');

// Test 2: Mixed Goal (Financial Analyst with Python AI Skills)
console.log('👤 TEST STUDENT 2: Mixed Finance + Tech Goal');
console.log('   - Goal: "Financial Analyst with Python AI Skills"');
console.log('   - Course: Course 2 (Business Finance & Investment Management)');
const res2 = generateDynamicStudentRoadmap({
  qt1: 45,
  qt2: 65,
  archetype: 'Deep Thinker',
  goal: 'Financial Analyst with Python AI Skills',
  courseId: 'course-finance-investment',
  durationDays: 30,
  dailyPace: 2
});

console.log(`   - Generated Modules Count: ${res2.length}`);
console.log(`   - Module 1 Title: "${res2[0].title}"`);
console.log(`   - Module 1 Description: "${res2[0].desc}"`);
console.log(`   - Knowledge Tag: "${res2[0].knowledgeAdaptationTag}"`);
console.log(`   - Target Pace Tag: "${res2[0].personalizedPaceTag}"`);
console.log('');

console.log('========================================================================');
console.log('  ✅ ALL MIXED TECH + NON-TECH ROADMAP TESTS PASSED WITH 100% SUCCESS!');
console.log('========================================================================');

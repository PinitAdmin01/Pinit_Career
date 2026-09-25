import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { CANONICAL_TRAJECTORIES, recommendCareerTrajectory } from '../../src/lib/data/careerTrajectories';

console.log('🔬 Verifying Course ID Consistency across careerTrajectories and coursesData...');

const registryIds = new Set(COURSES_REGISTRY.map(c => c.id));
console.log(`Registered courses count: ${registryIds.size}`);

const checkedIds = new Set<string>();
const invalidCourseIds: { source: string; courseId: string }[] = [];

// 1. Check all canonical trajectories
for (const [key, traj] of Object.entries(CANONICAL_TRAJECTORIES)) {
  for (const node of traj.nodes) {
    checkedIds.add(node.courseId);
    if (!registryIds.has(node.courseId)) {
      invalidCourseIds.push({ source: `CANONICAL_TRAJECTORIES.${key}`, courseId: node.courseId });
    }
  }
}

// 2. Check various recommendCareerTrajectory returns
const testGoals = [
  'ml', 'python', 'iot', 'hardware', 'frontend', 'cloud', 'design', 'fullstack',
  'tax', 'banking', 'investment', 'consulting', 'product_management', 'hr',
  'operations', 'analytics', 'entrepreneurship', 'research', 'law', 'education',
  'healthcare', 'media', 'technology', 'unknown_custom_goal'
];

for (const g of testGoals) {
  const traj = recommendCareerTrajectory(g, 70, 75, 'Pattern Hunter');
  for (const node of traj.nodes) {
    checkedIds.add(node.courseId);
    if (!registryIds.has(node.courseId)) {
      invalidCourseIds.push({ source: `recommendCareerTrajectory("${g}")`, courseId: node.courseId });
    }
  }
}

// 3. Check all course IDs referenced in useOnboardingWizard.ts
const fs = require('fs');
const wizardContent = fs.readFileSync('src/app/onboarding/hooks/useOnboardingWizard.ts', 'utf8');
const wizardCourseMatches = [...wizardContent.matchAll(/courseId:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

for (const cId of wizardCourseMatches) {
  checkedIds.add(cId);
  if (!registryIds.has(cId)) {
    invalidCourseIds.push({ source: 'useOnboardingWizard.ts', courseId: cId });
  }
}

console.log(`Total unique trajectory & wizard courseIds checked: ${checkedIds.size}`);
if (invalidCourseIds.length > 0) {
  console.error('❌ Found invalid courseIds:', invalidCourseIds);
  process.exit(1);
} else {
  console.log('✅ ALL checked courseIds across trajectories and wizard are 100% valid and exist in COURSES_REGISTRY!');
}

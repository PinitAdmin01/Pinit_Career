import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { COURSES_CATALOG } from '@/lib/data/coursesCatalog';

console.log('=== COURSES FROM coursesData.ts ===');
console.log('Total in coursesData.ts:', COURSES_REGISTRY.length);
COURSES_REGISTRY.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.id}] ${c.title} (Duration: ${c.durationWeeks} weeks, Quests: ${c.quests.length})`);
});

console.log('\n=== COURSES FROM coursesCatalog.ts ===');
console.log('Total in coursesCatalog.ts:', COURSES_CATALOG.length);
COURSES_CATALOG.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.id}] ${c.title} (Duration: ${c.durationWeeks} weeks)`);
});

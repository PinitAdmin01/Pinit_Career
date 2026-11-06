import * as fs from 'fs';
import * as path from 'path';

const summaryPath = path.resolve(process.cwd(), 'scripts/course-curriculum-summary.json');
const courses = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

console.log('=== DETAILED CATEGORY INVENTORY ===\n');

courses.forEach((c: any) => {
  console.log(`[${c.num}] ${c.id}: "${c.title}"`);
  console.log(`    Difficulty: ${c.difficulty} | Weeks: ${c.durationWeeks} | Days: ${c.blocks.flatMap((b: any) => b.days).length}`);
  console.log(`    Overview: ${c.desc.slice(0, 110)}...`);
  console.log(`    Block 1 sample: ${c.blocks[0]?.days[0]?.title} -> ${c.blocks[0]?.days[4]?.title}`);
  console.log(`    Block 6 sample: ${c.blocks[5]?.days[0]?.title} -> ${c.blocks[5]?.days[4]?.title}`);
  console.log('');
});

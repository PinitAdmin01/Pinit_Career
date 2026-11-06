import { getLongLesson } from '../src/lib/data/longLessons';

for (let d = 27; d <= 30; d++) {
  const l = getLongLesson('excel_viz', d);
  console.log(`=== Day ${d} ===`);
  if (!l) {
    console.log('Not found');
    continue;
  }
  l.parts.forEach((p, i) => {
    const classMatch = p.code.match(/class\s+([A-Za-z0-9_]+)/g);
    console.log(`  Part ${i + 1} [${p.title}]:`, classMatch);
  });
}

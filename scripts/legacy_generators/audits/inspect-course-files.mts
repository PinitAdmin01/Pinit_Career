import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.resolve(process.cwd(), 'src/lib/data');
const files = fs.readdirSync(dataDir);

const thirtyDayFiles = files.filter(f => f.includes('30DayData.ts'));
console.log('Total *30DayData.ts files:', thirtyDayFiles.length);
thirtyDayFiles.forEach((f, idx) => {
  const stat = fs.statSync(path.join(dataDir, f));
  console.log(`${idx + 1}. ${f} (${Math.round(stat.size / 1024)} KB)`);
});

const longLessonFiles = files.filter(f => f.includes('LongLessons.ts'));
console.log('\nTotal *LongLessons.ts files:', longLessonFiles.length);
longLessonFiles.forEach((f, idx) => {
  const stat = fs.statSync(path.join(dataDir, f));
  console.log(`${idx + 1}. ${f} (${Math.round(stat.size / 1024)} KB)`);
});

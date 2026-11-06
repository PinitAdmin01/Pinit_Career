import { LONG_LESSON_SOURCES } from '../src/lib/data/longLessons';

console.log('='.repeat(80));
console.log('   PINIT CAREER OS: AUDIT OF ALL LONG LESSON SOURCES IN PLATFORM   ');
console.log('='.repeat(80));

const seenArrays = new Set<any>();
const uniqueCourses: Array<{ key: string; count: number; minDay: number; maxDay: number }> = [];

for (const [key, lessonArray] of Object.entries(LONG_LESSON_SOURCES)) {
  if (seenArrays.has(lessonArray)) {
    continue; // skip alias
  }
  seenArrays.add(lessonArray);

  const count = lessonArray.length;
  const days = lessonArray.map(l => l.day);
  const minDay = days.length > 0 ? Math.min(...days) : 0;
  const maxDay = days.length > 0 ? Math.max(...days) : 0;

  uniqueCourses.push({
    key,
    count,
    minDay,
    maxDay
  });
}

console.log(`\n#   | Source Key               | Days Found | Day Range   | Status`);
console.log('-'.repeat(80));
let grandTotalDays = 0;
uniqueCourses.forEach((c, idx) => {
  const numStr = String(idx + 1).padEnd(3);
  const keyStr = c.key.padEnd(24);
  const countStr = String(c.count).padEnd(10);
  const rangeStr = `${c.minDay}..${c.maxDay}`.padEnd(11);
  const status = c.count === 60 ? '60/60 (100.0%)' : `${c.count}/60`;
  grandTotalDays += c.count;
  console.log(`${numStr} | ${keyStr} | ${countStr} | ${rangeStr} | ${status}`);
});

console.log('='.repeat(80));
console.log(`Total Unique Course Source Arrays: ${uniqueCourses.length}`);
console.log(`Total LongLesson Days across Platform: ${grandTotalDays}`);
console.log('='.repeat(80));

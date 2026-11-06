import { COMP_FUND_LONG_LESSONS } from '../../src/lib/data/compFundLongLessons';

let totalParts = 0;
let failingParts = 0;

for (let d = 0; d < COMP_FUND_LONG_LESSONS.length; d++) {
  const day = COMP_FUND_LONG_LESSONS[d];
  day.parts.forEach((p, idx) => {
    totalParts++;
    const words = (p.say as string[]).join(' ').trim().split(/\s+/).filter(Boolean).length;
    if (words < 580) {
      console.error(`FAIL: Day ${day.day} Part ${idx + 1} has ${words} words (< 580)`);
      failingParts++;
    }
  });
}

console.log(`Total days checked: ${COMP_FUND_LONG_LESSONS.length}`);
console.log(`Total parts checked: ${totalParts}`);
console.log(`Failing parts: ${failingParts}`);
if (failingParts === 0) {
  console.log('PERFECT! 100% of all parts in Computer Fundamentals meet or exceed >= 580 words!');
} else {
  process.exit(1);
}

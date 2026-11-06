import { BCOM_ECOM_LONG_LESSONS } from '../../src/lib/data/bcomEcomLongLessons';

console.log('Inspecting BCOM_ECOM quiz properties:');
const d31 = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === 31)!;
console.log('Day 31 Part 1 check:', JSON.stringify(d31.parts[0].check, null, 2));

const d56 = BCOM_ECOM_LONG_LESSONS.find((l) => l.day === 56)!;
console.log('Day 56 Part 1 check:', JSON.stringify(d56.parts[0].check, null, 2));

// In brutal_ts_audit.ts, the check was:
// if (part.check.answer !== 0 || part.check.answerIndex !== 0) quizDefects++;
// What if some earlier lessons only had `answer: 0` OR only `answerIndex: 0`?
for (let d = 31; d <= 60; d++) {
  const l = BCOM_ECOM_LONG_LESSONS.find((x) => x.day === d);
  if (!l) continue;
  l.parts.forEach((p, idx) => {
    if (!p.check) {
      console.log(`Day ${d} Part ${idx + 1}: No check`);
    } else {
      if (p.check.answer !== 0 && p.check.answerIndex !== 0) {
        console.log(`Day ${d} Part ${idx + 1}: neither answer nor answerIndex is 0 (answer: ${p.check.answer}, answerIndex: ${p.check.answerIndex})`);
      } else if (p.check.answer === undefined) {
        console.log(`Day ${d} Part ${idx + 1}: answer is undefined, answerIndex is ${p.check.answerIndex}`);
      } else if (p.check.answerIndex === undefined) {
        console.log(`Day ${d} Part ${idx + 1}: answerIndex is undefined, answer is ${p.check.answer}`);
      }
    }
  });
}

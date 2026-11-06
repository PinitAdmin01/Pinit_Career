import { getLongLesson } from '../src/lib/data/longLessons';

const courses = [
  'excel_viz',
  'git_vcs',
  'comp_fund',
  'soft_skills',
  'java-basics',
  'fullstack-js',
  'mobile',
  'blockchain',
  'quant-systems',
  'g3d'
];

for (const c of courses) {
  let count = 0;
  const days: number[] = [];
  for (let d = 1; d <= 60; d++) {
    const l = getLongLesson(c, d);
    if (l) {
      count++;
      days.push(d);
    }
  }
  console.log(`${c.padEnd(16)}: count=${count}, range=${days[0]}..${days[days.length-1]}`);
}

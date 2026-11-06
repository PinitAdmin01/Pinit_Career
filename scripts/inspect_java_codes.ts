import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

for (let day of [6, 7, 8, 31, 32]) {
  const lesson = JAVA_BASICS_LONG_LESSONS.find(l => l.day === day);
  console.log(`\nDay ${day} Part 1 Code:`);
  console.log(lesson?.parts[0].code);
  console.log(`Day ${day} Part 1 Output:`);
  console.log(lesson?.parts[0].output);
}

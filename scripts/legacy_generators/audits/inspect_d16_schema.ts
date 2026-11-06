import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

const d16 = JAVA_BASICS_LONG_LESSONS.find(x => x.day === 16);
if (d16) {
  console.log('Day 16 keys:', Object.keys(d16));
  console.log('Day 16 parts count:', d16.parts.length);
  console.log('Day 16 part 1 keys:', Object.keys(d16.parts[0]));
  console.log('Day 16 part 1 check:', d16.parts[0].check);
}

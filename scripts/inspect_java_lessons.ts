import fs from 'fs';
import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { getLongLesson } from '../src/lib/data/longLessons';

console.log('Array length in javaBasicsLongLessons:', JAVA_BASICS_LONG_LESSONS.length);
JAVA_BASICS_LONG_LESSONS.forEach((l, idx) => {
  console.log(`Index ${idx}: Day ${l.day} - ${l.title} (parts: ${l.parts.length})`);
});

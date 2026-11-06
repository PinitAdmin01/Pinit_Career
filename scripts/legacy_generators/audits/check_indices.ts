import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

console.log(`JAVA_BASICS_LONG_LESSONS total array length: ${JAVA_BASICS_LONG_LESSONS.length}`);

for (let i = 0; i < JAVA_BASICS_LONG_LESSONS.length; i++) {
    const l: any = JAVA_BASICS_LONG_LESSONS[i];
    console.log(`Index ${i.toString().padStart(2, ' ')} -> day field: ${l.day} | title: "${l.title?.slice(0, 45)}"`);
}

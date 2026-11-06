import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

for (let day = 1; day <= 5; day++) {
  const lesson = JAVA_BASICS_LONG_LESSONS.find(l => l.day === day);
  const cfg = JAVA_30_DAYS_CONFIGS.find(c => c.day === day);
  console.log(`\n=================== DAY ${day} ===================`);
  console.log(`Lesson Title: ${lesson?.title}`);
  console.log(`Config Title: ${cfg?.title}`);
  console.log(`Config eTitle: ${cfg?.eTitle}`);
  console.log(`Config eDesc: ${cfg?.eDesc}`);
  console.log(`Config eStarter:\n${cfg?.eStarter}`);
  console.log(`Lesson parts: ${lesson?.parts.length}`);
  lesson?.parts.forEach((p, idx) => {
    const sayArr = Array.isArray(p.say) ? p.say : [p.say];
    const words = sayArr.join(' ').trim().split(/\s+/).length;
    console.log(`  Part ${idx + 1}: "${p.title}" (${words} words)`);
    console.log(`    say lines: ${sayArr.length}, example: "${p.example?.slice(0, 60)}..."`);
  });
}

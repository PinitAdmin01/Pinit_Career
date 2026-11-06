import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

console.log("=== INSPECTING DAYS 11 TO 30 OF JAVA BASICS ===");

for (let day = 11; day <= 30; day++) {
    const lesson = JAVA_BASICS_LONG_LESSONS[day];
    const dayData = JAVA_30_DAYS_CONFIGS.find(d => d.day === day);
    
    if (lesson) {
        const p1 = lesson.parts[0];
        const hasContent = 'content' in p1;
        const hasChecksArray = Array.isArray(p1.checks);
        console.log(`Day ${day}: ConfigTitle: "${dayData?.title?.slice(0, 40)}" | Part 1 Title: "${p1.title?.slice(0, 40)}" | format: ${hasContent ? 'modern(content)' : 'legacy(say)'} | checksCount: ${hasChecksArray ? p1.checks.length : (p1.check ? 1 : 0)}`);
    } else {
        console.log(`Day ${day}: NO LESSON!`);
    }
}

import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';
import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

console.log("=== FULL 30-DAY MAP: TITLE vs CHALLENGE ===");

for (let day = 1; day <= 30; day++) {
    const config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === day);
    const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);
    console.log(`Day ${day.toString().padStart(2, '0')}: ConfigTitle: "${config?.title?.slice(0, 35)}" | Challenge: "${config?.eTitle?.slice(0, 35)}" | LessonTitle: "${lesson?.title?.slice(0, 35)}"`);
}

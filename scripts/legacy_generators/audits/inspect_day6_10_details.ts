import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

console.log("=== DETAILED INSPECTION: DAYS 6 TO 10 ===");

for (let day = 6; day <= 10; day++) {
    const config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === day);
    const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);
    
    console.log(`\n========================================`);
    console.log(`DAY ${day}`);
    console.log(`Config Title: ${config?.title}`);
    console.log(`Config Desc:  ${config?.desc}`);
    console.log(`Config Syllabus:`);
    config?.syllabus?.forEach((s: string) => console.log(`   - ${s}`));
    console.log(`Challenge: ${config?.eTitle}`);
    console.log(`Challenge Desc: ${config?.eDesc}`);
    console.log(`Lesson Title: ${lesson?.title}`);
    console.log(`Lesson Parts:`);
    lesson?.parts?.forEach((p: any, idx: number) => {
        console.log(`   Part ${idx + 1}: "${p.title}"`);
    });
}

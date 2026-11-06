import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';
import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

console.log("=== DAYS 16 TO 30 DETAILED MAPPING ===");
for (let day = 16; day <= 30; day++) {
    const d30 = JAVA_30_DAYS_CONFIGS.find(d => d.day === day);
    const dLong = JAVA_BASICS_LONG_LESSONS.find(d => d.day === day);
    console.log(`\n--- DAY ${day} ---`);
    console.log(`  30Day Title:  ${d30?.title}`);
    console.log(`  30Day Desc:   ${d30?.desc}`);
    console.log(`  30Day eTitle: ${d30?.eTitle}`);
    console.log(`  30Day eDesc:  ${d30?.eDesc}`);
    console.log(`  LongLesson Title: ${dLong?.title}`);
    console.log(`  LongLesson Parts Count: ${dLong?.parts?.length}`);
    if (dLong?.parts) {
        dLong.parts.forEach((p: any, idx: number) => {
            const content = p.content || '';
            const words = content.trim().split(/\s+/).filter(Boolean).length;
            console.log(`    Part ${idx + 1}: "${p.title}" | words: ${words} | keys: [${Object.keys(p).join(', ')}]`);
        });
    }
}

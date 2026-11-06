import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';
import * as fs from 'fs';
import * as path from 'path';

console.log("=== INSPECTING DAYS 6 TO 10 OF JAVA BASICS ===");

for (let day = 6; day <= 10; day++) {
    const lesson = JAVA_BASICS_LONG_LESSONS[day];
    const dayData = JAVA_30_DAYS_CONFIGS.find(d => d.day === day);
    const visualPath = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics', `day-${String(day).padStart(2, '0')}.json`);
    const visualExists = fs.existsSync(visualPath);
    
    console.log(`\n--- DAY ${day} ---`);
    console.log(`Title in 30DayData: "${dayData?.title}"`);
    console.log(`Challenge: "${dayData?.eDesc?.slice(0, 80)}..."`);
    console.log(`Visual exists: ${visualExists}`);
    if (lesson) {
        console.log(`LongLesson parts count: ${lesson.parts.length}`);
        let totalWords = 0;
        lesson.parts.forEach((p: any, idx: number) => {
            console.log(`  Part ${idx + 1} keys:`, Object.keys(p));
            const text = p.content || p.explanation || p.theory || '';
            const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
            totalWords += wc;
            console.log(`  Part ${idx + 1}: "${p.title}" | Words: ${wc} | Checks: ${p.checks?.length || 0} | Code length: ${p.code?.length || 0}`);
        });
        console.log(`Total words: ${totalWords}`);
    } else {
        console.log("No LongLesson found!");
    }
}

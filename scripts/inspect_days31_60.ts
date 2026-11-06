import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

console.log("=== INSPECTING DAYS 31 TO 60 OF JAVA BASICS ===");

for (let day = 31; day <= 60; day++) {
    const lesson = JAVA_BASICS_LONG_LESSONS[day];
    if (lesson) {
        const p1 = lesson.parts[0];
        const hasContent = 'content' in p1;
        const checksCount = Array.isArray(p1.checks) ? p1.checks.length : 0;
        let totalWords = 0;
        let minWords = 99999;
        lesson.parts.forEach((p: any) => {
            const wc = (p.content || '').trim().split(/\s+/).length;
            totalWords += wc;
            if (wc < minWords) minWords = wc;
        });
        if (day === 31 || day === 35 || day === 45 || day === 60) {
            console.log(`Day ${day}: "${p1.title?.slice(0, 40)}" | minWords: ${minWords} | totalWords: ${totalWords} | checks: ${checksCount}`);
        }
    } else {
        console.log(`Day ${day}: MISSING!`);
    }
}

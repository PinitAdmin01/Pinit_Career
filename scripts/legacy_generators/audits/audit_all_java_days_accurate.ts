import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

console.log("=== ACCURATE (BY DAY ID) WORD COUNT AUDIT OF JAVA BASICS (DAYS 1 TO 60) ===");

function getProse(p: any): string {
    if (typeof p.content === 'string') return p.content;
    if (Array.isArray(p.say)) return p.say.join(' ');
    if (typeof p.say === 'string') return p.say;
    return '';
}

for (let day = 1; day <= 60; day++) {
    const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);
    if (!lesson) {
        console.log(`Day ${day}: [MISSING LESSON OBJECT]`);
        continue;
    }
    const partWordCounts = lesson.parts.map((p: any) => {
        const text = getProse(p).trim();
        return text ? text.split(/\s+/).length : 0;
    });
    const minWc = Math.min(...partWordCounts);
    const maxWc = Math.max(...partWordCounts);
    const totalWc = partWordCounts.reduce((a, b) => a + b, 0);
    const allPass = partWordCounts.every(wc => wc >= 580);
    const status = allPass ? "PASS (>=580)" : `FAIL (min=${minWc})`;
    
    console.log(`Day ${day.toString().padStart(2, '0')}: ${status.padEnd(16)} | Total: ${totalWc.toString().padStart(4)}w | Parts: [${partWordCounts.join(', ')}]`);
}

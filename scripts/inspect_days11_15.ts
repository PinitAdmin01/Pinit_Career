import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

console.log("=== DETAILED INSPECTION: DAYS 11 TO 15 ===");

for (let day = 11; day <= 15; day++) {
    const config = JAVA_30_DAYS_CONFIGS.find((d: any) => d.day === day);
    const lesson = JAVA_BASICS_LONG_LESSONS.find((l: any) => l.day === day);
    
    console.log(`\n========================================`);
    console.log(`DAY ${day}`);
    console.log(`Config Title: ${config?.title}`);
    console.log(`Config Desc:  ${config?.desc}`);
    console.log(`Challenge: ${config?.eTitle}`);
    console.log(`Challenge Desc: ${config?.eDesc}`);
    console.log(`Challenge Starter: ${config?.eStarter?.slice(0, 100)}...`);
    console.log(`Lesson Title: ${lesson?.title}`);
    console.log(`Lesson Parts count: ${lesson?.parts?.length}`);
    lesson?.parts?.forEach((p: any, idx: number) => {
        const text = (typeof p.content === 'string') ? p.content : (Array.isArray(p.say) ? p.say.join(' ') : (p.say || ''));
        const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
        const checksCount = Array.isArray(p.checks) ? p.checks.length : (p.check ? 1 : 0);
        console.log(`   Part ${idx + 1}: "${p.title}" | Words: ${wc} | Checks: ${checksCount}`);
    });
}

import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

function countWords(part: any) {
  if (Array.isArray(part.say)) {
    return part.say.reduce((acc: number, p: string) => acc + (p || '').trim().split(/\s+/).filter(Boolean).length, 0);
  }
  if (typeof part.content === 'string') {
    return part.content.trim().split(/\s+/).filter(Boolean).length;
  }
  return 0;
}

const summary: Record<string, any>[] = [];
let passCount = 0;
let failCount = 0;

for (let d = 1; d <= 60; d++) {
  const lesson = JAVA_BASICS_LONG_LESSONS.find(l => l.day === d);
  if (!lesson) {
    summary.push({ day: d, status: 'MISSING' });
    failCount++;
    continue;
  }
  const parts = lesson.parts || [];
  const partWordCounts = parts.map(countWords);
  const totalWords = partWordCounts.reduce((a, b) => a + b, 0);
  const allParts580 = partWordCounts.length === 5 && partWordCounts.every(w => w >= 580);
  const hasCode = parts.every(p => p.code && p.code.trim().length > 30);
  
  if (allParts580) {
    passCount++;
  } else {
    failCount++;
  }

  summary.push({
    day: d,
    title: lesson.title,
    partWordCounts,
    totalWords,
    allParts580,
    hasCode,
    status: allParts580 ? 'PASS' : 'FAIL'
  });
}

console.log(`=== COURSE 01 GROUND TRUTH AUDIT SUMMARY ===`);
console.log(`TOTAL DAYS: 60 | PASS (all 5 parts >= 580w): ${passCount} | FAIL: ${failCount}`);

console.log("\n--- DETAILED BREAKDOWN BY BLOCK ---");
for (let b = 1; b <= 12; b++) {
  const startDay = (b - 1) * 5 + 1;
  const endDay = b * 5;
  const blockDays = summary.filter(s => s.day >= startDay && s.day <= endDay);
  const blockPass = blockDays.filter(s => s.status === 'PASS').length;
  console.log(`Block ${b} (Days ${startDay}-${endDay}): ${blockPass}/5 PASS`);
  for (const s of blockDays) {
    if (s.status !== 'PASS') {
      console.log(`  Day ${s.day} [${s.status}]: ${s.title}`);
      console.log(`    Part words: ${JSON.stringify(s.partWordCounts)} (Total: ${s.totalWords})`);
    }
  }
}

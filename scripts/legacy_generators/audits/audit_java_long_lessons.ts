import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';

console.log(`Total lessons in JAVA_BASICS_LONG_LESSONS: ${JAVA_BASICS_LONG_LESSONS.length}`);

interface DayStats {
  day: number;
  title: string;
  partsCount: number;
  partWords: number[];
  minPartWords: number;
  totalWords: number;
  checkQuestionsCount: number;
  hasVisualCode: boolean;
  passesInvariant: boolean; // each part >= 580 words
}

const stats: DayStats[] = [];

for (const lesson of JAVA_BASICS_LONG_LESSONS) {
  const partWords = lesson.parts.map(p => {
    const sayText = Array.isArray(p.say) ? p.say.join(' ') : String(p.say);
    return sayText.trim().split(/\s+/).filter(Boolean).length;
  });
  const minPartWords = Math.min(...partWords);
  const totalWords = partWords.reduce((a, b) => a + b, 0);
  const passesInvariant = lesson.parts.length === 5 && partWords.every(w => w >= 580);
  
  stats.push({
    day: lesson.day,
    title: lesson.title,
    partsCount: lesson.parts.length,
    partWords,
    minPartWords,
    totalWords,
    checkQuestionsCount: lesson.parts.filter(p => p.check && p.check.question).length,
    hasVisualCode: lesson.parts.every(p => !!p.code),
    passesInvariant
  });
}

console.log(`\n--- AUDIT SUMMARY (Days 1 to 60) ---`);
const failingDays = stats.filter(s => !s.passesInvariant);
console.log(`Passing Invariant (5 parts, all >= 580w): ${stats.length - failingDays.length} / ${stats.length}`);
if (failingDays.length > 0) {
  console.log(`\nFailing Days:`);
  for (const f of failingDays) {
    console.log(`  Day ${f.day.toString().padStart(2, '0')}: min=${f.minPartWords}w, total=${f.totalWords}w, parts=${f.partsCount}, wordsPerPart=[${f.partWords.join(', ')}] | ${f.title}`);
  }
}

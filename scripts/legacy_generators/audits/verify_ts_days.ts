import { IOT_EMB_LONG_LESSONS } from '../src/lib/data/iotEmbLongLessons';

console.log(`Total lessons in IOT_EMB_LONG_LESSONS: ${IOT_EMB_LONG_LESSONS.length}`);

for (const lesson of IOT_EMB_LONG_LESSONS) {
  if (lesson.day >= 36 && lesson.day <= 45) {
    let totalWords = 0;
    const partWords: number[] = [];
    for (const part of lesson.parts) {
      const words = part.say.reduce((sum, s) => sum + s.split(/\s+/).filter(Boolean).length, 0);
      partWords.push(words);
      totalWords += words;
    }
    console.log(`Day ${lesson.day}: declared minutes=${lesson.minutes}, total say words=${totalWords} (${(totalWords/120).toFixed(1)} mins spoken), parts=${JSON.stringify(partWords)}`);
  }
}

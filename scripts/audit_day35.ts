import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

const d35 = getLongLesson('iot_emb', 35);
console.log('Day 35 title:', d35?.title);
console.log('Day 35 parts:', d35?.parts.length);
if (d35) {
  let totalSayWords = 0;
  d35.parts.forEach((p, idx) => {
    const sayWords = p.say.join(' ').split(/\s+/).filter(Boolean).length;
    totalSayWords += sayWords;
    console.log('Part ' + (idx + 1) + ' say words: ' + sayWords);
  });
  console.log('Total say words: ' + totalSayWords);
  console.log('estimateSpokenMinutes: ' + estimateSpokenMinutes(d35));
  console.log('estimateLessonMinutes: ' + estimateLessonMinutes(d35));
}

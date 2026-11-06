import { getLongLesson, estimateSpokenMinutes, estimateLessonMinutes } from '../src/lib/data/longLessons';

for (let d = 11; d <= 30; d++) {
  const l = getLongLesson('java-basics', d)!;
  const spoken = estimateSpokenMinutes(l);
  const total = estimateLessonMinutes(l);
  const words = l.parts
    .flatMap((p) => [...p.say, p.example ?? '', p.tryIt ?? '', p.check.why])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  console.log(`Day ${d}: words=${words}, spoken=${spoken} min, total=${total} min`);
}

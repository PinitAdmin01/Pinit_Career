
const { JAVA_BASICS_LONG_LESSONS } = require('./src/lib/data/javaBasicsLongLessons');

function countWords(part) {
  if (Array.isArray(part.say)) {
    return part.say.reduce((acc, p) => acc + (p || '').trim().split(/\s+/).filter(Boolean).length, 0);
  }
  if (typeof part.content === 'string') {
    return part.content.trim().split(/\s+/).filter(Boolean).length;
  }
  return 0;
}

const results = [];
for (let d = 1; d <= 60; d++) {
  const lesson = JAVA_BASICS_LONG_LESSONS.find(l => l.day === d);
  if (!lesson) {
    results.push({ day: d, status: 'MISSING' });
    continue;
  }
  const parts = lesson.parts || [];
  const partWordCounts = parts.map(countWords);
  const totalWords = partWordCounts.reduce((a, b) => a + b, 0);
  const allParts580 = partWordCounts.length === 5 && partWordCounts.every(w => w >= 580);
  const hasCode = parts.every(p => p.code && p.code.trim().length > 30);
  
  results.push({
    day: d,
    title: lesson.title,
    partsCount: parts.length,
    partWordCounts,
    totalWords,
    allParts580,
    hasCode,
    status: allParts580 ? 'PASS' : 'FAIL'
  });
}

console.log(JSON.stringify(results, null, 2));

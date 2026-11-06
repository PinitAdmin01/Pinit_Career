with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import json
import re

# Find each day object
day_matches = list(re.finditer(r'\{\s*["\']?day["\']?:\s*(\d+)\s*,', text))
print(f"Total day objects found in javaBasicsLongLessons: {len(day_matches)}")

# Let's import JAVA_BASICS_LONG_LESSONS via node to get accurate parsed objects
node_script = """
const { JAVA_BASICS_LONG_LESSONS } = require('./src/lib/data/javaBasicsLongLessons');

function countWords(part) {
  if (Array.isArray(part.say)) {
    return part.say.reduce((acc, p) => acc + (p || '').trim().split(/\\s+/).filter(Boolean).length, 0);
  }
  if (typeof part.content === 'string') {
    return part.content.trim().split(/\\s+/).filter(Boolean).length;
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
"""

with open('scripts/node_audit_java.cjs', 'w', encoding='utf-8') as f_out:
    f_out.write(node_script)

print("Created scripts/node_audit_java.cjs")

import { NODE_WEB_LONG_LESSONS } from '../src/lib/data/nodeWebLongLessons';

const d1p1 = NODE_WEB_LONG_LESSONS[0].parts[0];
console.log('Node Day 1 Part 1 title:', d1p1.title);
console.log('Sentences count:', d1p1.say.length);
const words = d1p1.say.map(s => s.trim().split(/\s+/).filter(Boolean).length);
const totalW = words.reduce((a, b) => a + b, 0);
console.log('Total words:', totalW);
console.log('Words per sentence:', words);
console.log('\nFirst 4 sentences:');
d1p1.say.slice(0, 4).forEach((s, i) => console.log(`[${i+1}] (${words[i]}w): ${s}`));
console.log('\nLast 4 sentences:');
d1p1.say.slice(-4).forEach((s, i) => console.log(`[${d1p1.say.length - 4 + i + 1}] (${words[d1p1.say.length - 4 + i]}w): ${s}`));

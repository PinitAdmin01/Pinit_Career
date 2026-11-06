import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('src/lib/data').filter(f => f.includes('LongLessons'));
for (const f of files) {
  const content = fs.readFileSync(path.join('src/lib/data', f), 'utf8');
  const dayMatches = [...content.matchAll(/day:\s*(\d+)/g)].map(m => parseInt(m[1]));
  const uniqueDays = [...new Set(dayMatches)].sort((a,b)=>a-b);
  console.log(`${f.padEnd(35)} Count: ${String(uniqueDays.length).padStart(2)} Max: ${String(Math.max(...uniqueDays, 0)).padStart(2)} Range: ${uniqueDays[0] || 0}..${uniqueDays[uniqueDays.length-1] || 0}`);
}

import fs from 'fs';

const content = fs.readFileSync('src/lib/data/softSkillsLongLessons.ts', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
console.log('First 20 lines:');
console.log(lines.slice(0, 20).join('\n'));
console.log('Last 40 lines:');
console.log(lines.slice(-40).join('\n'));

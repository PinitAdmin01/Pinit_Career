import * as fs from 'fs';

const content = fs.readFileSync('tests/systems_long_lessons_parity.test.ts', 'utf8');
const matches = [...content.matchAll(/getLongLesson\(['"]git_vcs['"],\s*(\d+)\)/g)].map(m => parseInt(m[1]));
const uniqueDays = [...new Set(matches)].sort((a,b) => a-b);
console.log('Tested git_vcs days count:', uniqueDays.length, 'min:', Math.min(...uniqueDays), 'max:', Math.max(...uniqueDays));

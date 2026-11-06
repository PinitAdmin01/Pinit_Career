import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const start = html.indexOf('Day 45: ⭐ Milestone 8');
const end = html.indexOf('Day 51: Operating System Threads');
console.log(html.substring(start, end));

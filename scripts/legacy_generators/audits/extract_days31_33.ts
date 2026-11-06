import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const start = html.indexOf('5.3 Month 2 Masterclass Blueprint');
const d31 = html.indexOf('>Day 31<', start);
const d34 = html.indexOf('>Day 34<', d31);

console.log(html.substring(d31 - 100, d34));

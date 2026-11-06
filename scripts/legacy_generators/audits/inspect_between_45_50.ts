import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const d45 = html.indexOf('>Day 45<');
const d50 = html.indexOf('>Day 50<', d45);
console.log('d45:', d45, 'd50:', d50);
console.log(html.substring(d45, d50 + 200));

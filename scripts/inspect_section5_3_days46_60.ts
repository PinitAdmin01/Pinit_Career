import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const start = html.indexOf('5.3 Month 2 Masterclass Blueprint');
const end = html.indexOf('6.1 Course Identity &amp; Architecture Matrix', start);
const section = html.substring(start, end);

const dayMatches = [...section.matchAll(/Day\s+(4[6-9]|50|5[1-9]|60)/g)];
console.log('Found days in Section 5.3:');
const uniqueDays = new Set();
for (const m of dayMatches) {
  const dayStr = m[0];
  if (!uniqueDays.has(dayStr)) {
    uniqueDays.add(dayStr);
    const pos = m.index;
    console.log(section.substring(pos, pos + 200).replace(/\n/g, ' '));
  }
}

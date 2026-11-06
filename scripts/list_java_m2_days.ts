import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const start = html.indexOf('5.3 Month 2 Masterclass Blueprint');
const end = html.indexOf('6.1 Course Identity &amp; Architecture Matrix', start);
const section = html.substring(start, end);

const regex = /<span style="[^"]*">Day (\d+)<\/span>\s*<strong style="[^"]*">([^<]+)<\/strong>/g;
let match;
while ((match = regex.exec(section)) !== null) {
  console.log(`Day ${match[1]}: ${match[2]}`);
}

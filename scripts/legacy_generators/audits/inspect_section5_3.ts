import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const start = html.indexOf('5.3 Month 2 Masterclass Blueprint');
const end = html.indexOf('6.1 Course Identity &amp; Architecture Matrix', start);
console.log(html.substring(start, start + 4000));

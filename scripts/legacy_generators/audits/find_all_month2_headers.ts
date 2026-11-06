import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const regex = /<h2>(.*?(?:Month 2|Days 31).*?)<\/h2>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(match[1]);
}

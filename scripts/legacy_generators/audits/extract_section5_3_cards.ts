import fs from 'fs';

const html = fs.readFileSync('docs/visuals/PINIT_MASTER_DEBUG.html', 'utf8');
const start = html.indexOf('5.3 Month 2 Masterclass Blueprint');
const end = html.indexOf('Part VI', start);
const section = html.substring(start, end !== -1 ? end : start + 300000);

console.log('Section length:', section.length);

const regex = /Day\s+(\d+)<\/span>\s*<strong[^>]*>([^<]+)<\/strong>/g;
let match;
const daysFound: Record<string, string> = {};
while ((match = regex.exec(section)) !== null) {
  if (!daysFound[match[1]]) {
    daysFound[match[1]] = match[2].trim();
    console.log(`Day ${match[1]}: ${match[2].trim()}`);
  }
}

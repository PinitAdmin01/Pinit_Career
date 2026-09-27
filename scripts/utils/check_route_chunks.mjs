import fs from 'fs';
import path from 'path';

const routes = [
  'out/index.html',
  'out/login/index.html',
  'out/dashboard/index.html',
  'out/quests/index.html'
];

routes.forEach(route => {
  const fullPath = path.resolve(route);
  if (fs.existsSync(fullPath)) {
    const html = fs.readFileSync(fullPath, 'utf8');
    const matches = Array.from(new Set(html.match(/_next\/static\/chunks\/[^"']+\.js/g) || []));
    console.log(`\n========================================`);
    console.log(`Route: ${route}`);
    console.log(`Direct chunk tags: ${matches.length}`);
    let totalDirectSize = 0;
    let hasHugeChunk = false;
    matches.forEach(m => {
      const outChunkRelative = m.replace('_next/', 'out/_next/');
      let size = 0;
      if (fs.existsSync(outChunkRelative)) {
        size = fs.statSync(outChunkRelative).size;
      }
      totalDirectSize += size;
      const sizeKb = (size / 1024).toFixed(2);
      if (size > 500 * 1024) {
        hasHugeChunk = true;
        console.log(`  ?? LARGE: ${m} (${sizeKb} KB)`);
      } else {
        console.log(`  - ${m} (${sizeKb} KB)`);
      }
    });
    console.log(`Total Initial JS for route: ${(totalDirectSize / 1024).toFixed(2)} KB`);
    console.log(`Contains 10MB chunk directly: ${hasHugeChunk}`);
  } else {
    console.log(`Route ${route} not found.`);
  }
});

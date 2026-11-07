const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.git' && item.name !== '.next') {
      files = files.concat(walk(full));
    } else if (/\.(ts|tsx|js|mjs)$/.test(item.name)) {
      files.push(full);
    }
  }
  return files;
}

const appFiles = walk('src');
const tables = new Map();

for (const f of appFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /(?:supabase|admin|sbAdmin|supabaseAdmin)\s*\.\s*from\s*\(\s*['"]([a-zA-Z0-9_]+)['"]\s*\)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const t = m[1];
    if (!tables.has(t)) tables.set(t, []);
    tables.get(t).push(path.relative('src', f).replace(/\\/g, '/'));
  }
}

const sorted = Array.from(tables.keys()).sort();
console.log('TOTAL DISTINCT TABLES CALLED BY APP:', sorted.length);
sorted.forEach(t => console.log(t + ' | ' + tables.get(t).length + ' calls'));

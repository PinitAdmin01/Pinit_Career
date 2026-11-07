const fs = require('fs');
const path = require('path');

function walk(dir, ext) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.git' && item.name !== '.next') {
      files = files.concat(walk(full, ext));
    } else if (item.name.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

const appFiles = walk('src', '.ts').concat(walk('src', '.tsx'));
const appTables = new Map();
for (const f of appFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /(?:supabase|admin|sbAdmin|supabaseAdmin)\s*\.\s*from\s*\(\s*['"]([a-zA-Z0-9_]+)['"]\s*\)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const t = m[1].toLowerCase();
    if (!appTables.has(t)) appTables.set(t, []);
    appTables.get(t).push(path.relative('src', f).replace(/\\/g, '/'));
  }
}

const sqlFiles = walk('supabase', '.sql');
const sqlTables = new Map();
for (const f of sqlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi);
  for (const m of matches) {
    const t = m[1].toLowerCase();
    if (t !== 'if') {
      if (!sqlTables.has(t)) sqlTables.set(t, []);
      sqlTables.get(t).push(path.relative('supabase', f).replace(/\\/g, '/'));
    }
  }
}

console.log('App tables called in src/:', appTables.size);
console.log('SQL tables declared in supabase/:', sqlTables.size);

const missingInSql = [];
for (const [t, callers] of appTables.entries()) {
  if (!sqlTables.has(t)) {
    missingInSql.push({ table: t, callers: callers });
  }
}

console.log('\n=== TABLES CALLED IN CODE BUT MISSING IN SUPABASE SQL SCHEMAS (' + missingInSql.length + ') ===');
missingInSql.sort((a,b) => a.table.localeCompare(b.table)).forEach(item => {
  console.log(`- ${item.table} (called in ${item.callers.length} files: ${item.callers[0]})`);
});

const unusedInApp = [];
for (const [t, sqlSources] of sqlTables.entries()) {
  if (!appTables.has(t)) {
    unusedInApp.push({ table: t, source: sqlSources[0] });
  }
}

console.log('\n=== TABLES IN SQL SCHEMAS NOT CURRENTLY CALLED IN APP CODE (' + unusedInApp.length + ') ===');
unusedInApp.sort((a,b) => a.table.localeCompare(b.table)).forEach(item => {
  console.log(`- ${item.table} (${item.source})`);
});

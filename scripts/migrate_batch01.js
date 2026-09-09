// scratch/migrate_batch01.js
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/vinay/Desktop/project working/Present-Career-os';
const BATCH_FILE = path.join(ROOT, 'scripts', 'batches', 'batch-01.txt');
const SNAP_FILE = path.join(ROOT, 'scripts', '.colour-batch-snapshot.json');

const snap = JSON.parse(fs.readFileSync(SNAP_FILE, 'utf8')).snap;
const files = fs.readFileSync(BATCH_FILE, 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l && !l.startsWith('#'));

const PROTECTED = {
  'certificate gold': [/#D4AF37/gi, /#8e701d/gi, /#aa7c11/gi, /#4a3306/gi, /#f3e5ab/gi],
  'projects gradient': [/#060B19/gi, /#091128/gi, /#0B1226/gi, /#0d162f/gi, /#0e1b38/gi],
};

function statText(text) {
  const crlf = (text.match(/\r\n/g) || []).length;
  const lfTotal = (text.match(/\n/g) || []).length;
  const protectedCounts = {};
  for (const [name, patterns] of Object.entries(PROTECTED)) {
    protectedCounts[name] = patterns.reduce((n, p) => n + (text.match(p) || []).length, 0);
  }
  const hex6 = (text.match(/#[0-9a-fA-F]{6}\b/g) || []).length;
  const hex3 = (text.match(/#[0-9a-fA-F]{3}\b/g) || []).length;
  const rgba = (text.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g) || []).length;
  return {
    hex6, hex3, rgba, total: hex6 + hex3 + rgba,
    crlf, lf: lfTotal - crlf, lines: lfTotal,
    protectedCounts
  };
}

function migrateText(content, filePath) {
  let s = content;

  // 1. Status & Accent Hexes (single & double quote wrappers)
  const hexReplacements = [
    [/'#10b981'/gi, "'var(--success)'"],
    [/"#10b981"/gi, '"var(--success)"'],
    [/'#34d399'/gi, "'var(--success-bright)'"],
    [/"#34d399"/gi, '"var(--success-bright)"'],
    [/'#059669'/gi, "'var(--success-deep)'"],
    [/"#059669"/gi, '"var(--success-deep)"'],
    [/'#ef4444'/gi, "'var(--danger)'"],
    [/"#ef4444"/gi, '"var(--danger)"'],
    [/'#f87171'/gi, "'var(--danger-bright)'"],
    [/"#f87171"/gi, '"var(--danger-bright)"'],
    [/'#dc2626'/gi, "'var(--danger-deep)'"],
    [/"#dc2626"/gi, '"var(--danger-deep)"'],
    [/'#f59e0b'/gi, "'var(--warning)'"],
    [/"#f59e0b"/gi, '"var(--warning)"'],
    [/'#fbbf24'/gi, "'var(--warning-bright)'"],
    [/"#fbbf24"/gi, '"var(--warning-bright)"'],
    [/'#3b82f6'/gi, "'var(--info)'"],
    [/"#3b82f6"/gi, '"var(--info)"'],
    [/'#60a5fa'/gi, "'var(--info-bright)'"],
    [/"#60a5fa"/gi, '"var(--info-bright)"'],
    [/'#8b5cf6'/gi, "'var(--reward)'"],
    [/"#8b5cf6"/gi, '"var(--reward)"'],
    [/'#a78bfa'/gi, "'var(--reward-bright)'"],
    [/"#a78bfa"/gi, '"var(--reward-bright)"'],
    [/'#14b8a6'/gi, "'var(--accent-teal)'"],
    [/"#14b8a6"/gi, '"var(--accent-teal)"'],
    [/'#06b6d4'/gi, "'var(--accent-cyan)'"],
    [/"#06b6d4"/gi, '"var(--accent-cyan)"'],
    [/'#6366f1'/gi, "'var(--brand)'"],
    [/"#6366f1"/gi, '"var(--brand)"']
  ];

  for (const [re, rep] of hexReplacements) {
    s = s.replace(re, rep);
  }

  // 2. Translucent RGBA Triplets
  const rgbaReplacements = [
    [/rgba\(\s*16\s*,\s*185\s*,\s*129\s*,/g, 'rgba(var(--success-rgb), '],
    [/rgba\(\s*5\s*,\s*150\s*,\s*105\s*,/g, 'rgba(var(--success-deep-rgb), '],
    [/rgba\(\s*239\s*,\s*68\s*,\s*68\s*,/g, 'rgba(var(--danger-rgb), '],
    [/rgba\(\s*245\s*,\s*158\s*,\s*11\s*,/g, 'rgba(var(--warning-rgb), '],
    [/rgba\(\s*59\s*,\s*130\s*,\s*246\s*,/g, 'rgba(var(--info-rgb), '],
    [/rgba\(\s*139\s*,\s*92\s*,\s*246\s*,/g, 'rgba(var(--reward-rgb), '],
    [/rgba\(\s*20\s*,\s*184\s*,\s*166\s*,/g, 'rgba(var(--accent-teal-rgb), '],
    [/rgba\(\s*6\s*,\s*182\s*,\s*212\s*,/g, 'rgba(var(--accent-cyan-rgb), '],
    [/rgba\(\s*99\s*,\s*102\s*,\s*241\s*,/g, 'rgba(var(--brand-rgb), ']
  ];

  for (const [re, rep] of rgbaReplacements) {
    s = s.replace(re, rep);
  }

  // 3. Text Colours (CSS color properties only - avoid surface background #fff/#ffffff)
  s = s.replace(/color:\s*'#fff'/gi, "color: 'var(--text)'");
  s = s.replace(/color:\s*"#fff"/gi, 'color: "var(--text)"');
  s = s.replace(/color:\s*'#ffffff'/gi, "color: 'var(--text)'");
  s = s.replace(/color:\s*"#ffffff"/gi, 'color: "var(--text)"');
  s = s.replace(/color:\s*'#f1f5f9'/gi, "color: 'var(--text)'");
  s = s.replace(/color:\s*"#f1f5f9"/gi, 'color: "var(--text)"');
  s = s.replace(/color:\s*'#94a3b8'/gi, "color: 'var(--text-muted)'");
  s = s.replace(/color:\s*"#94a3b8"/gi, 'color: "var(--text-muted)"');
  s = s.replace(/color:\s*'#cbd5e1'/gi, "color: 'var(--text-muted)'");
  s = s.replace(/color:\s*"#cbd5e1"/gi, 'color: "var(--text-muted)"');
  s = s.replace(/color:\s*'#e2e8f0'/gi, "color: 'var(--text-muted)'");
  s = s.replace(/color:\s*"#e2e8f0"/gi, 'color: "var(--text-muted)"');
  s = s.replace(/color:\s*'#64748b'/gi, "color: 'var(--text-dim)'");
  s = s.replace(/color:\s*"#64748b"/gi, 'color: "var(--text-dim)"');
  s = s.replace(/color:\s*'#475569'/gi, "color: 'var(--text-dim)'");
  s = s.replace(/color:\s*"#475569"/gi, 'color: "var(--text-dim)"');

  // Ternary and conditional text colour expressions
  s = s.replace(/'#fff'\s*:\s*'var\(--t2\)'/g, "'var(--text)' : 'var(--t2)'");
  s = s.replace(/:\s*'#ffffff'/g, ": 'var(--text)'");
  s = s.replace(/:\s*'#fff'/g, ": 'var(--text)'");

  // 4. Uppercase hex replacements (unquoted & CSS property mappings)
  s = s.replace(/#10B981\b/g, 'var(--success)');
  s = s.replace(/#94A3B8\b/g, 'var(--text-muted)');
  s = s.replace(/#64748B\b/g, 'var(--text-dim)');
  s = s.replace(/#7C3AED\b/g, 'var(--reward)');
  s = s.replace(/#A855F7\b/g, 'var(--reward-bright)');
  s = s.replace(/#06B6D4\b/g, 'var(--accent-cyan)');

  return s;
}

const isDryRun = process.argv.includes('--dry-run');

console.log('Executing Batch 01 Colour Migration (' + (isDryRun ? 'DRY RUN' : 'APPLYING') + ')...\n');
let totalBefore = 0;
let totalAfter = 0;
let problemCount = 0;

for (const relPath of files) {
  const absPath = path.join(ROOT, relPath);
  const rawBefore = fs.readFileSync(absPath, 'utf8');
  const migrated = migrateText(rawBefore, relPath);

  const beforeStat = snap[relPath];
  const afterStat = statText(migrated);

  const removed = beforeStat.total - afterStat.total;
  totalBefore += beforeStat.total;
  totalAfter += afterStat.total;

  console.log('  ' + relPath.padEnd(52) + ' before: ' + String(beforeStat.total).padStart(4) + ' | after: ' + String(afterStat.total).padStart(4) + ' | removed: ' + String(removed).padStart(4));

  if (removed === 0) {
    console.error('    ERROR: File untouched (' + relPath + ')');
    problemCount++;
  }
  if (beforeStat.crlf !== afterStat.crlf || beforeStat.lf !== afterStat.lf) {
    console.error('    ERROR: Line endings changed in ' + relPath + '! before: crlf=' + beforeStat.crlf + ', lf=' + beforeStat.lf + ' | after: crlf=' + afterStat.crlf + ', lf=' + afterStat.lf);
    problemCount++;
  }
  if (beforeStat.lines !== afterStat.lines) {
    console.error('    ERROR: Line count changed in ' + relPath + '! ' + beforeStat.lines + ' -> ' + afterStat.lines);
    problemCount++;
  }
  for (const [palName, bCount] of Object.entries(beforeStat.protectedCounts)) {
    const aCount = afterStat.protectedCounts[palName] || 0;
    if (bCount !== aCount) {
      console.error('    ERROR: Protected palette "' + palName + '" modified in ' + relPath + '! (' + bCount + ' -> ' + aCount + ')');
      problemCount++;
    }
  }

  if (!isDryRun && problemCount === 0) {
    fs.writeFileSync(absPath, migrated, 'utf8');
  }
}

console.log('\n----------------------------------------------------------------------------');
console.log('Total Before: ' + totalBefore + ' | Total After: ' + totalAfter + ' | Migrated: ' + (totalBefore - totalAfter) + ' (' + ((totalBefore - totalAfter) * 100 / totalBefore).toFixed(1) + '%)');
console.log('Problems detected: ' + problemCount);

if (problemCount > 0) {
  console.error('\nFAIL: Migration aborted due to validation problems.');
  process.exit(1);
} else {
  console.log('\nPASS: All 10 files processed cleanly.');
}

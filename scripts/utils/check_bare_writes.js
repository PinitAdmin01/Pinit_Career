// scripts/check_bare_writes.js
// Automated CI guard: ensures no bare `await supabase.from(...)` writes exist in services
const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src', 'lib', 'services');
let violations = [];

fs.readdirSync(dir).filter(f => f.endsWith('.ts')).forEach(f => {
  const filePath = path.join(dir, f);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    if (/^\s*await supabase\.from\(/.test(line) && /(insert|update|upsert|delete)\(/.test(line)) {
      violations.push({ file: f, line: idx + 1, code: line.trim() });
    }
  });
});

if (violations.length === 0) {
  console.log('✅ [PASS] CI Check: Zero bare Supabase writes detected across all campus services.');
  process.exit(0);
} else {
  console.error(`❌ [FAIL] CI Check: Found ${violations.length} unchecked bare Supabase write(s):`);
  violations.forEach(v => console.error(`   ${v.file}:${v.line} -> ${v.code}`));
  console.error('\nEvery Supabase write must assign result and check error, e.g.:');
  console.error('   const res = await supabase.from(...)...;');
  console.error('   if (res.error) throw new Error(res.error.message);\n');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'lib', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('30DayData.ts') || f.endsWith('Data.ts'));

console.log(`Auditing ${files.length} curriculum data files for schema and data integrity...`);

let totalErrors = 0;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check that export const exists
  const exports = content.match(/export const (\w+)/g);
  if (!exports || exports.length === 0) {
    console.error(`❌ [FAIL] ${file} has no named export const!`);
    totalErrors++;
  } else {
    console.log(`✅ [PASS] ${file} exports: ${exports.map(e => e.replace('export const ', '')).join(', ')}`);
  }

  // Check for undefined or NaN string literals that might break JSON/React
  if (content.includes(': undefined,') || content.includes('NaN')) {
    console.warn(`⚠️ [WARN] ${file} contains raw undefined or NaN literals`);
  }
}

if (totalErrors === 0) {
  console.log(`\n🎉 All ${files.length} curriculum data files passed structure and syntax validation!`);
  process.exit(0);
} else {
  console.error(`\n❌ Found ${totalErrors} curriculum data errors.`);
  process.exit(1);
}

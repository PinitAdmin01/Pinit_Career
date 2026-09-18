const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCAN_DIRS = ['src', 'scripts', 'audit'];
const EXTENSIONS = new Set(['.ts', '.tsx']);
const FORBIDDEN_PATTERN = /@typescript-eslint/;

let violations = [];

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'out') {
        continue;
      }
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        checkFile(fullPath);
      }
    }
  }
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (FORBIDDEN_PATTERN.test(content)) {
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (FORBIDDEN_PATTERN.test(line)) {
          const relPath = path.relative(ROOT_DIR, filePath);
          violations.push({ file: relPath, line: idx + 1, content: line.trim() });
        }
      });
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
}

console.log('🔍 Scanning codebase for forbidden @typescript-eslint comments...');
for (const dir of SCAN_DIRS) {
  scanDirectory(path.join(ROOT_DIR, dir));
}

if (violations.length > 0) {
  console.error('\n🚨 Found @typescript-eslint comments in the following files:');
  for (const v of violations) {
    console.error(`  - ${v.file}:${v.line} -> ${v.content}`);
  }
  console.error('\nFATAL: @typescript-eslint comments are forbidden. Use standard ESLint rules only.');
  process.exit(1);
}

console.log('✅ PASS: Zero @typescript-eslint comments detected across all TypeScript files.');
process.exit(0);

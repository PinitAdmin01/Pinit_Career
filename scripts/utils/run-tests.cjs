/**
 * Cross-platform test runner for `npm test`.
 * Discovers all *.test.ts files under tests/ (excluding e2e) and passes them to tsx --test.
 * Avoids shell globbing and quote mismatch across Windows, Linux, and macOS.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const TESTS_DIR = path.join(ROOT, 'tests');

function getTestFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'e2e' && entry.name !== 'fixtures' && entry.name !== 'helpers') {
        results = results.concat(getTestFiles(fullPath));
      }
    } else if (entry.name.endsWith('.test.ts')) {
      const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      results.push(relPath);
    }
  }
  return results;
}

const files = getTestFiles(TESTS_DIR);
if (files.length === 0) {
  console.error('No test files found in tests/');
  process.exit(1);
}

const tsxCli = require.resolve('tsx/cli');
const result = spawnSync(process.execPath, [tsxCli, '--test', '--test-reporter=spec', ...files], {
  cwd: ROOT,
  stdio: 'inherit',
});

process.exit(result.status ?? (result.error ? 1 : 0));

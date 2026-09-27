// scripts/scan_real_secrets.ts
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync('.env', 'utf-8');
const secrets: { key: string; val: string }[] = [];

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx > 0) {
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    // Only test non-public secrets with length > 8
    if (!key.startsWith('NEXT_PUBLIC_') && val.length > 8) {
      secrets.push({ key, val });
    }
  }
}

console.log(`Auditing ${secrets.length} backend-only secrets against production bundle...`);

function readFileWithRetry(filePath: string, retries = 5): string {
  for (let i = 0; i < retries; i++) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (err: any) {
      if ((err.code === 'EBUSY' || err.code === 'EPERM') && i < retries - 1) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150);
        continue;
      }
      throw err;
    }
  }
  return fs.readFileSync(filePath, 'utf-8');
}

let leaks = 0;
function scanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (['.js', '.html', '.json', '.map'].includes(path.extname(entry.name).toLowerCase())) {
      const content = readFileWithRetry(full);
      for (const s of secrets) {
        if (content.includes(s.val)) {
          console.error(`🚨 [CRITICAL LEAK] Backend secret ${s.key} exposed in ${path.relative(process.cwd(), full)}`);
          leaks++;
        }
      }
    }
  }
}

scanDir('out');

if (leaks === 0) {
  console.log('✅ [PASS] 0 leaks found. No actual backend secrets (service role, DB passwords, private API keys) exist in out/.');
  process.exit(0);
} else {
  console.error(`❌ [FAIL] Found ${leaks} actual secret leaks!`);
  process.exit(1);
}

// scripts/audit_production_performance.ts
import fs from 'fs';
import path from 'path';

function getFileSize(relPath: string): { bytes: number; kb: string } {
  const full = path.join(process.cwd(), relPath);
  if (!fs.existsSync(full)) return { bytes: 0, kb: 'N/A' };
  const stats = fs.statSync(full);
  return { bytes: stats.size, kb: (stats.size / 1024).toFixed(2) + ' KB' };
}

console.log('========================================================================');
console.log('⚡ PRODUCTION PERFORMANCE & BUNDLE SIZE AUDIT');
console.log('========================================================================\n');

const htmlPages = [
  'out/index.html',
  'out/login/index.html',
  'out/dashboard/index.html',
  'out/quests/index.html',
  'out/quests/lesson/index.html',
  'out/onboarding/index.html',
];

console.log('── INITIAL DOCUMENT SIZES (HTML) ──');
for (const p of htmlPages) {
  const s = getFileSize(p);
  console.log(`  • ${p.padEnd(32)}: ${s.kb} (${s.bytes} bytes)`);
}

console.log('\n── SHARED RUNTIME JS BUNDLES (CRITICAL PATH) ──');
const staticChunksDir = path.join(process.cwd(), 'out', '_next', 'static', 'chunks');
let totalJsBytes = 0;
let chunkCount = 0;

if (fs.existsSync(staticChunksDir)) {
  const files = fs.readdirSync(staticChunksDir);
  for (const f of files) {
    if (f.endsWith('.js')) {
      chunkCount++;
      const full = path.join(staticChunksDir, f);
      const b = fs.statSync(full).size;
      totalJsBytes += b;
      if (b > 100 * 1024) {
        console.log(`  ⚠️ Large Chunk: ${f} -> ${(b / 1024).toFixed(2)} KB`);
      }
    }
  }
}

console.log(`\n  • Total JS Chunks in chunks/: ${chunkCount} chunks`);
console.log(`  • Total Cumulative JS Volume: ${(totalJsBytes / 1024 / 1024).toFixed(2)} MB`);

console.log('\n========================================================================');

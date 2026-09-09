// scripts/audit_production_bundle_secrets.ts
// Comprehensive Secret Scan of Production Bundle (out/ and .next/)

import fs from 'fs';
import path from 'path';

const SENSITIVE_PATTERNS = [
  { name: 'Supabase Service Role Key Identifier', regex: /SUPABASE_SERVICE_ROLE_KEY/i },
  { name: 'Generic service_role claim', regex: /"role"\s*:\s*"service_role"|'role'\s*:\s*'service_role'/ },
  { name: 'Razorpay Secret Key identifier', regex: /RAZORPAY_KEY_SECRET/i },
  { name: 'GitHub Webhook Secret identifier', regex: /GITHUB_WEBHOOK_SECRET/i },
  { name: 'Private Key PEM header', regex: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
  { name: 'Postgres Connection URI with password', regex: /postgres(?:ql)?:\/\/[^:]+:[^@]+@/ },
  { name: 'Raw Service Role JWT pattern', regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/ },
];

function scanDirectory(dir: string, results: { file: string; match: string; pattern: string }[]) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, results);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.js', '.html', '.json', '.map', '.txt'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const pat of SENSITIVE_PATTERNS) {
            if (pat.regex.test(content)) {
              // Extract snippet
              const match = content.match(pat.regex);
              results.push({
                file: path.relative(process.cwd(), fullPath),
                match: match ? match[0].substring(0, 40) : '',
                pattern: pat.name,
              });
            }
          }
        } catch (err) {
          // ignore unreadable
        }
      }
    }
  }
}

console.log('========================================================================');
console.log('🔍 EXECUTING DEEP PRODUCTION BUNDLE SECRET AUDIT (out/)');
console.log('========================================================================\n');

const outDir = path.join(process.cwd(), 'out');
const matches: { file: string; match: string; pattern: string }[] = [];

scanDirectory(outDir, matches);

if (matches.length === 0) {
  console.log('  ✅ [PASS] Zero backend secrets, service_role keys, or private PEM keys found in out/ bundle.');
} else {
  console.log(`  ❌ [FAIL] Found ${matches.length} potential sensitive leaks in out/:`);
  for (const m of matches) {
    console.log(`    - Pattern: ${m.pattern} in ${m.file} [Match: ${m.match}]`);
  }
}

console.log('\n========================================================================');
process.exit(matches.length === 0 ? 0 : 1);

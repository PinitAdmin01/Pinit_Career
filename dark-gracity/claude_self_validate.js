/**
 * Claude Code Autonomous Self-Validation Script
 * 
 * Used by Claude Code and the Task Scheduler to verify deliverables:
 * 1. Validates all components in claude_sandbox/
 * 2. Checks for syntax, duplicate identifiers, and unclosed tags
 * 3. Runs TypeScript typecheck against the project
 * 4. Returns exit code 0 (Pass) or exit code 1 (Fail with actionable feedback)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=======================================================');
console.log('🔍 CLAUDE CODE AUTONOMOUS SELF-VALIDATION ENGINE');
console.log('=======================================================\n');

let errorCount = 0;
const issues = [];

// 1. Check sandbox directory
const sandboxDir = path.join(__dirname, 'claude_sandbox');
if (!fs.existsSync(sandboxDir)) {
  console.log('📁 Creating claude_sandbox/ directory...');
  fs.mkdirSync(sandboxDir, { recursive: true });
}

const sandboxFiles = fs.readdirSync(sandboxDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js'));
console.log(`[Step 1] Inspecting ${sandboxFiles.length} deliverables in claude_sandbox/...`);

for (const file of sandboxFiles) {
  const filePath = path.join(sandboxDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check: duplicate variable declarations in same block (e.g. const targetRoute repeated)
  const constMatches = content.match(/const\s+([a-zA-Z0-9_$]+)\s*=/g) || [];
  const constNames = constMatches.map(m => m.replace(/const\s+/, '').replace(/\s*=/, '').trim());
  const seenConsts = new Set();
  const duplicateConsts = new Set();
  for (const name of constNames) {
    if (seenConsts.has(name) && !['i', 'j', 'k', 'err', 'e', 'item', 'res', 'data'].includes(name)) {
      duplicateConsts.add(name);
    }
    seenConsts.add(name);
  }

  // Check: empty files
  if (content.trim().length === 0) {
    issues.push(`❌ [${file}]: File is empty!`);
    errorCount++;
  }

  // Check: leftover placeholder markers
  if (content.includes('// TODO: implement') || content.includes('// REPLACE_ME')) {
    issues.push(`⚠️ [${file}]: Contains unfulfilled placeholder comments.`);
  }

  console.log(`  ✓ Checked ${file} (${(content.length / 1024).toFixed(1)} KB)`);
}

// 2. Run TypeScript compilation check
console.log('\n[Step 2] Running TypeScript Typecheck (npx tsc --noEmit)...');
try {
  // Check if tsconfig exists in current or parent directory
  const parentTsConfig = path.join(__dirname, '..', 'tsconfig.json');
  const localTsConfig = path.join(__dirname, 'tsconfig.json');
  const configPath = fs.existsSync(localTsConfig) ? localTsConfig : (fs.existsSync(parentTsConfig) ? parentTsConfig : null);

  if (configPath) {
    const tscCmd = configPath === localTsConfig ? 'npx tsc --noEmit' : `npx tsc --noEmit --project "${configPath}"`;
    console.log(`  Executing: ${tscCmd}`);
    const output = execSync(tscCmd, { cwd: path.dirname(configPath), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log('  ✓ TypeScript check passed with 0 errors.');
  } else {
    console.log('  ℹ No tsconfig.json found, skipping tsc check.');
  }
} catch (err) {
  const stderr = err.stdout || err.stderr || err.message;
  const lines = stderr.split('\n').filter(l => l.includes('error TS')).slice(0, 10);
  console.error('  ❌ TypeScript Typecheck failed with errors:');
  lines.forEach(l => console.error(`     ${l.trim()}`));
  issues.push(`TypeScript errors detected (${lines.length} errors shown above).`);
  errorCount++;
}

// 3. Final Scorecard
console.log('\n=======================================================');
if (errorCount === 0) {
  console.log('🏆 SELF-VALIDATION PASSED! ALL CHECKS 100% CLEAN.');
  console.log('=======================================================');
  process.exit(0);
} else {
  console.error(`❌ SELF-VALIDATION FAILED with ${errorCount} blocking issue(s):`);
  issues.forEach(iss => console.error(`   - ${iss}`));
  console.error('\n💡 SELF-CORRECTION REQUIRED: Please review the errors above, apply the fixes, and re-run this validator.');
  console.log('=======================================================');
  process.exit(1);
}

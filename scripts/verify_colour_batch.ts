/**
 * scripts/verify_colour_batch.ts
 *
 * Adversarial verifier for colour-token migration batches.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS
 * ─────────────────────────────────────────────────────────────────────────────
 * Migration work is reported by whoever does it, and reports have been wrong
 * in both directions on this project:
 *
 *   - A previous remediation pass reported 21 services swept; 2 were missed.
 *   - Colour counts were reported hex-only three times, undercounting the real
 *     total by 44%, 60% and 50% because rgba() and #fff forms were ignored.
 *   - `sed -i` silently rewrote 3,309 line endings while reporting a ~115 line
 *     change, which made the diff unreviewable.
 *
 * So this script does not read reports. It reads the files.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────────────────────
 *   BEFORE the work:  npx tsx scripts/verify_colour_batch.ts snapshot <batch.txt>
 *   AFTER the work:   npx tsx scripts/verify_colour_batch.ts verify   <batch.txt>
 *
 * <batch.txt> is one repo-relative file path per line.
 *
 * Exit code 0 = batch genuinely complete. Non-zero = something is wrong, and
 * the output says exactly what.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = path.join(__dirname, '..');
const SNAP = path.join(__dirname, '.colour-batch-snapshot.json');

// Colour forms. Missing any one of these is how every previous undercount
// happened, so all three are always counted together.
const RE_HEX6 = /#[0-9a-fA-F]{6}\b/g;
const RE_HEX3 = /#[0-9a-fA-F]{3}\b/g;
const RE_RGBA = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g;

// Palettes that must survive untouched. Blanket consolidation would destroy
// these — they are deliberate design, not accidental inconsistency.
const PROTECTED: Record<string, RegExp[]> = {
  'certificate gold': [/#D4AF37/gi, /#8e701d/gi, /#aa7c11/gi, /#4a3306/gi, /#f3e5ab/gi],
  'projects gradient': [/#060B19/gi, /#091128/gi, /#0B1226/gi, /#0d162f/gi, /#0e1b38/gi],
};

// ── CONTEXTS WHERE var() IS NOT A COLOUR ─────────────────────────────────────
// Added after batch 02, where FaceAnalyzer.tsx had its canvas colours migrated
// to `ctx.fillStyle = 'var(--brand)'`. This is invalid: the Canvas 2D API does
// not resolve CSS custom properties.
//
// Worse, it does not throw. Per spec an unparseable fillStyle/strokeStyle is
// SILENTLY IGNORED and the attribute keeps its previous value — which for a
// fresh context is #000000. So the feature renders black and nothing anywhere
// reports a problem: tsc passes, the build passes, every test suite passes,
// and the total-count check in this very script passes because the value was
// legitimately replaced. Only looking at the screen reveals it.
//
// (addColorStop is the exception — that one DOES throw, which is how the
// DynamicSkyCanvas instance was caught.)
//
// The correct pattern is to resolve the token once via
//   getComputedStyle(document.documentElement).getPropertyValue('--brand-rgb')
// and pass the resolved value to the canvas.
const FORBIDDEN_VAR_CONTEXTS: { label: string; re: RegExp }[] = [
  { label: 'Canvas fillStyle',   re: /fillStyle\s*=\s*[`'"][^`'"]*var\(--/g },
  { label: 'Canvas strokeStyle', re: /strokeStyle\s*=\s*[`'"][^`'"]*var\(--/g },
  { label: 'Canvas shadowColor', re: /shadowColor\s*=\s*[`'"][^`'"]*var\(--/g },
  { label: 'CanvasGradient.addColorStop', re: /addColorStop\([^)]*var\(--/g },
  { label: 'setAttribute fill/stroke',    re: /setAttribute\(\s*['"](?:fill|stroke)['"]\s*,\s*['"][^'"]*var\(--/g },
];

interface FileStat {
  hex6: number; hex3: number; rgba: number; total: number;
  crlf: number; lf: number; lines: number; sha: string;
  protectedCounts: Record<string, number>;
}

function statFile(rel: string): FileStat | null {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  const raw = fs.readFileSync(abs);
  const text = raw.toString('utf8');
  const bin = raw.toString('binary');

  const crlf = (bin.match(/\r\n/g) || []).length;
  const lfTotal = (bin.match(/\n/g) || []).length;

  const protectedCounts: Record<string, number> = {};
  for (const [name, patterns] of Object.entries(PROTECTED)) {
    protectedCounts[name] = patterns.reduce(
      (n, p) => n + (text.match(p) || []).length, 0
    );
  }

  const hex6 = (text.match(RE_HEX6) || []).length;
  const hex3 = (text.match(RE_HEX3) || []).length;
  const rgba = (text.match(RE_RGBA) || []).length;

  return {
    hex6, hex3, rgba, total: hex6 + hex3 + rgba,
    crlf, lf: lfTotal - crlf, lines: lfTotal,
    sha: crypto.createHash('sha1').update(raw).digest('hex').slice(0, 12),
    protectedCounts,
  };
}

function readBatch(batchFile: string): string[] {
  return fs.readFileSync(batchFile, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));
}

function snapshot(batchFile: string) {
  const files = readBatch(batchFile);
  const snap: Record<string, FileStat> = {};
  let total = 0;
  console.log('📸 SNAPSHOT — recording pre-work state\n');
  for (const f of files) {
    const s = statFile(f);
    if (!s) { console.error(`  ⚠️  MISSING: ${f}`); continue; }
    snap[f] = s; total += s.total;
    console.log(`  ${String(s.total).padStart(4)} values  ${s.crlf > 0 ? 'CRLF' : 'LF  '}  ${f}`);
  }
  fs.writeFileSync(SNAP, JSON.stringify({ batchFile, at: new Date().toISOString(), snap }, null, 2));
  console.log(`\n  ${files.length} files, ${total} hardcoded colour values recorded.`);
  console.log(`  Snapshot: ${path.relative(ROOT, SNAP)}`);
  console.log('\n  Now hand the batch to the implementer. Re-run with "verify" afterwards.');
}

function verify(batchFile: string) {
  if (!fs.existsSync(SNAP)) {
    console.error('❌ No snapshot found. Run "snapshot" BEFORE the work, not after.');
    process.exit(1);
  }
  const { snap } = JSON.parse(fs.readFileSync(SNAP, 'utf8')) as { snap: Record<string, FileStat> };
  const files = readBatch(batchFile);

  let problems = 0;
  let beforeTotal = 0, afterTotal = 0;

  console.log('🔍 VERIFY — comparing against pre-work snapshot\n');
  console.log('  ' + 'file'.padEnd(52) + 'before  after  removed');
  console.log('  ' + '-'.repeat(76));

  for (const f of files) {
    const before = snap[f];
    const after = statFile(f);
    if (!before) { console.error(`  ⚠️  ${f} — not in snapshot`); problems++; continue; }
    if (!after)  { console.error(`  ❌ ${f} — FILE MISSING (deletion is not permitted)`); problems++; continue; }

    beforeTotal += before.total; afterTotal += after.total;
    const removed = before.total - after.total;
    console.log(`  ${f.padEnd(52).slice(0, 52)}${String(before.total).padStart(6)}${String(after.total).padStart(7)}${String(removed).padStart(9)}`);

    // 1. Untouched file — the "missed 2 of 21 services" failure mode.
    if (removed === 0 && before.total > 0) {
      console.error(`      ❌ NOT MIGRATED — file was left untouched`);
      problems++;
    }

    // 2. Line endings must be preserved exactly. sed -i breaks this silently.
    if (before.crlf !== after.crlf || before.lf !== after.lf) {
      console.error(`      ❌ LINE ENDINGS CHANGED — before CRLF=${before.crlf}/LF=${before.lf}, after CRLF=${after.crlf}/LF=${after.lf}`);
      console.error(`         This makes the diff unreviewable. Use node, never \`sed -i\`.`);
      problems++;
    }

    // 3. Line count must not change — a colour swap adds and removes no lines.
    if (before.lines !== after.lines) {
      console.error(`      ❌ LINE COUNT CHANGED ${before.lines} → ${after.lines} — colour substitution must not add or remove lines`);
      problems++;
    }

    // 4. Protected palettes must survive intact.
    for (const [name, beforeCount] of Object.entries(before.protectedCounts)) {
      const afterCount = after.protectedCounts[name] ?? 0;
      if (beforeCount > 0 && afterCount !== beforeCount) {
        console.error(`      ❌ PROTECTED PALETTE ALTERED — "${name}" ${beforeCount} → ${afterCount}`);
        console.error(`         This is deliberate design, not inconsistency. Restore it.`);
        problems++;
      }
    }

    // 5. var() must never reach an API that cannot resolve it.
    //    This is the only check here that catches a RUNTIME-visible bug rather
    //    than a bookkeeping one — everything above still passes when this fails.
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const { label, re } of FORBIDDEN_VAR_CONTEXTS) {
      const hits = text.match(re);
      if (hits && hits.length) {
        console.error(`      ❌ var() PASSED TO ${label} — ${hits.length} occurrence(s)`);
        console.error(`         ${hits[0].trim().slice(0, 80)}`);
        console.error(`         Canvas cannot resolve CSS custom properties. fillStyle/strokeStyle`);
        console.error(`         ignore the value SILENTLY and keep the previous colour (#000 by`);
        console.error(`         default), so this renders wrong with no error anywhere.`);
        console.error(`         Resolve it first: getComputedStyle(document.documentElement)`);
        console.error(`                             .getPropertyValue('--token').trim()`);
        problems++;
      }
    }
  }

  const pct = beforeTotal ? ((beforeTotal - afterTotal) * 100 / beforeTotal) : 0;
  console.log('  ' + '-'.repeat(76));
  console.log(`  ${'TOTAL'.padEnd(52)}${String(beforeTotal).padStart(6)}${String(afterTotal).padStart(7)}${String(beforeTotal - afterTotal).padStart(9)}  (${pct.toFixed(0)}% removed)`);

  console.log('\n' + '='.repeat(78));
  if (problems === 0) {
    console.log(`✅ BATCH CLEAN — ${beforeTotal - afterTotal} values migrated, no integrity problems.`);
    console.log('   Still required before accepting: npx tsc --noEmit  AND  node build.js');
  } else {
    console.log(`❌ ${problems} PROBLEM(S) FOUND — batch is NOT complete. Details above.`);
  }
  console.log('='.repeat(78));
  process.exit(problems === 0 ? 0 : 1);
}

const [mode, batchFile] = process.argv.slice(2);
if (!mode || !batchFile) {
  console.error('Usage: verify_colour_batch.ts <snapshot|verify> <batch.txt>');
  process.exit(1);
}
if (mode === 'snapshot') snapshot(batchFile);
else if (mode === 'verify') verify(batchFile);
else { console.error(`Unknown mode: ${mode}`); process.exit(1); }

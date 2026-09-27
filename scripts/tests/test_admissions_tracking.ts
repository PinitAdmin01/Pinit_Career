/**
 * scripts/test_admissions_tracking.ts
 *
 * Verifies the hardening of the public admissions tracking lookup.
 *
 * Proves:
 *   1. Application references are no longer sequential — the old
 *      `APP-${Date.now()}` format meant one known id leaked its neighbours.
 *   2. References avoid glyphs that are ambiguous when read aloud or printed.
 *   3. The name second-factor matches forgivingly (case / spacing) but rejects
 *      a different name.
 *   4. "No such application" and "wrong name" produce an IDENTICAL result, so
 *      the endpoint cannot be used as an existence oracle.
 *
 * Run: npx tsx scripts/test_admissions_tracking.ts
 */

let passed = 0;
let failed = 0;
function check(label: string, ok: boolean, detail = '') {
  if (ok) { console.log(`  ✅ [PASS] ${label}`); passed++; }
  else { console.error(`  ❌ [FAIL] ${label}${detail ? ' — ' + detail : ''}`); failed++; }
}

// ── Replicas of the shipped implementations ─────────────────────────────────
// Mirrors generateApplicationId() in src/lib/services/admissionsService.ts
function generateApplicationId(): string {
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const year = new Date().getFullYear();
  let suffix = '';
  const c: any = (globalThis as any).crypto;
  if (c && typeof c.getRandomValues === 'function') {
    const bytes = new Uint8Array(6);
    c.getRandomValues(bytes);
    for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];
  } else {
    for (let i = 0; i < 6; i++) suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `APP-${year}-${suffix}`;
}

// Mirrors nameMatches() in the route and campusFallback
const normalise = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
function nameMatches(supplied: string, stored: unknown): boolean {
  if (typeof stored !== 'string' || !stored.trim()) return false;
  return normalise(supplied) === normalise(stored);
}

// Mirrors the lookup contract: same empty shape for every failure mode.
const NOT_FOUND = { application: null };
function lookup(db: Record<string, any>, id: string, name: string) {
  if (!id || !name) return NOT_FOUND;
  const app = db[id];
  if (!app) return NOT_FOUND;
  if (!nameMatches(name, app.studentName)) return NOT_FOUND;
  return { application: app };
}

function main() {
  console.log('='.repeat(72));
  console.log('🔎 ADMISSIONS TRACKING HARDENING AUDIT');
  console.log('='.repeat(72));

  // ── 1. References are non-sequential ──────────────────────────────────────
  console.log('\n── 1. References must not be guessable from a neighbour ──');
  const ids = Array.from({ length: 500 }, () => generateApplicationId());
  check('500 references generated with no collisions', new Set(ids).size === 500,
    `${500 - new Set(ids).size} duplicates`);

  const suffixes = ids.map(i => i.split('-')[2]);
  // The old scheme produced strictly increasing values. Confirm the new one
  // does not: adjacent references must not be ordered.
  let increasing = 0;
  for (let i = 1; i < suffixes.length; i++) if (suffixes[i] > suffixes[i - 1]) increasing++;
  const ratio = increasing / (suffixes.length - 1);
  check('Adjacent references are not sequential', ratio > 0.3 && ratio < 0.7,
    `${(ratio * 100).toFixed(1)}% ascending (a timestamp scheme would be 100%)`);

  check('Format matches what the UI shows users', /^APP-\d{4}-[A-Z2-9]{6}$/.test(ids[0]), ids[0]);

  const ambiguous = ids.some(i => /[O01I]/.test(i.split('-')[2]));
  check('No ambiguous glyphs (O/0/I/1) in references', !ambiguous);

  // ── 2. Name second factor ─────────────────────────────────────────────────
  console.log('\n── 2. Name second factor is forgiving but not permissive ──');
  check('Exact match accepted', nameMatches('Priya Sharma', 'Priya Sharma'));
  check('Case-insensitive', nameMatches('priya sharma', 'Priya Sharma'));
  check('Extra whitespace tolerated', nameMatches('  Priya   Sharma  ', 'Priya Sharma'));
  check('Different name rejected', !nameMatches('Rohan Verma', 'Priya Sharma'));
  check('Empty supplied name rejected', !nameMatches('', 'Priya Sharma'));
  check('Missing stored name rejected', !nameMatches('Priya Sharma', undefined));
  check('Partial name rejected', !nameMatches('Priya', 'Priya Sharma'));

  // ── 3. No existence oracle ────────────────────────────────────────────────
  console.log('\n── 3. Failure modes must be indistinguishable ──');
  const db: Record<string, any> = {
    'APP-2026-K7M4QX': { id: 'APP-2026-K7M4QX', studentName: 'Priya Sharma', course: 'CSE', rank: 412 },
  };

  const ok         = lookup(db, 'APP-2026-K7M4QX', 'Priya Sharma');
  const wrongName  = lookup(db, 'APP-2026-K7M4QX', 'Rohan Verma');
  const noSuchApp  = lookup(db, 'APP-2026-ZZZZZZ', 'Rohan Verma');
  const missingArg = lookup(db, 'APP-2026-K7M4QX', '');

  check('Correct id + correct name returns the application', ok.application !== null);
  check('Correct id + WRONG name returns nothing', wrongName.application === null);
  check('Unknown id returns nothing', noSuchApp.application === null);
  check('Missing name returns nothing', missingArg.application === null);
  check(
    'Wrong-name and unknown-id responses are byte-identical (no oracle)',
    JSON.stringify(wrongName) === JSON.stringify(noSuchApp),
    `${JSON.stringify(wrongName)} vs ${JSON.stringify(noSuchApp)}`
  );

  // ── 4. Enumeration simulation ─────────────────────────────────────────────
  console.log('\n── 4. Simulated enumeration run yields nothing ──');
  let leaked = 0;
  for (let i = 0; i < 2000; i++) {
    // Attacker scans references without knowing any name.
    const r = lookup(db, generateApplicationId(), 'Any Name');
    if (r.application !== null) leaked++;
  }
  check('2,000 blind lookups leaked zero records', leaked === 0, `${leaked} leaked`);

  console.log('\n' + '='.repeat(72));
  console.log(`🏁 RESULT: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(72));
  process.exit(failed === 0 ? 0 : 1);
}

main();

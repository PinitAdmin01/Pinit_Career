/**
 * scripts/audit_anon_row_exposure.ts
 *
 * Does the anon (public) key actually return ROWS from any table?
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS REPLACES THE STATUS-CODE AUDIT
 * ─────────────────────────────────────────────────────────────────────────────
 * scripts/audit_full_schema_inventory.ts reports "ALLOWED (200)" for a table
 * whenever the HTTP status is 200. It never reads the response body:
 *
 *     resolve(res.statusCode || 0);                         // line 58
 *     if (code === 200 || code === 204) return 'ALLOWED';   // line 80
 *
 * That is misleading in the most dangerous possible direction. PostgREST
 * returns **200 OK with an empty array** when RLS filters every row out. A
 * correctly locked-down table therefore reports as "ALLOWED (200)", identical
 * to a wide-open one. The status code cannot distinguish "you may read this"
 * from "you may read nothing".
 *
 * The only thing that matters is: DID ROWS COME BACK, and if so, what is in
 * them. This script reads the body and reports row counts plus the column
 * names of any leaked row, so an exposure is unambiguous.
 *
 * SAFETY: read-only. Issues the same anon SELECT that any visitor's browser
 * performs on page load. Writes nothing. Never prints key material, and
 * truncates any leaked values so this output can be pasted safely.
 *
 * Run: npx tsx scripts/audit_anon_row_exposure.ts
 */
import https from 'https';
import fs from 'fs';
import path from 'path';

function loadEnv(): { url: string; anon: string } {
  for (const f of ['.env.local', '.env']) {
    const p = path.join(__dirname, '..', f);
    if (!fs.existsSync(p)) continue;
    const txt = fs.readFileSync(p, 'utf8');
    const url = txt.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)/)?.[1]?.trim().replace(/^["']|["']$/g, '');
    const anon = txt.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)/)?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (url && anon) return { url, anon };
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
}

const TABLES = [
  // Highest stakes first — these would be the worst to leak.
  'users', 'vault_items', 'vault_access_tokens', 'qr_login_sessions', 'sessions',
  'audit_logs', 'contact_submissions', 'applications', 'interview_sessions',
  'exam_events', 'ai_usage_log', 'notifications', 'missions', 'opportunities',
  'jobs', 'processed_payments',
  // Evidence & Competency Engine
  'competency_evidence_ledger', 'competency_evidence_audit_log',
  'competency_evidence_records', 'student_competency_mastery', 'student_program_enrollments',
  // Phase 2 & 3 Ecosystem
  'codewars_matches', 'hackathon_squads', 'hackathon_squad_members',
  'external_internship_records', 'ats_skill_gaps', 'college_cohorts', 'student_cohort_enrollments',
  // Error Telemetry Ingest
  'client_telemetry_events',
  // Application Runtime Tables (Undeclared Drift Closed)
  'student_gd_history', 'gd_sessions', 'student_squads', 'exam_attempts',
  'admin_audit_log', 'profiles', 'chat_messages', 'direct_messages',
  // Language Labs
  'student_language_progress', 'student_language_srs_cards',
  'student_language_memories', 'student_language_xp_awards',
  'student_language_mastery', 'student_language_assessments',
  'student_language_attempts',
];

function fetchRows(base: string, anon: string, table: string): Promise<{ status: number; body: string }> {
  return new Promise(resolve => {
    const u = new URL(`${base.replace(/\/$/, '')}/rest/v1/${table}?select=*&limit=3`);
    const req = https.request(
      { hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
        headers: { apikey: anon, Authorization: `Bearer ${anon}`, Accept: 'application/json' } },
      res => {
        let body = '';
        res.on('data', c => (body += c));
        res.on('end', () => resolve({ status: res.statusCode || 0, body }));
      }
    );
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ status: 0, body: '' }); });
    req.end();
  });
}

async function main() {
  const { url, anon } = loadEnv();
  console.log('='.repeat(76));
  console.log('🔓 ANON ROW-EXPOSURE AUDIT — does the public key return actual DATA?');
  console.log('='.repeat(76));

  if (!url || !anon) {
    console.error('\n❌ Supabase URL / anon key not found in .env.local, .env or environment.');
    console.error('   Cannot run a live check. This is inconclusive, NOT a pass.');
    process.exit(2);
  }
  console.log(`\nTarget: ${url.replace(/\/\/([^.]+)\./, '//***.')}\n`);

  let exposed = 0, secured = 0, missing = 0, errored = 0;
  const leaks: string[] = [];

  for (const t of TABLES) {
    const { status, body } = await fetchRows(url, anon, t);

    if (status === 0)   { console.log(`  ⚠️  ${t.padEnd(34)} network error / timeout`); errored++; continue; }
    if (status === 404) { console.log(`  ·   ${t.padEnd(34)} does not exist`); missing++; continue; }

    if (status === 200) {
      let rows: any[] = [];
      try { rows = JSON.parse(body); } catch { rows = []; }
      if (Array.isArray(rows) && rows.length > 0) {
        const cols = Object.keys(rows[0]).slice(0, 8).join(', ');
        console.log(`  🔴  ${t.padEnd(34)} EXPOSED — ${rows.length} row(s) returned`);
        console.log(`      columns: ${cols}${Object.keys(rows[0]).length > 8 ? ', …' : ''}`);
        leaks.push(t);
        exposed++;
      } else {
        console.log(`  ✅  ${t.padEnd(34)} secured — 200 but ZERO rows (RLS working)`);
        secured++;
      }
      continue;
    }

    console.log(`  ✅  ${t.padEnd(34)} secured — HTTP ${status}`);
    secured++;
  }

  console.log('\n' + '='.repeat(76));
  if (exposed > 0) {
    console.log(`🔴 ${exposed} TABLE(S) LEAK ROWS TO THE PUBLIC ANON KEY:`);
    console.log(`   ${leaks.join(', ')}`);
    console.log('\n   The anon key ships in the client bundle and is readable by anyone.');
    console.log('   Every one of these tables needs a restrictive RLS SELECT policy.');
  } else {
    console.log(`✅ NO ROW EXPOSURE. ${secured} table(s) returned zero rows to the anon key.`);
    console.log('   The earlier "ALLOWED (200)" report was a status-code artefact:');
    console.log('   PostgREST answers 200 with [] when RLS filters everything out.');
  }
  if (missing) console.log(`   (${missing} table(s) not present on this project.)`);
  if (errored) console.log(`   ⚠️  ${errored} table(s) could not be reached — treat as UNKNOWN, not safe.`);
  console.log('='.repeat(76));
  process.exit(exposed > 0 ? 1 : 0);
}

main().catch(e => { console.error('Audit failed:', e?.message); process.exit(2); });

// scripts/audit_full_schema_inventory.ts
/**
 * ============================================================================
 * LIVE SCHEMA INVENTORY & ROW-LEVEL EXPOSURE AUDIT
 * ============================================================================
 * NOTE: PostgREST returns HTTP 200 with an empty array [] when RLS filters out
 * all rows for the anon role. Checking status code 200 alone previously created
 * a FALSE ALARM by reporting secured tables as "ALLOWED".
 *
 * This script inspects the response body and measures actual row leakages.
 */
import fs from 'fs';
import https from 'https';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(https:\/\/[^\s]+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\s]+)/);
if (!urlMatch || !keyMatch) {
  console.error('Supabase URL or Anon key missing in .env');
  process.exit(1);
}
const supabaseUrl = urlMatch[1].trim();
const anonKey = keyMatch[1].trim();

const tables = [
  'users',
  'vault_items',
  'missions',
  'opportunities',
  'jobs',
  'applications',
  'notifications',
  'interview_sessions',
  'sessions',
  'audit_logs',
  'qr_login_sessions',
  'vault_access_tokens',
  'exam_events',
  'ai_usage_log',
  'contact_submissions',
  'competency_evidence_ledger',
  'processed_payments',
  'client_telemetry_events',
  'student_language_progress',
  'student_language_srs_cards',
  'student_language_memories',
  'student_language_xp_awards',
  'student_language_mastery',
  'student_language_assessments',
  'student_language_attempts'
];

interface HttpResponse {
  status: number;
  body: string;
}

function testMethod(table: string, method: string, payload?: any): Promise<HttpResponse> {
  return new Promise((resolve) => {
    const url = new URL(`/rest/v1/${table}?limit=1`, supabaseUrl);
    const req = https.request(url, {
      method,
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode || 0, body }));
    });
    req.on('error', () => resolve({ status: 500, body: '' }));
    if (payload) req.write(JSON.stringify(payload));
    req.end();
  });
}

(async () => {
  console.log('========================================================================');
  console.log('🔒 LIVE SCHEMA INVENTORY & ROW-LEVEL EXPOSURE AUDIT');
  console.log('========================================================================\n');
  console.log('| Table Name | Anon SELECT | Anon INSERT | Anon UPDATE | Anon DELETE |');
  console.log('| :--- | :---: | :---: | :---: | :---: |');

  let totalLeaks = 0;

  for (const t of tables) {
    const sel = await testMethod(t, 'GET');
    const ins = await testMethod(t, 'POST', { dummy: 'test' });
    const upd = await testMethod(t, 'PATCH', { dummy: 'test' });
    const del = await testMethod(t, 'DELETE');

    const fmtSelect = (res: HttpResponse) => {
      if (res.status === 404) return 'NOT_FOUND (404)';
      if (res.status === 401 || res.status === 403) return 'BLOCKED (401/403)';
      if (res.status === 200) {
        try {
          const parsed = JSON.parse(res.body);
          if (Array.isArray(parsed) && parsed.length > 0) {
            totalLeaks++;
            return `🔴 LEAK (${parsed.length} rows)`;
          }
          return '✅ SECURED (0 rows)';
        } catch {
          return '✅ SECURED (0 rows)';
        }
      }
      return `${res.status}`;
    };

    const fmtMutation = (res: HttpResponse) => {
      if (res.status === 404) return 'NOT_FOUND (404)';
      if (res.status === 401 || res.status === 403 || res.status === 400) return 'BLOCKED';
      if (res.status === 201 || res.status === 200 || res.status === 204) {
        try {
          const parsed = JSON.parse(res.body);
          if (Array.isArray(parsed) && parsed.length > 0) {
            totalLeaks++;
            return `🔴 ALLOWED (${parsed.length})`;
          }
        } catch {}
        return 'BLOCKED/NO_ROWS';
      }
      return `${res.status}`;
    };

    console.log(`| \`${t}\` | ${fmtSelect(sel)} | ${fmtMutation(ins)} | ${fmtMutation(upd)} | ${fmtMutation(del)} |`);
  }

  console.log('\n========================================================================');
  if (totalLeaks > 0) {
    console.error(`🔴 AUDIT FAILED: ${totalLeaks} active leakage points detected!`);
    process.exit(1);
  } else {
    console.log('✅ AUDIT PASSED: Zero unauthorized rows or mutations exposed to anon role.');
  }
  console.log('========================================================================');
})();

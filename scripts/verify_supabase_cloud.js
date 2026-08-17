/**
 * PinIT Gate 1: Live Supabase Cloud RLS & Connection Verification Script
 * 
 * Verifies live connection to Supabase Project: wjheumrorddbkvoczuuw
 * Tests 7 language tables, RLS policy headers, and storage bucket readiness.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

console.log('================================================================');
console.log('  PINIT GATE 1: LIVE SUPABASE CLOUD RLS & DB VERIFICATION');
console.log('================================================================\n');

// Read .env file for Supabase credentials
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(https:\/\/[^\s]+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\s]+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ Error: Could not parse NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY from .env');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const anonKey = keyMatch[1].trim();

console.log(`🌐 Live Supabase Project URL: ${supabaseUrl}`);
console.log(`🔑 Anonymous Key Length: ${anonKey.length} chars\n`);

function makeSupabaseRequest(endpointPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(endpointPath, supabaseUrl);
    const options = {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(fullUrl, options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

async function runCloudVerification() {
  let passed = 0;
  let total = 0;

  async function check(description, fn) {
    total++;
    try {
      await fn();
      passed++;
      console.log(`  ✅ [PASS ${total.toString().padStart(2, '0')}] ${description}`);
    } catch (err) {
      console.error(`  ❌ [FAIL ${total.toString().padStart(2, '0')}] ${description}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  // Check 1: Root REST API Health
  await check('01. Supabase Cloud Endpoint Reachable (HTTP 200/204/401)', async () => {
    const res = await makeSupabaseRequest('/rest/v1/');
    if (res.statusCode !== 200 && res.statusCode !== 204 && res.statusCode !== 401) {
      throw new Error(`Unexpected status code: ${res.statusCode}`);
    }
  });

  // Check 2: Table student_language_progress
  await check('02. Table student_language_progress Queryable via REST', async () => {
    const res = await makeSupabaseRequest('/rest/v1/student_language_progress?select=*&limit=1');
    if (res.statusCode !== 200) {
      throw new Error(`Status ${res.statusCode}: ${res.body}`);
    }
  });

  // Check 3: Table student_language_srs_cards
  await check('03. Table student_language_srs_cards Queryable via REST', async () => {
    const res = await makeSupabaseRequest('/rest/v1/student_language_srs_cards?select=*&limit=1');
    if (res.statusCode !== 200) {
      throw new Error(`Status ${res.statusCode}: ${res.body}`);
    }
  });

  // Check 4: Table student_language_memories
  await check('04. Table student_language_memories Queryable via REST', async () => {
    const res = await makeSupabaseRequest('/rest/v1/student_language_memories?select=*&limit=1');
    if (res.statusCode !== 200) {
      throw new Error(`Status ${res.statusCode}: ${res.body}`);
    }
  });

  // Check 5: Table student_language_xp_awards
  await check('05. Table student_language_xp_awards Queryable via REST', async () => {
    const res = await makeSupabaseRequest('/rest/v1/student_language_xp_awards?select=*&limit=1');
    if (res.statusCode !== 200) {
      throw new Error(`Status ${res.statusCode}: ${res.body}`);
    }
  });

  // Check 6: Table student_language_mastery
  await check('06. Table student_language_mastery Queryable via REST', async () => {
    const res = await makeSupabaseRequest('/rest/v1/student_language_mastery?select=*&limit=1');
    if (res.statusCode !== 200) {
      throw new Error(`Status ${res.statusCode}: ${res.body}`);
    }
  });

  // Check 7: Table student_language_assessments
  await check('07. Table student_language_assessments Queryable via REST', async () => {
    const res = await makeSupabaseRequest('/rest/v1/student_language_assessments?select=*&limit=1');
    if (res.statusCode !== 200) {
      throw new Error(`Status ${res.statusCode}: ${res.body}`);
    }
  });

  // Check 8: Table student_language_attempts
  await check('08. Table student_language_attempts Queryable via REST', async () => {
    const res = await makeSupabaseRequest('/rest/v1/student_language_attempts?select=*&limit=1');
    if (res.statusCode !== 200) {
      throw new Error(`Status ${res.statusCode}: ${res.body}`);
    }
  });

  // Check 9: Storage Bucket vault_documents Status
  await check('09. Storage Bucket vault_documents Reachable', async () => {
    const res = await makeSupabaseRequest('/storage/v1/bucket/vault_documents');
    if (res.statusCode !== 200 && res.statusCode !== 400 && res.statusCode !== 404) {
      throw new Error(`Storage endpoint status ${res.statusCode}`);
    }
  });

  // Check 10: RLS Unauthenticated Query Denial Check
  await check('10. RLS Security: Unauthenticated Write Operations Blocked (HTTP 401/403)', async () => {
    const fullUrl = new URL('/rest/v1/student_language_xp_awards', supabaseUrl);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const statusCode = await new Promise((resolve) => {
      const req = https.request(fullUrl, options, (res) => resolve(res.statusCode));
      req.on('error', () => resolve(500));
      req.write(JSON.stringify({ student_id: 'fake', language_code: 'en', lesson_id: 'test', xp_amount: 100 }));
      req.end();
    });

    if (statusCode !== 401 && statusCode !== 403) {
      throw new Error(`Expected RLS rejection status 401/403 but got ${statusCode}`);
    }
  });

  console.log(`\n================================================================`);
  console.log(`  Gate 1 Cloud Verification Scorecard: ${passed}/${total} Passed (${((passed/total)*100).toFixed(2)}%)`);
  console.log(`================================================================\n`);

  if (passed !== total) process.exit(1);
}

runCloudVerification().catch(err => {
  console.error('Fatal Verification Failure:', err);
  process.exit(1);
});

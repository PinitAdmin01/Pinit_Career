import assert from 'assert';

console.log('========================================================================');
console.log('🌐 TESTING LIVE PRODUCTION BUILD ON HTTP://LOCALHOST:3005');
console.log('========================================================================');

const BASE_URL = 'http://localhost:3005';

let passed = 0;
let failed = 0;

async function checkRoute(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ [LIVE PASS]: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ [LIVE FAIL]: ${name} -> ${err.message}`);
    failed++;
  }
}

async function waitForServer(retries = 15, delayMs = 1000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/time`);
      if (res.ok || res.status === 404 || res.status === 200) {
        return true;
      }
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

async function runLiveBuildTests() {
  console.log('⏳ Waiting for production server on port 3005 to respond...');
  const ready = await waitForServer();
  if (!ready) {
    console.error('❌ Server failed to respond on http://localhost:3005 after timeout.');
    process.exit(1);
  }
  console.log('🚀 Server is responding! Running live tests...\n');

  // Test 1: Landing / Root Page
  await checkRoute('GET / (Home page renders HTTP 200 with HTML)', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes('<!DOCTYPE html>') || html.includes('<html'), 'Must return HTML document');
  });

  // Test 2: Public Verification Page
  await checkRoute('GET /verify/ev_test_credential_001 (Verification page renders HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/verify/ev_test_credential_001`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes('Credential') || html.includes('Verification') || html.includes('PinIT'), 'Must return verification page content');
  });

  // Test 3: Public Verification API - Non-existent ID
  await checkRoute('GET /api/verify/nonexistent_record (Server API returns 200 with valid: false)', async () => {
    const res = await fetch(`${BASE_URL}/api/verify/nonexistent_record`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.valid, false, 'Non-existent credential must report valid: false');
    assert.strictEqual(json.error, 'NOT_FOUND');
  });

  // Test 4: Passport Transcript Route - Auth Gate
  await checkRoute('GET /api/passport/transcript (Requires authentication -> 401)', async () => {
    const res = await fetch(`${BASE_URL}/api/passport/transcript`);
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // Test 5: GitHub Webhook - Missing signature / unconfigured secret fails closed
  await checkRoute('POST /api/webhooks/github (Fails closed -> 401 or 503)', async () => {
    const res = await fetch(`${BASE_URL}/api/webhooks/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    });
    assert.ok(res.status === 401 || res.status === 503, `Expected 401 or 503, got ${res.status}`);
    const json = await res.json();
    assert.ok(json.error === 'Invalid HMAC signature' || json.error === 'WEBHOOK_NOT_CONFIGURED');
  });

  // Test 6: Quests Page
  await checkRoute('GET /quests (Quests page renders HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/quests`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes('Quests') || html.includes('Career') || html.includes('<!DOCTYPE html>'));
  });

  // Test 7: Friends Hub Page
  await checkRoute('GET /friends (Friends Hub page renders HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/friends`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes('Friends') || html.includes('Arena') || html.includes('<!DOCTYPE html>'));
  });

  // Test 8: Dashboard Page
  await checkRoute('GET /dashboard (Dashboard page renders HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
  });

  // Test 9: Vault Upload Auth Gate
  await checkRoute('POST /api/vault/upload (Requires authentication -> 401)', async () => {
    const res = await fetch(`${BASE_URL}/api/vault/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'test.pdf' }),
    });
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
  });

  // Test 10: Verify Exam Auth Gate
  await checkRoute('POST /api/portfolio/verify-exam (Requires authentication -> 401)', async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/verify-exam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: {} }),
    });
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
  });

  // Test 11: Teacher Inbox Live Route
  await checkRoute('GET /api/teacher/inbox (Returns 200 with database messages)', async () => {
    const res = await fetch(`${BASE_URL}/api/teacher/inbox?teacherId=priya`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.messages));
  });

  // Test 12: Direct Messages Live Route
  await checkRoute('GET /api/messages/direct (Returns 200 with conversation history)', async () => {
    const res = await fetch(`${BASE_URL}/api/messages/direct?with=priya`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.ok(Array.isArray(data.messages));
  });

  console.log('\n========================================================================');
  console.log(`📊 LIVE PRODUCTION BUILD TEST: ${passed} / ${passed + failed} ROUTES PASSED`);
  console.log('========================================================================\n');

  if (failed > 0) process.exit(1);
}

runLiveBuildTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

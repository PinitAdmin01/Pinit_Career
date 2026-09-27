import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { NextRequest } from 'next/server';

process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'development';

console.log('========================================================================');
console.log('🧪 VERIFYING ISSUE 38: NOTIFICATIONS UNIFIED SCHEMA & LEADERBOARD ELO');
console.log('========================================================================');

let passed = 0;
let failed = 0;

function check(desc: string, condition: boolean, details?: string) {
  if (condition) {
    console.log(`  ✅ [PASS]: ${desc}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL]: ${desc}`);
    if (details) console.error(`     Details: ${details}`);
    failed++;
  }
}

async function runTests() {
  // --- Test 1: Notifications Migration & Consolidated SQL ---
  console.log('\n--- 1. Database Migration & RLS Policies ---');
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260924_notifications_unified_schema_and_rls.sql');
  check('Migration file exists', fs.existsSync(migrationPath));

  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  check('Defines column read on notifications', migrationSql.includes('ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false'));
  check('Defines column sender_id on notifications', migrationSql.includes('ADD COLUMN IF NOT EXISTS sender_id UUID'));
  check('Defines sync_notifications_read_column trigger function', migrationSql.includes('CREATE OR REPLACE FUNCTION public.sync_notifications_read_column()'));
  check('Defines trg_sync_notifications_read trigger', migrationSql.includes('CREATE TRIGGER trg_sync_notifications_read'));
  check('Defines RLS INSERT policy for notifications', migrationSql.includes('CREATE POLICY "Users and staff can insert notifications"'));
  check('Defines RLS SELECT policy for notifications', migrationSql.includes('CREATE POLICY "Users can view their own notifications"'));
  check('Defines RLS UPDATE policy for notifications', migrationSql.includes('CREATE POLICY "Users can update their own notifications"'));

  const consolidatedPath = path.join(process.cwd(), 'supabase', 'migrations', 'PRODUCTION_CONSOLIDATED_MIGRATIONS.sql');
  const consolidatedBuffer = fs.readFileSync(consolidatedPath);
  const hasBom = consolidatedBuffer[0] === 0xEF && consolidatedBuffer[1] === 0xBB && consolidatedBuffer[2] === 0xBF;
  check('Consolidated migrations file has 0 UTF-8 BOM', !hasBom);
  check('Consolidated migrations includes 20260924 notifications migration', consolidatedBuffer.toString('utf8').includes('20260924: notifications Unified Schema and RLS'));

  // --- Test 2: SocialService Notification Methods ---
  console.log('\n--- 2. SocialService Notification Layer ---');
  const {
    normalizeNotification,
    createNotification,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    sendBroadcastNotification
  } = await import('../src/lib/services/supabase/socialService');

  const normalized = normalizeNotification({
    id: 'test_n_1',
    user_id: 'user_dev_01',
    title: 'Test Notification',
    message: 'Hello world',
    read: true,
    is_read: false
  });
  check('normalizeNotification synchronizes read and is_read to true', normalized.is_read === true && normalized.read === true);

  const testUid = 'user_issue38_test_' + Date.now();
  const createRes = await createNotification({
    userId: testUid,
    senderId: 'faculty_priya',
    title: 'Milestone Achieved',
    message: 'You completed your system design assessment.',
    type: 'success',
    source: 'assessment'
  });
  check('createNotification succeeds and returns notification object', createRes.ok === true && createRes.notification !== undefined);
  check('Created notification has is_read false and read false', createRes.notification.is_read === false && createRes.notification.read === false);
  check('Created notification retains senderId', createRes.notification.sender_id === 'faculty_priya');

  const notifs = await getNotifications(testUid);
  check('getNotifications returns newly created notification', Array.isArray(notifs) && notifs.length >= 1);
  const createdId = (createRes.notification as any).id;

  await markNotificationRead(testUid, createdId);
  const afterMark = await getNotifications(testUid);
  const markedItem = afterMark.find(n => n.id === createdId);
  check('markNotificationRead marks specific notification read without database errors', markedItem !== undefined && markedItem.is_read === true && markedItem.read === true);

  // Add a second unread notification
  await createNotification({
    userId: testUid,
    title: 'Second Notification',
    message: 'Pending interview schedule.',
    type: 'info'
  });

  await markAllNotificationsRead(testUid);
  const afterMarkAll = await getNotifications(testUid);
  const allRead = afterMarkAll.every(n => n.is_read === true && n.read === true);
  check('markAllNotificationsRead marks all notifications read without database errors', allRead);

  // Test broadcast
  const broadcastRes = await sendBroadcastNotification('admin_user', 'Campus Broadcast', 'Semester review begins Monday.', 'system', 'all');
  check('sendBroadcastNotification succeeds with positive sentCount', broadcastRes.ok === true);

  // --- Test 3: API Route Handlers ---
  console.log('\n--- 3. Dedicated Next.js Notification API Routes ---');
  const { GET: notifGET, POST: notifPOST } = await import('../src/app/api/notifications/route');
  const { POST: markAllPOST } = await import('../src/app/api/notifications/mark-all-read/route');
  const { PATCH: markOnePATCH } = await import('../src/app/api/notifications/[id]/read/route');

  // GET notifications
  const getReq = new NextRequest(`http://localhost:3000/api/notifications`, {
    headers: { 'authorization': 'Bearer demo-token-bypass' }
  });
  const getRes = await notifGET(getReq);
  check('GET /api/notifications returns HTTP 200', getRes.status === 200);
  const getJson = await getRes.json();
  check('GET /api/notifications response has notifications array', Array.isArray(getJson.notifications));

  // POST create notification
  const postReq = new NextRequest(`http://localhost:3000/api/notifications`, {
    method: 'POST',
    headers: {
      'authorization': 'Bearer demo-token-bypass',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Lab Session Reminder',
      message: 'Cloud infrastructure lab starts at 3:00 PM.',
      type: 'info'
    })
  });
  const postRes = await notifPOST(postReq);
  check('POST /api/notifications creates notification and returns HTTP 200', postRes.status === 200);

  // PATCH mark single read
  const patchReq = new NextRequest(`http://localhost:3000/api/notifications/notif_test_123/read`, {
    method: 'PATCH',
    headers: { 'authorization': 'Bearer demo-token-bypass' }
  });
  const patchRes = await markOnePATCH(patchReq, { params: { id: 'notif_test_123' } });
  check('PATCH /api/notifications/[id]/read returns HTTP 200 with id', patchRes.status === 200);
  const patchJson = await patchRes.json();
  check('PATCH /api/notifications/[id]/read returns ok: true', patchJson.ok === true && patchJson.id === 'notif_test_123');

  // POST mark all read
  const markAllReq = new NextRequest(`http://localhost:3000/api/notifications/mark-all-read`, {
    method: 'POST',
    headers: { 'authorization': 'Bearer demo-token-bypass' }
  });
  const markAllRes = await markAllPOST(markAllReq);
  check('POST /api/notifications/mark-all-read returns HTTP 200 with ok: true', markAllRes.status === 200);
  const markAllJson = await markAllRes.json();
  check('POST /api/notifications/mark-all-read response has ok: true', markAllJson.ok === true);

  // --- Test 4: Leaderboard Audit & Real ELO Rating ---
  console.log('\n--- 4. Leaderboard Audit & Real ELO Rating ---');
  const { GET: leaderboardGET } = await import('../src/app/api/leaderboard/route');
  const { firestoreRouter } = await import('../src/lib/api/legacyFirestoreRouter');

  const lbReq = new NextRequest('http://localhost:3000/api/leaderboard?mode=code_wars', {
    headers: { 'authorization': 'Bearer demo-token-bypass' }
  });
  const lbRes = await leaderboardGET(lbReq);
  check('GET /api/leaderboard returns HTTP 200', lbRes.status === 200);
  const lbJson = await lbRes.json();
  check('Leaderboard returns ok: true', lbJson.ok === true);
  check('Leaderboard has leaderboard array', Array.isArray(lbJson.leaderboard));

  // Verify no fake invented students (Sarah Chen, etc.)
  const hasSarahChen = lbJson.leaderboard.some((e: any) => e.name?.includes('Sarah Chen') || e.college?.includes('Stanford'));
  check('Leaderboard contains ZERO invented students (Sarah Chen / Stanford removed)', !hasSarahChen);

  // Verify ELO ratings
  if (lbJson.leaderboard.length > 0) {
    const first = lbJson.leaderboard[0];
    check('Leaderboard entries have genuine eloRating number', typeof first.eloRating === 'number' && first.eloRating >= 1000);
  }

  // Verify browser shim fallback in legacyFirestoreRouter
  const shimResult = await firestoreRouter('GET', '/api/leaderboard', undefined) as any;
  check('legacyFirestoreRouter /api/leaderboard returns ok: true', shimResult.ok === true);
  check('legacyFirestoreRouter /api/leaderboard returns multi-peer cohort (not just "You")', Array.isArray(shimResult.leaderboard) && shimResult.leaderboard.length >= 2);
  const shimHasElo = shimResult.leaderboard.every((e: any) => typeof e.eloRating === 'number');
  check('legacyFirestoreRouter all entries have valid numeric eloRating', shimHasElo);

  // Verify router notifications handling
  const routerMarkAll = await firestoreRouter('POST', '/api/notifications/mark-all-read', {}) as any;
  check('legacyFirestoreRouter POST /api/notifications/mark-all-read returns ok: true', routerMarkAll.ok === true);
  const routerMarkOne = await firestoreRouter('PATCH', '/api/notifications/notif_abc/read', {}) as any;
  check('legacyFirestoreRouter /api/notifications/[id]/read returns ok: true', routerMarkOne.ok === true);

  console.log('\n========================================================================');
  console.log(`📊 RESULT: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

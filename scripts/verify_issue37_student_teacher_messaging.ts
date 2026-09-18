import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  sendDirectMessage,
  getDirectMessages,
  getTeacherInbox,
  markMessagesAsRead,
  getUnreadMessageCount
} from '../src/lib/services/supabase/socialService';
import { inboxSyncService } from '../src/lib/chat/inboxSyncService';
import { GET as directMessagesGET, POST as directMessagesPOST } from '../src/app/api/messages/direct/route';
import { GET as teacherInboxGET, POST as teacherInboxPOST } from '../src/app/api/teacher/inbox/route';
import { NextRequest } from 'next/server';

console.log('========================================================================');
console.log('📬 VERIFYING ISSUE 37: STUDENT ↔ TEACHER MESSAGING ON DATABASE');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ [PASS]: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ [FAIL]: ${name} -> ${err.message}`);
    failed++;
  }
}

async function runTests() {
  // Test 1: Migration SQL File exists and contains column sync trigger and RLS
  await test('Issue 37.1: Migration 20260923 defines dual columns, sync trigger, and staff RLS', async () => {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260923_direct_messages_unified_schema_and_rls.sql');
    assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    assert.ok(sql.includes('sync_direct_messages_columns'), 'Must define sync trigger');
    assert.ok(sql.includes('recipient_id'), 'Must declare recipient_id');
    assert.ok(sql.includes('receiver_id'), 'Must declare receiver_id');
    assert.ok(sql.includes('is_read'), 'Must declare is_read');
    assert.ok(sql.includes('Unified direct messages select policy'), 'Must declare unified select policy');
    assert.ok(sql.includes('campus_is_staff()'), 'Must grant teacher/staff privileges');
  });

  // Test 2: sendDirectMessage sets both recipient_id and receiver_id, content and message, and is_read false
  await test('Issue 37.2: sendDirectMessage populates all alias columns safely without errors', async () => {
    const studentId = 'std_test_001';
    const teacherId = 'priya';
    const testContent = 'Need clarification on neural network assignment 3';

    const result = await sendDirectMessage({
      sender_id: studentId,
      sender_name: 'Aditi Rao',
      recipient_id: teacherId,
      recipient_name: 'Ms. Priya',
      content: testContent,
      role: 'student'
    });

    assert.ok(result, 'Result should be returned');
    assert.strictEqual(result.ok, true, 'Result ok should be true');
    const msg = result.message || result;
    assert.strictEqual(msg.sender_id, studentId);
    assert.strictEqual(msg.recipient_id, teacherId);
    assert.strictEqual(msg.receiver_id, teacherId);
    assert.strictEqual(msg.content, testContent);
    assert.strictEqual(msg.message, testContent);
    assert.strictEqual(msg.is_read, false);
    assert.strictEqual(msg.read, false);
  });

  // Test 3: getTeacherInbox queries without crashing on receiver_id or read
  await test('Issue 37.3: getTeacherInbox retrieves student messages for faculty mentor', async () => {
    const inbox = await getTeacherInbox('priya');
    assert.ok(Array.isArray(inbox), 'Teacher inbox must return array');
    // If any messages exist, verify normalized format
    if (inbox.length > 0) {
      const first = inbox[0];
      assert.ok('recipient_id' in first, 'Must normalize recipient_id');
      assert.ok('receiver_id' in first, 'Must normalize receiver_id');
      assert.ok('is_read' in first, 'Must normalize is_read');
    }
  });

  // Test 4: markMessagesAsRead updates using is_read instead of broken read column
  await test('Issue 37.4: markMessagesAsRead executes safely without "read does not exist" error', async () => {
    const result = await markMessagesAsRead('priya', 'std_test_001');
    assert.strictEqual(typeof result, 'boolean', 'Must return boolean success status');
  });

  // Test 5: getUnreadMessageCount queries is_read without column errors
  await test('Issue 37.5: getUnreadMessageCount executes with is_read and returns integer', async () => {
    const count = await getUnreadMessageCount('priya');
    assert.strictEqual(typeof count, 'number', 'Count must be a number');
    assert.ok(count >= 0, 'Count must be >= 0');
  });

  // Test 6: inboxSyncService syncFromDatabase merges database messages into conversation threads
  await test('Issue 37.6: inboxSyncService bridges database messages into multi-device conversation state', async () => {
    // Send a student message via inboxSyncService
    const studentMsg = inboxSyncService.sendStudentMessage({
      studentId: 'std_cross_machine_102',
      studentName: 'Vikram Singh',
      studentEmail: 'vikram@campus.edu',
      course: 'Full Stack Web',
      topic: 'React Hooks',
      text: 'How do useEffect dependencies work across re-renders?'
    });

    assert.ok(studentMsg.id, 'Message must receive ID');
    assert.strictEqual(studentMsg.sender, 'student');
    assert.strictEqual(studentMsg.studentId, 'std_cross_machine_102');

    // Simulate teacher on another computer calling syncFromDatabase
    const syncedConvs = await inboxSyncService.syncFromDatabase('priya');
    assert.ok(Array.isArray(syncedConvs), 'Synced conversations must return array');
    const vikramConvo = syncedConvs.find(c => c.studentId === 'std_cross_machine_102');
    assert.ok(vikramConvo, 'Conversation with Vikram must exist in synced state');
    assert.ok(vikramConvo.messages.length >= 1, 'Thread must contain at least 1 message');

    // Teacher sends a reply
    const teacherReply = inboxSyncService.sendTeacherReply(
      'std_cross_machine_102',
      'The dependency array determines when the effect re-runs. Include all reactive values!',
      'Ms. Priya',
      'priya'
    );

    assert.ok(teacherReply, 'Teacher reply must be emitted');
    assert.strictEqual(teacherReply?.sender, 'teacher');
    assert.strictEqual(teacherReply?.senderName, 'Ms. Priya');

    // Check thread contains both student inquiry and teacher reply
    const thread = inboxSyncService.getStudentThread('std_cross_machine_102');
    assert.ok(thread.some(m => m.sender === 'student'), 'Thread must contain student message');
    assert.ok(thread.some(m => m.sender === 'teacher'), 'Thread must contain teacher reply');
  });

  // Test 7: Direct Messages API Route (/api/messages/direct)
  await test('Issue 37.7: GET & POST /api/messages/direct execute end-to-end with database backing', async () => {
    // POST new message
    const postReq = new NextRequest('http://localhost:3000/api/messages/direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'std_api_test',
        senderName: 'Maya Sharma',
        recipientId: 'priya',
        recipientName: 'Ms. Priya',
        content: 'API test message for direct teacher messaging',
        role: 'student'
      })
    });

    const postRes = await directMessagesPOST(postReq);
    assert.strictEqual(postRes.status, 200);
    const postBody = await postRes.json();
    assert.strictEqual(postBody.ok, true);

    // GET conversation
    const getReq = new NextRequest('http://localhost:3000/api/messages/direct?with=priya&userId=std_api_test');
    const getRes = await directMessagesGET(getReq);
    assert.strictEqual(getRes.status, 200);
    const getBody = await getRes.json();
    assert.strictEqual(getBody.ok, true);
    assert.ok(Array.isArray(getBody.messages), 'Must return messages array');
  });

  // Test 8: Teacher Inbox API Route (/api/teacher/inbox)
  await test('Issue 37.8: GET & POST /api/teacher/inbox retrieve inbox and post replies', async () => {
    // GET teacher inbox
    const getReq = new NextRequest('http://localhost:3000/api/teacher/inbox?teacherId=priya');
    const getRes = await teacherInboxGET(getReq);
    assert.strictEqual(getRes.status, 200);
    const getBody = await getRes.json();
    assert.strictEqual(getBody.ok, true);
    assert.ok(Array.isArray(getBody.messages));

    // POST teacher reply
    const postReq = new NextRequest('http://localhost:3000/api/teacher/inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'std_api_test',
        replyText: 'Great question Maya, let us schedule 10 minutes to review it.',
        teacherName: 'Ms. Priya',
        teacherId: 'priya'
      })
    });

    const postRes = await teacherInboxPOST(postReq);
    assert.strictEqual(postRes.status, 200);
    const postBody = await postRes.json();
    assert.strictEqual(postBody.ok, true);
  });

  console.log('\n========================================================================');
  console.log(`🏁 ISSUE 37 TEST COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

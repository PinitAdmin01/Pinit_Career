import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStudentKnowledge, resolveMatchmakingDifficulty } from '../src/lib/arena/knowledgeEngine';
import { ArenaPvPStore } from '../src/lib/services/arenaPvPStore';
import { judgeCodeWarsSubmission } from '../src/lib/server/codeWarsJudge';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';

describe('Task 14: Empirical Knowledge Calibration Engine', () => {
  before(() => {
    // Provide in-memory mock admin with clean table routing
    const mockAdmin: any = {
      from: (table: string) => {
        if (table === 'arena_rooms' || table === 'arena_room_submissions' || table === 'arena_matchmaking_queue') {
          // Force fallback to inMemoryRooms for instantaneous deterministic execution
          const roomQb: any = {
            select: () => roomQb,
            eq: () => roomQb,
            neq: () => roomQb,
            gte: () => roomQb,
            order: () => roomQb,
            limit: () => roomQb,
            maybeSingle: async () => ({ data: null, error: new Error('offline_test') }),
            update: () => roomQb,
            insert: async () => ({ error: new Error('offline_test') }),
            upsert: async () => ({ error: new Error('offline_test') }),
            delete: () => roomQb,
            then: (resolve: any) => resolve({ data: null, error: new Error('offline_test') }),
          };
          return roomQb;
        }

        const userQb: any = {
          select: () => userQb,
          eq: () => userQb,
          maybeSingle: async () => ({
            data: { arena_elo: 1200, arena_wins: 2, arena_losses: 1, xp_total: 400, weekly_xp: 400, pins: 20 },
            error: null,
          }),
          update: () => userQb,
          insert: async () => ({ error: null }),
          upsert: async () => ({ error: null }),
          then: (resolve: any) => resolve({ data: [], error: null }),
        };
        return userQb;
      },
    };
    setSupabaseAdminForTests(mockAdmin);
  });

  it('calibrates a beginner student to Novice tier with basic difficulty', () => {
    const knowledge = calculateStudentKnowledge({
      xpTotal: 250,
      arenaElo: 1050,
      completedQuests: ['react_day_1', 'react_day_2'],
      careerDnaScore: 40,
      missionsCompleted: 1,
    });

    assert.ok(knowledge.score <= 30, `Expected Novice score <= 30, got ${knowledge.score}`);
    assert.equal(knowledge.tier, 'novice');
    assert.equal(knowledge.recommendedDifficulty, 'basic');
    assert.match(knowledge.tierLabel, /Novice/i);
  });

  it('calibrates an intermediate student to Apprentice tier with intermediate difficulty', () => {
    const knowledge = calculateStudentKnowledge({
      xpTotal: 1200,
      arenaElo: 1250,
      completedQuests: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'],
      careerDnaScore: 60,
      missionsCompleted: 3,
    });

    assert.ok(knowledge.score >= 31 && knowledge.score <= 65, `Expected Apprentice score 31-65, got ${knowledge.score}`);
    assert.equal(knowledge.tier, 'apprentice');
    assert.equal(knowledge.recommendedDifficulty, 'intermediate');
    assert.match(knowledge.tierLabel, /Apprentice/i);
  });

  it('calibrates an advanced student to Master tier with advanced difficulty', () => {
    const knowledge = calculateStudentKnowledge({
      xpTotal: 15000,
      arenaElo: 1850,
      completedQuests: [
        ...Array.from({ length: 45 }, (_, i) => `quest_d3_${i}`),
        'milestone_exam_1',
        'milestone_exam_2',
        'capstone_project'
      ],
      careerDnaScore: 92,
      missionsCompleted: 25,
    });

    assert.ok(knowledge.score >= 66, `Expected Master score >= 66, got ${knowledge.score}`);
    assert.equal(knowledge.tier, 'master');
    assert.equal(knowledge.recommendedDifficulty, 'advanced');
    assert.match(knowledge.tierLabel, /Master/i);
  });

  it('resolves matchmaking difficulty protecting novices from advanced challenges', () => {
    const novice = calculateStudentKnowledge(null);
    const master = calculateStudentKnowledge({
      xpTotal: 20000,
      arenaElo: 1900,
      careerDnaScore: 95,
      completedQuests: ['capstone_1', 'capstone_2', 'exam_1', 'exam_2', ...Array.from({ length: 30 }, (_, i) => `quest_d3_${i}`)],
      missionsCompleted: 30,
    });

    // Novice vs Master should cap at intermediate (not advanced systems problems)
    const diff = resolveMatchmakingDifficulty(novice, master);
    assert.equal(diff, 'intermediate');

    // Novice vs Novice must get basic
    const noviceDiff = resolveMatchmakingDifficulty(novice, novice);
    assert.equal(noviceDiff, 'basic');

    // Master vs Master gets advanced
    const masterDiff = resolveMatchmakingDifficulty(master, master);
    assert.equal(masterDiff, 'advanced');
  });
});

describe('Task 14: 2-Device Pairing & Session Isolation', () => {
  it('allows same user testing on two devices to occupy host and guest slots without collision', async () => {
    const testUserId = 'tester_cross_device_01';
    const roomCode = 'ARENA-DEVPAIR';

    // Device 1 creates room
    const created = await ArenaPvPStore.createRoom({
      hostId: testUserId,
      hostName: 'Alice (Laptop)',
      hostDeviceId: 'device_laptop_alpha',
      hostLanguage: 'typescript',
      problemId: 'war_two_sum_01',
      roomCode,
    });
    assert.equal(created.hostId, testUserId);
    assert.equal(created.hostDeviceId, 'device_laptop_alpha');
    assert.equal(created.guestId, undefined);

    // Device 2 joins room under same user account from phone
    const joinRes = await ArenaPvPStore.joinRoom({
      roomCode,
      guestId: testUserId,
      guestName: 'Alice (Phone)',
      guestDeviceId: 'device_phone_beta',
      guestLanguage: 'python',
    });

    assert.equal(joinRes.success, true);
    assert.ok(joinRes.room);
    assert.equal(joinRes.room.hostId, testUserId);
    assert.equal(joinRes.room.guestId, `${testUserId}_challenger`);
    assert.equal(joinRes.room.guestDeviceId, 'device_phone_beta');
    assert.equal(joinRes.room.guestLanguage, 'python');

    // Verify ready toggling works for both devices
    const readyHost = await ArenaPvPStore.updateRoom(roomCode, (r) => {
      r.hostReady = true;
      return r;
    });
    assert.equal(readyHost?.hostReady, true);
    assert.equal(readyHost?.guestReady, false);

    const readyGuest = await ArenaPvPStore.updateRoom(roomCode, (r) => {
      r.guestReady = true;
      r.status = 'in_progress';
      return r;
    });
    assert.equal(readyGuest?.guestReady, true);
    assert.equal(readyGuest?.status, 'in_progress');
  });
});

describe('Task 14: Cross-Language JS vs Python Parity & Catalog Integrity', () => {
  it('expanded catalog contains all calibrated problems across all 3 tiers', () => {
    assert.ok(CODE_WARS_PROBLEMS_CATALOG.length >= 9, 'Expected at least 9 problems in catalog');
    
    const novice = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'basic');
    const apprentice = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'intermediate');
    const master = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'advanced');

    assert.ok(novice.length >= 3, 'Expected at least 3 Novice problems');
    assert.ok(apprentice.length >= 3, 'Expected at least 3 Apprentice problems');
    assert.ok(master.length >= 3, 'Expected at least 3 Master problems');

    for (const p of CODE_WARS_PROBLEMS_CATALOG) {
      assert.ok(p.starterCode.typescript, `Problem ${p.id} missing TypeScript starter`);
      assert.ok(p.starterCode.python, `Problem ${p.id} missing Python starter`);
      assert.ok(p.testCases.length >= 2, `Problem ${p.id} missing test cases`);
    }
  });

  it('correctly evaluates Two Sum in TypeScript via sandbox', async () => {
    const tsCode = `
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`;
    const res = await judgeCodeWarsSubmission('war_two_sum_01', tsCode, 'typescript');
    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.passed, true);
      assert.equal(res.testsPassed, 5);
      assert.equal(res.totalTests, 5);
    }
  });

  it('correctly evaluates Two Sum in Python via sandbox', async () => {
    const pyCode = `
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`;
    const res = await judgeCodeWarsSubmission('war_two_sum_01', pyCode, 'python');
    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.passed, true);
      assert.equal(res.testsPassed, 5);
      assert.equal(res.totalTests, 5);
    }
  });

  it('correctly fails an incorrect Python submission and reports failed test count', async () => {
    const buggyPy = `
def two_sum(nums, target):
    # Bug: always returns [0, 0]
    return [0, 0]
`;
    const res = await judgeCodeWarsSubmission('war_two_sum_01', buggyPy, 'python');
    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.passed, false);
      assert.equal(res.testsPassed, 0);
      assert.match(res.error || '', /Test case 1 failed/i);
    }
  });

  it('evaluates Valid Palindrome in both TypeScript and Python', async () => {
    const tsCode = `
function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}
`;
    const tsRes = await judgeCodeWarsSubmission('war_valid_palindrome_02', tsCode, 'typescript');
    assert.equal(tsRes.ok, true);
    if (tsRes.ok) assert.equal(tsRes.passed, true);

    const pyCode = `
def is_palindrome(s):
    clean = [c.lower() for c in s if c.isalnum()]
    return clean == clean[::-1]
`;
    const pyRes = await judgeCodeWarsSubmission('war_valid_palindrome_02', pyCode, 'python');
    assert.equal(pyRes.ok, true);
    if (pyRes.ok) assert.equal(pyRes.passed, true);
  });

  it('evaluates Kadane Maximum Subarray in both TypeScript and Python', async () => {
    const tsCode = `
function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0];
  let curr = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    maxSoFar = Math.max(maxSoFar, curr);
  }
  return maxSoFar;
}
`;
    const tsRes = await judgeCodeWarsSubmission('war_max_subarray_05', tsCode, 'typescript');
    assert.equal(tsRes.ok, true);
    if (tsRes.ok) assert.equal(tsRes.passed, true);

    const pyCode = `
def max_sub_array(nums):
    max_so_far = nums[0]
    curr = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        max_so_far = max(max_so_far, curr)
    return max_so_far
`;
    const pyRes = await judgeCodeWarsSubmission('war_max_subarray_05', pyCode, 'python');
    assert.equal(pyRes.ok, true);
    if (pyRes.ok) assert.equal(pyRes.passed, true);
  });
});

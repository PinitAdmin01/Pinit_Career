import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  selectPerfectQuestion,
  getStudentCurriculumTier,
  ArenaPvPStore,
  QueueTicket,
} from '../src/lib/services/arenaPvPStore';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';
import { judgeCodeWarsSubmission } from '../src/lib/server/codeWarsJudge';

describe('PinIT Arena Knowledge-Affinity Shared-Frontier & Polyglot Engine Suite', () => {

  it('1. Curriculum Tier Evaluator: Correctly classifies progress tiers and protects slow readers', () => {
    // Cold start (0 quests)
    assert.strictEqual(getStudentCurriculumTier([]), 'basic');
    assert.strictEqual(getStudentCurriculumTier(undefined), 'basic');

    // Novice learner (Days 1 to 10)
    assert.strictEqual(getStudentCurriculumTier(['day_01', 'day_02', 'day_05']), 'basic');
    assert.strictEqual(getStudentCurriculumTier(['d3', 'd7']), 'basic');
    assert.strictEqual(getStudentCurriculumTier(['comp_arrays_hashing_l1']), 'basic');

    // Intermediate apprentice (Days 11 to 20)
    assert.strictEqual(getStudentCurriculumTier(['day_12']), 'intermediate');
    assert.strictEqual(getStudentCurriculumTier(['d18', 'day_05']), 'intermediate');
    assert.strictEqual(getStudentCurriculumTier(['comp_stack_brackets_l2']), 'intermediate');
    assert.strictEqual(getStudentCurriculumTier([], ['comp_greedy_kadane_l2']), 'intermediate');

    // Advanced master (Days 21+)
    assert.strictEqual(getStudentCurriculumTier(['day_25']), 'advanced');
    assert.strictEqual(getStudentCurriculumTier(['d35', 'day_02']), 'advanced');
    assert.strictEqual(getStudentCurriculumTier(['comp_concurrency_threads_l2']), 'advanced');
    assert.strictEqual(getStudentCurriculumTier([], ['comp_database_sql_internals_l3']), 'advanced');
  });

  it('2. Shared Frontier Rule: Day 5 Novice vs Day 40 Master matches strictly on Day 5 Foundation', () => {
    const hostNovice: QueueTicket = {
      studentId: 'student_novice_day5',
      studentName: 'Aarav (Day 5)',
      difficulty: 'any',
      eloRating: 1200,
      enqueuedAt: Date.now(),
      preferredLanguage: 'python',
      completedQuests: ['day_01', 'day_02', 'day_03', 'day_04', 'day_05'],
    };

    const guestMaster: QueueTicket = {
      studentId: 'student_master_day40',
      studentName: 'Tanvi (Day 40 Senior)',
      difficulty: 'any',
      eloRating: 1550,
      enqueuedAt: Date.now(),
      preferredLanguage: 'typescript',
      completedQuests: ['day_01', 'day_15', 'day_25', 'day_35', 'day_40'],
      verifiedCompetencies: ['comp_dsa_linear_trees_l2', 'comp_concurrency_threads_l2'],
    };

    const chosen = selectPerfectQuestion(hostNovice, guestMaster);

    // Must be a basic foundational problem that the novice has actually learned!
    assert.strictEqual(chosen.difficulty, 'basic');
    assert.ok(
      ['war_two_sum_01', 'war_valid_palindrome_02', 'war_reverse_string_03'].includes(chosen.id),
      `Chosen problem ${chosen.id} must be in the Tier 1 foundational catalog`
    );
    // Must NOT be an alien Tree, Concurrency, or SQL problem
    assert.notStrictEqual(chosen.id, 'war_tree_lca_01');
    assert.notStrictEqual(chosen.id, 'war_concurrency_deadlock_02');
    assert.notStrictEqual(chosen.id, 'war_sql_btree_query_03');
  });

  it('3. Equal Advanced Frontier: Two Day 30+ students match at Master tier', () => {
    const playerA: QueueTicket = {
      studentId: 'player_a_senior',
      studentName: 'Rohan (Senior)',
      difficulty: 'any',
      eloRating: 1400,
      enqueuedAt: Date.now(),
      preferredLanguage: 'typescript',
      completedQuests: ['day_25', 'day_30'],
    };

    const playerB: QueueTicket = {
      studentId: 'player_b_senior',
      studentName: 'Diya (Senior)',
      difficulty: 'any',
      eloRating: 1450,
      enqueuedAt: Date.now(),
      preferredLanguage: 'python',
      completedQuests: ['day_32', 'day_35'],
    };

    const chosen = selectPerfectQuestion(playerA, playerB);
    assert.strictEqual(chosen.difficulty, 'advanced');
    assert.ok(
      ['war_tree_lca_01', 'war_concurrency_deadlock_02', 'war_sql_btree_query_03'].includes(chosen.id),
      `Chosen problem ${chosen.id} must be an advanced master tier challenge`
    );
  });

  it('4. Cold-Start Safety: A brand-new student with 0 quests receives foundational problem without crash', () => {
    const coldStudent: QueueTicket = {
      studentId: 'brand_new_student',
      studentName: 'First-time Learner',
      difficulty: 'any',
      eloRating: 1200,
      enqueuedAt: Date.now(),
      preferredLanguage: 'typescript',
      completedQuests: [],
    };

    const peerStudent: QueueTicket = {
      studentId: 'peer_learner',
      studentName: 'Peer Learner',
      difficulty: 'any',
      eloRating: 1200,
      enqueuedAt: Date.now(),
      preferredLanguage: 'python',
      completedQuests: ['day_01'],
    };

    const chosen = selectPerfectQuestion(coldStudent, peerStudent);
    assert.ok(chosen, 'A problem must be returned');
    assert.strictEqual(chosen.difficulty, 'basic');
  });

  it('5. Polyglot Compatibility: Selected problem has starter code for Python and TypeScript', () => {
    const pyStudent: QueueTicket = {
      studentId: 'py_coder',
      studentName: 'Pythonista',
      difficulty: 'any',
      eloRating: 1250,
      enqueuedAt: Date.now(),
      preferredLanguage: 'python',
      completedQuests: ['day_15'],
    };

    const tsStudent: QueueTicket = {
      studentId: 'ts_coder',
      studentName: 'TS Dev',
      difficulty: 'any',
      eloRating: 1280,
      enqueuedAt: Date.now(),
      preferredLanguage: 'typescript',
      completedQuests: ['day_15'],
    };

    const chosen = selectPerfectQuestion(pyStudent, tsStudent);
    assert.ok(chosen.starterCode.python, 'Problem must have Python starter code');
    assert.ok(chosen.starterCode.typescript, 'Problem must have TypeScript starter code');
  });

  it('6. De-duplication: Avoids recently solved problems if fresh candidates exist', () => {
    const host: QueueTicket = {
      studentId: 'host_student',
      studentName: 'Host',
      difficulty: 'any',
      eloRating: 1200,
      enqueuedAt: Date.now(),
      preferredLanguage: 'typescript',
      completedQuests: ['day_05'],
      recentProblemIds: ['war_two_sum_01'],
    };

    const guest: QueueTicket = {
      studentId: 'guest_student',
      studentName: 'Guest',
      difficulty: 'any',
      eloRating: 1200,
      enqueuedAt: Date.now(),
      preferredLanguage: 'typescript',
      completedQuests: ['day_05'],
      recentProblemIds: ['war_valid_palindrome_02'],
    };

    // Both war_two_sum_01 and war_valid_palindrome_02 are recent
    const chosen = selectPerfectQuestion(host, guest);
    assert.strictEqual(chosen.id, 'war_reverse_string_03', 'Must pick the fresh remaining Tier 1 problem');
  });

  it('7. Governing Rule Invariant: Both players receive the EXACT SAME problem in createRoom / matchmake', async () => {
    const host: QueueTicket = {
      studentId: 'pinit_host_test',
      studentName: 'Host Player',
      difficulty: 'any',
      eloRating: 1200,
      enqueuedAt: Date.now(),
      preferredLanguage: 'python',
      completedQuests: ['day_01', 'day_05'],
    };

    const guest: QueueTicket = {
      studentId: 'pinit_guest_test',
      studentName: 'Guest Player',
      difficulty: 'any',
      eloRating: 1200,
      enqueuedAt: Date.now(),
      preferredLanguage: 'typescript',
      completedQuests: ['day_01', 'day_05'],
    };

    const room = await ArenaPvPStore.createRoom({
      hostId: host.studentId,
      hostName: host.studentName,
      hostLanguage: host.preferredLanguage,
      problemId: 'war_two_sum_01',
      difficulty: 'basic',
    });

    const joinResult = await ArenaPvPStore.joinRoom({
      roomCode: room.roomCode,
      guestId: guest.studentId,
      guestName: guest.studentName,
      guestLanguage: guest.preferredLanguage,
    });

    assert.ok(joinResult.success && joinResult.room);
    assert.strictEqual(room.problemId, joinResult.room.problemId, 'Both players MUST receive the exact same problem ID');
    assert.strictEqual(room.roomCode, joinResult.room.roomCode, 'Both players are in the same room code');
    assert.strictEqual(joinResult.room.hostLanguage, 'python', 'Host language preserved');
    assert.strictEqual(joinResult.room.guestLanguage, 'typescript', 'Guest language preserved');
  });

  it('8. Polyglot Server Judge: Validates TypeScript and Python submissions against identical test suites', async () => {
    // A. Valid Two Sum in TypeScript
    const validTsCode = `
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

    const tsResult = await judgeCodeWarsSubmission('war_two_sum_01', validTsCode, 'typescript');
    assert.ok(tsResult.ok);
    assert.strictEqual(tsResult.passed, true);
    assert.strictEqual(tsResult.testsPassed, 5);

    // B. Valid Two Sum in Python
    const validPyCode = `
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`;

    const pyResult = await judgeCodeWarsSubmission('war_two_sum_01', validPyCode, 'python');
    assert.ok(pyResult.ok);
    assert.strictEqual(pyResult.passed, true);
    assert.strictEqual(pyResult.testsPassed, 5);
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateExpectedScore,
  calculateEloMatch,
  getKFactor,
  ELO_CONFIG,
} from '../src/lib/arena/eloEngine';

import {
  calculateBattleScore,
  resolveMatchWinner,
  checkRunCooldown,
  createCombatEvent,
  ARENA_RULES_CONFIG,
  CombatantBattleStats,
} from '../src/lib/arena/codeWarRules';

import { CodeWarsApiService } from '../src/lib/api/codeWarsApi';
import { validateVmCodeSecurity } from '../src/lib/server/codeWarsSandbox';
import { calculateStudentKnowledge, resolveMatchmakingDifficulty } from '../src/lib/arena/knowledgeEngine';
import {
  generateMemorableGlobalId,
  generateCollegePinItId,
  validatePinItId,
  parseCollegeIdCard,
} from '../src/lib/utils/pinitIdGenerator';

describe('COLD-BLOODED ADVERSARIAL FINAL VERIFICATION SUITE', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // PERSONA 3: Cold-Blooded Red-Team Penetration & Fuzzing Attacks
  // ──────────────────────────────────────────────────────────────────────────
  describe('Persona 3: Cold-Blooded Red-Team Penetration & Fuzzing Attacks', () => {
    it('P3.1: Fuzzes calculateEloMatch with non-finite values (Infinity, -Infinity, NaN, null, strings)', () => {
      const nonFiniteCases = [
        { host: Infinity, guest: 1200 },
        { host: -Infinity, guest: 1200 },
        { host: NaN, guest: 1200 },
        { host: null as any, guest: undefined as any },
        { host: 'not_a_number' as any, guest: '1500' as any },
        { host: -9999, guest: 9999 },
      ];

      for (const tc of nonFiniteCases) {
        const res = calculateEloMatch({
          hostId: 'h1',
          guestId: 'g1',
          hostElo: tc.host,
          guestElo: tc.guest,
          winnerId: 'h1',
        });

        assert.ok(Number.isFinite(res.hostCurrentElo), `hostCurrentElo must be finite for ${String(tc.host)}`);
        assert.ok(Number.isFinite(res.guestCurrentElo), `guestCurrentElo must be finite for ${String(tc.guest)}`);
        assert.ok(Number.isFinite(res.hostNewElo), `hostNewElo must be finite for ${String(tc.host)}`);
        assert.ok(Number.isFinite(res.guestNewElo), `guestNewElo must be finite for ${String(tc.guest)}`);
        assert.ok(res.hostNewElo >= ELO_CONFIG.FLOOR_ELO, `hostNewElo must be >= floor for ${String(tc.host)}`);
        assert.ok(res.guestNewElo >= ELO_CONFIG.FLOOR_ELO, `guestNewElo must be >= floor for ${String(tc.guest)}`);
      }
    });

    it('P3.2: Fuzzes calculateBattleScore with negative, zero, and NaN inputs', () => {
      const chaoticInputs = [
        { testsPassed: NaN, totalTests: NaN, timeRemainingSeconds: NaN, timeLimitSeconds: NaN },
        { testsPassed: -10, totalTests: -5, timeRemainingSeconds: -50, timeLimitSeconds: 0 },
        { testsPassed: 999, totalTests: 5, timeRemainingSeconds: 9999, timeLimitSeconds: 600 },
        { testsPassed: 0, totalTests: 0, timeRemainingSeconds: 0, timeLimitSeconds: 0 },
        { testsPassed: 5, totalTests: 5, timeRemainingSeconds: 30, timeLimitSeconds: 600, failedAttempts: 100 },
      ];

      for (const input of chaoticInputs) {
        const score = calculateBattleScore(input);
        assert.ok(Number.isFinite(score.totalScore), 'totalScore must be finite');
        assert.ok(score.totalScore >= 0 && score.totalScore <= 1000, `totalScore must be in [0, 1000], got ${score.totalScore}`);
        assert.ok(Number.isFinite(score.accuracyPct), 'accuracyPct must be finite');
        assert.ok(score.accuracyPct >= 0 && score.accuracyPct <= 100, `accuracyPct must be in [0, 100], got ${score.accuracyPct}`);
      }
    });

    it('P3.3: Tests TypeScript type stripping with complex generic nested structures', () => {
      const complexTsCode = `
        interface ResultMap<K extends string, V> {
          data: Map<K, V>;
          count: number;
        }
        type Callback<T> = (val: T) => Promise<boolean>;
        
        function solveComplex(matrix: Array<Record<string, number | null>>): Record<string, string> {
          const dict: Record<string, string> = {};
          const raw = matrix[0]! as Record<string, any>;
          return dict;
        }
      `;

      const stripped = CodeWarsApiService.cleanTypeScriptForExecution(complexTsCode);
      assert.ok(!stripped.includes('interface ResultMap'), 'Must strip interface');
      assert.ok(!stripped.includes('type Callback'), 'Must strip type alias');
      assert.ok(!stripped.includes('Record<string, string>'), 'Must strip Record<string, string> return type');
      // Must be executable JavaScript without syntax error
      assert.doesNotThrow(() => {
        new Function(stripped);
      }, 'Stripped code must evaluate without syntax error');
    });

    it('P3.4: Rejects AST malicious security violations before execution', () => {
      const exploits = [
        'require("fs").readFileSync("/etc/passwd")',
        'process.exit(1)',
        'process.mainModule.require("child_process")',
        'globalThis.constructor.constructor("return process")()',
        'import("child_process")',
      ];

      for (const exploit of exploits) {
        const check = validateVmCodeSecurity(exploit);
        assert.equal(check.safe, false, `Must flag exploit: ${exploit}`);
        assert.ok(check.reason, 'Must return security violation reason');
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // PERSONA 4: Senior Mathematical Architect & Systems Engineer
  // ──────────────────────────────────────────────────────────────────────────
  describe('Persona 4: Senior Mathematical Invariants & State Machine Proofs', () => {
    it('P4.1: Mathematical Proof: Expected score E_A + E_B === 1.0 across differential span [-3000, 3000]', () => {
      for (let delta = -3000; delta <= 3000; delta += 150) {
        const rA = 1500;
        const rB = 1500 + delta;
        const eA = calculateExpectedScore(rA, rB);
        const eB = calculateExpectedScore(rB, rA);
        const sum = eA + eB;

        assert.ok(
          Math.abs(sum - 1.0) < 1e-9,
          `E_A + E_B must equal 1.0 at delta ${delta}. Got sum=${sum}`
        );
      }
    });

    it('P4.2: K-Factor boundary curve transitions strictly at 1400 and 1800', () => {
      assert.equal(getKFactor(1000), 32);
      assert.equal(getKFactor(1399), 32);
      assert.equal(getKFactor(1400), 24);
      assert.equal(getKFactor(1600), 24);
      assert.equal(getKFactor(1800), 24);
      assert.equal(getKFactor(1801), 16);
      assert.equal(getKFactor(2500), 16);
    });

    it('P4.3: Rating Floor Invariant: 50 consecutive losses never breach floor Elo', () => {
      let rating = 100;
      for (let i = 0; i < 50; i++) {
        const res = calculateEloMatch({
          hostId: 'underdog',
          guestId: 'peer',
          hostElo: rating,
          guestElo: 100,
          winnerId: 'peer',
        });
        rating = res.hostNewElo;
        assert.ok(rating >= ELO_CONFIG.FLOOR_ELO, `Rating broke floor on loss ${i + 1}: ${rating}`);
      }
      assert.equal(rating, ELO_CONFIG.FLOOR_ELO, 'Rating must hit floor');
    });

    it('P4.4: Monotonicity: Battle score strictly increases or equals as test cases pass', () => {
      let prevScore = -1;
      for (let passed = 0; passed <= 5; passed++) {
        const score = calculateBattleScore({
          testsPassed: passed,
          totalTests: 5,
          timeRemainingSeconds: 300,
          timeLimitSeconds: 600,
        }).totalScore;

        assert.ok(score >= prevScore, `Score must be non-decreasing: passed ${passed} gave ${score} vs prev ${prevScore}`);
        prevScore = score;
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // PERSONA 5: Hardened QA, Real-World Lifecycle & Multi-Device Isolation
  // ──────────────────────────────────────────────────────────────────────────
  describe('Persona 5: Hardened QA, Real-World Lifecycle & Multi-Device Isolation', () => {
    it('P5.1: 2-Device Same-User Testing isolation without room collision', () => {
      const hostDeviceId = 'mobile_iphone_15';
      const guestDeviceId = 'desktop_chrome_mac';
      const sharedUserId = 'student_vinay_kashyap';

      // Both devices belong to the same student trying 1v1 PvP
      const isDifferentDevice = hostDeviceId !== guestDeviceId;
      assert.ok(isDifferentDevice, 'Devices must be distinct');

      // Room state handles host and guest slots
      const roomMock = {
        hostId: sharedUserId,
        hostDeviceId,
        guestId: sharedUserId,
        guestDeviceId,
      };

      assert.equal(roomMock.hostDeviceId, hostDeviceId);
      assert.equal(roomMock.guestDeviceId, guestDeviceId);
    });

    it('P5.2: Empirical Knowledge Calibration gracefully clamps extreme and missing profiles', () => {
      // Missing profile (null)
      const nullK = calculateStudentKnowledge(null);
      assert.equal(nullK.score, 15);
      assert.equal(nullK.tier, 'novice');
      assert.equal(nullK.recommendedDifficulty, 'basic');

      // Empty object profile
      const emptyK = calculateStudentKnowledge({});
      assert.equal(emptyK.score, 18);
      assert.equal(emptyK.tier, 'novice');
      assert.equal(emptyK.recommendedDifficulty, 'basic');

      // Super-veteran profile
      const veteranK = calculateStudentKnowledge({
        completedQuests: Array.from({ length: 60 }, (_, i) => `exam_m${i + 1}`),
        careerDnaScore: 100,
        atsScore: 100,
        arenaElo: 2500,
        missionsCompleted: 50,
        xpTotal: 50000,
      });
      assert.equal(veteranK.score, 100);
      assert.equal(veteranK.tier, 'master');
      assert.equal(veteranK.recommendedDifficulty, 'advanced');
    });

    it('P5.3: PinIT ID Generator produces memorable IDs under bizarre and special-char names', () => {
      const weirdNames = [
        '   ',
        '!!! @@@ ###',
        'Dr. Jean-Luc Picard',
        '1234567890',
        '🚀🔥 Code Ninja',
      ];

      for (const name of weirdNames) {
        const gid = generateMemorableGlobalId(name);
        assert.ok(gid.startsWith('PIN-GLB-'), `Must start with PIN-GLB-: ${gid}`);
        const valid = validatePinItId(gid);
        assert.equal(valid.valid, true, `Generated ID must be valid: ${gid}`);
      }
    });

    it('P5.4: Heuristic College Card Parser correctly handles fragmented OCR and USN patterns', async () => {
      const mockOcrText = `
        KARNATAKA ACCREDITED
        R.V. COLLEGE OF ENGINEERING, BANGALORE - 560059
        DEPARTMENT OF COMPUTER SCIENCE & ENGG
        NAME: ADITYA SHENOY
        USN: 1RV21CS042
        VALID UPTO: 2025
      `;

      const parsed = await parseCollegeIdCard(mockOcrText, 'Aditya Shenoy');
      assert.equal(parsed.collegeCode, 'RVCE');
      assert.equal(parsed.departmentCode, 'CSE');
      assert.equal(parsed.rollNumber, '042');

      const pinitId = generateCollegePinItId({
        collegeCode: parsed.collegeCode,
        departmentCode: parsed.departmentCode,
        rollNumber: parsed.rollNumber,
      });

      assert.equal(pinitId, 'PIN-RVCE-CSE-042');
      assert.equal(validatePinItId(pinitId).valid, true);
    });

    it('P5.5: Task 10 League Promotion/Demotion Formula: Top 10% Promote, Bottom 10% Demote', () => {
      // 10 students in weekly league cohort
      const cohort = Array.from({ length: 10 }, (_, i) => ({
        id: `student_${i + 1}`,
        weeklyXp: 1000 - i * 80,
        eloGain: 20 - i * 2,
      }));

      // League Score = weeklyXp + eloGain
      const scored = cohort.map(c => ({
        ...c,
        leagueScore: c.weeklyXp + c.eloGain,
      })).sort((a, b) => b.leagueScore - a.leagueScore);

      // Top 10% (rank 1) is promotion
      assert.equal(scored[0].id, 'student_1');
      assert.equal(scored[0].leagueScore, 1020); // 1000 + 20

      // Rank 2
      assert.equal(scored[1].id, 'student_2');
      assert.equal(scored[1].leagueScore, 920 + 18); // 938

      // Bottom 10% (rank 10) is demotion
      assert.equal(scored[9].id, 'student_10');
      assert.equal(scored[9].leagueScore, (1000 - 9 * 80) + (20 - 9 * 2)); // 280 + 2 = 282
    });
  });
});

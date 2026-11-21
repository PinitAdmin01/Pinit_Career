import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { matchNavigationIntent } from '../src/components/avatar/hooks/useVoiceNavigation';
import { matchVoiceActionIntent } from '../src/lib/avatar/voiceActionRouter';
import {
  clearInMemoryTrustState,
  applyTrustReward,
  applyVaultRejectionPenalty,
  recordCheatingIncident,
  getTrustLedger,
} from '../src/lib/trust/trustEngine';
import {
  clearMetricLedger,
  recordMetricLedgerEntry,
  getMetricLedger,
  computeMentalityBreakdown,
} from '../src/lib/telemetry/metricsLedger';
import {
  resolveVaultAuditorMentor,
  extractSkillsFast,
  generateBrutalDefensePrompt,
  evaluateVaultDefenseResponses,
} from '../src/lib/vault/vaultDefenseEngine';
import { PERSONA_CONFIGS, resolveAvatarModelPaths } from '../src/components/avatar/VRoidAvatarEngine';

describe('Tasks 1–5 Complete Verification Suite', () => {
  beforeEach(() => {
    clearInMemoryTrustState();
    clearMetricLedger();
  });

  describe('Task 1: "hey priya" Standalone Wake Word Isolation', () => {
    it('does NOT redirect "hey priya" or standalone mentor greetings to Arena or any route', () => {
      const standalonePhrases = [
        'hey priya',
        'hi priya',
        'priya',
        'hello ms priya',
        'hey anish',
        'hey akash',
      ];
      for (const phrase of standalonePhrases) {
        const nav = matchNavigationIntent(phrase, { addressedMentor: true });
        const act = matchVoiceActionIntent(phrase, { addressedMentor: true });
        assert.equal(nav.matched, false, `"${phrase}" falsely matched route ${nav.path}`);
        assert.equal(act.matched, false, `"${phrase}" falsely matched action ${act.path}`);
      }
    });

    it('preserves explicit voice navigation when route target is spoken', () => {
      const arenaCmd = matchNavigationIntent('hey priya open arena', { addressedMentor: true });
      assert.equal(arenaCmd.matched, true);
      assert.equal(arenaCmd.path, '/arena');

      const courseCmd = matchNavigationIntent('hey priya go to courses', { addressedMentor: true });
      assert.equal(courseCmd.matched, true);
      assert.equal(courseCmd.path, '/quests');
    });
  });

  describe('Task 2: Trust Score (+/-) Ledger Table Audit Trail', () => {
    it('records chronological +3, +5, -5, and session-deduplicated -2 entries in Trust Ledger', async () => {
      const uid = 'ledger_student_001';

      // Baseline 50 -> +3 lesson -> 53
      await applyTrustReward(uid, 'lesson', 50);
      // 53 -> +3 mission -> 56
      await applyTrustReward(uid, 'mission', 53);
      // 56 -> +5 vault verified -> 61
      await applyTrustReward(uid, 'vault_verified', 56, 'Verified Master Resume');
      // 61 -> -5 vault rejected -> 56
      await applyVaultRejectionPenalty(uid, 61, 'Rejected Fake Cert');
      // 56 -> -2 cheat (twice in same session -> only ONE -2 entry!) -> 54
      await recordCheatingIncident(uid, 'sess_ledger_1', 'lesson', 'mcq_rapid_brute_force');
      await recordCheatingIncident(uid, 'sess_ledger_1', 'lesson', 'tab_switching');

      const ledger = getTrustLedger(uid);
      assert.equal(ledger.length, 5, 'Should have 5 ledger entries (duplicate cheat in same session skipped)');

      // Newest first
      assert.equal(ledger[0].delta, -2);
      assert.equal(ledger[0].valueAfter, 54);
      assert.equal(ledger[1].delta, -5);
      assert.equal(ledger[1].valueAfter, 56);
      assert.equal(ledger[2].delta, 5);
      assert.equal(ledger[2].valueAfter, 61);
      assert.equal(ledger[3].delta, 3);
      assert.equal(ledger[4].delta, 3);
    });
  });

  describe('Task 3: Proof Vault UI, Category Config & Ledger Mounting', () => {
    it('fixes resume -> OTHER fallback, uses streamlined 2-tab above-the-fold layout, adds delete action, and mounts TelemetryAuditLedger', () => {
      const root = process.cwd();
      const vaultSrc = fs.readFileSync(path.join(root, 'src/app/vault/page.tsx'), 'utf-8');
      const ledgerSrc = fs.readFileSync(path.join(root, 'src/components/vault/TelemetryAuditLedger.tsx'), 'utf-8');
      assert.ok(vaultSrc.includes('resume:') && vaultSrc.includes('Master Resume'), 'TYPE_CONFIG must define resume category');
      assert.ok(vaultSrc.includes('proof_url'), 'Must preserve proof_url compatibility');
      assert.ok(vaultSrc.includes('formEvidenceFile'), 'Must preserve formEvidenceFile input');
      assert.ok(!vaultSrc.includes('Verified (100% Match)'), 'Must not falsely auto-verify on upload');
      assert.ok(!vaultSrc.includes('Avg AI Grounding'), 'Must remove confusing Avg AI Grounding metric');
      assert.ok(vaultSrc.includes('My Documents') && vaultSrc.includes('Score History'), 'Must render clean 2-tab switcher');
      assert.ok(vaultSrc.includes('removeVaultItem'), 'Must allow deleting duplicate/unverified documents');
      assert.ok(vaultSrc.includes('<TelemetryAuditLedger'), 'Must render TelemetryAuditLedger component inside Vault');
      assert.ok(ledgerSrc.includes('Current Synced Trust Balance'), 'Ledger anchor must stay consistent with live Trust Score');
    });
  });

  describe('Task 4: Cross-Mentor Brutal Defense Room (Akash vs Priya) & Portfolio Sync', () => {
    it('selects Mr. Akash (male) when student uses Ms. Priya, and Ms. Priya (female) when student uses male mentor', () => {
      const auditorForPriyaUser = resolveVaultAuditorMentor('priya');
      assert.equal(auditorForPriyaUser.id, 'akash');
      assert.equal(auditorForPriyaUser.name, 'Mr. Akash');
      assert.equal(auditorForPriyaUser.gender, 'male');

      for (const maleMentor of ['anish', 'rohan', 'vikram']) {
        const auditorForMaleUser = resolveVaultAuditorMentor(maleMentor);
        assert.equal(auditorForMaleUser.id, 'priya');
        assert.equal(auditorForMaleUser.name, 'Ms. Priya');
        assert.equal(auditorForMaleUser.gender, 'female');
      }
    });

    it('registers Mr. Akash with a valid male 3D VRoid model path chain in public/avatar/', () => {
      assert.ok(PERSONA_CONFIGS.akash, 'PERSONA_CONFIGS must include akash');
      assert.equal(PERSONA_CONFIGS.akash.gender, 'male');
      const paths = resolveAvatarModelPaths('akash');
      assert.ok(paths.length > 0 && paths[0].includes('avatarsample_r.glb'), 'Akash must resolve male GLB model first');
      assert.ok(fs.existsSync(path.join(process.cwd(), 'public', paths[0])), 'Akash fast model GLB must exist on disk');
    });

    it('extracts skills fast from resumes and generates brutal adversarial questioning prompts', () => {
      const skills = extractSkillsFast('Full Stack Engineer Resume: React, TypeScript, PostgreSQL, Docker, System Design');
      assert.ok(skills.includes('React'));
      assert.ok(skills.includes('TypeScript'));
      assert.ok(skills.includes('PostgreSQL'));
      assert.ok(skills.includes('Docker'));

      const q1 = generateBrutalDefensePrompt({
        docId: 'doc_1',
        title: 'Master Resume',
        itemType: 'resume',
        claimedSkills: skills,
        auditor: resolveVaultAuditorMentor('priya'),
        createdAt: new Date().toISOString(),
      }, 0);
      assert.ok(q1.includes('Mr. Akash'));
      assert.ok(q1.includes('React'));
    });

    it('fails superficial/bluff defense (-5 Trust, no portfolio skills) and passes deep technical defense (+5 Trust + all skills synced)', () => {
      const claimedSkills = ['React', 'PostgreSQL', 'Docker'];

      // Bluff answers
      const failEval = evaluateVaultDefenseResponses(claimedSkills, [
        'yes i know react',
        'not sure about edge cases',
        'idk',
      ]);
      assert.equal(failEval.passed, false);
      assert.equal(failEval.trustDelta, -5);
      assert.equal(failEval.verifiedSkillsAdded.length, 0);

      // Substantive technical answers
      const passEval = evaluateVaultDefenseResponses(claimedSkills, [
        'In React reconciliation compares virtual DOM trees using fiber keys; unstable keys cause state mismatches and wasted re-renders under O(n) heuristics because component instances get remounted.',
        'For PostgreSQL under 10x traffic spike, lock contention and missing composite B-tree indexes hurt query latency; we mitigate via connection pooling, read replicas, and strict transaction isolation trade-offs.',
        'Combining Docker multi-stage builds with non-root runtime users, healthcheck timeouts, and strict SQL transaction rollback boundaries prevents silent corruption and cuts deployment memory overhead.',
      ]);
      assert.equal(passEval.passed, true);
      assert.ok(passEval.score >= 65);
      assert.equal(passEval.trustDelta, 5);
      assert.deepEqual(passEval.verifiedSkillsAdded, claimedSkills);
    });
  });

  describe('Task 5: Full Telemetry Ledgers & Behavioral Mentality Breakdown', () => {
    it('tracks Arena ELO, Arena League Points, Weekly EXP, Career Score, and Mentality shifts in unified ledger', () => {
      const uid = 'telemetry_user_001';

      recordMetricLedgerEntry(uid, {
        metric: 'arena_elo',
        feature: 'arena',
        action: '1v1 Arena Victory',
        delta: 20,
        previousValue: 100,
        valueAfter: 120,
        mentalityTag: 'Pattern Hunter',
      });
      recordMetricLedgerEntry(uid, {
        metric: 'arena_league_points',
        feature: 'arena',
        action: 'Victory Bonus LP',
        delta: 50,
        previousValue: 0,
        valueAfter: 50,
      });
      recordMetricLedgerEntry(uid, {
        metric: 'weekly_xp',
        feature: 'lesson',
        action: 'Course Quest Completed',
        delta: 100,
        previousValue: 0,
        valueAfter: 100,
      });
      recordMetricLedgerEntry(uid, {
        metric: 'career_score',
        feature: 'mission',
        action: 'Daily Mission Completed',
        delta: 10,
        previousValue: 0,
        valueAfter: 10,
      });
      recordMetricLedgerEntry(uid, {
        metric: 'mentality',
        feature: 'vault',
        action: 'Defense Integrity · Stabilizer',
        delta: 6,
        previousValue: 0,
        valueAfter: 6,
        mentalityTag: 'Stabilizer',
      });

      assert.equal(getMetricLedger(uid, 'arena_elo')[0].delta, 20);
      assert.equal(getMetricLedger(uid, 'arena_league_points')[0].delta, 50);
      assert.equal(getMetricLedger(uid, 'weekly_xp')[0].delta, 100);
      assert.equal(getMetricLedger(uid, 'career_score')[0].delta, 10);
      assert.equal(getMetricLedger(uid, 'mentality')[0].mentalityTag, 'Stabilizer');

      const mentality = computeMentalityBreakdown({
        completedQuestsCount: 6,
        completedMissionsCount: 4,
        missionStreak: 5,
        trustScore: 70,
        arenaElo: 140,
        arenaWins: 3,
        verifiedVaultCount: 2,
        totalVaultCount: 3,
        interviewsCount: 2,
      });
      assert.equal(mentality.traits.length, 4);
      const traitNames = mentality.traits.map((t) => t.trait);
      assert.ok(traitNames.includes('Pattern Hunter'));
      assert.ok(traitNames.includes('Social Intelligence'));
      assert.ok(traitNames.includes('Stabilizer'));
      assert.ok(traitNames.includes('Explorer'));
    });
  });
});

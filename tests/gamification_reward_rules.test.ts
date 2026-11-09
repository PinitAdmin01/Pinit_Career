import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  REWARD_RULES,
  getEloTier,
  calculateStakesPreview,
  getPlayerLevel,
  ELO_TIERS,
} from '../src/lib/gamification/rewardRules';
import { getAuthoritativeQuest } from '../src/lib/quests/questRegistry';

describe('Gamification & Progression Reward Rules (Task 13)', () => {
  describe('Canonical XP & Pin Rewards', () => {
    it('defines standard lesson rewards as exactly +100 XP and 0 Pins (gameplay pins disabled)', () => {
      assert.strictEqual(REWARD_RULES.LESSON_STANDARD.xp, 100);
      assert.strictEqual(REWARD_RULES.LESSON_STANDARD.pins, 0);
    });

    it('defines 5-day milestone exam rewards as exactly +200 XP and 0 Pins', () => {
      assert.strictEqual(REWARD_RULES.LESSON_EXAM_MILESTONE.xp, 200);
      assert.strictEqual(REWARD_RULES.LESSON_EXAM_MILESTONE.pins, 0);
    });

    it('defines month capstone / graduation project rewards as +500 XP and 0 Pins', () => {
      assert.strictEqual(REWARD_RULES.LESSON_CAPSTONE_PROJECT.xp, 500);
      assert.strictEqual(REWARD_RULES.LESSON_CAPSTONE_PROJECT.pins, 0);
    });

    it('defines 1v1 PvP duel rewards: Win (+50 XP, 0 Pins), Loss (+15 XP, 0 Pins), Draw (+25 XP, 0 Pins)', () => {
      assert.strictEqual(REWARD_RULES.ARENA_WIN.xp, 50);
      assert.strictEqual(REWARD_RULES.ARENA_WIN.pins, 0);

      assert.strictEqual(REWARD_RULES.ARENA_LOSS.xp, 15);
      assert.strictEqual(REWARD_RULES.ARENA_LOSS.pins, 0);

      assert.strictEqual(REWARD_RULES.ARENA_DRAW.xp, 25);
      assert.strictEqual(REWARD_RULES.ARENA_DRAW.pins, 0);
    });

    it('defines career drills: Daily Mission (+50 XP), Interview Pass (+150 XP), GitHub Ingest (+1000 XP)', () => {
      assert.strictEqual(REWARD_RULES.DAILY_MISSION.xp, 50);
      assert.strictEqual(REWARD_RULES.AI_INTERVIEW_PASS.xp, 150);
      assert.strictEqual(REWARD_RULES.GITHUB_PROJECT_AUTHORED.xp, 1000);
    });
  });

  describe('Elo Tiers and Stakes Previews', () => {
    it('categorizes players into Cadet, Warrior, and Grandmaster tiers', () => {
      assert.strictEqual(getEloTier(1150).tier, 'Cadet');
      assert.strictEqual(getEloTier(1500).tier, 'Warrior');
      assert.strictEqual(getEloTier(1950).tier, 'Grandmaster');
    });

    it('calculates dynamic stakes preview showing potential win/loss before duel', () => {
      // Even matchup (1200 vs 1200)
      const evenStakes = calculateStakesPreview(1200, 1200);
      assert.strictEqual(evenStakes.potentialWin, 16);
      assert.strictEqual(evenStakes.potentialLoss, -16);
      assert.strictEqual(evenStakes.potentialWinXp, 50);
      assert.strictEqual(evenStakes.potentialLossXp, 15);

      // Underdog matchup (1200 challenging 1600)
      const underdogStakes = calculateStakesPreview(1200, 1600);
      assert.ok(underdogStakes.potentialWin > 25); // Winning gives huge reward
      assert.ok(Math.abs(underdogStakes.potentialLoss) < 10); // Losing has small penalty
    });
  });

  describe('Player Level Calculation & Pacing', () => {
    it('accurately resolves Level 1 (Cadet), Level 2 (Junior), Level 3 (Full Stack)', () => {
      const l1 = getPlayerLevel(500);
      assert.strictEqual(l1.level, 1);
      assert.strictEqual(l1.title, 'Cadet Engineer');
      assert.strictEqual(l1.progressPercent, 50);

      const l2 = getPlayerLevel(1500);
      assert.strictEqual(l2.level, 2);
      assert.strictEqual(l2.title, 'Junior Software Engineer');

      const l3 = getPlayerLevel(3500);
      assert.strictEqual(l3.level, 3);
      assert.strictEqual(l3.title, 'Full Stack Developer');
    });
  });

  describe('Quest Registry Integration', () => {
    it('resolves standard lessons to canonical 100 XP and exams to 200 XP', () => {
      const lessonQuest = getAuthoritativeQuest('test-course-d01-lesson');
      assert.ok(lessonQuest);
      assert.strictEqual(lessonQuest.xp, 100);
      assert.strictEqual(lessonQuest.pins, 0);

      const examQuest = getAuthoritativeQuest('test-course-exam-milestone-01');
      assert.ok(examQuest);
      assert.strictEqual(examQuest.xp, 200);
      assert.strictEqual(examQuest.pins, 0);
    });
  });
});

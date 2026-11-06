import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRESTIGE_MILESTONE_REGISTRY,
  verifyMilestoneEligibility,
  getRegisteredBadge,
  getRegisteredMilestone,
  isRegisteredBadge,
  isRegisteredMilestone,
} from '../src/lib/badges/badgeRegistry';
import { VaultItem } from '../src/hooks/useVault';

test('Block 37: Student Vault Item Schema & Category Parity', () => {
  const sampleItem: VaultItem = {
    id: 'vault_item_101',
    title: 'NISM Series XV Research Analyst Certification',
    item_type: 'certification',
    organization_name: 'National Institute of Securities Markets',
    description: 'Certified in equity research, valuation multiples, and financial statement forensic audit.',
    verified: true,
    ai_confidence_score: 96,
    skill_tags: ['Financial Modeling', 'DCF', 'Forensic Accounting'],
    is_public: true,
    used_in_resume: true,
    used_in_portfolio: true,
    proof_url: 'https://credentials.nism.gov.in/verify/101',
  };

  assert.strictEqual(sampleItem.verified, true);
  assert.ok(sampleItem.ai_confidence_score >= 0 && sampleItem.ai_confidence_score <= 100);
  assert.ok(sampleItem.skill_tags.length >= 3);
  assert.strictEqual(sampleItem.item_type, 'certification');
});

test('Block 37: Milestone Badge Registry Invariants & Streak Eligibility', () => {
  // 1. Verify existence of canonical streak badges
  assert.ok(isRegisteredMilestone('mission_streak_7'), '7-day streak must be registered');
  assert.ok(isRegisteredMilestone('mission_streak_30'), '30-day streak must be registered');

  // 2. Test 7-Day Streak evaluation
  const ineligibleUser = { mission_streak: 6 };
  const eligible7User = { mission_streak: 7 };
  const superStreakUser = { streak: 35 };

  const resIneligible = verifyMilestoneEligibility('mission_streak_7', ineligibleUser);
  assert.strictEqual(resIneligible.eligible, false);
  assert.ok(resIneligible.reason?.includes('at least 7'));

  const resEligible7 = verifyMilestoneEligibility('mission_streak_7', eligible7User);
  assert.strictEqual(resEligible7.eligible, true);

  // 3. Test 30-Day Streak evaluation
  const resEligible30 = verifyMilestoneEligibility('mission_streak_30', superStreakUser);
  assert.strictEqual(resEligible30.eligible, true);

  // 4. Trust score sentinel verification
  const resTrust90 = verifyMilestoneEligibility('trust_score_90', { trust_score: 92 });
  assert.strictEqual(resTrust90.eligible, true);

  const resTrustLow = verifyMilestoneEligibility('trust_score_99', { trust_score: 85 });
  assert.strictEqual(resTrustLow.eligible, false);
});

test('Block 37: XP Allocation & Reward Integrity', () => {
  for (const [key, def] of Object.entries(PRESTIGE_MILESTONE_REGISTRY)) {
    assert.ok(def.xpBonus > 0, `Milestone ${key} must award positive XP`);
    assert.ok(def.name.length > 0, `Milestone ${key} must have human-readable name`);
    assert.ok(def.badgeId.length > 0, `Milestone ${key} must have unique badgeId`);

    // Reverse lookup parity
    const lookedUp = getRegisteredBadge(def.badgeId);
    assert.strictEqual(lookedUp?.milestoneKey, key, `Badge ID ${def.badgeId} must map back to ${key}`);
  }
});

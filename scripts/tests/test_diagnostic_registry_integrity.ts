// scripts/tests/test_diagnostic_registry_integrity.ts
import {
  GOAL_DISCOVERY_QUESTIONS,
  SJT_QUESTIONS,
  MATRIX_SCENARIOS,
  TRADEOFF_PROBES,
  BehavioralDimension
} from '../../src/lib/onboarding/diagnosticRegistry';

function validateRegistryIntegrity() {
  console.log('=== VALIDATING DIAGNOSTIC REGISTRY INTEGRITY (TASK 1) ===');

  // 1. Goal Discovery Validation (8 questions)
  if (GOAL_DISCOVERY_QUESTIONS.length !== 8) {
    throw new Error(`Expected 8 Goal Discovery questions, found ${GOAL_DISCOVERY_QUESTIONS.length}`);
  }
  for (const q of GOAL_DISCOVERY_QUESTIONS) {
    if (!q.id || !q.title || !q.options || q.options.length < 2) {
      throw new Error(`Invalid Goal Discovery question definition: ${q.id}`);
    }
  }
  console.log('✓ Goal Discovery Questions Validated: 8/8 defined correctly.');

  // 2. SJT Questions Validation (12 questions)
  if (SJT_QUESTIONS.length !== 12) {
    throw new Error(`Expected 12 SJT questions, found ${SJT_QUESTIONS.length}`);
  }

  const expectedDimensions: BehavioralDimension[] = ['PH', 'EX', 'ST', 'SIQ'];
  const dimensionCounts: Record<BehavioralDimension, number> = { PH: 0, EX: 0, ST: 0, SIQ: 0 };
  const contextCounts: Record<string, number> = {};

  for (const q of SJT_QUESTIONS) {
    if (!q.id || !q.scenario || !q.options || q.options.length !== 4) {
      throw new Error(`Invalid SJT question definition: ${q.id}`);
    }
    const dimsInQ = new Set<BehavioralDimension>();
    for (const opt of q.options) {
      if (!opt.id || !opt.text || !opt.dimension || opt.evidence !== 2) {
        throw new Error(`Invalid SJT option in ${q.id}: ${opt.id}`);
      }
      dimsInQ.add(opt.dimension);
      dimensionCounts[opt.dimension]++;
      contextCounts[opt.context] = (contextCounts[opt.context] || 0) + 1;
    }
    for (const dim of expectedDimensions) {
      if (!dimsInQ.has(dim)) {
        throw new Error(`SJT question ${q.id} is missing an option for dimension ${dim}`);
      }
    }
  }
  console.log(`✓ 12 SJTs Validated: Each question contains all 4 orthogonal dimensions (48 options total).`);
  console.log(`  Dimension coverage: PH: ${dimensionCounts.PH}, EX: ${dimensionCounts.EX}, ST: ${dimensionCounts.ST}, SIQ: ${dimensionCounts.SIQ}`);
  console.log(`  Contexts covered:`, Object.keys(contextCounts));

  // 3. Behavioral Frequency Matrix Validation (4 scenarios)
  if (MATRIX_SCENARIOS.length !== 4) {
    throw new Error(`Expected 4 Matrix scenarios, found ${MATRIX_SCENARIOS.length}`);
  }
  for (const m of MATRIX_SCENARIOS) {
    if (!m.id || !m.items || m.items.length !== 4) {
      throw new Error(`Invalid Matrix scenario: ${m.id}`);
    }
    const dimsInM = new Set<BehavioralDimension>();
    for (const item of m.items) {
      dimsInM.add(item.dimension);
    }
    for (const dim of expectedDimensions) {
      if (!dimsInM.has(dim)) {
        throw new Error(`Matrix scenario ${m.id} is missing item for dimension ${dim}`);
      }
    }
  }
  console.log('✓ Matrix Scenarios Validated: 4/4 scenarios cover all 4 behavioral dimensions.');

  // 4. Trade-off Probes Validation (4 probes)
  if (TRADEOFF_PROBES.length !== 4) {
    throw new Error(`Expected 4 Trade-off probes, found ${TRADEOFF_PROBES.length}`);
  }
  for (const probe of TRADEOFF_PROBES) {
    if (!probe.id || !probe.options || probe.options.length !== 2) {
      throw new Error(`Invalid Trade-off probe: ${probe.id}`);
    }
    if (probe.options[0].pole === probe.options[1].pole) {
      throw new Error(`Trade-off probe ${probe.id} has identical poles.`);
    }
  }
  console.log('✓ Trade-Off Probes Validated: 4/4 dual-pole competing probes verified.');

  console.log('🎉 TASK 1 VALIDATION SUCCESSFUL: 100% REGISTRY INTEGRITY VERIFIED.');
}

validateRegistryIntegrity();

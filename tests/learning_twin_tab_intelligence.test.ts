/**
 * tests/learning_twin_tab_intelligence.test.ts
 * 
 * Comprehensive Verification Suite for Learning & Career Twin Tab Intelligence.
 * 
 * Verifies:
 * 1. Diagnostic taxonomy humanization (resolving snake_case database tokens like rigid_execution_vs_adaptation).
 * 2. Dynamic 4-Phase Growth Roadmap derivation across React, Java, and AI trajectories.
 * 3. Digital Career Twin sensitivity engine calculations (daily pace, interview score, gap closure).
 * 4. Curriculum Gaps multi-tier categorization and interactive quick check logic.
 * 5. Closed-loop mistake-to-FSRS memory card synthesis.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  humanizeAssessmentGap,
  getDynamicRoadmapForTrack,
  calculateDynamicCareerTwin,
  getCategorizedGaps,
  createFSRSCardFromMistake,
  MULTI_TRACK_CONCEPT_DECKS
} from '../src/lib/learning/learningTwinIntelligence';
import { State } from '../src/lib/learning/fsrsScheduler';

describe('Learning & Career Twin Intelligence Suite', () => {

  it('1. Humanizes diagnostic assessment snake_case tokens into deep Socratic drills', () => {
    // Test rigid_execution_vs_adaptation (from user screenshot)
    const mistake1 = humanizeAssessmentGap('rigid_execution_vs_adaptation');
    assert.strictEqual(mistake1.title, 'Cognitive Rigidity & Dynamic Constraint Adaptation');
    assert.strictEqual(mistake1.category, 'Behavioral & Execution');
    assert.strictEqual(mistake1.severity, 'High');
    assert.ok(mistake1.rootCause.length > 30, 'Should have informative root-cause explanation');
    assert.ok(mistake1.telemetrySnippet?.includes('API Gateway'), 'Should have realistic telemetry log');
    assert.ok(mistake1.drill.options.length >= 3, 'Should have multiple drill options');
    const correctOpt1 = mistake1.drill.options.find(o => o.id === mistake1.drill.correctOptionId);
    assert.ok(correctOpt1?.isCorrect, 'Drill should have verified correct option');

    // Test communication_vs_investigation (from user screenshot)
    const mistake2 = humanizeAssessmentGap('communication_vs_investigation');
    assert.strictEqual(mistake2.title, 'Inquiry Imbalance & Clarification Protocol');
    assert.strictEqual(mistake2.category, 'Communication & Interview');
    assert.strictEqual(mistake2.severity, 'Medium');
    assert.ok(mistake2.drill.question.includes('System Design'), 'Should have targeted interview drill');

    // Test fallback for arbitrary snake_case technical keys
    const fallback = humanizeAssessmentGap('distributed_database_sharding');
    assert.strictEqual(fallback.title, 'Distributed Database Sharding Mastery');
    assert.strictEqual(fallback.category, 'System Architecture');
    assert.ok(fallback.drill.options.some(o => o.isCorrect), 'Fallback must produce valid drill');
  });

  it('2. Dynamically generates 4-Phase Growth Roadmap based on target track', () => {
    // Frontend Track
    const frontendRoadmap = getDynamicRoadmapForTrack('React Frontend SDE', 'course-react-web', 5, 2, 3);
    assert.strictEqual(frontendRoadmap.length, 4, 'Must have exactly 4 progressive phases');
    assert.strictEqual(frontendRoadmap[0].stageNumber, 1);
    assert.ok(frontendRoadmap[0].phaseName.includes('Phase 1'), 'First phase is Phase 1');
    assert.ok(frontendRoadmap[0].skills.includes('DOM Manipulation') || frontendRoadmap[0].skills.includes('ES6+ Syntax'));
    assert.strictEqual(frontendRoadmap[0].courseId, 'course-react-web');
    assert.strictEqual(frontendRoadmap[0].questDeepLink, '/quests?course=course-react-web');
    assert.ok(frontendRoadmap[0].progressPct > 0, 'Progress must reflect user activity');
    assert.strictEqual(frontendRoadmap[3].stageNumber, 4);
    assert.ok(frontendRoadmap[3].title.includes('Micro-Frontends') || frontendRoadmap[3].title.includes('Web Vitals'));

    // Java Backend Track
    const javaRoadmap = getDynamicRoadmapForTrack('Java Spring Backend Engineer', 'course-java-core');
    assert.strictEqual(javaRoadmap.length, 4);
    assert.ok(javaRoadmap[0].phaseName.includes('Java Core') || javaRoadmap[0].title.includes('OOP'));
    assert.ok(javaRoadmap[1].phaseName.includes('Spring Boot') || javaRoadmap[1].title.includes('Spring'));
    assert.ok(javaRoadmap[2].phaseName.includes('Distributed Systems') || javaRoadmap[2].title.includes('Kafka'));

    // AI Track
    const aiRoadmap = getDynamicRoadmapForTrack('AI & LLM Systems Engineer', 'course-python-ai');
    assert.strictEqual(aiRoadmap.length, 4);
    assert.ok(aiRoadmap[0].skills.includes('NumPy Vectorization'));
    assert.ok(aiRoadmap[2].phaseName.includes('Deep Learning') || aiRoadmap[2].title.includes('Neural Networks'));
  });

  it('3. Digital Career Twin sensitivity engine recalculates placement timeline, CTC, and readiness', () => {
    const baseTwin = calculateDynamicCareerTwin({
      targetRole: 'Full Stack Engineer',
      dailyQuestPace: 1,
      interviewScoreTarget: 60,
      gapsResolvedCount: 0,
      baseAtsScore: 65,
      verifiedProofsCount: 1
    });

    const acceleratedTwin = calculateDynamicCareerTwin({
      targetRole: 'Full Stack Engineer',
      dailyQuestPace: 3,
      interviewScoreTarget: 90,
      gapsResolvedCount: 5,
      baseAtsScore: 78,
      verifiedProofsCount: 4
    });

    // Verification 1: Market readiness must increase with higher pacing, interview score, and gap closure
    assert.ok(
      acceleratedTwin.overallMarketReadiness > baseTwin.overallMarketReadiness,
      `Accelerated readiness (${acceleratedTwin.overallMarketReadiness}) must exceed base readiness (${baseTwin.overallMarketReadiness})`
    );

    // Verification 2: Time to first offer must decrease (accelerate) with higher pacing
    assert.ok(
      acceleratedTwin.estimatedMonthsToOffer < baseTwin.estimatedMonthsToOffer,
      `Accelerated timeline (${acceleratedTwin.estimatedMonthsToOffer} mo) must be faster than base (${baseTwin.estimatedMonthsToOffer} mo)`
    );

    // Verification 3: Recruiter tier must upgrade
    assert.ok(
      acceleratedTwin.recruiterAppealTier === 'Top 10% High-Potential' || acceleratedTwin.recruiterAppealTier === 'Top 2% Direct Unicorn Select',
      `Tier must be upgraded, got ${acceleratedTwin.recruiterAppealTier}`
    );

    // Verification 4: All 3 industry archetypes exist
    assert.strictEqual(acceleratedTwin.paths.length, 3);
    const unicornPath = acceleratedTwin.paths.find(p => p.id === 'path_unicorn_tech');
    const enterprisePath = acceleratedTwin.paths.find(p => p.id === 'path_enterprise_mnc');
    const venturePath = acceleratedTwin.paths.find(p => p.id === 'path_early_venture');

    assert.ok(unicornPath, 'Unicorn archetype path must exist');
    assert.ok(enterprisePath, 'Enterprise MNC archetype path must exist');
    assert.ok(venturePath, 'Venture archetype path must exist');

    assert.ok(unicornPath!.projectedSalaryRange.includes('LPA'));
    assert.ok(unicornPath!.hiringCriteria.length >= 3);
    assert.ok(unicornPath!.fitScore > 0);
  });

  it('4. Curriculum Gaps are categorized into Critical Blockers, Differentiators, and Specializations', () => {
    const gaps = getCategorizedGaps(
      'React Frontend SDE',
      ['rigid_execution_vs_adaptation', 'communication_vs_investigation', 'async_race_condition'],
      ['PostgreSQL Datastore']
    );

    assert.ok(gaps.length >= 3, 'Must categorize all supplied gaps');
    assert.strictEqual(gaps[0].tier, 'Critical Blocker');
    assert.strictEqual(gaps[1].tier, 'Competitive Differentiator');
    assert.strictEqual(gaps[2].tier, 'Enterprise Specialization');

    assert.ok(gaps[0].questQuery.length > 0);
    assert.ok(gaps[0].quickCheck.options.length >= 2);
    assert.ok(gaps[0].quickCheck.correctIndex >= 0);
  });

  it('5. Creates valid FSRS Spaced Memory card from resolved mistake', () => {
    const mistake = humanizeAssessmentGap('rigid_execution_vs_adaptation');
    const fsrsCard = createFSRSCardFromMistake(mistake);

    assert.ok(fsrsCard.id.startsWith('fsrs_rigid_execution_vs_adaptation'));
    assert.strictEqual(fsrsCard.topic, 'Adaptive Webhook Scaling');
    assert.ok(fsrsCard.question.includes('database connection pool exhaustion'));
    assert.ok(fsrsCard.answer.includes('HTTP 202 Accepted'));
    assert.strictEqual(fsrsCard.fsrs.state, State.New);
    assert.strictEqual(fsrsCard.fsrs.stability, 0);
  });

  it('6. Multi-track concept decks are available for Spaced Repetition', () => {
    assert.ok(MULTI_TRACK_CONCEPT_DECKS.frontend.length >= 2);
    assert.ok(MULTI_TRACK_CONCEPT_DECKS.backend.length >= 2);
    assert.ok(MULTI_TRACK_CONCEPT_DECKS.commerce.length >= 2);

    const reactCard = MULTI_TRACK_CONCEPT_DECKS.frontend.find(c => c.id === 'c_react_hooks_rule');
    assert.ok(reactCard);
    assert.ok(reactCard!.question.includes('React Hooks'));
  });

});

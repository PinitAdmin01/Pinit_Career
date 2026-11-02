/**
 * tests/learning_twin_adversarial_qa.test.ts
 * 
 * BRUTAL ADVERSARIAL QA AUDIT SUITE
 * Simulates a skeptical, ruthless first-time inspector attacking every edge case,
 * boundary condition, and data corruption scenario in the Learning & Career Twin Hub.
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
import {
  Rating,
  State,
  scheduleNextReview,
  calculateRetention,
  DEFAULT_FSRS_PARAMS
} from '../src/lib/learning/fsrsScheduler';

describe('BRUTAL ADVERSARIAL AUDIT: Learning & Digital Career Twin Hub', () => {

  it('BRUTAL-1: Survives extreme, malformed, and corrupted diagnostic input tokens', () => {
    const maliciousInputs = [
      '',
      '   ',
      '!!!@@@###$$$%%%^^^&&&***()',
      'a'.repeat(500),
      '1234567890',
      'undefined',
      'null',
      'rIgId_ExEcUtIoN_vS_aDaPtAtIoN', // mixed casing
      '   communication_vs_investigation   ', // trailing/leading spaces
      'SQL_INJECTION; DROP TABLE users;--',
      '<script>alert("xss")</script>',
      'off_by_one_error_in_infinite_recursive_loop'
    ];

    for (const input of maliciousInputs) {
      const result = humanizeAssessmentGap(input);
      assert.ok(result, `Should return an object for input: ${input}`);
      assert.ok(result.id && typeof result.id === 'string', `Valid ID required for input: ${input}`);
      assert.ok(result.title && result.title.length > 0, `Non-empty title required for input: ${input}`);
      assert.ok(result.category, `Valid category required for input: ${input}`);
      assert.ok(['High', 'Medium', 'Low'].includes(result.severity), `Valid severity required for input: ${input}`);
      assert.ok(result.rootCause && result.rootCause.length > 0, `Root cause required for input: ${input}`);
      assert.ok(result.drill, `Drill object required for input: ${input}`);
      assert.ok(result.drill.question && result.drill.question.length > 0, `Drill question required for input: ${input}`);
      assert.ok(result.drill.options.length >= 2, `At least 2 options required for input: ${input}`);
      assert.ok(result.drill.options.some(o => o.isCorrect), `At least one correct option required for input: ${input}`);
      assert.ok(result.drill.fsrsDeckItem.topic, `FSRS deck item topic required for input: ${input}`);
    }
  });

  it('BRUTAL-2: Mathematical Invariant Sweep — 500+ parameter permutations of sensitivity engine', () => {
    const paces = [1, 2, 3, 4];
    const interviewScores = [50, 60, 70, 75, 80, 85, 90, 95, 98];
    const gapsResolved = [0, 1, 2, 4, 7, 10];
    const atsScores = [0, 30, 65, 80, 100];
    const proofs = [0, 1, 3, 6, 12];

    let totalCombinationsTested = 0;

    for (const pace of paces) {
      for (const score of interviewScores) {
        for (const gaps of gapsResolved) {
          for (const ats of atsScores) {
            for (const proof of proofs) {
              totalCombinationsTested++;
              const sim = calculateDynamicCareerTwin({
                targetRole: 'Staff Full-Stack Architect',
                dailyQuestPace: pace,
                interviewScoreTarget: score,
                gapsResolvedCount: gaps,
                baseAtsScore: ats,
                verifiedProofsCount: proof
              });

              // Invariant 1: Readiness must be bounded between 40 and 100
              assert.ok(
                !isNaN(sim.overallMarketReadiness) &&
                sim.overallMarketReadiness >= 40 &&
                sim.overallMarketReadiness <= 100,
                `Readiness violated bounds: ${sim.overallMarketReadiness}`
              );

              // Invariant 2: Estimated months must be strictly positive and realistic
              assert.ok(
                !isNaN(sim.estimatedMonthsToOffer) &&
                sim.estimatedMonthsToOffer >= 2.0 &&
                sim.estimatedMonthsToOffer <= 15.0,
                `Timeline violated bounds: ${sim.estimatedMonthsToOffer} mo`
              );

              // Invariant 3: Recruiter tier must be valid
              assert.ok(
                ['Standard Pool', 'Competitive Contender', 'Top 10% High-Potential', 'Top 2% Direct Unicorn Select'].includes(sim.recruiterAppealTier),
                `Invalid recruiter tier: ${sim.recruiterAppealTier}`
              );

              // Invariant 4: For each archetype path, salary min <= max and fit score is valid
              for (const path of sim.paths) {
                assert.ok(!isNaN(path.projectedCtcMin), `CTC Min is NaN in ${path.title}`);
                assert.ok(!isNaN(path.projectedCtcMax), `CTC Max is NaN in ${path.title}`);
                assert.ok(
                  path.projectedCtcMin <= path.projectedCtcMax,
                  `Inverted salary in ${path.title}: min ${path.projectedCtcMin} > max ${path.projectedCtcMax}`
                );
                assert.ok(
                  path.probabilityPct >= 20 && path.probabilityPct <= 100,
                  `Invalid probability ${path.probabilityPct}% in ${path.title}`
                );
                assert.ok(path.hiringCriteria.length >= 3, `Inadequate hiring criteria in ${path.title}`);
              }
            }
          }
        }
      }
    }

    assert.ok(totalCombinationsTested >= 500, `Tested ${totalCombinationsTested} combinations`);
  });

  it('BRUTAL-3: Monotonic Sensitivity Properties of the Career Twin Simulator', () => {
    // Property 1: Increasing Daily Pacing MUST reduce (accelerate) time to first offer
    const tPace1 = calculateDynamicCareerTwin({ targetRole: 'SDE', dailyQuestPace: 1, interviewScoreTarget: 75, gapsResolvedCount: 2 });
    const tPace4 = calculateDynamicCareerTwin({ targetRole: 'SDE', dailyQuestPace: 4, interviewScoreTarget: 75, gapsResolvedCount: 2 });
    assert.ok(
      tPace4.estimatedMonthsToOffer < tPace1.estimatedMonthsToOffer,
      `Pace 4 (${tPace4.estimatedMonthsToOffer} mo) must be strictly faster than Pace 1 (${tPace1.estimatedMonthsToOffer} mo)`
    );

    // Property 2: Increasing Mock Interview Score from 50 to 98 MUST increase starting CTC bracket
    const tInterview50 = calculateDynamicCareerTwin({ targetRole: 'SDE', dailyQuestPace: 2, interviewScoreTarget: 50, gapsResolvedCount: 2 });
    const tInterview98 = calculateDynamicCareerTwin({ targetRole: 'SDE', dailyQuestPace: 2, interviewScoreTarget: 98, gapsResolvedCount: 2 });
    assert.ok(
      tInterview98.paths[0].projectedCtcMin > tInterview50.paths[0].projectedCtcMin,
      `Interview 98% min CTC (${tInterview98.paths[0].projectedCtcMin}) must exceed Interview 50% min CTC (${tInterview50.paths[0].projectedCtcMin})`
    );

    // Property 3: Closing 10 gaps vs 0 gaps MUST increase Market Readiness
    const tGaps0 = calculateDynamicCareerTwin({ targetRole: 'SDE', dailyQuestPace: 2, interviewScoreTarget: 75, gapsResolvedCount: 0 });
    const tGaps10 = calculateDynamicCareerTwin({ targetRole: 'SDE', dailyQuestPace: 2, interviewScoreTarget: 75, gapsResolvedCount: 10 });
    assert.ok(
      tGaps10.overallMarketReadiness > tGaps0.overallMarketReadiness,
      `10 Gaps readiness (${tGaps10.overallMarketReadiness}%) must exceed 0 Gaps readiness (${tGaps0.overallMarketReadiness}%)`
    );
  });

  it('BRUTAL-4: Multi-Track Curriculum Trajectory Invariants Across 8 Distinct Specializations', () => {
    const rolesToTest = [
      'React Frontend Developer',
      'Next.js Fullstack Engineer',
      'Java Spring Boot Architect',
      'Java Backend Core Specialist',
      'AI & Machine Learning Engineer',
      'Python Data Scientist',
      'Cloud DevOps Infrastructure Engineer',
      'Forensic Accounting & Corporate Auditor'
    ];

    for (const role of rolesToTest) {
      const stages = getDynamicRoadmapForTrack(role);
      assert.strictEqual(stages.length, 4, `Track "${role}" must have exactly 4 progressive stages`);

      for (let i = 0; i < stages.length; i++) {
        const s = stages[i];
        assert.strictEqual(s.stageNumber, i + 1, `Stage number must be sequentially ${i + 1}`);
        assert.ok(s.phaseName && s.phaseName.includes(`Phase ${i + 1}`), `Phase name must match stage number in ${role}`);
        assert.ok(s.title && s.title.length > 5, `Descriptive title required for stage ${i + 1} in ${role}`);
        assert.ok(s.description && s.description.length > 20, `Substantive description required for stage ${i + 1} in ${role}`);
        assert.ok(s.skills.length >= 3, `At least 3 core skills required for stage ${i + 1} in ${role}`);
        assert.ok(s.gateRequirements.minCompletionPct >= 50, `Valid completion threshold in stage ${i + 1}`);
        assert.ok(s.questDeepLink.startsWith('/quests'), `Quest deep link must target /quests in stage ${i + 1}`);
      }
    }
  });

  it('BRUTAL-5: Curriculum Gaps Stress Test — Empty inputs, massive inputs, and tier distribution', () => {
    // Scenario A: Completely empty input
    const emptyGaps = getCategorizedGaps('SDE', [], []);
    assert.ok(emptyGaps.length >= 3, 'Must supply fallback gaps if user has none');
    assert.strictEqual(emptyGaps[0].tier, 'Critical Blocker');

    // Scenario B: Large array with duplicates
    const rawGaps = [
      'rigid_execution_vs_adaptation',
      'rigid_execution_vs_adaptation', // duplicate
      'communication_vs_investigation',
      'async_race_condition',
      'db_n_plus_one_query',
      'system_design_caching',
      'distributed_locking',
      'kafka_event_streaming'
    ];
    const categorized = getCategorizedGaps('SDE', rawGaps);
    
    // Verify deduplication
    const uniqueNames = new Set(categorized.map(g => g.name));
    assert.strictEqual(categorized.length, uniqueNames.size, 'Gaps must be deduplicated by name');

    // Verify all tiers represented
    assert.ok(categorized.some(g => g.tier === 'Critical Blocker'), 'Must have Critical Blocker');
    assert.ok(categorized.some(g => g.tier === 'Competitive Differentiator'), 'Must have Competitive Differentiator');
    assert.ok(categorized.some(g => g.tier === 'Enterprise Specialization'), 'Must have Enterprise Specialization');

    // Verify interactive check question and correctIndex
    for (const g of categorized) {
      assert.ok(g.quickCheck.question.length > 10, 'Question must be descriptive');
      assert.ok(g.quickCheck.options.length >= 2, 'Must have at least 2 options');
      assert.ok(
        g.quickCheck.correctIndex >= 0 && g.quickCheck.correctIndex < g.quickCheck.options.length,
        'correctIndex must be within bounds of options'
      );
    }
  });

  it('BRUTAL-6: FSRS-4.5 Algorithm Invariant & Card Synthesis Under Stress', () => {
    const gap = humanizeAssessmentGap('async_race_condition');
    const card = createFSRSCardFromMistake(gap);

    // Initial state invariants
    assert.strictEqual(card.fsrs.state, State.New);
    assert.strictEqual(card.fsrs.reps, 0);
    assert.strictEqual(card.fsrs.lapses, 0);

    // Review 1: Student rates "Good"
    const now = Date.now();
    const scheduledGood = scheduleNextReview(card.fsrs, Rating.Good, DEFAULT_FSRS_PARAMS, now);
    assert.ok(scheduledGood.stability > 0, 'Stability must become positive on Good rating');
    assert.ok(scheduledGood.due > now, 'Next due date must be in the future');
    assert.strictEqual(scheduledGood.reps, 1);

    // Review 2: Student lapses with "Again"
    const scheduledAgain = scheduleNextReview(scheduledGood, Rating.Again, DEFAULT_FSRS_PARAMS, scheduledGood.due);
    assert.strictEqual(scheduledAgain.lapses, 1, 'Lapses count must increment');

    // Retention formula must remain within [0, 1]
    const retention = calculateRetention(scheduledGood, now + 86400000);
    assert.ok(!isNaN(retention) && retention >= 0 && retention <= 1.0, `Retention out of bounds: ${retention}`);
  });

  it('BRUTAL-7: Multi-Track Decks Coverage and Structural Parity', () => {
    const tracks = ['frontend', 'backend', 'commerce'];

    for (const track of tracks) {
      const deck = MULTI_TRACK_CONCEPT_DECKS[track];
      assert.ok(Array.isArray(deck) && deck.length >= 2, `Deck for ${track} must exist and have >= 2 cards`);

      for (const card of deck) {
        assert.ok(card.id && card.id.length > 0, 'Card ID must not be empty');
        assert.ok(card.course && card.course.length > 0, 'Card course must not be empty');
        assert.ok(card.topic && card.topic.length > 0, 'Card topic must not be empty');
        assert.ok(card.question && card.question.length > 15, 'Card question must be substantive');
        assert.ok(card.answer && card.answer.length > 25, 'Card answer must be comprehensive');
      }
    }
  });

});

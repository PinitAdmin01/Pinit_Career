import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFallbackAssistData } from '../src/app/interview/components/AssistModeDrawer';
import { generateScorecardPrintHtml } from '../src/app/interview/interviewEvaluator';

test('AI Interview Block 50 - Assist Mode & PDF Scorecard Suite', async (t) => {
  await t.test('buildFallbackAssistData produces structured STAR guidance for round 4', () => {
    const assist = buildFallbackAssistData('round4_star', 'Distributed Systems', 'advanced');
    assert.ok(assist.script.includes('Situation'));
    assert.ok(assist.script.includes('Task'));
    assert.ok(assist.script.includes('Action'));
    assert.ok(assist.script.includes('Result'));
    assert.ok(assist.bulletPoints.length >= 3);
    assert.ok(assist.deliveryGuide?.emphasisWords?.includes('measurable'));
    assert.ok(typeof assist.deliveryGuide?.pacing === 'string');
  });

  await t.test('buildFallbackAssistData provides complexity and invariant hints for coding round', () => {
    const assist = buildFallbackAssistData('round2_coding', 'Kafka Partitioning', 'standard', true);
    assert.ok(assist.script.includes('Kafka Partitioning'));
    assert.ok(assist.bulletPoints.some(bp => bp.includes('Time Complexity')));
    assert.ok(assist.deliveryGuide?.emphasisWords?.includes('complexity'));
  });

  await t.test('buildFallbackAssistData generates architecture ingress flow for system design', () => {
    const assist = buildFallbackAssistData('round3_systems', 'E-Commerce Platform', 'advanced');
    assert.ok(assist.script.includes('API Gateway'));
    assert.ok(assist.bulletPoints.some(bp => bp.includes('caching strategy')));
    assert.ok(assist.deliveryGuide?.emphasisWords?.includes('throughput'));
  });

  await t.test('generateScorecardPrintHtml generates complete print-ready HTML with rounds, telemetry and rubric evidence', () => {
    const html = generateScorecardPrintHtml({
      activeTopicName: 'High Throughput Distributed Cache',
      domainStream: 'tech',
      teacherName: 'Aditya',
      evaluationResult: {
        score: 88,
        verdict: 'Strong Hire',
        perRoundScores: {
          round1: { score: 90, verdict: 'Exemplary', metric: 'Communication' },
          round2: { score: 85, verdict: 'Passed', metric: '5/5 Tests' },
          round3: { score: 92, verdict: 'Optimal', metric: 'Canvas Topology' },
          round4: { score: 85, verdict: 'Structured', metric: 'STAR Quadrants' },
        },
        answerQuality: {
          evidence: [
            {
              dimension: 'reasoningDepth',
              quote: 'We implemented consistent hashing with virtual nodes.',
              assessment: 'Demonstrates deep partition rebalancing understanding.'
            }
          ]
        }
      },
      eyeContactScore: 82,
      wpmScore: 138,
      fillerWordCount: 2,
      tabSwitchCount: 0,
      messages: [
        { id: '1', role: 'user', content: 'We implemented consistent hashing with virtual nodes.' }
      ]
    });

    assert.ok(html.includes('PinIT Career OS — AI Mock Interview Official Scorecard'));
    assert.ok(html.includes('High Throughput Distributed Cache'));
    assert.ok(html.includes('88%'));
    assert.ok(html.includes('Strong Hire'));
    assert.ok(html.includes('Round 1: Behavioral & Domain'));
    assert.ok(html.includes('Round 2: Problem Solving'));
    assert.ok(html.includes('Round 3: System Architecture'));
    assert.ok(html.includes('Round 4: STAR Defense'));
    assert.ok(html.includes('82%'));
    assert.ok(html.includes('138 WPM'));
    assert.ok(html.includes('We implemented consistent hashing with virtual nodes.'));
    assert.ok(html.includes('window.print()'));
  });
});

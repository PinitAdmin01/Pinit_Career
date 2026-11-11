import test from 'node:test';
import assert from 'node:assert/strict';
import { runTestSuite } from '../src/lib/code/codeRunner';
import { resolveDynamicCodingProblem } from '../src/app/interview/problemGenerator';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';
import { ActiveInterviewDraft } from '../src/app/interview/interviewTypes';

test('C++ Interview Sandbox: AST Invariant Execution of Quant Limit Order Book Matcher', async () => {
  const prob = resolveDynamicCodingProblem('HFT Order Matching Engine', 'tech', 'cpp');
  assert.ok(prob.starterCode, 'Starter code must exist for cpp');
  assert.ok(prob.starterCode.includes('class Solution'), 'Must have Solution class');
  assert.ok(prob.starterCode.includes('int matchLimitOrders'), 'Must declare matchLimitOrders method');

  // Concrete solution implementation in C++
  const cppSolution = `
#include <vector>
#include <string>

struct Order {
    std::string side;
    int price;
    int qty;
};

class Solution {
public:
    int matchLimitOrders(const std::vector<Order>& orders) {
        int totalRemaining = 0;
        for (const auto& ord : orders) {
            totalRemaining += ord.qty;
        }
        return totalRemaining > 0 ? 6 : 0;
    }
};
`;

  const result = await runTestSuite(cppSolution, 'cpp', {
    functionName: 'matchLimitOrders',
    testCases: prob.testCases as any
  });

  assert.strictEqual(result.language, 'cpp');
  assert.ok(result.totalTests >= 5, 'Should inspect 5 boundary tiers');
  assert.ok(result.terminalLogs.some(log => log.includes('[CPP STATIC ANALYZER]')), 'C++ Static Analyzer must run');
  assert.ok(result.terminalLogs.some(log => log.includes('matchLimitOrders')), 'Must verify method signature');
  assert.strictEqual(result.allPassed, false, 'Without a real C++ compiler, test assertions must fail closed (never fake-pass)');
});

test('C++ Interview Sandbox: Fails Closed Without Compiler for IoT Packet Decoder', async () => {
  const prob = resolveDynamicCodingProblem('IoT Sensor Telemetry', 'tech', 'cpp');
  assert.ok(prob.starterCode.includes('uint8_t'), 'Must have uint8_t in starter code');

  const cppSolution = `
#include <vector>
#include <cstdint>

class Solution {
public:
    int decodeSensorPacket(const std::vector<uint8_t>& rawBytes) {
        if (rawBytes.empty() || rawBytes[0] != 0xAA) return -1;
        int len = rawBytes[1];
        if (rawBytes.size() < (size_t)(len + 3)) return -1;
        uint8_t chk = 0;
        for (size_t i = 2; i < 2 + len; ++i) {
            chk ^= rawBytes[i];
        }
        return (chk == rawBytes[2 + len]) ? len : -1;
    }
};
`;

  const result = await runTestSuite(cppSolution, 'cpp', {
    functionName: 'decodeSensorPacket',
    testCases: prob.testCases as any
  });

  assert.strictEqual(result.language, 'cpp');
  assert.ok(result.totalTests >= 5, 'Should track 5 boundary tiers');
  assert.ok(result.terminalLogs.some(log => log.includes('[CPP STATIC ANALYZER]')), 'Analyzer must log');
  assert.strictEqual(result.allPassed, false, 'Without a real C++ compiler, test assertions must fail closed');
});

test('Interview Scorecard: Full Data Contract Verification for Results View', () => {
  const evalResult = computeDeterministicEvaluation({
    messages: [
      { role: 'user', content: 'I engineered an embedded IoT telemetry gateway using ARM Cortex-M and FreeRTOS with zero-copy ring buffers.' },
      { role: 'assistant', content: 'Tell me how you secured the boot sequence.' },
      { role: 'user', content: 'We anchored the hardware root of trust in immutable Mask ROM with OTP eFuses and ECDSA P-256 signature verification.' }
    ],
    codeSubmitted: true,
    latestTopology: {
      nodes: [
        { id: '1', label: 'IoT Gateway', type: 'device' },
        { id: '2', label: 'MQTT Broker', type: 'gateway' }
      ]
    },
    starStep: 4,
    fillerWordCount: 0,
    wpmScore: 135,
    eyeContactScore: 88,
    activeTopicName: 'IoT Embedded Systems',
    domainStream: 'tech',
    roleKey: 'iot_embedded',
    difficulty: 'hard'
  });

  assert.ok(evalResult.verdict, 'Verdict must be present');
  assert.ok(evalResult.score >= 50, 'Score must be calculated');
  assert.ok(evalResult.readiness, 'Readiness status must be present');
  assert.ok(evalResult.rubricVersion, 'Rubric version must be present');
  assert.ok(evalResult.appliedWeights, 'Applied weights must be present');

  // Verify weights sum to 1.0
  const sumWeights = Object.values(evalResult.appliedWeights as Record<string, number>).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sumWeights - 1.0) < 1e-4, 'Applied weights must sum to 1.0');

  // Verify perRoundScores badges
  assert.ok(evalResult.perRoundScores.round1.badge, 'Round 1 badge must exist');
  assert.ok(evalResult.perRoundScores.round2.badge, 'Round 2 badge must exist');
  assert.strictEqual(evalResult.perRoundScores.round2.badge, 'MCU C++ Sandbox', 'Round 2 badge should be specialized');
  assert.ok(evalResult.perRoundScores.round3.badge, 'Round 3 badge must exist');
  assert.ok(evalResult.perRoundScores.round4.badge, 'Round 4 badge must exist');

  // Verify demonstrated strengths
  assert.ok(Array.isArray(evalResult.strengths), 'Strengths must be an array');
  assert.ok(evalResult.strengths.length > 0, 'Must have at least one demonstrated strength');
});

test('Interview Persistence: ActiveInterviewDraft supports cpp selectedLang', () => {
  const draft: ActiveInterviewDraft = {
    activeTopicName: 'Quant Trading Systems',
    domainStream: 'tech',
    activeStage: 'round2_coding',
    difficulty: 'hard',
    starStep: 2,
    messages: [],
    codeContent: '// C++ order book matching',
    selectedLang: 'cpp',
    elapsedSeconds: 120,
    fillerWordCount: 0,
    activeTeacherId: 'teacher_alex'
  };

  assert.strictEqual(draft.selectedLang, 'cpp');
  assert.strictEqual(draft.activeStage, 'round2_coding');
});

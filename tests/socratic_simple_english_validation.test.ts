import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { executeRoleplayTurn } from '../src/lib/missions/roleplayEngine';

describe('BRUTAL VALIDATION — SOCRATIC ROLEPLAY SIMPLE ENGLISH (Task 3)', () => {
  const mockLlmOffline = async () => {
    throw new Error('LLM offline for testing fallback resilience');
  };

  it('generates initialize crisis node in simple, student-friendly English without techno-jargon', async () => {
    const node = await executeRoleplayTurn(
      {
        action: 'initialize',
        studentName: 'Aarav Sharma',
        role: 'Full-Stack Developer',
        qt2: 75,
      },
      mockLlmOffline
    );

    assert.equal(node.ok, true);
    if ('message' in node) {
      assert.ok(node.message.length > 30, 'Message must be non-empty');
      assert.ok(node.message.includes('Aarav'), 'Must greet student by first name');

      // Crucial: Must NOT contain confusing SRE / Silicon Valley buzzwords
      assert.ok(!node.message.toLowerCase().includes('blast radius'), 'Must not contain "blast radius"');
      assert.ok(!node.message.toLowerCase().includes('skip the postmortem'), 'Must not contain "skip the postmortem"');
      assert.ok(!node.message.toLowerCase().includes('freeze writes on matching model'), 'Must not contain "freeze writes"');
      assert.ok(!node.message.toLowerCase().includes('algo drift'), 'Must not contain "algo drift"');
      assert.ok(!node.message.toLowerCase().includes('fifo fallback'), 'Must not contain "fifo fallback"');

      // Verify 3 distinct, simple choices
      assert.equal(node.choices.length, 3, 'Must have 3 choices');
      const deltas = node.choices.map((c) => c.delta);
      assert.ok(deltas.includes(4), 'Must include high-ownership choice (+4)');
      assert.ok(deltas.includes(-2), 'Must include shortcut trap choice (-2)');
      assert.ok(deltas.includes(-4), 'Must include blame-shifting choice (-4)');

      // Verify choice texts are simple and clear
      for (const choice of node.choices) {
        assert.ok(choice.text.length > 20, 'Choice text must be descriptive');
        assert.ok(!choice.text.toLowerCase().includes('blast radius'), 'Choices must not contain "blast radius"');
        assert.ok(!choice.text.toLowerCase().includes('freeze writes'), 'Choices must not contain "freeze writes"');
      }
    } else {
      assert.fail('Expected RoleplayNode');
    }
  });

  it('generates respond node in simple, student-friendly English without techno-jargon', async () => {
    const node = await executeRoleplayTurn(
      {
        action: 'respond',
        studentName: 'Aarav Sharma',
        role: 'Full-Stack Developer',
        choice: 'Be honest and take ownership: calmly explain what broke and give an honest time estimate.',
        history: [
          { role: 'assistant', content: 'Hey Aarav, we have a serious issue with the student login portal!' },
          { role: 'user', content: 'Be honest and take ownership.' },
        ],
      },
      mockLlmOffline
    );

    assert.equal(node.ok, true);
    if ('message' in node) {
      assert.ok(node.message.length > 30, 'Message must be non-empty');
      assert.ok(!node.message.toLowerCase().includes('blast radius'), 'Must not contain "blast radius"');
      assert.equal(node.choices.length, 3, 'Must have 3 choices');
    } else {
      assert.fail('Expected RoleplayNode');
    }
  });

  it('generates evaluation summary in simple, student-friendly English with spoken conclusion', async () => {
    const evalResult = await executeRoleplayTurn(
      {
        action: 'evaluate',
        studentName: 'Aarav Sharma',
        history: [
          { role: 'assistant', content: 'Crisis node 1' },
          { role: 'user', content: 'Be honest and take ownership.', delta: 4 },
          { role: 'assistant', content: 'Crisis node 2' },
          { role: 'user', content: 'Stay focused and transparent.', delta: 4 },
        ],
      },
      mockLlmOffline
    );

    assert.equal(evalResult.ok, true);
    if ('report' in evalResult) {
      assert.ok(evalResult.report.includes('Aarav'), 'Must mention candidate name');
      assert.ok(evalResult.spokenConclusion.includes('Aarav'), 'Spoken conclusion must address student');
      assert.ok(evalResult.spokenConclusion.length > 20, 'Spoken conclusion must be meaningful');
      assert.ok(
        !evalResult.spokenConclusion.toLowerCase().includes('blast radius'),
        'Spoken conclusion must not use techno-jargon'
      );
      assert.ok(evalResult.qt2_delta > 0, 'Positive choices must yield positive QT2 delta');
    } else {
      assert.fail('Expected RoleplayEval');
    }
  });
});

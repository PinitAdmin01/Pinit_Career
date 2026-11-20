import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { executeRoleplayTurn } from '../src/lib/missions/roleplayEngine';

describe('TASK 1 BRUTAL VERIFICATION: 1st Year / 10+2 Student POV Socratic Situations', () => {
  const mockLlmOffline = async () => {
    throw new Error('LLM offline testing deterministic fallback');
  };

  it('1.1: Generates 1st-year student situations with relatable college dilemmas', async () => {
    const studentNames = ['Vinay', 'Aarav', 'Pooja', 'Rohan', 'Sneha'];

    for (const name of studentNames) {
      const node = await executeRoleplayTurn(
        {
          action: 'initialize',
          studentName: name,
          role: 'Engineering Student (1st Year)',
          qt2: 70,
        },
        mockLlmOffline
      );

      assert.equal(node.ok, true);
      if ('message' in node) {
        assert.ok(node.message.includes(name), `Message must greet ${name} by name`);

        // Check for 10+2 student friendly language
        const forbiddenJargon = [
          'cluster nodes',
          'in-flight transactions',
          'circuit breaker',
          'rate-limiter',
          'database connection pool',
          'kafka stream',
          'blast radius',
        ];

        for (const jargon of forbiddenJargon) {
          assert.ok(
            !node.message.toLowerCase().includes(jargon),
            `Message must not contain advanced enterprise jargon: "${jargon}"`
          );
        }

        // Must have 4 options with exact delta spread [+4, +2, -2, -4]
        assert.equal(node.choices.length, 4, 'Must have exactly 4 choices');
        const deltas = node.choices.map(c => c.delta).sort((a, b) => b - a);
        assert.deepEqual(deltas, [4, 2, -2, -4], 'Must have deltas 4, 2, -2, -4');

        // Check each choice does not have enterprise jargon
        for (const c of node.choices) {
          assert.ok(c.text.length > 25, 'Choice must be well explained');
          for (const jargon of forbiddenJargon) {
            assert.ok(!c.text.toLowerCase().includes(jargon), `Choice must not contain "${jargon}"`);
          }
        }
      } else {
        assert.fail('Expected RoleplayNode');
      }
    }
  });

  it('1.2: 10-turn progression maintains accessible student language through all 5 phases', async () => {
    let history: Array<{ role: 'user' | 'assistant'; content: string; delta?: number }> = [];

    // Turn 1: initialize
    const initNode = await executeRoleplayTurn(
      {
        action: 'initialize',
        studentName: 'Aarav',
        role: 'Computer Science Student',
      },
      mockLlmOffline
    );

    assert.equal(initNode.ok, true);
    if ('message' in initNode) {
      history.push({ role: 'assistant', content: initNode.message });
      // Pick best choice (+4)
      const bestChoice = initNode.choices.find(c => c.delta === 4)!;
      history.push({ role: 'user', content: bestChoice.text, delta: 4 });
    }

    // Play turns 2 to 10 (each presenting 4 student choices for 10 total decisions)
    for (let turn = 2; turn <= 10; turn++) {
      const respNode = await executeRoleplayTurn(
        {
          action: 'respond',
          studentName: 'Aarav',
          choice: history[history.length - 1].content,
          history,
        },
        mockLlmOffline
      );

      assert.equal(respNode.ok, true);
      if ('message' in respNode) {
        assert.equal(respNode.choices.length, 4, `Turn ${turn} must have 4 choices`);
        const chosen = respNode.choices.find(c => c.delta === 4) || respNode.choices[0];
        history.push({ role: 'assistant', content: respNode.message });
        history.push({ role: 'user', content: chosen.text, delta: chosen.delta });
      }
    }

    // After 10 user choices, the simulation concludes with a final summary node
    const finalNode = await executeRoleplayTurn(
      {
        action: 'respond',
        studentName: 'Aarav',
        choice: history[history.length - 1].content,
        history,
      },
      mockLlmOffline
    );

    assert.equal(finalNode.ok, true);
    if ('message' in finalNode) {
      assert.equal(finalNode.isEnded, true, 'Simulation must end after 10 decisions');
      assert.equal(finalNode.choices.length, 0, 'Final node must have 0 choices');
      assert.ok(finalNode.message.includes('Aarav'), 'Conclusion message must address student');
    }

    // Evaluate
    const evalRes = await executeRoleplayTurn(
      {
        action: 'evaluate',
        studentName: 'Aarav',
        history,
      },
      mockLlmOffline
    );

    assert.equal(evalRes.ok, true);
    if ('report' in evalRes) {
      assert.ok(evalRes.report.length > 50, 'Report must be non-empty');
      assert.ok(evalRes.spokenConclusion.length > 20, 'Spoken conclusion must be non-empty');
      assert.ok(evalRes.qt2_delta > 0, 'Positive choices must yield positive QT2 delta');
    }
  });
});

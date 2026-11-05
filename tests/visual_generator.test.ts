import test, { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setLlmJsonTransportForTests } from '@/lib/server/llmJson';
import { generatePart, generateDay } from '../scripts/visuals/generate.mts';

describe('Task E-17: Visual Generator Script', () => {
  afterEach(() => {
    setLlmJsonTransportForTests(null);
  });

  it('1. a valid answer is filled and passes', async () => {
    // Return a valid flow spec for python Day 1 Part 0
    const validSpec = {
      template: 'flow',
      title: 'Language Pipeline',
      nodes: [
        { id: '1', label: 'Python', tappable: true },
        { id: '2', label: 'code', tappable: true },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'Python gives clear instructions to the computer.',
          values: {
            '1': { text: 'print' },
            '2': { out: 1 },
          },
        },
        {
          at: 'say2',
          caption: 'People use python to build useful projects.',
          values: {
            '1': { text: 'print' },
            '2': { out: 1 },
          },
        },
      ],
    };

    let callCount = 0;
    setLlmJsonTransportForTests(async () => {
      callCount++;
      return JSON.stringify(validSpec);
    });

    const result = await generatePart('python', 1, 0, { skipKeyCheck: true });

    assert.equal(callCount, 1, 'Should succeed on the first attempt');
    assert.equal(result.status, 'passed');
    assert.equal(result.entry.spec.template, 'flow');
    assert.equal(result.attempts, 1);
    assert.ok(result.entry.filled, 'Filled visual data must exist');
    assert.equal(
      (result.entry.filled as any).title,
      'Language Pipeline'
    );
    assert.equal(
      (result.entry.filled as any).steps[0].values['1'],
      'print'
    );
    assert.equal(
      (result.entry.filled as any).steps[0].values['2'],
      'Hello! This is my first Python program.'
    );
  });

  it('2. an answer that breaks R3 is retried with the gate error', async () => {
    // Attempt 1: breaks R3 (stack-queue step 0 has 7 items, exceeding max 6)
    const brokenR3Spec = {
      template: 'stack-queue',
      title: 'Operation Queue',
      steps: [
        {
          at: 'say1',
          caption: 'An algorithm solves a problem with exact steps.',
          items: [
            { text: 'steps' },
            { text: 'steps' },
            { text: 'steps' },
            { text: 'steps' },
            { text: 'steps' },
            { text: 'steps' },
            { text: 'steps' }, // 7 items -> fails R3 (max 6)
          ],
        },
        {
          at: 'say2',
          caption: 'The program handles different amounts of data.',
          items: [{ text: 'steps' }],
        },
      ],
    };

    // Attempt 2: corrected valid spec with 2 items
    const correctedSpec = {
      template: 'stack-queue',
      title: 'Operation Queue',
      steps: [
        {
          at: 'say1',
          caption: 'An algorithm solves a problem with exact steps.',
          items: [
            { text: 'steps' },
            { text: 'steps' },
          ],
        },
        {
          at: 'say2',
          caption: 'The program handles different amounts of data.',
          items: [{ text: 'steps' }],
        },
      ],
    };

    const receivedPrompts: string[] = [];
    let callCount = 0;

    setLlmJsonTransportForTests(async (opts) => {
      callCount++;
      receivedPrompts.push(opts.user);
      if (callCount === 1) {
        return JSON.stringify(brokenR3Spec);
      }
      return JSON.stringify(correctedSpec);
    });

    const result = await generatePart('dsa-py', 1, 0, { skipKeyCheck: true });

    assert.equal(callCount, 2, 'Should retry and succeed on the second attempt');
    assert.equal(result.status, 'passed');
    assert.equal(result.attempts, 2);
    assert.equal(result.entry.spec.template, 'stack-queue');

    // Verify that the second call received the R3 gate error in prompt
    assert.ok(receivedPrompts[1], 'Second attempt prompt must exist');
    assert.match(
      receivedPrompts[1],
      /R3:.*max 6/,
      'Retry prompt must contain the gate failure message'
    );
  });

  it('3. 3 bad answers give none and needs-review', async () => {
    // Always return an invalid answer
    const badSpec = {
      template: 'flow',
      title: 'Broken Flow',
      nodes: [{ id: '1', label: 'Python' }],
      steps: [
        {
          at: 'say1',
          caption: 'No full stop at end and missing words',
          values: { '1': { text: 'print' } },
        },
        {
          at: 'say2',
          caption: 'Invalid caption text here without dot',
          values: { '1': { text: 'print' } },
        },
      ],
    };

    let callCount = 0;
    setLlmJsonTransportForTests(async () => {
      callCount++;
      return JSON.stringify(badSpec);
    });

    const result = await generatePart('python', 1, 0, { skipKeyCheck: true });

    assert.equal(callCount, 3, 'Must attempt exactly 3 times before giving up');
    assert.equal(result.status, 'needs-review');
    assert.equal(result.entry.spec.template, 'none');
    assert.match(
      result.entry.spec.reason,
      /^generator:/,
      'Reason must start with "generator: <last gate error>"'
    );
  });

  it('4. a typed value instead of a binding is rejected', async () => {
    // Return a spec where values has literal values instead of bindings
    const typedValueSpec = {
      template: 'flow',
      title: 'Typed Values Flow',
      nodes: [
        { id: '1', label: 'Python', tappable: true },
        { id: '2', label: 'code', tappable: true },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'Python gives instructions to the computer.',
          values: {
            '1': 42, // Typed number instead of binding!
            '2': 'Literal Text', // Typed string instead of binding!
          },
        },
        {
          at: 'say2',
          caption: 'People use python to build projects.',
          values: {
            '1': 42,
            '2': 'Literal Text',
          },
        },
      ],
    };

    let callCount = 0;
    setLlmJsonTransportForTests(async () => {
      callCount++;
      return JSON.stringify(typedValueSpec);
    });

    const result = await generatePart('python', 1, 0, { skipKeyCheck: true });

    assert.equal(callCount, 3, 'Typed value was rejected every attempt');
    assert.equal(result.status, 'needs-review');
    assert.equal(result.entry.spec.template, 'none');
    assert.match(
      result.entry.spec.reason,
      /SCHEMA_VALIDATION_FAILED/,
      'Rejection reason must mention schema validation failure on bindings'
    );
  });

  it('5. generates a valid spec for react-basics', async () => {
    const validReactSpec = {
      template: 'boxes',
      title: 'Browser and Server',
      boxes: [
        { id: '1', label: 'browser', tappable: true },
        { id: '2', label: 'server', tappable: true },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'Your browser sends a request to the server.',
          values: {
            '1': { text: 'browser' },
            '2': { text: 'server' },
          },
        },
        {
          at: 'say2',
          caption: 'The recursive resolver queries the authoritative domain.',
          values: {
            '1': { text: 'browser' },
            '2': { text: 'server' },
          },
        },
      ],
    };

    setLlmJsonTransportForTests(async () => {
      return JSON.stringify(validReactSpec);
    });

    const result = await generatePart('react-basics', 1, 0, { skipKeyCheck: true });
    assert.equal(result.status, 'passed');
    assert.equal(result.entry.spec.template, 'boxes');
    assert.equal(result.attempts, 1);
  });
});


import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import {
  askForJson,
  extractJsonObjectSubstring,
  setLlmJsonTransportForTests,
} from '../src/lib/server/llmJson';

const SampleSchema = z.object({
  title: z.string(),
  count: z.number(),
  tags: z.array(z.string()),
});

describe('server helper for strict-JSON AI calls (askForJson)', () => {
  afterEach(() => {
    setLlmJsonTransportForTests(null);
  });

  it('valid clean JSON passes and validates against the schema', async () => {
    setLlmJsonTransportForTests(async () => {
      return JSON.stringify({
        title: 'Backend Refactoring',
        count: 5,
        tags: ['python', 'fastapi'],
      });
    });

    const res = await askForJson({
      system: 'You are an engineer.',
      user: 'Generate a task.',
      schema: SampleSchema,
      maxTokens: 500,
    });

    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.strictEqual(res.data.title, 'Backend Refactoring');
      assert.strictEqual(res.data.count, 5);
      assert.deepStrictEqual(res.data.tags, ['python', 'fastapi']);
      assert.ok(res.model.length > 0);
    }
  });

  it('handles conversational chatter and markdown code blocks around JSON', async () => {
    setLlmJsonTransportForTests(async () => {
      return `Sure! Here is the JSON you requested for the task:

\`\`\`json
{
  "title": "Bug fix in payment service",
  "count": 3,
  "tags": ["django", "sql"]
}
\`\`\`

I hope this helps you get started! Let me know if you need changes.`;
    });

    const res = await askForJson({
      system: 'You are an engineer.',
      user: 'Generate a task.',
      schema: SampleSchema,
      maxTokens: 500,
    });

    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.strictEqual(res.data.title, 'Bug fix in payment service');
      assert.strictEqual(res.data.count, 3);
      assert.deepStrictEqual(res.data.tags, ['django', 'sql']);
    }
  });

  it('returns ok: false when reply contains invalid JSON syntax', async () => {
    setLlmJsonTransportForTests(async () => {
      return 'Here is JSON: { "title": "Incomplete", "count": 5, tags: [broken }';
    });

    const res = await askForJson({
      system: 'You are an engineer.',
      user: 'Generate a task.',
      schema: SampleSchema,
      maxTokens: 500,
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.match(res.reason, /JSON_PARSE_FAILED/);
    }
  });

  it('returns ok: false when no JSON object exists in reply', async () => {
    setLlmJsonTransportForTests(async () => {
      return 'Sorry, I am unable to generate a response right now.';
    });

    const res = await askForJson({
      system: 'You are an engineer.',
      user: 'Generate a task.',
      schema: SampleSchema,
      maxTokens: 500,
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.reason, 'NO_JSON_OBJECT_FOUND');
    }
  });

  it('returns ok: false when JSON does not match the Zod schema', async () => {
    setLlmJsonTransportForTests(async () => {
      return JSON.stringify({
        title: 'Missing fields',
        // count is missing, tags is wrong type
        tags: 'not-an-array',
      });
    });

    const res = await askForJson({
      system: 'You are an engineer.',
      user: 'Generate a task.',
      schema: SampleSchema,
      maxTokens: 500,
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.match(res.reason, /SCHEMA_VALIDATION_FAILED/);
    }
  });

  it('extractJsonObjectSubstring handles various boundaries', () => {
    assert.strictEqual(extractJsonObjectSubstring('no braces here'), null);
    assert.strictEqual(extractJsonObjectSubstring('}{'), null);
    assert.strictEqual(extractJsonObjectSubstring('prefix {"a": 1} suffix'), '{"a": 1}');
    assert.strictEqual(
      extractJsonObjectSubstring('multi { "outer": { "inner": 2 } } trailing'),
      '{ "outer": { "inner": 2 } }'
    );
  });
});

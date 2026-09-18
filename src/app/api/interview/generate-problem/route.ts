import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { recordActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';

export interface DynamicProblemRequest {
  topic: string;
  domainStream?: 'tech' | 'non_tech';
  language?: 'python' | 'javascript' | 'java' | 'sql';
  difficulty?: 'easy' | 'normal' | 'hard';
  projectContext?: string;
}

export interface DynamicProblemResponse {
  title: string;
  description: string;
  functionName: string;
  starterCode: {
    python: string;
    javascript: string;
    java: string;
    sql: string;
  };
  testCases: Array<{
    input: string;
    expectedOutput: string;
    output?: string;
    name: string;
  }>;
  suggestedWhiteboardNodes: Array<{
    id: string;
    label: string;
    type: string;
  }>;
  success: boolean;
}

// Universal Semantic Problem Generator (Instant Fallback with Zero Static Topic Lists)
function generateSemanticProblemFallback(
  topic: string,
  domainStream: string = 'tech',
  difficulty: string = 'normal'
): DynamicProblemResponse {
  const cleanTopic = (topic || 'Engineering Logic').trim();
  const isNonTech = domainStream === 'non_tech';

  // Slugify topic into a safe function identifier
  const safeFnName = cleanTopic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24) || 'evaluate_metric';

  const jsFnName = safeFnName.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());

  if (isNonTech) {
    return {
      title: `${cleanTopic} Quantitative Metric & Feasibility Evaluator`,
      description: `Write a business calculation function '${safeFnName}(primary_metric, secondary_metric)' that evaluates whether the efficiency ratio meets or exceeds 1.25 without dividing by zero. Return boolean true if viable, false otherwise.`,
      functionName: safeFnName,
      starterCode: {
        python: `def ${safeFnName}(primary_metric, secondary_metric):\n    # TODO: Return True if primary / secondary >= 1.25, handling zero division\n    return False`,
        javascript: `function ${jsFnName}(primaryMetric, secondaryMetric) {\n    // TODO: Return true if primary / secondary >= 1.25, handling zero division\n    return false;\n}`,
        java: `public class Solution {\n    public boolean ${jsFnName}(double primary, double secondary) {\n        // TODO: Return true if primary / secondary >= 1.25\n        return false;\n    }\n}`,
        sql: `SELECT CASE WHEN secondary_metric > 0 AND (primary_metric / secondary_metric) >= 1.25 THEN 1 ELSE 0 END as is_viable FROM metrics;`
      },
      testCases: [
        {
          input: '(150, 100)',
          expectedOutput: 'true',
          output: 'true',
          name: 'Standard Efficiency Threshold Check'
        },
        {
          input: '(80, 100)',
          expectedOutput: 'false',
          output: 'false',
          name: 'Sub-Optimal Ratio Check'
        },
        {
          input: '(0, 0)',
          expectedOutput: 'false',
          output: 'false',
          name: 'Zero Boundary Case'
        }
      ],
      suggestedWhiteboardNodes: [
        { id: 'input', label: 'Data Intake & Ledger', type: 'api' },
        { id: 'analytics', label: 'Quantitative Engine', type: 'compute' },
        { id: 'validation', label: 'Compliance & Audit Gate', type: 'cache' },
        { id: 'reporting', label: 'Executive Reporting Tier', type: 'database' }
      ],
      success: true
    };
  }

  // Technical Domain Problem Generator
  return {
    title: `${cleanTopic} Algorithmic Pipeline & Data Optimizer`,
    description: `Implement an optimized function '${safeFnName}(items, threshold)' that returns the count of items meeting or exceeding the given threshold in linear O(N) time.`,
    functionName: safeFnName,
    starterCode: {
      python: `def ${safeFnName}(items, threshold):\n    # TODO: Return count of items >= threshold\n    return 0`,
      javascript: `function ${jsFnName}(items, threshold) {\n    // TODO: Return count of items >= threshold\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int ${jsFnName}(int[] items, int threshold) {\n        // TODO: Return count of items >= threshold\n        return 0;\n    }\n}`,
      sql: `SELECT COUNT(*) as valid_count FROM domain_records WHERE metric_val >= 50;`
    },
    testCases: [
      {
        input: '([10, 50, 75, 100], 50)',
        expectedOutput: '3',
        output: '3',
        name: 'Standard Filtering Test'
      },
      {
        input: '([10, 20, 30], 100)',
        expectedOutput: '0',
        output: '0',
        name: 'Empty Matches Boundary Test'
      },
      {
        input: '([], 10)',
        expectedOutput: '0',
        output: '0',
        name: 'Empty Input Dataset Test'
      }
    ],
    suggestedWhiteboardNodes: [
      { id: 'gateway', label: 'Client / Gateway Layer', type: 'api' },
      { id: 'worker', label: `${cleanTopic} Microservice`, type: 'compute' },
      { id: 'cache', label: 'Redis Low-Latency Cache', type: 'cache' },
      { id: 'storage', label: 'Primary Relational Database', type: 'database' }
    ],
    success: true
  };
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`interview_gen_problem_${ip}`, { limit: 10, windowMs: 3_600_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

  console.log('[Dynamic Problem API] Incoming problem generation request received');

  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.warn('[Dynamic Problem API] Auth verification failed');
      return gated.error;
    }
    const userId = gated.user.id;

    const body = (await req.json()) as DynamicProblemRequest;
    const {
      topic = 'Software Engineering',
      domainStream = 'tech',
      language = 'python',
      difficulty = 'normal',
      projectContext = ''
    } = body;

    recordActiveLiveInterview(userId, topic, 'round2_coding');

    console.log(`[Dynamic Problem API] Generating dynamic challenge for: "${topic}" | Stream: ${domainStream} | Language: ${language} | User: ${userId}`);

    const stream = domainStream === 'non_tech' ? 'non_tech' : 'tech';

    // Build Prompt for Generative LLM Problem Creation
    const systemPrompt = `You are a Principal Engineering & Corporate Assessment Architect.
Design a highly realistic, authentic, and engaging coding or analytical problem tailored precisely to the topic "${topic}" (${stream} stream, difficulty: ${difficulty}).
${projectContext ? `Project context: "${projectContext}".` : ''}

Generate:
1. Title: Professional challenge title specific to ${topic}.
2. Description: Real-world problem statement with constraints and expected return format.
3. functionName: Pythonic snake_case function identifier (e.g. "calculate_latency", "evaluate_portfolio").
4. starterCode: Empty function signatures/stubs with parameter comments and a TODO placeholder. Strictly DO NOT implement or leak the solution algorithm.
5. testCases: Exactly 3 deterministic unit test cases (Standard, Edge/Boundary, Zero/Empty). "input" MUST be a valid function argument tuple e.g. "([1, 2, 3], 5)" and "expectedOutput" MUST be a machine-parsable literal (e.g. "3", "true", "42") without descriptive prose.
6. suggestedWhiteboardNodes: 4 recommended architecture/workflow nodes for this topic.

Return ONLY valid JSON matching this schema:
{
  "title": "<string>",
  "description": "<string>",
  "functionName": "<string>",
  "starterCode": {
    "python": "<string>",
    "javascript": "<string>",
    "java": "<string>",
    "sql": "<string>"
  },
  "testCases": [
    { "input": "<string>", "expectedOutput": "<string>", "name": "<string>" }
  ],
  "suggestedWhiteboardNodes": [
    { "id": "<string>", "label": "<string>", "type": "<api|compute|cache|database>" }
  ]
}`;

    // Multi-key pool rotation
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let parsedResult: any = null;

    for (const key of groqKeys) {
      try {
        console.log(`[Dynamic Problem API] Attempting LLM problem generation with Groq key ending in ...${key.slice(-4)}`);
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate dynamic challenge boilerplate and test cases for: "${topic}"` }
            ],
            max_tokens: 850,
            temperature: 0.2
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          parsedResult = JSON.parse(cleanJsonStr);
          console.log('[Dynamic Problem API] ✅ Groq dynamic problem generated successfully');
          break;
        } else {
          console.warn(`[Dynamic Problem API] Groq key returned status: ${res.status}`);
        }
      } catch (err: any) {
        console.warn('[Dynamic Problem API] Groq attempt failed:', err?.message);
      }
    }

    // Failover to OpenRouter if Groq is unavailable
    if (!parsedResult && openRouterKey) {
      try {
        console.log('[Dynamic Problem API] Falling back to OpenRouter for problem generation...');
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit-careers.web.app',
            'X-Title': 'PinIT Dynamic Problem Generator'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate dynamic challenge boilerplate and test cases for: "${topic}"` }
            ],
            max_tokens: 850,
            temperature: 0.2
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          parsedResult = JSON.parse(cleanJsonStr);
          console.log('[Dynamic Problem API] ✅ OpenRouter problem generated successfully');
        }
      } catch (err: any) {
        console.warn('[Dynamic Problem API] OpenRouter attempt failed:', err?.message);
      }
    }

    if (parsedResult && parsedResult.title && parsedResult.starterCode) {
      return NextResponse.json({
        title: sanitizeLLMOutput(parsedResult.title),
        description: sanitizeLLMOutput(parsedResult.description),
        functionName: parsedResult.functionName || 'evaluate_solution',
        starterCode: parsedResult.starterCode,
        testCases: Array.isArray(parsedResult.testCases) ? parsedResult.testCases : [],
        suggestedWhiteboardNodes: Array.isArray(parsedResult.suggestedWhiteboardNodes) ? parsedResult.suggestedWhiteboardNodes : [],
        success: true
      });
    }

    // Instant Semantic Fallback with Zero Hardcoding
    console.log('[Dynamic Problem API] Serving instant semantic dynamic fallback');
    const fallback = generateSemanticProblemFallback(topic, stream, difficulty);
    return NextResponse.json(fallback);

  } catch (err: any) {
    console.error('[Dynamic Problem API Error]:', err);
    const fallback = generateSemanticProblemFallback('Engineering Logic', 'tech', 'normal');
    return NextResponse.json(fallback);
  }
}

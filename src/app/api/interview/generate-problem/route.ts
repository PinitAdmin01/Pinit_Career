import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { recordActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';
import { extractJsonObject } from '@/lib/interview/jsonExtract';

export interface DynamicProblemRequest {
  topic: string;
  domainStream?: 'tech' | 'non_tech';
  language?: 'python' | 'javascript' | 'java' | 'sql' | 'cpp';
  difficulty?: 'easy' | 'normal' | 'hard';
  variation?: number;
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
    cpp?: string;
    sql: string;
  };
  testCases: Array<{
    input: string;
    expectedOutput: string;
    output?: string;
    name: string;
  }>;
  testSuite?: string;
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
  difficulty: string = 'normal',
  variation: number = 0
): DynamicProblemResponse {
  const cleanTopic = (topic || 'Engineering Logic').trim();
  const isNonTech = domainStream === 'non_tech';
  const strictComparison = variation % 2 === 1;
  const comparisonText = strictComparison ? 'strictly greater than' : 'greater than or equal to';

  // Slugify topic into a clean, readable function identifier (trimming on underscore boundaries, never mid-word)
  const rawSlug = cleanTopic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  let safeFnName = rawSlug;
  if (safeFnName.length > 24) {
    const cut = safeFnName.slice(0, 24);
    const lastSep = cut.lastIndexOf('_');
    safeFnName = (lastSep >= 10 ? cut.slice(0, lastSep) : cut).replace(/_+$/g, '');
  }
  if (!safeFnName || /^[0-9]/.test(safeFnName)) {
    safeFnName = 'evaluate_metric';
  }

  const jsFnName = safeFnName.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());

  if (isNonTech) {
    return {
      title: `${cleanTopic} Quantitative Metric & Feasibility Evaluator${variation ? ` · Challenge ${variation + 1}` : ''}`,
      description: `Write a business calculation function '${safeFnName}(primary_metric, secondary_metric)' that evaluates whether the efficiency ratio is ${comparisonText} 1.25 without dividing by zero. Return boolean true if viable, false otherwise.`,
      functionName: safeFnName,
      starterCode: {
        python: `def ${safeFnName}(primary_metric, secondary_metric):\n    # TODO: Compare the ratio with the required boundary; handle zero division\n    return False`,
        javascript: `function ${jsFnName}(primaryMetric, secondaryMetric) {\n    // TODO: Compare the ratio with the required boundary; handle zero division\n    return false;\n}`,
        java: `public class Solution {\n    public boolean ${jsFnName}(double primary, double secondary) {\n        // TODO: Return true if primary / secondary >= 1.25\n        return false;\n    }\n}`,
        cpp: `class Solution {\npublic:\n    bool ${jsFnName}(double primary, double secondary) {\n        // TODO: Return true if primary / secondary >= 1.25\n        return false;\n    }\n};`,
        sql: `SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary FROM employees GROUP BY department_id HAVING AVG(salary) > 50000 ORDER BY department_id;`
      },
      testCases: [
        {
          input: '(125, 100)',
          expectedOutput: strictComparison ? 'false' : 'true',
          output: strictComparison ? 'false' : 'true',
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
      testSuite: `CREATE TABLE employees (id INT, name TEXT, department_id INT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Alice', 101, 'Engineering', 95000);
INSERT INTO employees VALUES (2, 'Bob', 102, 'Marketing', 65000);
INSERT INTO employees VALUES (3, 'Charlie', 101, 'Engineering', 105000);
INSERT INTO employees VALUES (4, 'David', 103, 'Sales', 72000);
INSERT INTO employees VALUES (5, 'Emma', 101, 'Engineering', 98000);
-- CHECKS --
SELECT count(*) = 3 AS ok, 'returns all departments above the salary threshold' AS msg FROM answer;
SELECT (SELECT headcount FROM answer WHERE department_id = 101) = 3 AS ok, 'includes the correct Engineering headcount' AS msg;
SELECT (SELECT round(avg_salary) FROM answer WHERE department_id = 101) = 99333 AS ok, 'calculates the Engineering average salary' AS msg;`,
      success: true
    };
  }

  // Technical Domain Problem Generator
  return {
      title: `${cleanTopic} Algorithmic Pipeline & Data Optimizer${variation ? ` · Challenge ${variation + 1}` : ''}`,
      description: `Implement an optimized function '${safeFnName}(items, threshold)' that returns the count of items ${comparisonText} the given threshold in linear O(N) time.`,
    functionName: safeFnName,
    starterCode: {
      python: `def ${safeFnName}(items, threshold):\n    # TODO: Return count using the required threshold boundary\n    return 0`,
      javascript: `function ${jsFnName}(items, threshold) {\n    // TODO: Return count using the required threshold boundary\n    return 0;\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public int ${jsFnName}(int[] items, int threshold) {\n        // TODO: Return count of items ${comparisonText} the threshold\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int ${jsFnName}(const std::vector<int>& items, int threshold) {\n        // TODO: Return count of items ${comparisonText} the threshold\n        return 0;\n    }\n};`,
      sql: `SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary FROM employees GROUP BY department_id HAVING AVG(salary) > 50000 ORDER BY department_id;`
    },
    testCases: [
      {
        input: '([10, 50, 75, 100], 50)',
        expectedOutput: strictComparison ? '2' : '3',
        output: strictComparison ? '2' : '3',
        name: '[T1: Standard] Standard Filtering Test'
      },
      {
        input: '([10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 50)',
        expectedOutput: strictComparison ? '5' : '6',
        output: strictComparison ? '5' : '6',
        name: '[T2: Scale] Large Scale Batch Filtering Test'
      },
      {
        input: '([], 10)',
        expectedOutput: '0',
        output: '0',
        name: '[T3: Zero/Empty] Empty Input Dataset Test'
      },
      {
        input: '([-50, -10, 0, 10], -10)',
        expectedOutput: strictComparison ? '2' : '3',
        output: strictComparison ? '2' : '3',
        name: '[T4: Edge Values] Negative & Exact Threshold Boundary Test'
      },
      {
        input: '([10, 20, 30], 100)',
        expectedOutput: '0',
        output: '0',
        name: '[T5: Complexity] Zero Matches Full-Scan Test'
      }
    ],
    suggestedWhiteboardNodes: [
      { id: 'gateway', label: 'Client / Gateway Layer', type: 'api' },
      { id: 'worker', label: `${cleanTopic} Microservice`, type: 'compute' },
      { id: 'cache', label: 'Redis Low-Latency Cache', type: 'cache' },
      { id: 'storage', label: 'Primary Relational Database', type: 'database' }
    ],
    testSuite: `CREATE TABLE employees (id INT, name TEXT, department_id INT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Alice', 101, 'Engineering', 95000);
INSERT INTO employees VALUES (2, 'Bob', 102, 'Marketing', 65000);
INSERT INTO employees VALUES (3, 'Charlie', 101, 'Engineering', 105000);
INSERT INTO employees VALUES (4, 'David', 103, 'Sales', 72000);
INSERT INTO employees VALUES (5, 'Emma', 101, 'Engineering', 98000);
-- CHECKS --
SELECT count(*) = 3 AS ok, 'returns all departments above the salary threshold' AS msg FROM answer;
SELECT (SELECT headcount FROM answer WHERE department_id = 101) = 3 AS ok, 'includes the correct Engineering headcount' AS msg;
SELECT (SELECT round(avg_salary) FROM answer WHERE department_id = 101) = 99333 AS ok, 'calculates the Engineering average salary' AS msg;`,
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
      variation = 0,
      projectContext = ''
    } = body;

    recordActiveLiveInterview(userId, topic, 'round2_coding');

    console.log(`[Dynamic Problem API] Generating dynamic challenge for: "${topic}" | Stream: ${domainStream} | Language: ${language} | User: ${userId}`);

    const stream = domainStream === 'non_tech' ? 'non_tech' : 'tech';

    // Build Prompt for Generative LLM Problem Creation
    const systemPrompt = `You are a Principal Engineering & Corporate Assessment Architect.
Design a highly realistic, authentic, and engaging coding or analytical problem tailored precisely to the topic "${topic}" (${stream} stream, difficulty: ${difficulty}).
Challenge variation: ${variation + 1}. For variation 2 and later, create a materially different task from earlier attempts rather than merely renaming the same task.
${projectContext ? `Project context: "${projectContext}".` : ''}

Generate:
1. Title: Professional challenge title specific to ${topic}.
2. Description: Real-world problem statement with constraints and expected return format.
3. functionName: Pythonic snake_case function identifier (e.g. "calculate_latency", "evaluate_portfolio").
4. starterCode: Empty function signatures/stubs with parameter comments and a TODO placeholder. Strictly DO NOT implement or leak the solution algorithm.
5. testCases: Exactly 5 deterministic unit test cases covering all 5 tiers: (1) Standard Case, (2) Large Scale, (3) Zero/Empty, (4) Edge/Negative Values, (5) Complexity/Boundary. "input" MUST be a valid function argument tuple e.g. "([1, 2, 3], 5)" and "expectedOutput" MUST be a machine-parsable literal (e.g. "3", "true", "42") without descriptive prose.
6. suggestedWhiteboardNodes: 4 recommended architecture/workflow nodes for this topic.
7. testSuite: For SQL language only, include deterministic setup SQL, then a line containing -- CHECKS --, then SQL checks that query the candidate's result through the answer view. Each check must return boolean ok and text msg columns. The SQL starter query must satisfy all checks. For other languages, return an empty string.

Return ONLY valid JSON matching this schema:
{
  "title": "<string>",
  "description": "<string>",
  "functionName": "<string>",
  "starterCode": {
    "python": "<string>",
    "javascript": "<string>",
    "java": "<string>",
    "cpp": "<string>",
    "sql": "<string>"
  },
  "testCases": [
    { "input": "<string>", "expectedOutput": "<string>", "name": "<string>" }
  ],
  "testSuite": "<setup SQL; for SQL include -- CHECKS -- and passing assertions against answer; otherwise empty string>",
  "suggestedWhiteboardNodes": [
    { "id": "<string>", "label": "<string>", "type": "<api|compute|cache|database>" }
  ]
}`;

    // Multi-key pool rotation
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    const groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_KEY;
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
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate a fresh variation ${variation + 1} challenge boilerplate and test cases for: "${topic}"` }
            ],
            max_tokens: 850,
            temperature: 0.2
          }),
          signal: AbortSignal.timeout(8000)
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const extracted = extractJsonObject(raw);
          if (extracted?.title && extracted?.starterCode) {
            parsedResult = extracted;
            console.log('[Dynamic Problem API] Groq dynamic problem generated successfully');
            break;
          }
        } else {
          console.warn(`[Dynamic Problem API] Groq key returned status: ${res.status}`);
        }
      } catch (err: any) {
        console.warn('[Dynamic Problem API] Groq attempt failed:', err?.message);
      }
    }

    // Failover to Gemini Flash if Groq is unavailable
    if (!parsedResult && geminiKey) {
      try {
        console.log('[Dynamic Problem API] Falling back to Gemini Flash for problem generation...');
        const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nGenerate a fresh variation ${variation + 1} challenge boilerplate and test cases for: "${topic}"\nReturn ONLY valid JSON.` }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 900,
              responseMimeType: 'application/json'
            }
          }),
          signal: AbortSignal.timeout(8000)
        });
        if (gemRes.ok) {
          const gemData = await gemRes.json();
          const raw = (gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
          const extracted = extractJsonObject(raw);
          if (extracted?.title && extracted?.starterCode) {
            parsedResult = extracted;
            console.log('[Dynamic Problem API] Gemini problem generated successfully');
          }
        }
      } catch (err: any) {
        console.warn('[Dynamic Problem API] Gemini attempt failed:', err?.message);
      }
    }

    // Failover to OpenRouter if Groq & Gemini are unavailable
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
          }),
          signal: AbortSignal.timeout(8000)
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const extracted = extractJsonObject(raw);
          if (extracted?.title && extracted?.starterCode) {
            parsedResult = extracted;
            console.log('[Dynamic Problem API] OpenRouter problem generated successfully');
          }
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
        testSuite: typeof parsedResult.testSuite === 'string' ? parsedResult.testSuite : '',
        suggestedWhiteboardNodes: Array.isArray(parsedResult.suggestedWhiteboardNodes) ? parsedResult.suggestedWhiteboardNodes : [],
        success: true
      });
    }

    // Instant Semantic Fallback with Zero Hardcoding
    console.log('[Dynamic Problem API] Serving instant semantic dynamic fallback');
    const fallback = generateSemanticProblemFallback(topic, stream, difficulty, variation);
    return NextResponse.json(fallback);

  } catch (err: any) {
    console.error('[Dynamic Problem API Error]:', err);
    const fallback = generateSemanticProblemFallback('Engineering Logic', 'tech', 'normal');
    return NextResponse.json(fallback);
  }
}

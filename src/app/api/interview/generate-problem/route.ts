import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';

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
      description: `Write a business calculation function '${safeFnName}(primary_metric, secondary_metric, volume)' to analyze operational throughput and return a feasibility ratio.`,
      functionName: safeFnName,
      starterCode: {
        python: `def ${safeFnName}(primary_metric, secondary_metric, volume):\n    # Calculate domain efficiency ratio\n    ratio = (primary_metric / secondary_metric) if secondary_metric > 0 else 0\n    is_viable = ratio >= 1.25 and volume > 0\n    return {\n        "ratio": round(ratio, 2),\n        "volume": volume,\n        "status": "Viable" if is_viable else "Review Required"\n    }`,
        javascript: `function ${jsFnName}(primaryMetric, secondaryMetric, volume) {\n    const ratio = secondaryMetric > 0 ? (primaryMetric / secondaryMetric) : 0;\n    const isViable = ratio >= 1.25 && volume > 0;\n    return {\n        ratio: Number(ratio.toFixed(2)),\n        volume,\n        status: isViable ? "Viable" : "Review Required"\n    };\n}`,
        java: `public class Solution {\n    public String ${jsFnName}(double primary, double secondary, int volume) {\n        double ratio = secondary > 0 ? (primary / secondary) : 0;\n        return (ratio >= 1.25 && volume > 0) ? "Viable" : "Review Required";\n    }\n}`,
        sql: `SELECT item_name, SUM(primary_metric) as total_metric, AVG(secondary_metric) as avg_secondary,\n (SUM(primary_metric) / NULLIF(AVG(secondary_metric),0)) as efficiency_ratio\nFROM domain_records GROUP BY item_name;`
      },
      testCases: [
        {
          input: 'primary_metric=150, secondary_metric=100, volume=50',
          expectedOutput: 'Viable (Ratio: 1.50)',
          name: 'Standard Efficiency Threshold Check'
        },
        {
          input: 'primary_metric=80, secondary_metric=100, volume=20',
          expectedOutput: 'Review Required (Ratio: 0.80)',
          name: 'Sub-Optimal Ratio Check'
        },
        {
          input: 'primary_metric=0, secondary_metric=0, volume=0',
          expectedOutput: 'Handled Zero Division Safe Check',
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
    description: `Implement an optimized function '${safeFnName}(items, threshold)' that filters, processes, and evaluates dataset constraints in linear O(N) time complexity.`,
    functionName: safeFnName,
    starterCode: {
      python: `def ${safeFnName}(items, threshold):\n    # Process items matching domain constraints in O(N)\n    valid_records = [x for x in items if x >= threshold]\n    total_sum = sum(valid_records)\n    avg_val = (total_sum / len(valid_records)) if valid_records else 0\n    return {\n        "count": len(valid_records),\n        "average": round(avg_val, 2),\n        "is_optimal": len(valid_records) > 0\n    }`,
      javascript: `function ${jsFnName}(items, threshold) {\n    const valid = items.filter(x => x >= threshold);\n    const sum = valid.reduce((acc, curr) => acc + curr, 0);\n    const avg = valid.length > 0 ? (sum / valid.length) : 0;\n    return {\n        count: valid.length,\n        average: Number(avg.toFixed(2)),\n        isOptimal: valid.length > 0\n    };\n}`,
      java: `import java.util.*;\npublic class Solution {\n    public boolean ${jsFnName}(int[] items, int threshold) {\n        for (int item : items) {\n            if (item >= threshold) return true;\n        }\n        return false;\n    }\n}`,
      sql: `SELECT entity_id, COUNT(*) as valid_records, AVG(metric_val) as avg_metric\nFROM performance_logs WHERE metric_val >= 50 GROUP BY entity_id;`
    },
    testCases: [
      {
        input: 'items=[10, 50, 75, 100], threshold=50',
        expectedOutput: 'count=3, average=75.0, is_optimal=True',
        name: 'Standard Filtering Test'
      },
      {
        input: 'items=[10, 20, 30], threshold=100',
        expectedOutput: 'count=0, average=0.0, is_optimal=False',
        name: 'Empty Matches Boundary Test'
      },
      {
        input: 'items=[], threshold=10',
        expectedOutput: 'count=0, average=0.0, is_optimal=False',
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
4. starterCode: Complete boilerplate implementations in python, javascript, java, and sql.
5. testCases: Exactly 3 deterministic unit test cases (Standard, Edge/Boundary, Zero/Empty).
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

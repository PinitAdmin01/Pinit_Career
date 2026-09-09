import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';

export interface AssistRequest {
  question: string;
  stage: 'round1_behavioral' | 'round2_coding' | 'round3_systems' | 'round4_star';
  topic: string;
  domainStream?: 'tech' | 'non_tech';
  difficulty?: 'easy' | 'normal' | 'hard';
  scriptLevel?: 'standard' | 'advanced';
  isPractice?: boolean;
}

export interface AssistResponse {
  script: string;
  bulletPoints: string[];
  deliveryGuide: {
    pacing: string;
    tone: string;
    emphasisWords: string[];
    pauseCues: string[];
  };
  starBreakdown?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  success: boolean;
}

// Rich Instant Fallback Scripts per Round & Domain Stream
function getFallbackAssistScript(
  stage: string,
  topic: string,
  stream: string,
  level: string
): AssistResponse {
  const isTech = stream !== 'non_tech';
  const cleanTopic = (topic || 'Software Engineering').toUpperCase();

  if (stage === 'round1_behavioral') {
    if (isTech) {
      return {
        script: `Hi! I am a full-stack software engineer with a strong focus on ${topic}. In my recent projects, I developed distributed web services and scalable APIs, emphasizing clean modular code, performance optimization, and rigorous testing. I'm passionate about solving complex system challenges and delivering reliable user experiences.`,
        bulletPoints: [
          `Mention your core stack & focus in ${topic}`,
          `Highlight a key engineering principle (e.g., modularity, test coverage)`,
          `State your motivation and passion for scalable engineering`
        ],
        deliveryGuide: {
          pacing: 'Steady conversational pace (~125 WPM)',
          tone: 'Warm, authentic, and confident',
          emphasisWords: ['distributed', 'modular', 'scalable', 'reliable'],
          pauseCues: ['Pause briefly after introducing your thesis statement', 'Maintain steady eye contact']
        },
        starBreakdown: {
          situation: `Transitioning into high-growth software engineering specializing in ${topic}`,
          task: 'Build performant, scalable, and resilient digital architectures',
          action: 'Engineered full-stack features with automated tests and CI/CD pipelines',
          result: 'Achieved sub-100ms response times and high modular code reuse'
        },
        success: true
      };
    } else {
      return {
        script: `Hello! I come from a background specializing in ${topic}. My experience centers around analyzing business metrics, optimizing unit economics, and executing structured workflows to drive organizational growth. I focus heavily on data-backed decision-making and cross-functional team collaboration.`,
        bulletPoints: [
          `Introduce your focus area in ${topic}`,
          `Highlight analytical approach & quantitative metrics`,
          `Emphasize collaboration and tangible business impact`
        ],
        deliveryGuide: {
          pacing: 'Clear, articulate pace (~120 WPM)',
          tone: 'Professional, structured, and proactive',
          emphasisWords: ['unit economics', 'metrics', 'optimization', 'growth'],
          pauseCues: ['Pause before citing numerical impact', 'Speak with open inflection']
        },
        starBreakdown: {
          situation: `Specializing in corporate and strategic ${topic}`,
          task: 'Streamline business processes and optimize key performance indicators',
          action: 'Implemented data-driven frameworks and cross-departmental coordination',
          result: 'Delivered measurable efficiency gains and structured reporting'
        },
        success: true
      };
    }
  }

  if (stage === 'round2_coding') {
    return {
      script: `To solve this ${topic} challenge efficiently, I first identified the constraints and expected time/space complexity. Rather than using an unoptimized brute-force method, I utilized a structured single-pass algorithm to bound our time complexity to O(N). Let me walk you through the key logic lines and boundary checks.`,
      bulletPoints: [
        `State the baseline complexity vs optimized complexity`,
        `Walk through boundary condition checks (e.g. empty inputs, zero division)`,
        `Explain the algorithmic choice (e.g. hash map lookup, math formula)`
      ],
      deliveryGuide: {
        pacing: 'Deliberate, methodical pace (~115 WPM)',
        tone: 'Analytical and precise',
        emphasisWords: ['time complexity', 'linear O(N)', 'boundary conditions', 'edge cases'],
        pauseCues: ['Pause when explaining formula/loop transformations', 'Speak clearly through variable names']
      },
      starBreakdown: {
        situation: `Encountered performance or analytical constraint in ${topic}`,
        task: 'Develop an algorithm with minimal time and memory footprint',
        action: 'Refactored iteration logic into a single-pass linear evaluation',
        result: 'Passed all unit test assertions with optimal runtime'
      },
      success: true
    };
  }

  if (stage === 'round3_systems') {
    return {
      script: `On the whiteboard for ${topic}, I designed a decoupled, multi-tier architecture. Read requests hit our edge CDN and Load Balancer, which routes traffic across redundant app microservices. I placed a Redis cache tier in front of our primary database to absorb read spikes, ensuring sub-20ms latency while eliminating single points of failure.`,
      bulletPoints: [
        `Explain tier-by-tier flow (Client ➔ Gateway ➔ Compute ➔ Cache ➔ Database)`,
        `Justify component selection and caching/queue strategy`,
        `Explicitly address failover and high-concurrency resilience`
      ],
      deliveryGuide: {
        pacing: 'Authoritative, structured pace (~130 WPM)',
        tone: 'Architectural authority, clear and composed',
        emphasisWords: ['decoupled', 'sub-20ms latency', 'failover', 'caching tier'],
        pauseCues: ['Pause between layer descriptions to give recruiter time to follow visual canvas']
      },
      starBreakdown: {
        situation: `Need for high availability and low latency under traffic spikes for ${topic}`,
        task: 'Design a resilient distributed topology without single points of failure',
        action: 'Introduced load balancing, asynchronous queues, and read-through caching',
        result: 'Protected core database and achieved 99.99% uptime availability'
      },
      success: true
    };
  }

  // Round 4 STAR Drill Default
  return {
    script: `In a high-stakes challenge regarding ${topic}, our team faced unexpected production latency spikes. My responsibility was to diagnose the root cause and execute an immediate fix without downtime. I analyzed server telemetry, isolated the bottleneck to an unindexed query, and deployed an indexed cache layer. This reduced latency by 45% and restored full system stability.`,
    bulletPoints: [
      `Situation: Concrete production crisis or challenging trade-off in ${topic}`,
      `Task: Your specific role and ownership in resolving it`,
      `Action: The exact technical or business steps you executed`,
      `Result: Quantifiable outcome (e.g. 45% latency drop, zero downtime)`
    ],
    deliveryGuide: {
      pacing: 'Narrative storytelling rhythm (~120 WPM)',
      tone: 'Calm under pressure, solution-driven',
      emphasisWords: ['root cause', 'isolated', 'restored stability', 'quantified impact'],
      pauseCues: ['Pause after describing the crisis to emphasize stakes', 'Deliver results with punchy clarity']
    },
    starBreakdown: {
      situation: `Production latency spike during high-concurrency event in ${topic}`,
      task: 'Isolate root cause and deploy zero-downtime remediation',
      action: 'Profiled telemetry logs, added index, and routed hot data through cache',
      result: 'Reduced P99 latency by 45% and prevented service outage'
    },
    success: true
  };
}

export async function POST(req: Request) {
  console.log('[Interview Assist API] Incoming request received at /api/interview/assist');

  try {
    // 1. Authenticate Request via Bearer Token
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.warn('[Interview Assist API] Auth verification failed');
      return gated.error;
    }
    const userId = gated.user.id;

    const body = (await req.json()) as AssistRequest;
    const {
      question,
      stage = 'round1_behavioral',
      topic = 'Software Engineering',
      domainStream = 'tech',
      difficulty = 'normal',
      scriptLevel = 'standard',
      isPractice = false
    } = body;

    // Reject cheat scripts during live graded interviews
    if (!isPractice) {
      return NextResponse.json(
        { error: 'Assist Mode teleprompter is strictly prohibited during live graded interviews to preserve evaluation integrity.', success: false },
        { status: 403 }
      );
    }

    console.log(`[Interview Assist API] User: ${userId} | Stage: ${stage} | Topic: ${topic} | Level: ${scriptLevel}`);

    const stream = domainStream === 'non_tech' ? 'non_tech' : 'tech';

    // 2. Build Structured LLM Prompt for High-Scoring Verbal Scripts
    const systemPrompt = `You are an elite Executive Interview Coach and Teleprompter Scriptwriter for top tech & corporate candidates.
The candidate is currently in an active AI interview for "${topic}" (${stream} stream, difficulty: ${difficulty}, level: ${scriptLevel}).

The AI Interviewer just asked this question:
"${question || 'Tell me about yourself and your experience.'}"

Generate a world-class, word-for-word spoken response script and vocal delivery guide that the candidate can read naturally into their microphone to score 95%+ on the rubric.

RULES:
1. Write in natural, spoken first-person dialogue ("I", "my approach", "in my project").
2. Format the script to take roughly 30 to 45 seconds to speak aloud (60-90 words).
3. Include specific metrics, keywords, and architectural/business frameworks for ${topic}.
4. Return ONLY valid JSON matching this exact schema:

{
  "script": "<word-for-word spoken answer string>",
  "bulletPoints": ["<point 1>", "<point 2>", "<point 3>"],
  "deliveryGuide": {
    "pacing": "<e.g. Steady conversational (120-130 WPM)>",
    "tone": "<e.g. Confident, enthusiastic, and structured>",
    "emphasisWords": ["<word1>", "<word2>", "<word3>"],
    "pauseCues": ["<pause advice 1>", "<pause advice 2>"]
  },
  "starBreakdown": {
    "situation": "<1 sentence>",
    "task": "<1 sentence>",
    "action": "<1 sentence>",
    "result": "<1 sentence>"
  }
}`;

    // 3. Multi-Key Pool & OpenRouter Failover
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let parsedResult: any = null;

    // Attempt Groq Multi-Key Pool
    for (const key of groqKeys) {
      try {
        console.log(`[Interview Assist API] Attempting Groq inference with key ending in ...${key.slice(-4)}`);
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
              { role: 'user', content: `Generate the interview script for question: "${question}"` }
            ],
            max_tokens: 650,
            temperature: 0.3
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          parsedResult = JSON.parse(cleanJsonStr);
          console.log('[Interview Assist API] Groq script generated successfully');
          break;
        } else {
          console.warn(`[Interview Assist API] Groq key returned status: ${res.status}`);
        }
      } catch (err: any) {
        console.warn('[Interview Assist API] Groq attempt failed:', err?.message);
      }
    }

    // Attempt OpenRouter Failover
    if (!parsedResult && openRouterKey) {
      try {
        console.log('[Interview Assist API] Falling back to OpenRouter...');
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit-careers.web.app',
            'X-Title': 'PinIT Interview Assist'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate the interview script for question: "${question}"` }
            ],
            max_tokens: 650,
            temperature: 0.3
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          parsedResult = JSON.parse(cleanJsonStr);
          console.log('[Interview Assist API] OpenRouter script generated successfully');
        }
      } catch (err: any) {
        console.warn('[Interview Assist API] OpenRouter attempt failed:', err?.message);
      }
    }

    // 4. Return LLM Script or Instant High-Quality Fallback
    if (parsedResult && parsedResult.script) {
      const sanitizedScript = sanitizeLLMOutput(parsedResult.script);
      return NextResponse.json({
        script: sanitizedScript,
        bulletPoints: Array.isArray(parsedResult.bulletPoints) ? parsedResult.bulletPoints : [],
        deliveryGuide: parsedResult.deliveryGuide || {
          pacing: 'Conversational pace (~125 WPM)',
          tone: 'Confident and structured',
          emphasisWords: [],
          pauseCues: []
        },
        starBreakdown: parsedResult.starBreakdown,
        success: true
      });
    }

    console.log('[Interview Assist API] Serving instant rich domain fallback script');
    const fallback = getFallbackAssistScript(stage, topic, stream, scriptLevel);
    return NextResponse.json(fallback);

  } catch (err: any) {
    console.error('[Interview Assist API Error]:', err);
    const fallback = getFallbackAssistScript('round1_behavioral', 'Software Engineering', 'tech', 'standard');
    return NextResponse.json(fallback);
  }
}

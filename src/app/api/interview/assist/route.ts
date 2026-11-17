import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

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

// Extract question intent and key concepts
function extractQuestionIntent(q: string): {
  intent: 'intro' | 'tradeoff' | 'failure' | 'conflict' | 'deadline' | 'scalability' | 'metrics' | 'general';
  keyConcept: string;
} {
  const clean = q
    .replace(/\s*—\s*(?:Ms\.|Mr\.)?\s*[\w\s]+$/i, '')
    .replace(/^(?:Ms\.|Mr\.)?\s*[\w\s]+:\s*/i, '')
    .replace(/^(?:welcome|hello|hi|good morning|good afternoon)[^.?!]*[.?!]\s*/i, '')
    .trim();

  const lower = clean.toLowerCase();

  // 1. Trade-off / Retrospective
  if (/\b(trade-?off\w*|differently|alternative\w*|compromise\w*|sacrifice\w*|retrospective\w*|approach differently|looking back|revisit\w*)\b/i.test(lower)) {
    return { intent: 'tradeoff', keyConcept: 'trade-offs and architectural retrospectives' };
  }

  // 2. Failure / Incident / Regressions
  if (/\b(fail\w*|mistake\w*|error\w*|bug\w*|incident\w*|outage\w*|crash\w*|crisis|down|broken|regress\w*)\b/i.test(lower)) {
    return { intent: 'failure', keyConcept: 'incident resolution and root cause analysis' };
  }

  // 3. Conflict / Disagreement
  if (/\b(conflict\w*|disagree\w*|pushback|differing|friction|cross-functional|stakeholder\w*|clash\w*|alignment)\b/i.test(lower)) {
    return { intent: 'conflict', keyConcept: 'constructive alignment and consensus building' };
  }

  // 4. Deadline / Pressure / Prioritization
  if (/\b(deadline\w*|pressure\w*|tight|fast|speed|urgent|urgency|timeline\w*|time constraint|balance speed)\b/i.test(lower)) {
    return { intent: 'deadline', keyConcept: 'rigorous prioritization and delivery under deadlines' };
  }

  // 5. Scalability / Performance / Architecture
  if (/\b(scale|scalable|scalability|scaling|architecture|architect\w*|bottleneck\w*|concurrency|throughput|latency|caching|redis|database|queries|capacity)\b/i.test(lower)) {
    return { intent: 'scalability', keyConcept: 'high-concurrency scalability and performance tuning' };
  }

  // 6. Metrics / Verification / Measurement
  if (/\b(measure\w*|signal\w*|feedback|confirm\w*|metric\w*|kpi\w*|indicator\w*|quantif\w*|prove|validate|validation|success)\b/i.test(lower)) {
    return { intent: 'metrics', keyConcept: 'measurable outcomes and telemetry signals' };
  }

  // 7. Self-introduction
  if (/\b(yourself|background|intro|introduce|walk me through|who you are|experience with)\b/i.test(lower) || lower.length < 25) {
    return { intent: 'intro', keyConcept: 'background introduction' };
  }

  // Extract substantive noun phrase for general questions
  const words = clean.split(/\s+/).filter(w => !/^(i|we|my|the|a|an|in|on|at|to|for|of|with|and|or|so|but|that|this|it|is|was|are|were|been|have|has|had|do|did|would|could|should|can|will|what|when|where|which|who|whom|how|why)$/i.test(w));
  const snippet = words.slice(0, 3).join(' ') || 'core concepts';

  return { intent: 'general', keyConcept: snippet };
}

// Rich Instant Question-Aware Fallback Scripts per Round & Domain Stream
export function getFallbackAssistScript(
  stage: string,
  topic: string,
  stream: string,
  level: string = 'standard',
  question: string = ''
): AssistResponse {
  const isTech = stream !== 'non_tech';
  const cleanTopic = (topic || 'Software Engineering').trim();
  const isAdvanced = level === 'advanced';
  const { intent, keyConcept } = extractQuestionIntent(question);

  if (stage === 'round1_behavioral') {
    if (isTech) {
      if (intent === 'tradeoff') {
        return {
          script: isAdvanced
            ? `When balancing trade-offs in ${cleanTopic}, our initial constraint was shipping an MVP rapidly under tight timelines. We chose a unified monolith with synchronous database transactions to iterate fast. In retrospect, the trade-off I would approach differently today is decoupling our event pipeline earlier and introducing asynchronous message queues with idempotent workers. That would have prevented database locking bottlenecks as our concurrency expanded 5x.`
            : `In that scenario for ${cleanTopic}, our primary trade-off was prioritizing delivery speed and simplicity over distributed complexity. We initially built a consolidated service to validate product-market fit quickly. Looking back, the key trade-off I would approach differently is decoupling the data layer earlier and introducing an asynchronous queue for heavy mutations. That would have prevented database connection bottlenecks as user concurrency surged.`,
          bulletPoints: [
            `Acknowledge initial architectural trade-off (shipping velocity vs long-term scalability)`,
            `Pinpoint the exact technical evolution you would implement today (e.g. event queues, caching)`,
            `Cite the concrete metric benefit (e.g. eliminating database locks, predictable latency)`
          ],
          deliveryGuide: {
            pacing: 'Thoughtful, analytical pace (~125 WPM)',
            tone: 'Self-aware, mature, and engineering-grounded',
            emphasisWords: ['trade-off', 'monolith', 'asynchronous queue', 'idempotent', 'bottlenecks'],
            pauseCues: ['Pause briefly after stating the original design trade-off', 'Deliver lessons learned with conviction']
          },
          starBreakdown: {
            situation: `Balancing rapid iteration speed against high-concurrency scaling for ${cleanTopic}`,
            task: 'Deliver reliable functionality on time while guarding system stability',
            action: 'Implemented modular components, but later decoupled hot paths with asynchronous queues',
            result: 'Eliminated database saturation and maintained sub-50ms response times under 5x traffic'
          },
          success: true
        };
      }

      if (intent === 'failure') {
        return {
          script: isAdvanced
            ? `During a production release in ${cleanTopic}, an unindexed query combined with traffic spikes caused database connection exhaustion. I immediately took command of the incident, instituted circuit breaking to protect core services, and rolled back the change within 4 minutes. In the blameless post-mortem, I instituted query latency guards in our CI/CD pipeline and automated chaos drills, ensuring zero recurrences.`
            : `During a critical deployment in ${cleanTopic}, we encountered an unexpected regression under peak production load. I took immediate ownership of the incident, coordinated with our team, and rolled back the change within 4 minutes. After stabilizing the service, I led a blameless post-mortem, identified the missing test coverage in our concurrent pipeline, and implemented automated regression guards so the issue could never recur.`,
          bulletPoints: [
            `Take direct, unreserved ownership of the incident without deflection`,
            `Detail immediate containment actions (circuit breaking, rollback within 4 minutes)`,
            `Demonstrate permanent architectural guards built into the engineering process`
          ],
          deliveryGuide: {
            pacing: 'Crisp, composed pace (~125 WPM)',
            tone: 'Accountable, crisis-tested, and process-driven',
            emphasisWords: ['ownership', 'circuit breaking', 'post-mortem', 'regression guards'],
            pauseCues: ['Pause after describing the incident to convey steady composure']
          },
          starBreakdown: {
            situation: `Production regression during high-load deployment in ${cleanTopic}`,
            task: 'Contain service degradation and restore SLA compliance immediately',
            action: 'Executed automated rollback in 4 minutes and introduced CI query latency gating',
            result: 'Restored 100% uptime with zero customer data loss and eliminated the failure class'
          },
          success: true
        };
      }

      if (intent === 'conflict') {
        return {
          script: `When architecting a core component in ${cleanTopic}, a senior engineer and I had differing perspectives on whether to adopt a synchronous REST model or an event-driven pub/sub queue. Instead of debating theoretically, I proposed a 1-day benchmark spikes to measure latency, throughput, and error propagation under simulated load. The telemetry proved the event-driven model provided far superior fault isolation. We aligned on the data, and shipped the milestone ahead of schedule.`,
          bulletPoints: [
            `Frame conflict around objective technical criteria rather than personal opinions`,
            `Use evidence-driven prototypes and telemetry to resolve architectural ambiguity`,
            `Highlight shared team alignment and mutual respect`
          ],
          deliveryGuide: {
            pacing: 'Collaborative, measured pace (~120 WPM)',
            tone: 'Empathetic, data-backed, and solutions-oriented',
            emphasisWords: ['benchmark', 'telemetry', 'fault isolation', 'aligned on data'],
            pauseCues: ['Emphasize the data-driven consensus to showcase team maturity']
          },
          starBreakdown: {
            situation: `Architectural disagreement regarding synchronous vs event-driven design in ${cleanTopic}`,
            task: 'Reach unanimous technical consensus without delaying milestone delivery',
            action: 'Built comparative latency/throughput benchmarks to evaluate real-world trade-offs',
            result: 'Aligned the team around telemetry findings and delivered the feature ahead of schedule'
          },
          success: true
        };
      }

      if (intent === 'deadline') {
        return {
          script: `Under strict delivery pressure for our ${cleanTopic} release, I utilized a MoSCoW prioritization model to isolate critical-path features from non-essential enhancements. I aligned with our product stakeholders on MVP boundaries, automated our core acceptance tests, and maintained continuous deployment. As a result, we hit our launch deadline with zero critical defects and full test coverage on all primary workflows.`,
          bulletPoints: [
            `Demonstrate structured prioritization (MoSCoW framework) under pressure`,
            `Show active communication with product leads to prevent scope creep`,
            `Maintain non-negotiable engineering verification standards`
          ],
          deliveryGuide: {
            pacing: 'Decisive, structured pace (~125 WPM)',
            tone: 'Disciplined, pragmatic, and high-ownership',
            emphasisWords: ['prioritization', 'critical-path', 'MVP boundaries', 'zero defects'],
            pauseCues: ['Speak with clarity and steady executive pacing']
          },
          starBreakdown: {
            situation: `High-stakes delivery deadline with expanding feature requirements in ${cleanTopic}`,
            task: 'Ship production-ready code on schedule without compromising system reliability',
            action: 'Negotiated scope boundaries, focused on critical path, and automated test gates',
            result: 'Delivered the milestone on time with zero high-severity production regressions'
          },
          success: true
        };
      }

      if (intent === 'scalability') {
        return {
          script: `When scaling our ${cleanTopic} services, telemetry indicated that database read saturation was our primary latency bottleneck. I architected a multi-tier caching strategy using Redis with write-around semantics, alongside connection pooling and index optimization. This offloaded 80% of repeat queries from our primary datastore, dropping our p99 response time from 380ms down to 42ms while comfortably absorbing 4x traffic surges.`,
          bulletPoints: [
            `Cite specific bottleneck diagnosed through profiling telemetry`,
            `Detail architectural mitigation (Redis cache-aside, connection pooling, indexation)`,
            `Quote clear quantitative metrics (p99 latency drop from 380ms to 42ms)`
          ],
          deliveryGuide: {
            pacing: 'Authoritative, technical pace (~125 WPM)',
            tone: 'Analytical, performance-driven, and confident',
            emphasisWords: ['telemetry', 'write-around', 'connection pooling', 'sub-50ms'],
            pauseCues: ['Pause before citing numerical impact to emphasize performance gains']
          },
          starBreakdown: {
            situation: `High database load causing latency degradation under concurrency in ${cleanTopic}`,
            task: 'Decouple read throughput from persistent storage without data inconsistency',
            action: 'Implemented Redis caching tier, query optimizations, and connection pooling',
            result: 'Reduced p99 latency by 88% and sustained 4x traffic surges without error spikes'
          },
          success: true
        };
      }

      if (intent === 'metrics') {
        return {
          script: `To validate the impact of our work in ${cleanTopic}, we tracked both system telemetry and business KPIs. Technically, we monitored p95 latency, error rate percentiles, and CPU saturation via Prometheus and Grafana. From a user standpoint, we measured funnel completion and ticket escalation rates. Our architectural improvements reduced response times by 45%, which correlated directly with an 18% improvement in end-user workflow completion.`,
          bulletPoints: [
            `Pair technical telemetry (p95 latency, error rates) with business outcomes`,
            `Explain the monitoring tooling and feedback loops established`,
            `Quote measurable correlation between engineering performance and user satisfaction`
          ],
          deliveryGuide: {
            pacing: 'Metric-oriented, articulate pace (~120 WPM)',
            tone: 'Executive, quantitative, and outcome-focused',
            emphasisWords: ['telemetry', 'percentiles', 'KPIs', 'quantitative impact'],
            pauseCues: ['Deliver numbers clearly and deliberately']
          },
          starBreakdown: {
            situation: `Evaluating engineering ROI and user impact for ${cleanTopic}`,
            task: 'Establish definitive telemetry signals to measure system health and user satisfaction',
            action: 'Configured Prometheus dashboards, alerting thresholds, and business funnel tracking',
            result: 'Demonstrated 45% latency drop and 18% improvement in user workflow efficiency'
          },
          success: true
        };
      }

      // Default Intro
      return {
        script: isAdvanced
          ? `Hi! I am a full-stack software engineer specializing in ${cleanTopic}. Across my recent engineering work, I architected distributed microservices and scalable APIs, emphasizing clean modularity, fault-tolerant patterns, and rigorous automated testing. I focus on bridging business requirements with resilient technical systems that reliably scale.`
          : `Hi! I am a full-stack software engineer with a strong focus on ${cleanTopic}. In my recent projects, I developed distributed web services and scalable APIs, emphasizing clean modular code, performance optimization, and rigorous testing. I'm passionate about solving complex system challenges and delivering reliable user experiences.`,
        bulletPoints: [
          `Highlight your core technical stack and architectural focus in ${cleanTopic}`,
          `Mention your philosophy on clean modular code, testing, and system reliability`,
          `Express passion for solving high-impact distributed challenges`
        ],
        deliveryGuide: {
          pacing: 'Steady conversational pace (~125 WPM)',
          tone: 'Warm, authentic, and confident',
          emphasisWords: ['distributed', 'modular', 'scalable', 'reliable'],
          pauseCues: ['Pause briefly after your thesis statement', 'Maintain steady eye contact']
        },
        starBreakdown: {
          situation: `Software engineering specialization in ${cleanTopic}`,
          task: 'Build performant, scalable, and resilient digital architectures',
          action: 'Engineered full-stack features with automated tests and CI/CD pipelines',
          result: 'Achieved sub-100ms response times and high modular code reuse'
        },
        success: true
      };
    } else {
      // Non-Tech / Commerce Domain Fallbacks
      if (intent === 'tradeoff') {
        return {
          script: `In that scenario for ${cleanTopic}, our primary trade-off was balancing aggressive market expansion against strict credit risk guidelines. While accelerating loan originations boosted top-line volume, it raised default risks. Today, I would integrate automated risk scoring covenants earlier to ensure unit economics remain healthy without sacrificing underwriting speed.`,
          bulletPoints: [
            `Frame trade-off between growth velocity and risk management in ${cleanTopic}`,
            `Identify the process improvement you would execute today (automated controls, gating)`,
            `Quantify the impact on unit economics and operational resilience`
          ],
          deliveryGuide: {
            pacing: 'Strategic, articulate pace (~120 WPM)',
            tone: 'Pragmatic, risk-aware, and executive',
            emphasisWords: ['unit economics', 'risk covenants', 'underwriting', 'resilience'],
            pauseCues: ['Pause after explaining the risk/growth balance']
          },
          starBreakdown: {
            situation: `Managing growth vs credit risk trade-offs in ${cleanTopic}`,
            task: 'Accelerate deal flow while maintaining strict capital preservation standards',
            action: 'Implemented automated covenant monitoring and dynamic risk tiers',
            result: 'Sustained 25% portfolio growth while reducing default exposure by 30%'
          },
          success: true
        };
      }

      return {
        script: `Hello! I specialize in corporate and strategic ${cleanTopic}. My experience centers around analyzing business metrics, optimizing unit economics, and executing structured workflows to drive organizational growth. I focus heavily on data-backed decision-making, financial compliance, and cross-functional team collaboration.`,
        bulletPoints: [
          `Introduce your focus area in ${cleanTopic}`,
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
          situation: `Specializing in corporate and strategic ${cleanTopic}`,
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
      script: `Start by restating the inputs, expected output, and constraints in your own words. Work through one small example by hand, then identify the simplest correct approach before thinking about optimization. Pay special attention to empty inputs, boundary values, and duplicate data. As you implement, keep each step easy to verify and use the tests to check your assumptions.`,
      bulletPoints: [
        `Clarify inputs, output, constraints, and one worked example`,
        `Choose a data structure that fits the operations the task needs`,
        `Check empty, boundary, duplicate, and ordinary cases before optimizing`
      ],
      deliveryGuide: {
        pacing: 'Work steadily; pause to test each assumption',
        tone: 'Curious and methodical',
        emphasisWords: ['constraints', 'worked example', 'edge cases', 'trade-offs'],
        pauseCues: ['Explain your reasoning before optimizing', 'Describe what each test is checking']
      },
      success: true
    };
  }

  if (stage === 'round3_systems') {
    return {
      script: `On the whiteboard for ${cleanTopic}, I designed a decoupled, multi-tier architecture. Read requests hit our edge CDN and Load Balancer, which routes traffic across redundant app microservices. I placed a Redis cache tier in front of our primary database to absorb read spikes, ensuring sub-20ms latency while eliminating single points of failure.`,
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
        situation: `Need for high availability and low latency under traffic spikes for ${cleanTopic}`,
        task: 'Design a resilient distributed topology without single points of failure',
        action: 'Introduced load balancing, asynchronous queues, and read-through caching',
        result: 'Protected core database and achieved 99.99% uptime availability'
      },
      success: true
    };
  }

  // Round 4 STAR Drill Default
  return {
    script: `In a high-stakes challenge regarding ${cleanTopic}, our team faced unexpected production latency spikes. My responsibility was to diagnose the root cause and execute an immediate fix without downtime. I analyzed server telemetry, isolated the bottleneck to an unindexed query, and deployed an indexed cache layer. This reduced latency by 45% and restored full system stability.`,
    bulletPoints: [
      `Situation: Concrete production crisis or challenging trade-off in ${cleanTopic}`,
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
      situation: `Production latency spike during high-concurrency event in ${cleanTopic}`,
      task: 'Isolate root cause and deploy zero-downtime remediation',
      action: 'Profiled telemetry logs, added index, and routed hot data through cache',
      result: 'Reduced P99 latency by 45% and prevented service outage'
    },
    success: true
  };
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`interview_assist_${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

  try {
    // 1. Authenticate Request via Bearer Token (Graceful fallback for guest/practice users)
    const gated = await requireUserFromRequest(req);
    const userId = gated.user?.id || `guest_${ip.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const isGuest = !gated.user;
    if (isGuest) {
      console.log(`[Interview Assist API] Guest/Practice session active from ${ip}`);
    }
    const body = (await req.json().catch(() => ({}))) as AssistRequest;
    const {
      question = '',
      stage = 'round1_behavioral',
      topic = 'Software Engineering',
      domainStream = 'tech',
      difficulty = 'normal',
      scriptLevel = 'standard',
    } = body;

    // Clean question to remove interviewer suffixes or speaker artifacts
    const cleanQuestion = String(question || '')
      .replace(/\s*—\s*(?:Ms\.|Mr\.)?\s*[\w\s]+$/i, '')
      .replace(/^(?:Ms\.|Mr\.)?\s*[\w\s]+:\s*/i, '')
      .trim();

    console.log(`[Interview Assist API] User: ${userId} | Stage: ${stage} | Topic: ${topic} | Question: "${cleanQuestion.slice(0, 60)}..."`);

    const stream = domainStream === 'non_tech' ? 'non_tech' : 'tech';

    // 2. Build Structured LLM Prompt for High-Scoring Verbal Scripts
    const isCodingCoach = stage === 'round2_coding';
    const systemPrompt = `You are an elite ${isCodingCoach ? 'coding coach' : 'Executive Interview Coach and Teleprompter Scriptwriter'} for top tech & corporate candidates.
The candidate is currently in an active AI interview for "${topic}" (${stream} stream, difficulty: ${difficulty}, level: ${scriptLevel}).

The AI Interviewer just asked this question:
"${cleanQuestion || 'Tell me about yourself and your experience.'}"

${isCodingCoach
    ? 'Generate concise problem-solving guidance for the side panel: what to clarify, a high-level approach to consider, useful data-structure considerations, edge cases, and how to explain trade-offs. Do not write a candidate answer.'
    : 'Generate a natural, word-for-word spoken response script and vocal delivery guide that the candidate can speak aloud directly to answer this specific question.'}

RULES:
1. ${isCodingCoach ? 'Never provide actual code, pseudocode, a complete algorithm, or a line-by-line solution. Coach the reasoning process only.' : 'Directly answer the question asked in natural, spoken first-person dialogue ("In that situation, my approach was...", "A key trade-off I faced was..."). Do NOT default to a generic bio/introduction unless the interviewer asked for one.'}
2. ${isCodingCoach ? 'Keep the coaching note concise and focused on this challenge.' : 'Format the script to take roughly 30 to 45 seconds to speak aloud (60-90 words).'}
3. Ground the script in realistic engineering/domain practices for ${topic} without claiming specific unverified credentials.
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

    // 3. Multi-Key Pool & Provider Failover
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let parsedResult: any = null;

    // A. Attempt Groq Multi-Key Pool with ultra-fast 8B model (20k TPM limit, <200ms latency)
    for (const key of groqKeys) {
      try {
        console.log(`[Interview Assist API] Attempting Groq 8B inference with key ending in ...${key.slice(-4)}`);
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate the interview response script for question: "${cleanQuestion}"` }
            ],
            max_tokens: 500,
            temperature: 0.3
          }),
          signal: AbortSignal.timeout(4000)
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          parsedResult = JSON.parse(cleanJsonStr);
          console.log('[Interview Assist API] Groq 8B script generated successfully');
          break;
        } else {
          console.warn(`[Interview Assist API] Groq 8B key returned status: ${res.status}`);
        }
      } catch (err: any) {
        console.warn('[Interview Assist API] Groq 8B attempt failed:', err?.message);
      }
    }

    // B. Attempt Groq 70B if 8B failed
    if (!parsedResult && groqKeys.length > 0) {
      for (const key of groqKeys) {
        try {
          console.log(`[Interview Assist API] Attempting Groq 70B fallback...`);
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
                { role: 'user', content: `Generate the interview response script for question: "${cleanQuestion}"` }
              ],
              max_tokens: 500,
              temperature: 0.3
            }),
            signal: AbortSignal.timeout(4500)
          });

          if (res.ok) {
            const data = await res.json();
            const raw = (data.choices?.[0]?.message?.content || '').trim();
            const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
            parsedResult = JSON.parse(cleanJsonStr);
            console.log('[Interview Assist API] Groq 70B script generated successfully');
            break;
          }
        } catch (err: any) {
          console.warn('[Interview Assist API] Groq 70B attempt failed:', err?.message);
        }
      }
    }

    // C. Attempt Gemini Flash Failover
    if (!parsedResult && geminiKey) {
      try {
        console.log('[Interview Assist API] Falling back to Gemini Flash...');
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nCandidate Question: "${cleanQuestion}"\nReturn ONLY the JSON object.` }]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 600,
              responseMimeType: 'application/json'
            }
          }),
          signal: AbortSignal.timeout(4500)
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const raw = (geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          parsedResult = JSON.parse(cleanJsonStr);
          console.log('[Interview Assist API] Gemini Flash script generated successfully');
        }
      } catch (geminiErr: any) {
        console.warn('[Interview Assist API] Gemini attempt failed:', geminiErr?.message);
      }
    }

    // D. Attempt OpenRouter Failover
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
              { role: 'user', content: `Generate the interview response script for question: "${cleanQuestion}"` }
            ],
            max_tokens: 500,
            temperature: 0.3
          }),
          signal: AbortSignal.timeout(4500)
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

    // 4. Return LLM Script or Instant Question-Aware Fallback
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

    console.log('[Interview Assist API] Serving instant question-aware fallback script');
    const fallback = getFallbackAssistScript(stage, topic, stream, scriptLevel, cleanQuestion);
    return NextResponse.json(fallback);

  } catch (err: any) {
    console.error('[Interview Assist API Error]:', err);
    const fallback = getFallbackAssistScript('round1_behavioral', 'Software Engineering', 'tech', 'standard', '');
    return NextResponse.json(fallback);
  }
}

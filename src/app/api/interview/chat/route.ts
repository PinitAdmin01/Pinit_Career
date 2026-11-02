import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { recordActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import {
  appendLiveTurns,
  clampTurn,
  codeSubmissionTurn,
  loadActiveLiveSession,
  stageMarker,
  transcriptForModel,
  type LiveSession,
} from '@/lib/interview/liveSession';

// Comprehensive Interviewer Persona Roster matching all frontend 3D VRoid Avatars
const INTERVIEWERS_MAP: Record<string, { name: string; role: string; nature: string }> = {
  priya: {
    name: 'Ms. Priya',
    role: 'HR & Talent Acquisition Director',
    nature: 'You are an insightful, warm, but incisive HR Director. You focus on leadership, cultural adaptability, situational conflict resolution, and the STAR framework (Situation, Task, Action, Result).'
  },
  rohan: {
    name: 'Mr. Rohan',
    role: 'Lead Software Architect & Tech Lead',
    nature: 'You are a pragmatic, seasoned software architect. You probe deep into clean code, algorithmic efficiency, time/space complexity, error handling, and modular component design.'
  },
  vikram: {
    name: 'Mr. Vikram',
    role: 'Principal Systems Specialist & Recruiter',
    nature: 'You have a professional, direct, and impatient recruiting style. You demand numeric metrics, architectural resilience, and often ask candidates to justify distributed trade-offs under high time pressure.'
  },
  aisha: {
    name: 'Ms. Aisha',
    role: 'Executive STAR Evaluator & Strategy Lead',
    nature: 'You are a sharp, analytical executive interviewer. You drill into high-stakes business decisions, trade-offs under uncertainty, and quantitative project outcomes.'
  },
  shalini: {
    name: 'Ms. Shalini',
    role: 'The Meticulous Assessor',
    nature: 'You are stoic, silent, and meticulous. You keep your tone formal and give zero verbal verification. You test candidate composure and confidence under quiet observation.'
  },
  aditya: {
    name: 'Mr. Aditya',
    role: 'The Strategy & Domain Lead',
    nature: 'You are a brilliant domain strategist. You focus microscopic attention on domain metrics, unit economics, and operational frameworks, asking candidates to justify every decision.'
  },
  neha: {
    name: 'Ms. Neha',
    role: 'The High-Stress Scenario Driller',
    nature: 'You prepare candidates for high-stress production outages and crisis management: "What if production crashes right now? Walk me through your triage step-by-step."'
  },
  kashyap: {
    name: 'Kashyap Sir',
    role: 'Principal Computer Science Mentor',
    nature: 'You value rigorous mathematical logic, algorithmic correctness, and fundamental first-principles reasoning.'
  },
  karthic: {
    name: 'Karthic Sir',
    role: 'Competitive Systems & Performance Specialist',
    nature: 'You focus on speed, execution precision, high-concurrency optimizations, and benchmark verification.'
  },
  maya: {
    name: 'Ms. Maya',
    role: 'UI/UX & Product Experience Architect',
    nature: 'You focus on user-centric design, state management responsiveness, accessibility standards, and frontend performance.'
  },
  divya: {
    name: 'Ms. Divya',
    role: 'Cloud Infrastructure & SRE Specialist',
    nature: 'You focus on zero-downtime deployments, Kubernetes orchestration, telemetry metrics, and fault-tolerant cloud architecture.'
  },
  rajesh: {
    name: 'Mr. Rajesh',
    role: 'Operations & Supply Chain Director',
    nature: 'You focus on inventory models, unit economics, logistics bottlenecks, and ERP/data modeling.'
  },
  sneha: {
    name: 'Ms. Sneha',
    role: 'People Operations & Talent Lead',
    nature: 'You focus on talent retention, employee lifecycle metrics, recruitment funnels, and organizational health.'
  },
  abhijit: {
    name: 'Mr. Abhijit',
    role: 'Quantitative Finance & Economics Specialist',
    nature: 'You focus on EBITDA calculations, balance sheet solvency, financial ratios, and DCF valuation models.'
  }
};


interface FallbackContext {
  stage: string;
  subTopic: string;
  history: Array<{ role: string; content: string }>;
  difficulty: string;
  interviewerName: string;
}

function extractCandidateKeyContext(text: string): { phrase: string; keyTerm: string; type: 'tech' | 'action' | 'metric' | 'general' } {
  const clean = text.replace(/```[\s\S]*?```/g, '').replace(/[^\w\s.,%'-]/g, ' ').trim();
  if (!clean || clean.length < 5) return { phrase: 'your initial approach', keyTerm: 'approach', type: 'general' };

  // Check for metrics or scale: e.g. "40%", "10x", "500ms", "3 team members", "millions of users"
  const metricMatch = clean.match(/(\d+%\s*(?:latency\s*(?:drop|reduction|increase)?|improvement|reduction|increase|drop)|10x|5x|\d+\s*(?:ms|seconds|minutes|hours|users|req\/s|rps|nodes|servers|instances))/i);
  if (metricMatch) {
    return { phrase: `achieving ${metricMatch[1]}`, keyTerm: metricMatch[1], type: 'metric' };
  }

  // Common high-value technical keywords & domains
  const techKeywords = [
    'redis', 'kafka', 'postgresql', 'postgres', 'mongodb', 'mysql', 'docker', 'kubernetes',
    'k8s', 'microservices', 'monolith', 'graphql', 'rest api', 'websocket', 'websockets',
    'caching', 'indexes', 'indexing', 'sharding', 'replication', 'concurrency', 'race condition',
    'deadlock', 'mutex', 'thread pool', 'event loop', 'async/await', 'load balancer', 'nginx',
    'react', 'next.js', 'nextjs', 'typescript', 'python', 'golang', 'java', 'spring boot',
    'ci/cd', 'github actions', 'aws', 's3', 'lambda', 'ec2', 'cloud', 'security', 'oauth', 'jwt',
    'rate limit', 'circuit breaker', 'idempotency', 'acid', 'eventual consistency', 'cap theorem',
    'bloom filter', 'trie', 'binary search', 'dynamic programming', 'graph', 'tree', 'queue',
    'cash flow', 'ebitda', 'unit economics', 'cac', 'ltv', 'margin', 'inventory', 'supply chain',
    'turnover', 'compliance', 'audit', 'taxation', 'statutory', 'reconciliation', 'ledger'
  ];

  const lower = clean.toLowerCase();
  for (const tk of techKeywords) {
    if (lower.includes(tk)) {
      return { phrase: `leveraging ${tk}`, keyTerm: tk, type: 'tech' };
    }
  }

  // Extract substantive action/problem clauses
  const actionMatch = clean.match(/(?:migrat|refactor|optimiz|debugg|deploy|resolv|implement|architect|scal|build|handl|manag|tackl)\w*\s+(?:the\s+)?[\w\s]{4,30}/i);
  if (actionMatch) {
    const rawPhrase = actionMatch[0].trim().replace(/\s+/g, ' ');
    const parts = rawPhrase.split(/\s+/);
    return { phrase: rawPhrase, keyTerm: parts.slice(-2).join(' '), type: 'action' };
  }

  // Meaningful non-filler words
  const words = clean.split(/\s+/).filter(w => !/^(i|we|my|the|a|an|in|on|at|to|for|of|with|and|or|so|but|that|this|it|is|was|are|were|been|have|has|had|do|did|would|could|should|can|will|just|really|basically|like|you|know)$/i.test(w));
  if (words.length >= 2) {
    const snippet = words.slice(0, 4).join(' ');
    return { phrase: `focusing on ${snippet}`, keyTerm: snippet, type: 'general' };
  }

  return { phrase: clean.slice(0, 30), keyTerm: clean.slice(0, 20), type: 'general' };
}

export function generateProgressiveFallbackQuestion(ctx: FallbackContext): string {
  const { stage, subTopic, history, difficulty, interviewerName } = ctx;

  const userTurns = (history || []).filter(m => m.role === 'user');
  const lastUserTurn = userTurns[userTurns.length - 1]?.content || '';
  const turnCount = userTurns.length;

  // First turn: warm welcome & initial background question
  if (turnCount <= 1 && (!lastUserTurn || lastUserTurn.length < 15)) {
    return `Welcome to your interview. I am ${interviewerName}. To get started, could you walk me through your background and your hands-on experience with ${subTopic}?`;
  }

  const { phrase, keyTerm } = extractCandidateKeyContext(lastUserTurn);

  // Active listening reflection openers
  const reflectionOpeners = [
    `I see your point regarding ${phrase}.`,
    `You made an insightful observation around ${phrase}.`,
    `Focusing on ${phrase} is a very pragmatic decision for ${subTopic}.`,
    `I appreciate how you tackled ${phrase}.`,
    `That is a solid direction regarding ${phrase}.`
  ];
  const opener = reflectionOpeners[turnCount % reflectionOpeners.length];

  // Stage-specific contextual follow-up questions
  if (stage === 'round1_behavioral') {
    const behavioralFollowUps = [
      `When navigating that, what was the most significant roadblock or cross-functional disagreement you encountered, and how did you resolve it?`,
      `Looking back at that scenario, what is one key technical or process trade-off you would approach differently today?`,
      `Under tight deadline pressure, how did you balance technical excellence against shipping speed while driving that forward?`,
      `What measurable signal or feedback confirmed to you and your team that this decision was a success?`
    ];
    const question = behavioralFollowUps[turnCount % behavioralFollowUps.length];
    return `${opener} ${question} — ${interviewerName}`;
  }

  if (stage === 'round2_coding') {
    const codingFollowUps = [
      `Given that approach with ${keyTerm}, what is the exact time and space complexity, and where could memory usage spike under large inputs?`,
      `How does your implementation handle critical boundary conditions, such as null/empty inputs, duplicate records, or extreme numerical ranges?`,
      `If multiple concurrent threads or API requests hit this logic simultaneously, what race condition or state corruption risks arise, and how would you safeguard against them?`,
      `How would you structure unit tests to thoroughly verify the correctness and failure modes of that logic before shipping to production?`
    ];
    const question = codingFollowUps[turnCount % codingFollowUps.length];
    return `${opener} ${question} — ${interviewerName}`;
  }

  if (stage === 'round3_systems') {
    const systemsFollowUps = [
      `Looking at the role of ${keyTerm} in your architecture, how does the system behave if that specific component experiences a sudden crash or network partition during peak load?`,
      `Where do you foresee the primary throughput or IO bottleneck in that data path, and how would caching or asynchronous queuing alleviate it?`,
      `How do you enforce idempotency and maintain data consistency across distributed boundaries if an operation fails midway?`,
      `What telemetry metrics, error budgets, and health check signals would you establish to monitor that tier in real time?`
    ];
    const question = systemsFollowUps[turnCount % systemsFollowUps.length];
    return `${opener} ${question} — ${interviewerName}`;
  }

  if (stage === 'round4_star') {
    const starFollowUps = [
      `How does your choice around ${keyTerm} directly drive the overall system SLAs and measurable business impact?`,
      `What empirical metrics or benchmarks did you monitor to demonstrate that your solution achieved its intended goal?`,
      `If a principal architect or executive challenged that architectural trade-off, what quantitative data and counter-arguments would you present?`,
      `Which part of your implementation or system design would you revisit first if traffic grew by a factor of 10x?`
    ];
    const question = starFollowUps[turnCount % starFollowUps.length];
    return `${opener} ${question} — ${interviewerName}`;
  }

  return `${opener} Could you elaborate on the key trade-offs and decisions you made for ${subTopic}? — ${interviewerName}`;
}

export async function POST(req: Request) {
  console.log('[Interview Chat API] Incoming request received at /api/interview/chat');
  
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`llm_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    // 1. Authenticate Request via Bearer Token
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.warn('[Interview Chat API] Auth rejection: Missing or invalid Bearer token');
      return gated.error;
    }

    const body = await req.json();
    const {
      message,
      interviewerId,
      stage,
      reviewDecision = false,
      history = [],
      telemetry,
      difficulty,
      customTopic,
      domainStream,
      domainSubTopic
    } = body;

    const selectedInterviewer = INTERVIEWERS_MAP[interviewerId] || INTERVIEWERS_MAP.vikram;

    // Recorded interview: the server's record is the conversation (the browser's history is not
    // used), and the topic is the one the interview was started with.
    const admin = body.liveSessionId ? getSupabaseAdmin() : null;
    let live: LiveSession | null = null;
    if (admin) {
      const found = await loadActiveLiveSession(admin, gated.user.id, body.liveSessionId);
      if (!found.ok) {
        return NextResponse.json(
          { error: `INTERVIEW_RECORD_${found.error}`, message: 'This interview can no longer continue. Please start a new one.' },
          { status: 409 }
        );
      }
      live = found.session;
    }
    const recordTurns = async (turns: Parameters<typeof appendLiveTurns>[2]) => {
      if (!admin || !live) return;
      const saved = await appendLiveTurns(admin, live, turns);
      if (saved) { live = saved; return; }
      // Another request updated the record first: reload once and append again.
      const again = await loadActiveLiveSession(admin, gated.user.id, live.id);
      if (again.ok) live = (await appendLiveTurns(admin, again.session, turns)) ?? again.session;
    };

    const stream = live ? live.domain_stream : (domainStream === 'non_tech' ? 'non_tech' : 'tech');
    const topicSource = live ? live.topic : (customTopic || domainSubTopic || (stream === 'non_tech' ? 'Finance & Strategy' : 'Software Engineering'));
    const subTopic = String(topicSource).toUpperCase();

    // Round changes, skipped questions and code submissions happen on the page; the record notes them.
    if (live && (body.event === 'stage' || body.event === 'skip' || body.event === 'code')) {
      if (body.event === 'code') {
        const turn = codeSubmissionTurn(body.code, body.language, body.problemTitle, stage);
        if (!turn) return NextResponse.json({ error: 'CODE_REQUIRED', message: 'No code to record.' }, { status: 400 });
        await recordTurns([turn]);
      } else if (body.event === 'stage') {
        await recordTurns([clampTurn('assistant', stageMarker(String(stage || '')), stage)]);
      } else {
        await recordTurns([
          clampTurn('user', '[Candidate skipped question]', stage),
          clampTurn('assistant', `Moving on to our next question for ${live.topic}.`, stage),
        ]);
      }
      return NextResponse.json({ ok: true, recorded: true });
    }
    const liveUserTurn = live ? clampTurn('user', message, stage) : null;
    const effectiveHistory: Array<{ role: string; content: string }> = live
      ? [...transcriptForModel(live), ...(liveUserTurn ? [{ role: 'user', content: liveUserTurn.content }] : [])]
      : (Array.isArray(history) ? history : []);

        console.log(`[Interview Chat API] Authenticated User: ${gated.user.id} | Interviewer: ${selectedInterviewer.name} (${interviewerId}) | Stage: ${stage} | Topic: ${subTopic}`);
    if (gated.user?.id) {
      recordActiveLiveInterview(gated.user.id, subTopic, stage || 'round1_behavioral');
    }

    // 2. Build Difficulty Context
    let difficultyPrompt = '';
    if (difficulty === 'easy') {
      difficultyPrompt = 'Scale difficulty to EASY. Maintain a supportive, encouraging tone, ask basic conceptual questions, and guide the candidate gently.';
    } else if (difficulty === 'hard') {
      difficultyPrompt = 'Scale difficulty to HARD. Be demanding, ask deep edge cases, query precise performance/financial metrics, and challenge claims aggressively.';
    } else {
      difficultyPrompt = 'Scale difficulty to NORMAL. Act as a typical corporate lead interviewer with standard expectations.';
    }

    // 3. Build Topic Context
    let topicPrompt = `The candidate is being interviewed for [${subTopic}] in the [${stream === 'non_tech' ? 'Non-Tech / Corporate / Business' : 'Tech / Software / Systems'}] stream.`;
    const topicFocus = live ? live.topic : (typeof customTopic === 'string' ? customTopic.trim() : '');
    if (topicFocus) {
      topicPrompt += ` Topic Focus: "${topicFocus}". Align all questions and technical drill-downs strictly to this domain.`;
    }

    // 4. Build Stage-Specific Context
    let stageContext = '';
    if (stage === 'round1_behavioral') {
      const historyLength = effectiveHistory.length;
      if (historyLength <= 1) {
        stageContext = `This is Round 1 (Behavioral & Background). Acknowledge the candidate warmly, introduce yourself briefly as ${selectedInterviewer.name}, and ask them to introduce their background and experience with ${subTopic}. Keep under 3 sentences.`;
      } else {
        stageContext = `This is Round 1 (Behavioral). Listen to the candidate's last answer. Acknowledge one specific detail they mentioned, then ask a structured behavioral or background follow-up question related to ${subTopic}. Keep under 3 sentences.`;
      }
    } else if (stage === 'round2_coding') {
      stageContext = reviewDecision
        ? `This is the final code-review decision for Round 2. Assess the candidate's code and their explanation in the conversation. If both meet the bar, briefly acknowledge why and append exactly [[ROUND_VERDICT:PASS]]. If the reasoning or implementation has a substantive gap, briefly explain it and append exactly [[ROUND_VERDICT:RETRY]]. Do not ask another question. Never include the marker in spoken prose.`
        : `This is Round 2 (Technical Assessment & Problem Solving). Review the submitted code when available and ask exactly one focused question about its logic, complexity, edge cases, or trade-offs. If they ask for hints, provide a conceptual clue without giving away code or the complete solution. Keep under 3 sentences.`;
    } else if (stage === 'round3_systems') {
      if (stream === 'non_tech') {
        stageContext = `This is Round 3 (Business Workflow Canvas). Ask about the conversion funnel, monetization loops, and bottleneck mitigations in their strategy for ${subTopic}. Keep under 3 sentences.`;
      } else {
        stageContext = `This is Round 3 (System Architecture Canvas). Ask the candidate about failure modes, load balancing, caching consistency, and database scaling trade-offs in ${subTopic}. Keep under 3 sentences.`;
      }
    } else if (stage === 'round4_star') {
      stageContext = `This is Round 4 (Executive Deep Dive). Use the candidate's actual earlier-round background, submitted code, and architecture choices from the conversation. Ask one probing question that connects at least two rounds—for example, why they chose that implementation, how it fits the system they designed, what trade-off it creates, and how they would measure its impact. Avoid generic STAR prompts when specific project evidence is present. Keep under 3 sentences.`;
    }

    // 5. Telemetry Context (Advisory)
    let telemetryContext = '';
    const hasWpm = typeof telemetry?.wpm === 'number' && !isNaN(telemetry.wpm) && telemetry.wpm > 0;
    const hasFillerWords = typeof telemetry?.fillerWords === 'number' && !isNaN(telemetry.fillerWords);
    if (hasWpm || hasFillerWords) {
      const parts: string[] = [];
      if (hasWpm) parts.push(`WPM: ${telemetry.wpm}`);
      if (hasFillerWords) parts.push(`Filler Words: ${telemetry.fillerWords}`);
      telemetryContext = `[Diagnostic Signal: ${parts.join(', ')}]. Maintain crisp verbal engagement.`;
    }

    const systemPrompt = `You are ${selectedInterviewer.name}, ${selectedInterviewer.role}. ${selectedInterviewer.nature}.
${difficultyPrompt}
${topicPrompt}
${stageContext}
${telemetryContext}
RULES:
1. Speak in first person as ${selectedInterviewer.name}.
2. ${reviewDecision ? 'For the final code-review decision, provide a concise verdict and use the required marker; do not ask a question.' : 'Ask exactly ONE clear, concise question per turn.'}
3. Never give the complete code or answer away.
4. Keep response under 3 sentences max for spoken voice clarity.`;

    // 6. Multi-Key Rotation Pool & Provider Failover
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let reply = '';
    const formattedHistory = effectiveHistory.map((h) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '') }));

    // A recorded interview needs the whole reply to store it, so it is answered without streaming.
    const wantsStream = !live && (Boolean(body.stream) || Boolean(body.streaming) || Boolean(req.headers.get('accept')?.includes('text/event-stream')));

    // 7. If client requested SSE streaming, attempt streaming Groq inference
    if (wantsStream) {
      for (const key of groqKeys) {
        try {
          console.log(`[Interview Chat API] Attempting streaming Groq inference with key ending in ...${key.slice(-4)}`);
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant',
              messages: [
                { role: 'system', content: systemPrompt },
                ...formattedHistory
              ],
              max_tokens: 280,
              temperature: 0.7,
              stream: true
            }),
            signal: AbortSignal.timeout(3500)
          });

          if (res.ok && res.body) {
            console.log('[Interview Chat API] Streaming Groq connection established');
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            const groqReader = res.body.getReader();

            const streamResponse = new ReadableStream({
              async start(controller) {
                let buffer = '';
                try {
                  while (true) {
                    const { done, value } = await groqReader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                      const trimmed = line.trim();
                      if (!trimmed || trimmed.startsWith(':')) continue;
                      if (trimmed === 'data: [DONE]') {
                        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                        controller.close();
                        return;
                      }
                      if (trimmed.startsWith('data: ')) {
                        try {
                          const json = JSON.parse(trimmed.slice(6));
                          const token = json.choices?.[0]?.delta?.content;
                          if (token) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
                          }
                        } catch {
                          // Ignore parse error on partial chunks
                        }
                      }
                    }
                  }
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                } catch (streamErr) {
                  controller.error(streamErr);
                }
              }
            });

            return new Response(streamResponse, {
              headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
              }
            });
          }
        } catch (streamAttemptErr: any) {
          console.warn('[Interview Chat API] Groq streaming key failed:', streamAttemptErr?.message);
        }
      }

      // If streaming Groq was offline, stream the deterministic fallback
      const fallback = generateProgressiveFallbackQuestion({ stage: stage || 'round1_behavioral', subTopic, history: formattedHistory, difficulty: difficulty || 'normal', interviewerName: selectedInterviewer.name });
      const encoder = new TextEncoder();
      const fallbackStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: fallback })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
      return new Response(fallbackStream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        }
      });
    }

    // Attempt Groq Multi-Key Pool with ultra-fast 8B conversational model and 3.5s timeout (Non-Streaming JSON)
    for (const key of groqKeys) {
      try {
        console.log(`[Interview Chat API] Attempting Groq inference with key ending in ...${key.slice(-4)}`);
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemPrompt },
              ...formattedHistory
            ],
            max_tokens: 280,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(3500)
        });

        if (res.ok) {
          const data = await res.json();
          reply = (data.choices?.[0]?.message?.content || '').trim();
          if (reply) {
            console.log(`[Interview Chat API] Groq inference successful (${reply.length} chars)`);
            break;
          }
        } else {
          console.warn(`[Interview Chat API] Groq key returned status: ${res.status}`);
        }
      } catch (err: any) {
        console.warn(`[Interview Chat API] Groq request failed for key:`, err?.message);
      }
    }

    // Fallback to Google Gemini API if Groq pool is exhausted
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!reply && geminiKey) {
      try {
        console.log('[Interview Chat API] Falling back to Gemini inference...');
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nConversation History:\n${formattedHistory.map(h => `${h.role}: ${h.content}`).join('\n')}\n\nRespond as ${selectedInterviewer.name}:` }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 280,
              temperature: 0.7
            }
          }),
          signal: AbortSignal.timeout(3500)
        });
        if (geminiRes.ok) {
          const gemData = await geminiRes.json();
          reply = (gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
          if (reply) {
            console.log(`[Interview Chat API] Gemini inference successful (${reply.length} chars)`);
          }
        }
      } catch (gemErr: any) {
        console.warn('[Interview Chat API] Gemini fallback failed:', gemErr?.message);
      }
    }

    // Fallback to OpenRouter if Groq pool is exhausted
    if (!reply && openRouterKey) {
      try {
        console.log('[Interview Chat API] Falling back to OpenRouter inference...');
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit-careers.web.app',
            'X-Title': 'PinIT Interview AI'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              ...formattedHistory
            ],
            max_tokens: 280,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(4000)
        });

        if (res.ok) {
          const data = await res.json();
          reply = (data.choices?.[0]?.message?.content || '').trim();
          console.log('[Interview Chat API] OpenRouter fallback successful');
        }
      } catch (err: any) {
        console.warn('[Interview Chat API] OpenRouter fallback failed:', err?.message);
      }
    }

    // Deterministic fallback if all external LLMs are offline
    if (!reply) {
      console.warn('[Interview Chat API] External LLMs unavailable, using contextual deterministic fallback');
      if (reviewDecision) {
        const finalAnswer = [...formattedHistory].reverse().find(turn => turn.role === 'user')?.content || '';
        const answer = finalAnswer.toLowerCase();
        const hasReasoning = ['because', 'complexity', 'edge case', 'trade-off', 'tradeoff', 'test', 'memory', 'time'].some(term => answer.includes(term));
        const passes = finalAnswer.trim().split(/\s+/).length >= 18 && hasReasoning;
        reply = passes
          ? `Your explanation connects the implementation to its complexity or edge cases. That meets the review bar. [[ROUND_VERDICT:PASS]]`
          : `I need a clearer explanation of the reasoning behind your implementation and how it handles complexity or edge cases. [[ROUND_VERDICT:RETRY]]`;
      } else {
        reply = generateProgressiveFallbackQuestion({ stage: stage || 'round1_behavioral', subTopic, history: formattedHistory, difficulty: difficulty || 'normal', interviewerName: selectedInterviewer.name });
      }
    }

    const verdictMatch = reviewDecision ? reply.match(/\[\[ROUND_VERDICT:(PASS|RETRY)\]\]/i) : null;
    const roundVerdict = reviewDecision ? (verdictMatch?.[1]?.toUpperCase() === 'PASS' ? 'PASS' : 'RETRY') : undefined;
    const sanitizedReply = sanitizeLLMOutput(reviewDecision ? reply.replace(/\[\[ROUND_VERDICT:(PASS|RETRY)\]\]/i, '').trim() : reply);
    if (live) {
      await recordTurns([liveUserTurn, clampTurn('assistant', sanitizedReply, stage)]);
      return NextResponse.json({ reply: sanitizedReply, recorded: true, roundVerdict });
    }
    return NextResponse.json({ reply: sanitizedReply, roundVerdict });

  } catch (err: any) {
    console.error('[Interview Chat API Critical Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error in interview chat' }, { status: 500 });
  }
}

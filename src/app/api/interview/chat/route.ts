import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { recordActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';

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

export function generateProgressiveFallbackQuestion(ctx: FallbackContext): string {
  const { stage, subTopic, history, difficulty, interviewerName } = ctx;

  const pastAssistantMsgs = (history || [])
    .filter(m => m.role === 'assistant')
    .map(m => (m.content || '').toLowerCase());
  const userTurns = (history || []).filter(m => m.role === 'user').length;

  const STAGE_QUESTIONS: Record<string, string[]> = {
    round1_behavioral: [
      `Thank you for sharing your background. In your experience with ${subTopic}, could you tell me about the most demanding challenge you tackled and how you approached resolving it?`,
      `Understood. When collaborating with stakeholders or cross-functional team members on ${subTopic}, how do you resolve conflicting priorities or technical disagreements?`,
      `That provides good context. Could you describe a time when an initial plan or implementation in ${subTopic} did not go as expected, and what actionable lessons you took away?`,
      `Great reflection. In high-pressure situations with tight deadlines, how do you balance technical excellence against shipping speed in ${subTopic}?`,
      `To wrap up our behavioral discussion: Looking forward, what is an area within ${subTopic} where you are actively expanding your skills or pushing deeper expertise?`
    ],
    round2_coding: [
      `Thank you for walking through that. Looking at your approach for ${subTopic}, what is the time and space complexity of your implementation, and could we optimize either?`,
      `How would your solution behave on extreme edge cases, such as null/empty inputs, integer overflow, or massive dataset scale?`,
      `If this code were executed concurrently by thousands of simultaneous threads, what concurrency issues or race conditions might arise, and how would you safeguard against them?`,
      `How would you structure comprehensive unit and integration tests to verify this logic before deploying to production?`
    ],
    round3_systems: [
      `Thank you. Let's analyze your architecture for ${subTopic}. Walk me through your data flow from the client edge gateway down to the persistent data store.`,
      `Where do you foresee the primary throughput or storage bottlenecks under 10x traffic surge, and how does your caching and indexing strategy mitigate them?`,
      `If your primary database or worker instance experiences an unrecoverable failure during peak hours, how does your system handle failover and data consistency?`,
      `How do you monitor system health, latency SLAs, and error budgets across these distributed components in production?`
    ],
    round4_star: [
      `Thank you. In this STAR defense round, let's establish the exact Situation and Task: What specific business objective or critical problem were you assigned in ${subTopic}?`,
      `Now let's drill into the Action: What specific technical decisions and implementation steps did you personally drive, and what trade-offs did you accept?`,
      `What were the quantifiable Results? What measurable metrics, business impact, or post-launch performance indicators demonstrated success?`,
      `Looking back with 20/20 hindsight, what is one major decision in that project that you would execute differently today?`
    ]
  };

  const candidates = STAGE_QUESTIONS[stage] || STAGE_QUESTIONS.round1_behavioral;

  let selected = candidates[Math.min(userTurns, candidates.length - 1)];

  for (const q of candidates) {
    const snippet = q.slice(0, 35).toLowerCase();
    const alreadyAsked = pastAssistantMsgs.some(past => past.includes(snippet));
    if (!alreadyAsked) {
      selected = q;
      break;
    }
  }

  return `${selected} — ${interviewerName}`;
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
      history = [],
      telemetry,
      difficulty,
      customTopic,
      domainStream,
      domainSubTopic
    } = body;

    const selectedInterviewer = INTERVIEWERS_MAP[interviewerId] || INTERVIEWERS_MAP.vikram;
    const stream = domainStream === 'non_tech' ? 'non_tech' : 'tech';
    const subTopic = (customTopic || domainSubTopic || (stream === 'non_tech' ? 'Finance & Strategy' : 'Software Engineering')).toUpperCase();

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
    if (customTopic && customTopic.trim()) {
      topicPrompt += ` Topic Focus: "${customTopic.trim()}". Align all questions and technical drill-downs strictly to this domain.`;
    }

    // 4. Build Stage-Specific Context
    let stageContext = '';
    if (stage === 'round1_behavioral') {
      const historyLength = Array.isArray(history) ? history.length : 0;
      if (historyLength <= 1) {
        stageContext = `This is Round 1 (Behavioral & Background). Acknowledge the candidate warmly, introduce yourself briefly as ${selectedInterviewer.name}, and ask them to introduce their background and experience with ${subTopic}. Keep under 3 sentences.`;
      } else {
        stageContext = `This is Round 1 (Behavioral). Listen to the candidate's last answer. Acknowledge one specific detail they mentioned, then ask a structured behavioral or background follow-up question related to ${subTopic}. Keep under 3 sentences.`;
      }
    } else if (stage === 'round2_coding') {
      stageContext = `This is Round 2 (Technical Assessment & Problem Solving). Guide the candidate on algorithmic/business problem solving in ${subTopic}. If they ask for hints, provide a conceptual clue without giving away the complete solution. Keep under 3 sentences.`;
    } else if (stage === 'round3_systems') {
      if (stream === 'non_tech') {
        stageContext = `This is Round 3 (Business Workflow Canvas). Ask about the conversion funnel, monetization loops, and bottleneck mitigations in their strategy for ${subTopic}. Keep under 3 sentences.`;
      } else {
        stageContext = `This is Round 3 (System Architecture Canvas). Ask the candidate about failure modes, load balancing, caching consistency, and database scaling trade-offs in ${subTopic}. Keep under 3 sentences.`;
      }
    } else if (stage === 'round4_star') {
      stageContext = `This is Round 4 (Executive STAR Drill). Evaluate the candidate's Situation, Task, Action, and Result for a high-stakes scenario in ${subTopic}. Guide them to explain their core architectural and trade-off decisions. Keep under 3 sentences.`;
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
2. Ask exactly ONE clear, concise question per turn.
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
    const formattedHistory = Array.isArray(history)
      ? history.map((h: any) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '') }))
      : [];

    const wantsStream = Boolean(body.stream) || Boolean(body.streaming) || Boolean(req.headers.get('accept')?.includes('text/event-stream'));

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
      reply = generateProgressiveFallbackQuestion({ stage: stage || 'round1_behavioral', subTopic, history: formattedHistory, difficulty: difficulty || 'normal', interviewerName: selectedInterviewer.name });
    }

    const sanitizedReply = sanitizeLLMOutput(reply);
    return NextResponse.json({ reply: sanitizedReply });

  } catch (err: any) {
    console.error('[Interview Chat API Critical Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error in interview chat' }, { status: 500 });
  }
}

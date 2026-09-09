import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';

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

export async function POST(req: Request) {
  console.log('[Interview Chat API] Incoming request received at /api/interview/chat');
  
  try {
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
    if (telemetry) {
      telemetryContext = `[Diagnostic Signal: WPM: ${telemetry.wpm || 125}, Filler Words: ${telemetry.fillerWords || 0}]. Maintain crisp verbal engagement.`;
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

    // Attempt Groq Multi-Key Pool
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
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...formattedHistory
            ],
            max_tokens: 280,
            temperature: 0.7
          })
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
          })
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
      reply = `Thank you for sharing that. As we look at ${subTopic}, could you walk me through your technical approach and how you handle unexpected production trade-offs? — ${selectedInterviewer.name}`;
    }

    const sanitizedReply = sanitizeLLMOutput(reply);
    return NextResponse.json({ reply: sanitizedReply });

  } catch (err: any) {
    console.error('[Interview Chat API Critical Error]:', err);
    return NextResponse.json({ error: err.message || 'Server error in interview chat' }, { status: 500 });
  }
}

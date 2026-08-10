import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

const INTERVIEWERS_MAP: Record<string, { name: string; role: string; nature: string }> = {
  vikram: {
    name: 'Mr. Vikram',
    role: 'The Strict Corporate Recruiter',
    nature: 'You have a professional, direct, and impatient recruiting style. You demand numeric metrics and often interrupt to say "Let\'s make it brief—can you summarize in 10 seconds?" to simulate extreme time pressure.'
  },
  shalini: {
    name: 'Ms. Shalini',
    role: 'The Meticulous Assessor',
    nature: 'You are stoic, silent, and meticulous. You keep your tone formal and give zero verbal verification or visual confirmation. You never say "Good job" or "Correct"—you simply nod or say "Understood, proceed." to test candidate confidence.'
  },
  aditya: {
    name: 'Mr. Aditya',
    role: 'The Strategy & Domain Lead',
    nature: 'You are a brilliant domain lead and strategist. You focus microscopic attention on domain metrics, strategic choices, and execution frameworks, asking candidates to justify every decision.'
  },
  neha: {
    name: 'Ms. Neha',
    role: 'The High-Stress Scenario Driller',
    nature: 'You prepare candidates for high-stress setups. You ask rapid-fire questions, interrupting logic with real-world crisis scenarios: "What if market conditions change overnight? Solve it now."'
  }
};

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { message, interviewerId, stage, history, telemetry, difficulty, customTopic, domainStream, domainSubTopic } = await req.json();
    const selectedInterviewer = INTERVIEWERS_MAP[interviewerId] || INTERVIEWERS_MAP.vikram;

    const stream = domainStream === 'non_tech' ? 'non_tech' : 'tech';
    const subTopic = (domainSubTopic || (stream === 'non_tech' ? 'B.Com / BBA Management' : 'Software Engineering')).toUpperCase();

    let difficultyPrompt = '';
    if (difficulty === 'easy') {
      difficultyPrompt = 'Scale difficulty to EASY. Maintain a supportive, encouraging tone, ask basic conceptual questions, and guide the candidate gently.';
    } else if (difficulty === 'hard') {
      difficultyPrompt = 'Scale difficulty to HARD. Be demanding, ask deep edge cases, query precise performance/financial metrics, and challenge claims aggressively.';
    } else {
      difficultyPrompt = 'Scale difficulty to NORMAL. Act as a typical corporate lead interviewer with standard expectations.';
    }

    let topicPrompt = `The candidate is being interviewed for the field of [${subTopic}] in the [${stream === 'non_tech' ? 'Non-Tech (Business, Finance, Marketing, HR, Operations)' : 'Tech (Software, Data, Systems)'}] stream.`;
    if (customTopic && customTopic.trim()) {
      topicPrompt += ` Custom Topic Focus: "${customTopic.trim()}". Align all questions, evaluation criteria, and follow-ups strictly around this topic.`;
    }

    let stageContext = '';
    if (stage === 'round1_behavioral') {
      const historyLength = Array.isArray(history) ? history.length : 0;
      if (historyLength <= 1) {
        stageContext = `This is the opening of Round 1. Start warmly with: "Welcome to the interview! To kick things off, please introduce yourself and tell me a bit about your academic background, experience, and career goals in ${subTopic}." Keep it direct (2-3 sentences).`;
      } else {
        stageContext = `Listen to the candidate's introduction. Acknowledge their response briefly, then ask a specific follow-up question related to their experience or key concepts in ${subTopic}. Keep it realistic, direct, and under 3 sentences.`;
      }
    } else if (stage === 'round3_systems') {
      if (stream === 'non_tech') {
        stageContext = `This is the Business Process & Strategy Workflow Canvas round. Ask the candidate to explain the visual workflow they built on the canvas for a ${subTopic} business strategy (e.g., Marketing Funnel, Supply Chain Pipeline, or Financial Forecast Model). Ask how they handle bottlenecks.`;
      } else {
        stageContext = `This is the Architecture & Systems Design Canvas round. Ask the candidate to explain the architecture node connections they drew on the canvas for ${subTopic} (e.g., Client, Load Balancer, Web Server, Database, Cache). Ask about single-points-of-failure.`;
      }
    } else if (stage === 'round4_star') {
      stageContext = `Conduct a structured STAR (Situation, Task, Action, Result) behavioral drill. Ask about a specific high-stakes challenge or project conflict the candidate faced in ${subTopic}. Guide them through ONE phase at a time (Situation ➔ Task ➔ Action ➔ Result). Keep response to 2-3 sentences max.`;
    }

    let telemetryContext = '';
    if (telemetry) {
      telemetryContext = `[Candidate Telemetry: Eye Contact: ${telemetry.eyeContact}%, WPM: ${telemetry.wpm}, Filler Words: ${telemetry.fillerWords}]. Adapt recruiter tone subtly based on this.`;
    }

    const systemPrompt = `You are ${selectedInterviewer.name}, ${selectedInterviewer.role}. ${selectedInterviewer.nature}. ${difficultyPrompt} ${topicPrompt} ${stageContext} ${telemetryContext} Max 3 sentences.`;

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || (process.env.GROQ_API_KEYS || '').split(',')[0]?.trim();

    let reply = '';
    if (groqKey) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map((h: any) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content }))
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      if (res.ok) {
        const data = await res.json();
        reply = (data.choices?.[0]?.message?.content || '').trim();
      }
    }

    if (!reply && openRouterKey) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map((h: any) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content }))
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        reply = (data.choices?.[0]?.message?.content || '').trim();
      }
    }

    if (!reply) {
      reply = `Thank you. Could you elaborate further on your experience with ${subTopic}? — ${selectedInterviewer.name}`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

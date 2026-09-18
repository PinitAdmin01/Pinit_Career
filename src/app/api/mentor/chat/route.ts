import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

interface MentorChatRequest {
  message?: string;
  query?: string;
  studentName?: string;
  targetRole?: string;
  activeQuest?: string | { title?: string; id?: string; progress?: number };
  missingSkills?: string[];
  weakAreas?: string[];
  careerContext?: Record<string, any>;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  stream?: boolean;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`llm_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests. Wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body: MentorChatRequest = await req.json();
    const userMessage = (body.message || body.query || '').trim();

    if (!userMessage) {
      return NextResponse.json(
        { ok: false, error: 'BAD_REQUEST', message: 'Message or query is required.' },
        { status: 400 }
      );
    }

    const studentName = body.studentName || body.careerContext?.displayName || 'Candidate';
    const targetRole = body.targetRole || body.careerContext?.targetRole || 'Software Engineer';
    const questTitle = typeof body.activeQuest === 'object' && body.activeQuest !== null
      ? body.activeQuest.title || 'Core Foundation'
      : (body.activeQuest || body.careerContext?.activeQuest || 'General Pathway');
    
    const missingSkills = Array.isArray(body.missingSkills) && body.missingSkills.length > 0
      ? body.missingSkills
      : (Array.isArray(body.careerContext?.jdMissingSkills) ? body.careerContext.jdMissingSkills : []);
    
    const atsScore = body.careerContext?.ats_score ?? body.careerContext?.atsScore ?? 65;
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    const systemPrompt = `You are an elite, empathetic Technical Career Mentor at PinIT Career OS.
You are directly mentoring ${studentName}, who is aiming for the role of "${targetRole}".
CURRENT STUDENT CONTEXT:
- Active Learning Quest: "${questTitle}"
- Critical Skill Gaps to close: ${missingSkills.length > 0 ? missingSkills.join(', ') : 'No critical gaps flagged yet'}
- Current ATS Resume Score: ${atsScore}/100

YOUR INSTRUCTIONS:
1. Provide actionable, concise, pragmatic advice tailored to their role and active quest.
2. If the student asks about what to focus on, explicitly address their specific skill gaps (${missingSkills.slice(0, 3).join(', ') || 'foundation principles'}) and guide them through their active quest "${questTitle}".
3. Never use generic platitudes. Be encouraging, precise, and practical. Keep responses under 3 paragraphs.
4. Maintain a warm, encouraging, yet rigorous Socratic mentor tone.`;

    // Try calling Groq / OpenRouter
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    if (process.env.GROQ_API_KEY && !groqKeys.includes(process.env.GROQ_API_KEY)) {
      groqKeys.push(process.env.GROQ_API_KEY);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    const wantsStream = Boolean(body.stream) || Boolean(req.headers.get('accept')?.includes('text/event-stream'));

    // Streaming Groq branch for sub-60ms TTFT
    if (wantsStream) {
      if (groqKeys.length > 0) {
        for (const key of groqKeys) {
          try {
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
                  ...history,
                  { role: 'user', content: userMessage }
                ],
                max_tokens: 350,
                temperature: 0.7,
                stream: true
              }),
              signal: AbortSignal.timeout(3500)
            });

            if (res.ok && res.body) {
              const encoder = new TextEncoder();
              const decoder = new TextDecoder();
              const reader = res.body.getReader();

              const streamResponse = new ReadableStream({
                async start(controller) {
                  let buffer = '';
                  try {
                    while (true) {
                      const { done, value } = await reader.read();
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
                            // partial JSON chunk
                          }
                        }
                      }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                  } catch (err) {
                    controller.error(err);
                  }
                }
              });

              return new Response(streamResponse, {
                headers: {
                  'Content-Type': 'text/event-stream; charset=utf-8',
                  'Cache-Control': 'no-cache, no-transform',
                  'Connection': 'keep-alive'
                }
              });
            }
          } catch {
            // cycle to next key or fallback
          }
        }
      }

      // Stream contextual fallback if external Groq is offline
      const gapsNotice = missingSkills.length > 0
        ? `Given your goal of becoming a ${targetRole}, I recommend tackling your gaps in ${missingSkills.slice(0, 2).join(' and ')}.`
        : `Let's keep reinforcing your core competencies for ${targetRole}.`;
      const fallbackReply = `Hello ${studentName}! As your mentor for ${targetRole}, I am tracking your progress on "${questTitle}". ${gapsNotice} What specific challenge can we solve today?`;

      const encoder = new TextEncoder();
      const fallbackStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: fallbackReply })}\n\n`));
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

    let llmResponse: string | null = null;

    if (groqKeys.length > 0) {
      for (const key of groqKeys) {
        try {
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
                ...history,
                { role: 'user', content: userMessage }
              ],
              max_tokens: 350,
              temperature: 0.7
            }),
            signal: AbortSignal.timeout(3500)
          });
          if (res.ok) {
            const data = await res.json();
            llmResponse = (data.choices?.[0]?.message?.content || '').trim();
            if (llmResponse) break;
          }
        } catch {
          // cycle to next key or fallback
        }
      }
    }

    if (!llmResponse && openRouterKey) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit.career',
            'X-Title': 'PinIT Career OS Mentor'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content: userMessage }
            ],
            max_tokens: 350,
            temperature: 0.7
          }),
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          const data = await res.json();
          llmResponse = (data.choices?.[0]?.message?.content || '').trim();
        }
      } catch {
        // Fall back to contextual engine
      }
    }

    let isSimulated = false;
    // Dynamic contextual fallback if LLM offline / absent API keys
    if (!llmResponse) {
      isSimulated = true;
      const gapsNotice = missingSkills.length > 0
        ? `Given your goal of becoming a ${targetRole}, I recommend tackling your gaps in ${missingSkills.slice(0, 2).join(' and ')}.`
        : `Let's keep reinforcing your core competencies for ${targetRole}.`;
      
      const lower = userMessage.toLowerCase();
      if (lower.includes('skill') || lower.includes('gap') || lower.includes('learn') || lower.includes('study')) {
        llmResponse = `Hey ${studentName}! ${gapsNotice} In your active quest "${questTitle}", focus on practical implementation projects and unit tests rather than passive reading.`;
      } else if (lower.includes('interview') || lower.includes('ready') || lower.includes('mock')) {
        llmResponse = `${studentName}, to ace ${targetRole} interviews, simulate real technical trade-offs. Your current ATS score is ${atsScore}/100; sharpening ${missingSkills[0] || 'system design'} will significantly elevate your profile score.`;
      } else if (lower.includes('quest') || lower.includes('mission') || lower.includes('project')) {
        llmResponse = `You are currently working on "${questTitle}". Completing the practical challenge here directly builds verifiable proof for ${targetRole} recruiters.`;
      } else {
        llmResponse = `Hello ${studentName}! As your mentor for ${targetRole}, I am tracking your progress on "${questTitle}". ${gapsNotice} What specific challenge can we solve today?`;
      }
    }

    const cleanReply = sanitizeLLMOutput(llmResponse);

    return NextResponse.json({
      ok: true,
      reply: cleanReply,
      simulated: isSimulated,
      context: {
        studentName,
        targetRole,
        activeQuest: questTitle,
        missingSkills,
        atsScore
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: 'SERVER_ERROR', message: error?.message || 'Failed to process mentor message' },
      { status: 500 }
    );
  }
}

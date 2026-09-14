import { NextResponse } from 'next/server';
import { requireUserFromRequest, verifyPaywallAccess } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const rateLimitKey = `llm_${gated.user?.id || getClientIp(req)}`;
    const rateCheck = checkRateLimit(rateLimitKey, { limit: 6, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'TOO_MANY_REQUESTS', message: `Rate limit exceeded. Please wait ${rateCheck.resetSec}s.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetSec),
          },
        }
      );
    }

    const { messages, systemPrompt, skillCategory, maxTokens } = await req.json();

    // Fixed server-side key — never trust client-supplied skillCategory for paywall
    const paywallErr = await verifyPaywallAccess(gated.user!.id, 'ai');
    if (paywallErr) return paywallErr;

    const clampedMaxTokens = Math.min(Math.max(Number(maxTokens) || 300, 50), 1000);

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }

    const isSoftSkill = skillCategory === 'soft-skills' || skillCategory === 'communication' || skillCategory === 'leadership';
    const primaryProvider = isSoftSkill ? 'groq' : 'openrouter';

    const executeGroq = async (): Promise<string> => {
      let lastError = new Error('No Groq keys configured');
      for (const key of groqKeys) {
        try {
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
                ...messages
              ],
              max_tokens: clampedMaxTokens,
              temperature: 0.7
            })
          });
          if (!res.ok) throw new Error(`Groq returned ${res.status}`);
          const data = await res.json();
          return (data.choices?.[0]?.message?.content || '').trim();
        } catch (err: any) {
          lastError = err;
        }
      }
      throw lastError;
    };

    const executeOpenRouter = async (): Promise<string> => {
      if (!openRouterKey) throw new Error('No OpenRouter key configured');
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://pinit-careers.web.app',
          'X-Title': 'Pi Career OS'
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-coder-32b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          max_tokens: clampedMaxTokens,
          temperature: 0.2
        })
      });
      if (!res.ok) throw new Error(`OpenRouter returned ${res.status}`);
      const data = await res.json();
      return (data.choices?.[0]?.message?.content || '').trim();
    };

    let reply = '';
    if (primaryProvider === 'openrouter') {
      try {
        reply = await executeOpenRouter();
      } catch (err) {
        console.warn('OpenRouter primary call failed, falling back to Groq', err);
        try {
          reply = await executeGroq();
        } catch (groqErr) {
          throw new Error('Both OpenRouter and Groq providers failed');
        }
      }
    } else {
      try {
        reply = await executeGroq();
      } catch (err) {
        console.warn('Groq primary call failed, falling back to OpenRouter', err);
        try {
          reply = await executeOpenRouter();
        } catch (orErr) {
          throw new Error('Both Groq and OpenRouter providers failed');
        }
      }
    }

    const sanitizedReply = sanitizeLLMOutput(reply);
    return NextResponse.json({ reply: sanitizedReply });
  } catch (err: any) {
    console.error('[Secure LLM API] Failed:', err);
    return NextResponse.json({ error: err.message || 'LLM Execution Failed' }, { status: 500 });
  }
}

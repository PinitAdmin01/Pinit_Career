import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import {
  executeGdTurn,
  type GdDomain,
  type GdDifficulty,
  type GdHistoryMessage,
  type GdRoleType,
} from '@/lib/group-discussion/gdTurnEngine';

export const dynamic = 'force-dynamic';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GD_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'] as const;

export type GdKeySlot = 'a' | 'b';

/**
 * Dedicated dual-key pool resolver:
 * - Avatar 1 (`slot: 'a'`) -> Groq Key 1 (GROQ_GD_KEY_1 / GROQ_API_KEYS_A / GROQ_API_KEY_A / GROQ_API_KEYS[0])
 * - Avatar 2 (`slot: 'b'`) -> Groq Key 2 (GROQ_GD_KEY_2 / GROQ_API_KEYS_B / GROQ_API_KEY_B / GROQ_API_KEYS[1])
 * Keeps Avatar 1 and Avatar 2 completely isolated on separate API keys so there is zero rate-limit contention or delay.
 */
export function resolveGroqKeysForGdSlot(
  slot: GdKeySlot,
  env: Record<string, string | undefined> = process.env
): { keys: string[]; keySlotLabel: 'key_1' | 'key_2' } {
  const splitKeys = (raw?: string) =>
    (raw || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

  const sharedPool = splitKeys(env.GROQ_API_KEYS);
  const slotDedicated =
    slot === 'b'
      ? [
          ...splitKeys(env.GROQ_GD_KEY_2),
          ...splitKeys(env.GROQ_API_KEYS_B),
          ...splitKeys(env.GROQ_API_KEY_B),
          ...(sharedPool.length >= 2 ? [sharedPool[1]] : []),
        ]
      : [
          ...splitKeys(env.GROQ_GD_KEY_1),
          ...splitKeys(env.GROQ_API_KEYS_A),
          ...splitKeys(env.GROQ_API_KEY_A),
          ...(sharedPool.length >= 1 ? [sharedPool[0]] : []),
        ];

  const fallbackPool = [
    ...splitKeys(env.GROQ_API_KEY),
    ...sharedPool,
  ];

  // Preserve order and deduplicate so dedicated slot key is ALWAYS tried first
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const k of [...slotDedicated, ...fallbackPool]) {
    if (k && !seen.has(k)) {
      seen.add(k);
      ordered.push(k);
    }
  }

  return {
    keys: ordered,
    keySlotLabel: slot === 'b' ? 'key_2' : 'key_1',
  };
}

async function callGroq(
  slot: GdKeySlot,
  system: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ text: string; keySlot: 'key_1' | 'key_2'; model: string }> {
  const { keys, keySlotLabel } = resolveGroqKeysForGdSlot(slot);
  if (keys.length === 0) throw new Error('NO_GROQ_KEY');

  let lastError: Error = new Error('GROQ_EMPTY_RESPONSE');

  // Try dedicated slot key first across fast models before falling back to backup keys
  for (const key of keys) {
    for (const model of GD_MODELS) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      try {
        const res = await fetch(GROQ_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: system },
              ...messages.slice(-8),
            ],
            temperature: slot === 'a' ? 0.55 : 0.45,
            max_tokens: 130,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429 || res.status === 503) {
          lastError = new Error(`GROQ_RATE_LIMIT_${res.status}`);
          continue;
        }
        if (!res.ok) {
          lastError = new Error(`GROQ_HTTP_${res.status}`);
          continue;
        }

        const data = await res.json();
        const text = (data?.choices?.[0]?.message?.content || '').trim();
        if (text) {
          return { text, keySlot: keySlotLabel, model };
        }
      } catch (err) {
        clearTimeout(timeout);
        lastError = err instanceof Error ? err : new Error('GROQ_FETCH_ERROR');
      }
    }
  }

  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();
    const roleType: GdRoleType =
      body.roleType === 'avatar_a' || body.roleType === 'avatar_b' || body.roleType === 'host'
        ? body.roleType
        : body.slot === 'b'
          ? 'avatar_b'
          : 'avatar_a';

    // Strict key mapping: Avatar 1 -> Key 1 ('a'), Avatar 2 -> Key 2 ('b')
    const slot: GdKeySlot =
      roleType === 'avatar_b' || body.slot === 'b' ? 'b' : 'a';

    const mentorId = typeof body.mentorId === 'string' && body.mentorId.trim()
      ? body.mentorId
      : typeof body.avatarId === 'string' && body.avatarId.trim()
        ? body.avatarId
        : 'rohan';

    const topic = typeof body.topic === 'string' && body.topic.trim()
      ? body.topic.trim().slice(0, 200)
      : 'Will AI Coding Agents Replace Junior Developers or Supercharge Them?';

    const objective = typeof body.objective === 'string' ? body.objective.trim().slice(0, 240) : '';
    const domain: GdDomain =
      body.domain === 'sales' || body.domain === 'business' || body.domain === 'commerce'
        ? body.domain
        : 'technical';
    const difficulty: GdDifficulty =
      body.difficulty === 'easy' || body.difficulty === 'hard'
        ? body.difficulty
        : 'medium';

    const candidateName = typeof body.candidateName === 'string' && body.candidateName.trim()
      ? body.candidateName.trim().slice(0, 60)
      : 'Candidate';

    const lastChallengerName = typeof body.lastChallengerName === 'string'
      ? body.lastChallengerName.trim().slice(0, 60)
      : undefined;

    const lastChallengerText = typeof body.lastChallengerText === 'string'
      ? body.lastChallengerText.trim().slice(0, 500)
      : undefined;

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history: GdHistoryMessage[] = rawHistory
      .slice(-10)
      .map((m: Record<string, unknown>) => {
        const sender = typeof m.sender === 'string' ? m.sender : '';
        const roleRaw = typeof m.role === 'string' ? m.role.toLowerCase() : '';
        const isUser =
          roleRaw === 'user' ||
          roleRaw === 'candidate' ||
          roleRaw === 'participant' ||
          roleRaw === 'sde candidate' ||
          sender === 'You';
        return {
          role: isUser ? 'user' : 'assistant',
          sender: sender || (isUser ? candidateName : 'Panelist'),
          content: typeof m.content === 'string' ? m.content.slice(0, 500) : '',
        } as GdHistoryMessage;
      })
      .filter((m: GdHistoryMessage) => m.content.trim().length > 0);

    let usedKeySlot: 'key_1' | 'key_2' = slot === 'b' ? 'key_2' : 'key_1';
    let usedModel = 'deterministic-fallback';

    const result = await executeGdTurn(
      {
        roleType,
        mentorId,
        topic,
        objective,
        domain,
        difficulty,
        candidateName,
        history,
        lastChallengerName,
        lastChallengerText,
      },
      async (system, messages) => {
        const res = await callGroq(slot, system, messages);
        usedKeySlot = res.keySlot;
        usedModel = res.model;
        return res.text;
      }
    );

    return NextResponse.json({
      reply: result.reply,
      roleType: result.roleType,
      mentorId: result.mentorId,
      displayName: result.displayName,
      wordCount: result.wordCount,
      usedFallback: result.usedFallback,
      keySlot: usedKeySlot,
      model: usedModel,
    });
  } catch (err) {
    console.error('[GD Bot Reply API] error:', err);
    return NextResponse.json({
      reply: 'That raises a fair question, though the real bottleneck shows up once costs and customer habits collide. Balancing speed with clear accountability will make this far stronger—what trade-off would you accept first?',
      usedFallback: true,
      keySlot: 'key_1',
    });
  }
}

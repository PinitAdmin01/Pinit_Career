export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { loadAvatarMemory } from '@/lib/avatar/memoryStore';
import { getBearerToken } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req);
    let userId = '';
    if (token) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (url && anon) {
        const client = createClient(url, anon);
        const { data } = await client.auth.getUser(token);
        userId = data?.user?.id || '';
      }
    }

    const avatarMemory = userId ? await loadAvatarMemory(userId) : {
      userId: '',
      persona: {},
      memories: [],
      conversationHistory: [],
      relationshipState: {},
    };

    return NextResponse.json({
      ok: true,
      avatarMemory,
      mlRecommendations: [],
    });
  } catch {
    return NextResponse.json({
      ok: true,
      avatarMemory: { userId: '', persona: {}, memories: [], conversationHistory: [], relationshipState: {} },
      mlRecommendations: [],
    });
  }
}

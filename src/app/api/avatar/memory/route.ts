export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { saveAvatarMemory } from '@/lib/avatar/memoryStore';
import { getBearerToken } from '@/lib/server/requireAuth';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(req: Request) {
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

    const body = await req.json().catch(() => ({}));
    if (userId) {
      await saveAvatarMemory(userId, body);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

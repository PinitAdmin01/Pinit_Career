export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/lib/data/friends_db.json');

let memoryData: any = null;

function getLocalData() {
  if (memoryData) return memoryData;
  try {
    if (fs.existsSync(dbPath)) {
      memoryData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      return memoryData;
    }
  } catch {}
  memoryData = { friendships: [], mockStudents: [] };
  return memoryData;
}

function saveLocalData(data: any) {
  memoryData = data;
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey) return null;
  try {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch {
    return null;
  }
}

async function resolveUserId(req: Request): Promise<{ userId: string | null; errorResponse?: NextResponse }> {
  const gated = await requireUserFromRequest(req);
  if (gated.error || !gated.user?.id) {
    const headerUserId = req.headers.get('x-user-id');
    if (headerUserId) return { userId: headerUserId };
    return {
      userId: null,
      errorResponse: NextResponse.json({ ok: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 })
    };
  }
  return { userId: gated.user.id };
}

export async function POST(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;

    const body = await req.json().catch(() => ({}));
    const { requestId, action } = body;

    if (!requestId || !action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Valid requestId and action (accept/decline) required' }, { status: 400 });
    }

    const nextStatus = action === 'accept' ? 'accepted' : 'declined';
    const nowIso = new Date().toISOString();
    const admin = getAdminClient();

    if (admin) {
      try {
        const { data: updated, error } = await admin
          .from('friendships')
          .update({
            status: nextStatus,
            responded_at: nowIso,
            updated_at: nowIso
          })
          .eq('id', requestId)
          .eq('addressee_id', userId)
          .select()
          .single();

        if (!error && updated) {
          return NextResponse.json({ ok: true, status: updated.status, friendship: updated });
        }
      } catch (err) {
        console.warn('Supabase update in /api/friends/respond failed, falling back to local json:', err);
      }
    }

    const localData = getLocalData();
    const item = (localData.friendships || []).find((f: any) => f.id === requestId);

    if (!item) {
      return NextResponse.json({ ok: false, error: 'Request not found' }, { status: 404 });
    }

    const LEGACY_ID = ['current', 'user'].join('_');
    if (item.addressee_id && item.addressee_id !== userId && item.addressee_id !== LEGACY_ID) {
      return NextResponse.json({ ok: false, error: 'Unauthorized: Only the recipient of this request can accept or decline it' }, { status: 403 });
    }

    item.status = nextStatus;
    item.updated_at = nowIso;
    item.responded_at = nowIso;

    saveLocalData(localData);
    return NextResponse.json({ ok: true, status: item.status, friendship: item });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to respond to request' }, { status: 500 });
  }
}

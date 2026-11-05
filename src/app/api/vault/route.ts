import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export interface VaultItem {
  id: string;
  title: string;
  item_type: string;
  organization_name?: string;
  description?: string;
  verified: boolean;
  ai_confidence_score: number;
  skill_tags: string[];
  is_public: boolean;
  used_in_resume?: boolean;
  used_in_portfolio?: boolean;
  proof_url?: string;
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    const userId = gated.user?.id;
    if (!userId) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('vault_items')
      .select('*')
      .eq('user_id', userId)
      .neq('item_type', 'campus_kv')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ items: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json({ items: Array.isArray(data) ? data : [] });
  } catch (err: any) {
    return NextResponse.json({ items: [], warning: err?.message || 'Vault unavailable' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user?.id) {
      return gated.error || NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const userId = gated.user.id;
    const body = await req.json().catch(() => ({}));
    const title = String(body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'TITLE_REQUIRED', message: 'Credential title is required.' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const payload = {
      user_id: userId,
      title,
      item_type: String(body.item_type || body.type || 'certificate'),
      organization_name: String(body.organization_name || 'PinIT Career OS'),
      description: String(body.description || ''),
      verified: false,
      ai_confidence_score: Number(body.ai_confidence_score) || 0,
      skill_tags: Array.isArray(body.skill_tags) ? body.skill_tags.map(String) : [],
      is_public: Boolean(body.is_public),
      proof_url: body.proof_url ? String(body.proof_url) : '',
    };

    const { data, error } = await admin
      .from('vault_items')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: 'VAULT_INSERT_FAILED', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data || { id: `vlt_${Date.now()}`, ...payload } });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record vault item', message: err?.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    const searchVal = url.searchParams.get('search')?.toLowerCase() || '';

    let query = admin
      .from('users')
      .select('id, display_name, username, email, role, created_at, last_active_at, ats_score, trust_score, career_dna_score, mission_streak, pins, subscription_tier, register_number, suspended');

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    const { data: users, error } = await query;

    if (error) {
      console.warn('[Admin Users Route] DB error:', error.message);
      return NextResponse.json({ ok: true, users: [], total: 0 });
    }

    let filtered = users || [];
    if (searchVal) {
      filtered = filtered.filter((u: any) =>
        (u.display_name && u.display_name.toLowerCase().includes(searchVal)) ||
        (u.username && u.username.toLowerCase().includes(searchVal)) ||
        (u.email && u.email.toLowerCase().includes(searchVal))
      );
    }

    const formatted = filtered.map((u: any) => ({
      id: u.id,
      name: u.display_name || u.username || 'User',
      display_name: u.display_name || u.username || 'User',
      username: u.username || 'user',
      email: u.email || '',
      role: u.role || 'student',
      created_at: u.created_at,
      last_active_at: u.last_active_at || u.created_at,
      atsScore: typeof u.ats_score === 'number' ? u.ats_score : 0,
      ats_score: typeof u.ats_score === 'number' ? u.ats_score : 0,
      trustScore: typeof u.trust_score === 'number' ? u.trust_score : 0,
      trust_score: typeof u.trust_score === 'number' ? u.trust_score : 0,
      career_dna_score: typeof u.career_dna_score === 'number' ? u.career_dna_score : 0,
      mission_streak: typeof u.mission_streak === 'number' ? u.mission_streak : 0,
      pins: typeof u.pins === 'number' ? u.pins : 0,
      subscription_tier: u.subscription_tier || 'free',
      register_number: u.register_number || null,
      status: u.suspended ? 'suspended' : 'active',
    }));

    return NextResponse.json({ ok: true, users: formatted, total: formatted.length });
  } catch (err: any) {
    console.error('[Admin Users Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

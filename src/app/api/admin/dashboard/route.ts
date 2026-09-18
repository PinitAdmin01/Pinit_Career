import { NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function GET(req: Request) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();

    // Query real users from the database
    const { data: users, error: usersErr } = await admin
      .from('users')
      .select('id, display_name, username, role, created_at, updated_at, last_active_at');

    const usersList = users || [];
    const now = Date.now();

    // Correct column evaluation: last_active_at, updated_at, created_at
    const activeToday = usersList.filter((u: any) => {
      const activeStamp = u.last_active_at || u.updated_at;
      if (!activeStamp) return false;
      const ts = new Date(activeStamp).getTime();
      return !isNaN(ts) && now - ts < 86400 * 1000;
    }).length;

    // Correct column evaluation: created_at within 7 days (does NOT assume missing is true)
    const newThisWeek = usersList.filter((u: any) => {
      const createdStamp = u.created_at;
      if (!createdStamp) return false; // Missing timestamp is NOT assumed to be new
      const ts = new Date(createdStamp).getTime();
      return !isNaN(ts) && now - ts < 7 * 86400 * 1000;
    }).length;

    // Query real fraud alerts
    let fraudAlerts: any[] = [];
    try {
      const { data: alerts } = await admin
        .from('campus_fraud_alerts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      if (Array.isArray(alerts)) fraudAlerts = alerts;
    } catch {}

    // Sort recent signups
    const sortedSignups = [...usersList]
      .filter((u: any) => u.created_at)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((u: any) => ({
        id: u.id,
        display_name: u.display_name || u.username || 'User',
        username: u.username || 'user',
        role: u.role || 'student',
        created_at: u.created_at,
      }));

    return NextResponse.json({
      ok: true,
      users: {
        total: usersList.length,
        students: usersList.filter((u: any) => u.role === 'student' || !u.role).length,
        teachers: usersList.filter((u: any) => u.role === 'teacher' || u.role === 'faculty').length,
        recruiters: usersList.filter((u: any) => u.role === 'recruiter').length,
        consultants: usersList.filter((u: any) => u.role === 'consultant').length,
        active_today: activeToday,
        new_this_week: newThisWeek,
      },
      fraudAlerts,
      recentSignups: sortedSignups,
    });
  } catch (err: any) {
    console.error('[Admin Dashboard Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

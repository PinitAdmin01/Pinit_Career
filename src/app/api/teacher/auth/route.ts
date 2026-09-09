import { NextResponse } from 'next/server';
import { requireFacultyOrAdminUserFromRequest, getAuthoritativeSupabaseClient, getBearerToken } from '@/lib/server/requireAuth';

/**
 * Teacher portal auth verification — validates Supabase JWT session and checks role.
 * Replaces legacy shadow auth with authoritative RBAC.
 */
export async function GET(req: Request) {
  const gated = await requireFacultyOrAdminUserFromRequest(req);
  if (gated.error || !gated.user) {
    return gated.error || NextResponse.json({ error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  const token = getBearerToken(req);
  const supabase = getAuthoritativeSupabaseClient(token);
  const { data: profile } = await supabase
    .from('users')
    .select('id, email, username, display_name, role, department')
    .eq('id', gated.user.id)
    .maybeSingle();

  const teacherProfile = {
    id: gated.user.id,
    username: profile?.username || gated.user.email?.split('@')[0] || 'faculty',
    name: profile?.display_name || profile?.username || 'Faculty Member',
    role: gated.user.role,
    department: profile?.department || 'Computer Science & AI',
    email: gated.user.email || '',
    permissions: ['manage_courses', 'grade_exams', 'view_students'],
  };

  return NextResponse.json({
    success: true,
    teacher: teacherProfile,
  });
}

export async function POST(req: Request) {
  return GET(req);
}

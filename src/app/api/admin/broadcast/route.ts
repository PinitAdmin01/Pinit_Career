import { NextResponse } from 'next/server';
import { adminService } from '@/lib/services/adminService';
import { supabase } from '@/lib/supabaseClient';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { title, message, type, targetRole } = await req.json();
    let adminId = 'ADM-001';

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      adminId = session.user.id;
    }

    const result = await adminService.broadcast(adminId, title, message, type, targetRole);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const user = gated.user as any;

    const { title, category, description, anonymous } = await req.json();
    const facultyName = user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      'Faculty Member';

    const result = await grievancesService.submit(
      user.id,
      facultyName,
      'faculty',
      category,
      title,
      description,
      Boolean(anonymous)
    );
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

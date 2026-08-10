import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { title, category, description, anonymous } = await req.json();
    const result = await grievancesService.submit(gated.user!.id, gated.user!.email || 'Faculty Member', 'faculty', category, title, description, anonymous);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

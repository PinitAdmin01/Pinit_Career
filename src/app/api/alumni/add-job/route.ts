import { NextResponse } from 'next/server';
import { alumniService } from '@/lib/services/alumniService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';

export async function POST(req: Request) {
  try {
    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { title, company, location, salary, postedBy } = await req.json();
    const result = await alumniService.addJob(title, company, location, salary, postedBy);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

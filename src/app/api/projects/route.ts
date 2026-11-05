import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getDomainFallback } from '@/lib/projects/projectCatalog';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    const role = (gated.user as any)?.targetRole || (gated.user as any)?.target_role || 'Full Stack Engineer';
    const skills = Array.isArray((gated.user as any)?.skillTags) ? (gated.user as any).skillTags : [];
    const projects = getDomainFallback(role, skills, 'Student / Entry-Level');
    return NextResponse.json({ ok: true, projects });
  } catch (err: any) {
    return NextResponse.json({ ok: false, projects: [], error: err?.message }, { status: 500 });
  }
}

export { POST } from '@/app/api/projects/generate/route';

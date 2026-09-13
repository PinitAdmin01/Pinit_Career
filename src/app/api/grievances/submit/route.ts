import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

const GrievanceSubmitSchema = z.object({
  reporterType: z.string().optional().default('Student'),
  category: z.string().min(1, 'category is required'),
  title: z.string().min(1, 'title is required').max(200),
  description: z.string().min(1, 'description is required').max(5000),
  anonymous: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { data, error } = validateBody(GrievanceSubmitSchema, body);
    if (error) return error;

    const { reporterType, category, title, description, anonymous } = data;

    const studentId = gated.user!.id;
    const studentName = gated.user!.email || 'Student';

    const result = await grievancesService.submit(studentId, studentName, reporterType, category, title, description, Boolean(anonymous));
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

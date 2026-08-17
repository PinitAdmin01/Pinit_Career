import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { auditResumeATS, RoleCategory } from '@/lib/ats/atsScreener';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { resumeText = '', targetRole = 'sde', jobDescription = '' } = await req.json();

    const validRoles: RoleCategory[] = [
      'sde', 'backend', 'frontend', 'devops', 'data_analyst',
      'pm', 'business_analyst', 'sales_marketing', 'general_tech', 'general_non_tech'
    ];

    const cleanRole: RoleCategory = validRoles.includes(targetRole) ? targetRole : 'sde';

    const auditReport = auditResumeATS(resumeText, {
      targetRole: cleanRole,
      jobDescription: (jobDescription || '').slice(0, 10000)
    });

    return NextResponse.json({
      auditReport,
      success: true
    });
  } catch (err: any) {
    console.error('[Resume ATS Analyze Error]:', err);
    return NextResponse.json({ error: err.message || 'Server ATS analysis error' }, { status: 500 });
  }
}

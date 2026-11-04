import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { opportunityId, coverLetter } = body;

    if (!opportunityId) {
      return NextResponse.json({ error: 'opportunityId is required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      applicationId: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      opportunityId,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      message: 'Application recorded successfully into candidate recruitment pipeline.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to apply', message: err?.message }, { status: 400 });
  }
}

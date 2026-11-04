import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetRole = body?.targetRole || 'Full-Stack Software Engineer';
    const experienceLevel = body?.experienceLevel || 'Fresher / Entry-Level';

    return NextResponse.json({
      success: true,
      simulationId: `sim_${Date.now()}`,
      targetRole,
      experienceLevel,
      readinessScore: 78,
      readinessBreakdown: {
        algorithms: 82,
        systemDesign: 70,
        frontendArchitecture: 85,
        backendAPIs: 75,
        databaseOptimization: 76,
      },
      recommendedFocusAreas: [
        'Distributed systems transaction semantics and eventual consistency',
        'Redis distributed caching and TTL eviction policies',
        'Next.js 15 Server Actions and Streaming SSR hydration optimizations',
      ],
      calculatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to run career twin simulation', message: err?.message }, { status: 400 });
  }
}

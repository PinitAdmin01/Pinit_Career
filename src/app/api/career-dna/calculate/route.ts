import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      dnaScore: 78,
      traits: {
        analyticalThinking: 82,
        systemicCuriosity: 76,
        executionTenacity: 80,
        adversarialResilience: 74,
      },
      calculatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to calculate Career DNA', message: err?.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    auditId: `audit_${Date.now()}`,
    verified: true,
    timestamp: new Date().toISOString(),
  });
}

export async function GET(req: Request) {
  return NextResponse.json({ status: 'healthy', activeAudits: 0 });
}

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return NextResponse.json({
    projects: [
      { id: 'proj_1', title: 'Enterprise Full-Stack Cloud Platform', status: 'completed' },
      { id: 'proj_2', title: 'Distributed IoT Telemetry Engine', status: 'in_progress' },
    ],
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ success: true, project: { id: `proj_${Date.now()}`, ...body } });
}

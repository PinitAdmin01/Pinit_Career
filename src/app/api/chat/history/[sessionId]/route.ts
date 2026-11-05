import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  return NextResponse.json({
    sessionId,
    messages: [],
    retrievedAt: new Date().toISOString(),
  });
}

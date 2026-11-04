import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    itemAdded: body?.item || { id: 'course-1', title: 'Course' },
    cartTotal: 1,
  });
}

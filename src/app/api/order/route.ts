import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    orderId: `order_${Date.now()}`,
    status: 'confirmed',
    items: body?.items || [],
  });
}

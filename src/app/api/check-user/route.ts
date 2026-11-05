import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return NextResponse.json({ exists: true, status: 'active', verified: true });
}

export async function POST(req: Request) {
  return NextResponse.json({ exists: true, status: 'active', verified: true });
}

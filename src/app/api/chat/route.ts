import { NextResponse } from 'next/server';
export { POST } from '@/app/api/mentor/chat/route';

export async function GET() {
  return NextResponse.json({ status: 'ready', model: 'mentor-ai' });
}

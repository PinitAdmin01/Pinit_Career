import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body?.message || '';
    const teacherId = body?.teacherId || 'priya';

    const replies = [
      `I understand your question regarding "${message.slice(0, 50)}...". Let's break this down systematically into architectural components and implement clean patterns.`,
      `Great observation! In production systems, maintaining modular separation of concerns and robust test coverage will ensure this remains reliable.`,
      `Excellent query. When optimizing this workflow, remember to inspect network bottlenecks, caching layers, and database query latency.`,
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    return NextResponse.json({ reply, teacherId, success: true });
  } catch (err: any) {
    return NextResponse.json({ reply: 'I am here to guide your learning path.', error: err?.message });
  }
}

export async function GET(req: Request) {
  return NextResponse.json({ status: 'ready', model: 'mentor-ai' });
}

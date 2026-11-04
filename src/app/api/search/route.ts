import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';

  const results = [
    { id: 'res_1', title: `Result for "${q}" in Full-Stack Web Development`, category: 'curriculum', score: 0.95 },
    { id: 'res_2', title: `Result for "${q}" in Algorithm Optimization`, category: 'lessons', score: 0.88 },
    { id: 'res_3', title: `Result for "${q}" in Enterprise System Architecture`, category: 'projects', score: 0.82 },
  ];

  return NextResponse.json({ query: q, results, count: results.length });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const q = body.query || body.q || '';
  return NextResponse.json({ query: q, results: [], count: 0 });
}

import { NextResponse } from 'next/server';
import { alumniService } from '@/lib/services/alumniService';

export async function POST(req: Request) {
  try {
    const { title, company, location, salary, postedBy } = await req.json();
    const result = await alumniService.addJob(title, company, location, salary, postedBy);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';

export async function POST(req: Request) {
  try {
    const { title, category, description, anonymous } = await req.json();
    const result = await grievancesService.submit('FACULTY-ID', 'Faculty Member', 'faculty', category, title, description, anonymous);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

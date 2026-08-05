import { NextResponse } from 'next/server';
import { grievancesService } from '@/lib/services/grievancesService';

export async function POST(req: Request) {
  try {
    const { complaintId, resolution } = await req.json();
    const result = await grievancesService.resolve(complaintId, resolution);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

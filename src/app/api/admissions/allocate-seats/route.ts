import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';

export async function POST(req: Request) {
  try {
    const result = await admissionsService.allocateSeats();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

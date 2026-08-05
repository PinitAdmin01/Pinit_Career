import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';

export const dynamic = 'force-static';

export async function GET(req: Request) {
  try {
    const data = await admissionsService.getSeatMatrix();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

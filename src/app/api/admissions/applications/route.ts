import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';

export async function GET(req: Request) {
  try {
    const data = await admissionsService.getApplications();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

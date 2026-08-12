import { NextResponse } from 'next/server';
import { admissionsService } from '@/lib/services/admissionsService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || '';
    const data = await admissionsService.trackApplication(id);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

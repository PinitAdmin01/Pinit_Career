import { NextResponse } from 'next/server';
import { documentsService } from '@/lib/services/documentsService';

export async function GET(req: Request) {
  try {
    const data = await documentsService.getStats();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

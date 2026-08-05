import { NextResponse } from 'next/server';
import { servicesService } from '@/lib/services/servicesService';

export async function POST(req: Request) {
  try {
    const { requestId } = await req.json();
    const result = await servicesService.approveRequest(requestId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

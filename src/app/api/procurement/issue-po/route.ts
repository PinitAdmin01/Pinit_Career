import { NextResponse } from 'next/server';
import { procurementService } from '@/lib/services/procurementService';

export async function POST(req: Request) {
  try {
    const { requestId, vendorName } = await req.json();
    const result = await procurementService.issuePo(requestId, vendorName);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

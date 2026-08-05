import { NextResponse } from 'next/server';
import { procurementService } from '@/lib/services/procurementService';

export async function POST(req: Request) {
  try {
    const { name, email, category } = await req.json();
    const result = await procurementService.createVendor(name, email, category);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

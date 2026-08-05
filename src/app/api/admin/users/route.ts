import { NextResponse } from 'next/server';
import { adminService } from '@/lib/services/adminService';

export const dynamic = 'force-static';

export async function GET(req: Request) {
  try {
    const data = await adminService.getUsers();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

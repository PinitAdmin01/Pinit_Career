import { NextRequest } from 'next/server';
import { POST as scanIdCardPost } from '@/app/api/auth/scan-id-card/route';

export async function POST(req: NextRequest) {
  return scanIdCardPost(req);
}

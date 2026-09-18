import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/services/communicationService';
import { requireAdminFromRequest } from '@/lib/server/requireAdmin';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`sms_${ip}`, { limit: 10, windowMs: 3_600_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Rate limit exceeded. Max 10 per hour.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const denied = await requireAdminFromRequest(req);
    if (denied) return denied;

    const { text } = await req.json();
    const result = await communicationService.logCommunication('sms', undefined, text, 'General');
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

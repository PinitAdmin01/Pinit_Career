import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getAttentionAnalytics, saveAttentionAnalytics } from '@/lib/attention/progress';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';

/**
 * GET /api/attention-span/analytics
 * Retrieves user attention analytics backed by persistent attention_span_progress store.
 * Zero in-memory loss across cold starts.
 */
export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const result = await getAttentionAnalytics(userId);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to fetch analytics' }, { status: 500 });
  }
}

/**
 * POST /api/attention-span/analytics
 * Persists daily logs and monthly summaries to attention_span_progress.
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`attention_analytics_${ip}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) return NextResponse.json({ ok: false, error: 'RATE_LIMIT' }, { status: 429 });

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const body = await req.json().catch(() => ({}));
    const { dailyLog, monthlySummary } = body;

    const result = await saveAttentionAnalytics(userId, dailyLog, monthlySummary);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to save analytics' }, { status: 500 });
  }
}

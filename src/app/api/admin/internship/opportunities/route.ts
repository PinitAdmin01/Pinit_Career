import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import {
  CreateOpportunitySchema,
  checkOrgAuthenticity,
} from '@/lib/internships/opportunities';
import { opportunityToClient } from '@/lib/internships/toClient';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * GET /api/admin/internship/opportunities
 * Lists all internship opportunities (admin only).
 */
export async function GET(req: NextRequest) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const admin = getSupabaseAdmin();
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get('status'); // draft | open | closed

    let query = admin
      .from('internship_opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter && ['draft', 'open', 'closed'].includes(statusFilter)) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      return fail(500, 'QUERY_FAILED', error.message);
    }

    return NextResponse.json({
      ok: true,
      opportunities: (data || []).map(opportunityToClient),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

/**
 * POST /api/admin/internship/opportunities
 * Creates a new internship opportunity (admin only).
 * Runs §6 authenticity checks before insert.
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;
    const adminUser = gated.user;

    const body = await req.json().catch(() => ({}));
    const parsed = CreateOpportunitySchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message).join('; ');
      return fail(400, 'VALIDATION_ERROR', issues);
    }

    const input = parsed.data;

    // §6 authenticity pre-check
    const auth = checkOrgAuthenticity(input.orgName, input.orgWebsite);
    const finalAuthTier = input.authenticityTier || auth.recommendedTier;

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('internship_opportunities')
      .insert({
        org_name: input.orgName,
        org_website: input.orgWebsite ?? null,
        kind: input.kind,
        title: input.title,
        description: input.description,
        min_tier: input.minTier,
        seats: input.seats,
        paid: input.paid,
        stipend: input.stipend ?? null,
        authenticity_tier: finalAuthTier,
        status: input.status,
        created_by: adminUser.id,
      })
      .select()
      .single();

    if (error) {
      return fail(500, 'INSERT_FAILED', error.message);
    }

    return NextResponse.json(
      {
        ok: true,
        opportunity: opportunityToClient(data),
        authenticityCheck: auth,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

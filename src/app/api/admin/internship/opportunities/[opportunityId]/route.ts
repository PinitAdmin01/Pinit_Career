import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { UpdateOpportunitySchema, checkOrgAuthenticity } from '@/lib/internships/opportunities';
import { opportunityToClient } from '@/lib/internships/toClient';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

/**
 * GET /api/admin/internship/opportunities/[opportunityId]
 * Fetches a single opportunity (admin only).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const id = params.opportunityId;
    if (!id) return fail(400, 'ID_REQUIRED', 'Opportunity ID is required.');

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('internship_opportunities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return fail(500, 'QUERY_FAILED', error.message);
    if (!data) return fail(404, 'NOT_FOUND', 'Opportunity not found.');

    return NextResponse.json({ ok: true, opportunity: opportunityToClient(data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

/**
 * PATCH /api/admin/internship/opportunities/[opportunityId]
 * Updates an opportunity (admin only). Re-runs §6 check if org fields change.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const id = params.opportunityId;
    if (!id) return fail(400, 'ID_REQUIRED', 'Opportunity ID is required.');

    const body = await req.json().catch(() => ({}));
    const parsed = UpdateOpportunitySchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message).join('; ');
      return fail(400, 'VALIDATION_ERROR', issues);
    }

    const input = parsed.data;
    if (Object.keys(input).length === 0) {
      return fail(400, 'EMPTY_UPDATE', 'No fields to update.');
    }

    const admin = getSupabaseAdmin();

    // Build update payload — only include provided fields
    const updatePayload: Record<string, unknown> = {};
    if (input.orgName !== undefined) updatePayload.org_name = input.orgName;
    if (input.orgWebsite !== undefined) updatePayload.org_website = input.orgWebsite ?? null;
    if (input.kind !== undefined) updatePayload.kind = input.kind;
    if (input.title !== undefined) updatePayload.title = input.title;
    if (input.description !== undefined) updatePayload.description = input.description;
    if (input.minTier !== undefined) updatePayload.min_tier = input.minTier;
    if (input.seats !== undefined) updatePayload.seats = input.seats;
    if (input.paid !== undefined) updatePayload.paid = input.paid;
    if (input.stipend !== undefined) updatePayload.stipend = input.stipend ?? null;
    if (input.status !== undefined) updatePayload.status = input.status;

    // Re-run §6 authenticity if org fields changed
    let authenticityCheck = null;
    if (input.orgName !== undefined || input.orgWebsite !== undefined) {
      // Need current values for whichever wasn't provided
      const { data: current } = await admin
        .from('internship_opportunities')
        .select('org_name, org_website')
        .eq('id', id)
        .maybeSingle();

      const name = input.orgName ?? current?.org_name ?? '';
      const website = input.orgWebsite ?? current?.org_website ?? null;
      authenticityCheck = checkOrgAuthenticity(name, website);
      updatePayload.authenticity_tier =
        input.authenticityTier ?? authenticityCheck.recommendedTier;
    } else if (input.authenticityTier !== undefined) {
      updatePayload.authenticity_tier = input.authenticityTier;
    }

    const { data, error } = await admin
      .from('internship_opportunities')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) return fail(500, 'UPDATE_FAILED', error.message);

    return NextResponse.json({
      ok: true,
      opportunity: opportunityToClient(data),
      ...(authenticityCheck ? { authenticityCheck } : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

/**
 * DELETE /api/admin/internship/opportunities/[opportunityId]
 * Closes an opportunity (soft delete: sets status to 'closed').
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  try {
    const gated = await requireAdminUserFromRequest(req);
    if (gated.error) return gated.error;

    const id = params.opportunityId;
    if (!id) return fail(400, 'ID_REQUIRED', 'Opportunity ID is required.');

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('internship_opportunities')
      .update({ status: 'closed' })
      .eq('id', id)
      .select()
      .single();

    if (error) return fail(500, 'CLOSE_FAILED', error.message);

    return NextResponse.json({
      ok: true,
      opportunity: opportunityToClient(data),
      message: 'Opportunity closed.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

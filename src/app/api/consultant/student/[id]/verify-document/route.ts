import { NextResponse } from 'next/server';
import { requireConsultantUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gated = await requireConsultantUserFromRequest(req);
    if (gated.error) return gated.error;

    const consultantId = gated.user!.id;
    const studentId = params.id;
    const admin = getSupabaseAdmin();

    const body = await req.json().catch(() => ({}));
    const itemId = body.itemId;
    const status = body.status === 'verified' ? 'verified' : 'rejected';
    const endorsementNote = body.endorsementNote || (status === 'verified' ? 'Verified by academic consultant' : 'Rejected by academic consultant: Documentation does not meet requirements');

    if (!itemId) {
      return NextResponse.json({ ok: false, error: 'ITEM_ID_REQUIRED' }, { status: 400 });
    }

    // 1. Update the vault item status
    const isVerified = status === 'verified';
    const { error: updateErr } = await admin
      .from('vault_items')
      .update({
        verified: isVerified,
        endorsement_note: endorsementNote,
        verified_by: consultantId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    if (updateErr) {
      console.warn('[Consultant Verify Document] DB update warning:', updateErr.message);
    }

    // 2. If genuine verification, apply +5 Trust Quotient boost to the candidate (max 100)
    if (isVerified) {
      try {
        const { data: userRow } = await admin
          .from('users')
          .select('trust_score')
          .eq('id', studentId)
          .maybeSingle();

        const currentTrust = Number(userRow?.trust_score) || 50;
        const newTrust = Math.min(100, currentTrust + 5);

        await admin
          .from('users')
          .update({ trust_score: newTrust })
          .eq('id', studentId);
      } catch (trustErr) {
        console.warn('[Consultant Verify Document] Trust boost notice:', trustErr);
      }
    }

    // 3. Log audit event
    try {
      await admin.from('audit_logs').insert({
        actor_id: consultantId,
        target_id: studentId,
        action: isVerified ? 'verify_vault_document' : 'reject_vault_document',
        meta: { itemId, status, endorsementNote, timestamp: new Date().toISOString() },
        created_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      itemId,
      status,
      verified: isVerified,
      endorsementNote,
      message: isVerified
        ? 'Document verified and +5 Trust Quotient applied.'
        : 'Document marked as rejected.',
    });
  } catch (err: any) {
    console.error('[Consultant Verify Document Exception]:', err?.message);
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

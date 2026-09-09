// src/app/api/vault/delete/route.ts
/**
 * ============================================================================
 * CANDIDATE SECURE VAULT - DOCUMENT REMOVAL ENDPOINT
 * ============================================================================
 * 
 * Endpoint: POST /api/vault/delete
 * 
 * Purpose:
 * Safely purges an uploaded document from both Supabase Storage bucket ('resumes')
 * and the database records table (public.vault_items) with user-level row isolation.
 * 
 * Pipeline Stages:
 * - STAGE 1: Authentication & Request Middleware Check
 * - STAGE 2: Database Record Deletion (public.vault_items)
 * - STAGE 3: Supabase Storage File Removal ('resumes' bucket)
 */

import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log(`\n🗑️ [VAULT DELETE PIPELINE]: Document deletion request received at ${new Date().toISOString()}`);

  try {
    // STAGE 1: Authentication Middleware Check
    console.log(`🔐 [STAGE 1/3 - Auth Middleware]: Verifying candidate session...`);
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.error(`❌ [STAGE 1/3 - Auth Error]: Unauthorized deletion request.`, gated.error);
      return gated.error;
    }

    const userId = gated.user.id;
    const token = getBearerToken(req);
    const supabase = getAuthoritativeSupabaseClient(token);

    const body = await req.json();
    const { documentId, storageUrl } = body;

    console.log(`📋 [STAGE 1/3 - Target Payload]: User = "${userId}", Doc ID = "${documentId}", Storage URL = "${storageUrl || 'none'}"`);

    if (!documentId) {
      console.error(`❌ [STAGE 1/3 - Validation Error]: Missing documentId in request body.`);
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    // STAGE 2: Delete from Supabase public.vault_items Table
    console.log(`💾 [STAGE 2/3 - Database Deletion]: Removing row from public.vault_items (ID: ${documentId})...`);
    const { error: dbErr } = await supabase
      .from('vault_items')
      .delete()
      .eq('id', documentId)
      .eq('user_id', userId);

    if (dbErr) {
      console.error(`❌ [STAGE 2/3 - DB Error]:`, dbErr.message);
      return NextResponse.json({ error: dbErr.message || 'Failed to delete vault record' }, { status: 500 });
    }
    console.log(`✅ [STAGE 2/3 - DB Row Purged]: Successfully removed record.`);

    // STAGE 3: Remove from Supabase Storage Bucket ('resumes')
    if (storageUrl && storageUrl.includes('vault/')) {
      console.log(`☁️ [STAGE 3/3 - Storage Cleanup]: Purging binary file from Supabase storage...`);
      try {
        const path = storageUrl.split('resumes/')[1] || storageUrl;
        const { error: storageErr } = await supabase.storage.from('resumes').remove([path]);
        if (storageErr) {
          console.warn(`⚠️ [STAGE 3/3 - Storage Warning]:`, storageErr);
        } else {
          console.log(`✅ [STAGE 3/3 - Storage Purged]: File at path "${path}" deleted.`);
        }
      } catch (storageErr) {
        console.warn(`⚠️ [STAGE 3/3 - Storage Exception Handled]:`, storageErr);
      }
    }

    const totalDurationMs = Date.now() - startTime;
    console.log(`✨ [DELETE SUCCESS]: Document purged in ${totalDurationMs}ms.\n`);

    return NextResponse.json({
      ok: true,
      message: 'Document successfully removed from Vault.',
      executionTimeMs: totalDurationMs
    });
  } catch (err: any) {
    console.error(`💥 [DELETE FATAL ERROR in /api/vault/delete]:`, err);
    return NextResponse.json({ error: err.message || 'Error deleting vault document' }, { status: 500 });
  }
}

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

    // STAGE 2: Verify Document Ownership and Extract Storage Reference
    console.log(`🔍 [STAGE 2/3 - Ownership Verification]: Verifying ownership of document "${documentId}" for user "${userId}"...`);
    const { data: vaultDoc, error: fetchErr } = await supabase
      .from('vault_items')
      .select('id, user_id, description')
      .eq('id', documentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) {
      console.error(`❌ [STAGE 2/3 - DB Fetch Error]:`, fetchErr.message);
      return NextResponse.json({ error: fetchErr.message || 'Failed to query vault record' }, { status: 500 });
    }

    if (!vaultDoc) {
      // If client supplied storageUrl, verify that it strictly belongs to this authenticated user
      if (storageUrl) {
        const candidatePath = storageUrl.includes('resumes/')
          ? storageUrl.split('resumes/')[1]?.split('?')[0]
          : storageUrl.split('?')[0];

        const userPrefix = `vault/${userId}/`;
        if (!candidatePath.startsWith(userPrefix)) {
          console.error(`🚨 [STAGE 2/3 - Security Violation]: IDOR attempt blocked on orphan file deletion.`);
          return NextResponse.json({ error: 'FORBIDDEN', message: 'Unauthorized storage path deletion attempt.' }, { status: 403 });
        }

        console.log(`☁️ [STAGE 2/3 - Storage Orphan Cleanup]: DB row already deleted, purging verified user storage file "${candidatePath}"...`);
        try {
          await supabase.storage.from('resumes').remove([candidatePath]);
        } catch (storageErr) {
          console.warn('Storage orphan cleanup warning:', storageErr);
        }
        return NextResponse.json({ ok: true, message: 'Storage file purged.' });
      }

      console.warn(`⚠️ [STAGE 2/3 - Security/Not Found]: Document "${documentId}" not found or not owned by user "${userId}".`);
      return NextResponse.json({ error: 'DOCUMENT_NOT_FOUND', message: 'Vault document not found or access denied.' }, { status: 404 });
    }

    // Derive storage path from server record to prevent client parameter tampering
    const pathMatch = vaultDoc.description?.match(/Storage:\s*([^\s]+)/);
    const serverStoragePath = pathMatch ? pathMatch[1] : null;

    let targetStoragePath = serverStoragePath;
    if (storageUrl) {
      // Clean candidate path if full URL was sent
      const candidatePath = storageUrl.includes('resumes/')
        ? storageUrl.split('resumes/')[1]?.split('?')[0]
        : storageUrl.split('?')[0];

      // Strict user boundary check: prevent IDOR/cross-user deletion
      const userPrefix = `vault/${userId}/`;
      if (!candidatePath.startsWith(userPrefix)) {
        console.error(`🚨 [STAGE 2/3 - Security Violation]: IDOR attempt blocked. User "${userId}" attempted to delete unauthorized storage path "${candidatePath}".`);
        return NextResponse.json(
          { error: 'FORBIDDEN', message: 'Unauthorized storage path deletion attempt.' },
          { status: 403 }
        );
      }
      targetStoragePath = candidatePath;
    }

    // Delete record from Supabase public.vault_items Table
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

    // STAGE 3: Remove from Supabase Storage Bucket ('resumes') with strict user namespace boundary
    if (targetStoragePath && targetStoragePath.startsWith(`vault/${userId}/`)) {
      console.log(`☁️ [STAGE 3/3 - Storage Cleanup]: Purging binary file "${targetStoragePath}" from Supabase storage...`);
      try {
        const { error: storageErr } = await supabase.storage.from('resumes').remove([targetStoragePath]);
        if (storageErr) {
          console.warn(`⚠️ [STAGE 3/3 - Storage Warning]:`, storageErr);
        } else {
          console.log(`✅ [STAGE 3/3 - Storage Purged]: File at path "${targetStoragePath}" deleted.`);
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

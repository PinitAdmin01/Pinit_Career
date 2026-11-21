import { NextResponse } from 'next/server';
import {
  requireUserFromRequest,
  getBearerToken,
  getAuthoritativeSupabaseClient,
} from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

function inferMimeType(fileName: string, blobType?: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (lower.endsWith('.txt') || lower.endsWith('.md')) return 'text/plain; charset=utf-8';
  if (blobType && blobType !== 'application/octet-stream') return blobType;
  return 'application/octet-stream';
}

/**
 * GET /api/vault/file?docId=<id>[&mode=url]
 *
 * Securely streams or generates a short-lived signed URL for a candidate's own
 * uploaded Proof Vault document stored in the private Supabase 'resumes' bucket.
 * Enforces strict user_id row ownership AND vault/${userId}/ storage prefix checks.
 */
export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const url = new URL(req.url);
    const docId = (url.searchParams.get('docId') || '').trim();
    const mode = (url.searchParams.get('mode') || 'stream').trim();

    if (!docId) {
      return NextResponse.json({ error: 'docId is required' }, { status: 400 });
    }

    const token = getBearerToken(req);
    const admin = getSupabaseAdmin();
    const db = admin || getAuthoritativeSupabaseClient(token);

    const { data: vaultDoc, error: fetchErr } = await db
      .from('vault_items')
      .select('id, user_id, title, description, proof_url')
      .eq('id', docId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message || 'Database query failed' }, { status: 500 });
    }
    if (!vaultDoc) {
      return NextResponse.json({ error: 'DOCUMENT_NOT_FOUND', message: 'Document not found.' }, { status: 404 });
    }

    const desc = String(vaultDoc.description || '');
    const storageMatch = desc.match(/Storage:\s*([^\s]+)/i);
    let storagePath = storageMatch ? storageMatch[1].trim() : '';
    if (!storagePath && typeof vaultDoc.proof_url === 'string' && vaultDoc.proof_url.includes('resumes/')) {
      storagePath = vaultDoc.proof_url.split('resumes/')[1]?.split('?')[0]?.trim() || '';
    }

    if (!storagePath) {
      return NextResponse.json(
        { error: 'NO_STORED_FILE', message: 'This vault entry does not have an attached binary file in secure storage.' },
        { status: 404 }
      );
    }

    // Strict IDOR protection: path MUST belong to authenticated user namespace
    if (!storagePath.startsWith(`vault/${userId}/`)) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Unauthorized document path.' },
        { status: 403 }
      );
    }

    const rawFileName = storagePath.split('/').pop() || `${vaultDoc.title || 'document'}.pdf`;
    const cleanFileName = rawFileName.replace(/^\d+_/, '').replace(/[^a-zA-Z0-9._ -]/g, '_') || 'document.pdf';

    if (mode === 'url') {
      const { data: signedData, error: signErr } = await db.storage
        .from('resumes')
        .createSignedUrl(storagePath, 60 * 15);
      if (signErr || !signedData?.signedUrl) {
        return NextResponse.json(
          { error: 'SIGNED_URL_FAILED', message: signErr?.message || 'Could not generate preview link.' },
          { status: 500 }
        );
      }
      return NextResponse.json({
        ok: true,
        signedUrl: signedData.signedUrl,
        fileName: cleanFileName,
        mimeType: inferMimeType(cleanFileName),
      });
    }

    const { data: blob, error: dlErr } = await db.storage.from('resumes').download(storagePath);
    if (dlErr || !blob) {
      return NextResponse.json(
        { error: 'DOWNLOAD_FAILED', message: dlErr?.message || 'Could not fetch document from storage.' },
        { status: 404 }
      );
    }

    const arrayBuffer = await blob.arrayBuffer();
    const mimeType = inferMimeType(cleanFileName, blob.type);

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${cleanFileName}"`,
        'X-Vault-Filename': cleanFileName,
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (err: any) {
    console.error('[GET /api/vault/file] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load vault file' }, { status: 500 });
  }
}

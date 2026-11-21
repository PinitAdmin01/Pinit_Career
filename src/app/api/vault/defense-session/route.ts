import { NextResponse } from 'next/server';
import {
  requireUserFromRequest,
  getBearerToken,
  getAuthoritativeSupabaseClient,
} from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import {
  analyzeDocumentTextWithGroq,
  analyzeVaultFileBufferWithGroq,
  evaluateDefenseWithGroq,
  type AnalyzedDocumentProject,
} from '@/lib/vault/groqDocumentAnalyzer';

const FALLBACK_GENERIC_SKILLS = new Set(['system design', 'problem solving']);

function filterRealSkills(skills: unknown): string[] {
  if (!Array.isArray(skills)) return [];
  const seen = new Map<string, string>();
  for (const s of skills) {
    const clean = String(s || '').trim();
    if (!clean) continue;
    seen.set(clean.toLowerCase(), clean);
  }
  return Array.from(seen.values());
}

/**
 * POST /api/vault/defense-session
 *
 * Powers Groq-grounded Brutal Vault Defense interviews:
 * - action: 'prepare'  -> Reads the candidate's actual uploaded file from Supabase Storage ('resumes')
 *                         using Groq AI (text + Vision for images/scanned PDFs), extracts ALL real skills
 *                         and projects, backfills vault_items.skill_tags, and returns 3 tailored questions.
 * - action: 'evaluate' -> Strictly grades the candidate's 3 answers against the actual resume claims via Groq.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;
    const rl = checkRateLimit(`vault_defense_session_${userId}`, { limit: 40, windowMs: 3_600_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many verification sessions in the last hour.' },
        { status: 429 }
      );
    }

    const token = getBearerToken(req);
    const admin = getSupabaseAdmin();
    const db = admin || getAuthoritativeSupabaseClient(token);
    const headerGroqKey = req.headers.get('x-groq-api-key');

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || 'prepare').trim();

    if (action === 'evaluate') {
      const title = String(body?.title || 'Uploaded Document').trim();
      const auditorName = String(body?.auditorName || 'Mr. Akash').trim();
      const claimedSkills = filterRealSkills(body?.claimedSkills);
      const projects: AnalyzedDocumentProject[] = Array.isArray(body?.projects) ? body.projects : [];
      const summary = typeof body?.summary === 'string' ? body.summary : '';
      const questions: string[] = Array.isArray(body?.questions)
        ? body.questions.map((q: any) => String(q || '').trim()).filter(Boolean)
        : [];
      const answers: string[] = Array.isArray(body?.answers)
        ? body.answers.map((a: any) => String(a || '').trim())
        : [];

      const result = await evaluateDefenseWithGroq({
        title,
        auditorName,
        claimedSkills,
        projects,
        summary,
        questions,
        answers,
        customGroqKey: headerGroqKey,
      });

      return NextResponse.json({ ok: true, result });
    }

    // action === 'prepare'
    const docId = typeof body?.docId === 'string' ? body.docId.trim() : '';
    const auditorName = String(body?.auditorName || 'Mr. Akash').trim();
    const fallbackTitle = String(body?.title || 'Uploaded Credential').trim();
    const clientSkills = filterRealSkills(body?.existingSkills);

    let vaultDoc: any = null;
    if (docId) {
      const { data } = await db
        .from('vault_items')
        .select('id, title, item_type, organization_name, description, skill_tags, proof_url')
        .eq('id', docId)
        .eq('user_id', userId)
        .maybeSingle();
      vaultDoc = data;
    }

    const docTitle = vaultDoc?.title || fallbackTitle;
    const docDesc = String(vaultDoc?.description || '');
    const dbSkills = filterRealSkills(vaultDoc?.skill_tags);

    let groqAnalysis = null;

    // 1. Download the REAL uploaded file from Supabase Storage ('resumes' bucket) with strict user namespace guard
    const storageMatch = docDesc.match(/Storage:\s*([^\s]+)/i);
    let storagePath = storageMatch ? storageMatch[1].trim() : '';
    if (!storagePath && typeof vaultDoc?.proof_url === 'string' && vaultDoc.proof_url.includes('resumes/')) {
      storagePath = vaultDoc.proof_url.split('resumes/')[1]?.split('?')[0]?.trim() || '';
    }

    if (storagePath && storagePath.startsWith(`vault/${userId}/`)) {
      try {
        const { data: blob, error: dlErr } = await db.storage.from('resumes').download(storagePath);
        if (!dlErr && blob) {
          const arrayBuffer = await blob.arrayBuffer();
          const fileBuffer = Buffer.from(arrayBuffer);
          const fileName = storagePath.split('/').pop() || `${docTitle}.pdf`;
          const analyzed = await analyzeVaultFileBufferWithGroq(
            fileBuffer,
            fileName,
            blob.type || undefined,
            {
              title: docTitle,
              auditorName,
              customGroqKey: headerGroqKey,
            }
          );
          groqAnalysis = analyzed.groqAnalysis;
        } else if (dlErr) {
          console.warn('[vault/defense-session] Storage download warning:', dlErr.message);
        }
      } catch (storageErr: any) {
        console.warn('[vault/defense-session] Storage analysis warning:', storageErr?.message || storageErr);
      }
    }

    // 2. If file wasn't in storage (or manual entry), run Groq on title + description + existing skills
    if (!groqAnalysis) {
      const cleanDesc = docDesc.replace(/Storage:\s*[^\s]+/gi, '').trim();
      const nonGenericExisting = [...dbSkills, ...clientSkills].filter(
        (s) => !FALLBACK_GENERIC_SKILLS.has(s.toLowerCase())
      );
      const syntheticText = [
        `Document Title: ${docTitle}`,
        vaultDoc?.organization_name ? `Organization: ${vaultDoc.organization_name}` : '',
        cleanDesc ? `Description: ${cleanDesc}` : '',
        nonGenericExisting.length > 0 ? `Claimed Skills: ${nonGenericExisting.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      if (syntheticText.length >= 25) {
        groqAnalysis = await analyzeDocumentTextWithGroq(syntheticText, {
          title: docTitle,
          auditorName,
          customGroqKey: headerGroqKey,
        });
      }
    }

    // Merge real extracted skills (prefer Groq's actual resume skills; drop dummy fallback if real skills exist)
    const mergedMap = new Map<string, string>();
    const groqSkills = groqAnalysis?.skills || [];
    const existingNonGeneric = [...dbSkills, ...clientSkills].filter(
      (s) => !FALLBACK_GENERIC_SKILLS.has(s.toLowerCase())
    );
    for (const sk of [...groqSkills, ...existingNonGeneric]) {
      const clean = String(sk || '').trim();
      if (clean && !mergedMap.has(clean.toLowerCase())) {
        mergedMap.set(clean.toLowerCase(), clean);
      }
    }

    const claimedSkills = Array.from(mergedMap.values()).slice(0, 15);

    // Backfill real extracted skills into vault_items so Proof Vault immediately reflects them!
    if (docId && vaultDoc && groqSkills.length > 0) {
      try {
        const updatePayload: Record<string, any> = {
          skill_tags: claimedSkills,
        };
        if (
          groqAnalysis?.institution &&
          (!vaultDoc.organization_name || vaultDoc.organization_name === 'Academic Institution')
        ) {
          updatePayload.organization_name = groqAnalysis.institution;
        }
        await db
          .from('vault_items')
          .update(updatePayload)
          .eq('id', docId)
          .eq('user_id', userId);
      } catch (updateErr) {
        console.warn('[vault/defense-session] vault_items skill backfill warning:', updateErr);
      }
    }

    return NextResponse.json({
      ok: true,
      analysisSource: groqAnalysis?.source || 'fallback',
      claimedSkills,
      projects: groqAnalysis?.projects || [],
      certifications: groqAnalysis?.certifications || [],
      summary: groqAnalysis?.summary || '',
      defenseQuestions: groqAnalysis?.defenseQuestions || [],
      candidateName: groqAnalysis?.candidateName || '',
      institution: groqAnalysis?.institution || vaultDoc?.organization_name || '',
    });
  } catch (err: any) {
    console.error('[vault/defense-session] Fatal error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to prepare defense session' },
      { status: 500 }
    );
  }
}

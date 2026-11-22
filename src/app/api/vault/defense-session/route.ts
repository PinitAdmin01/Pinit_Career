import { NextResponse } from 'next/server';
import {
  requireUserFromRequest,
  getBearerToken,
  getAuthoritativeSupabaseClient,
} from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { isReadableDocumentText } from '@/lib/ats/pdfTextExtractor';
import {
  analyzeDocumentTextWithGroq,
  analyzeVaultFileBufferWithGroq,
  evaluateDefenseWithGroq,
  type AnalyzedDocumentProject,
} from '@/lib/vault/groqDocumentAnalyzer';
import { extractSkillsFast } from '@/lib/vault/vaultDefenseEngine';

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
 * Powers Groq-grounded Proof Vault Resume/Certificate Verification:
 * - action: 'prepare'  -> Downloads the candidate's actual uploaded file from Supabase Storage ('resumes'),
 *                         extracts real text with Mozilla PDF.js (`unpdf`) + Groq Vision/LLM, heals generic
 *                         'Supporting Document' / empty skill_tags in vault_items, and returns the real
 *                         resume text excerpt, skills, projects, certifications, and tailored questions.
 * - action: 'evaluate' -> Strictly grades the candidate's live defense answers against their actual document via Groq.
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
    const userClient = getAuthoritativeSupabaseClient(token);
    const db = admin || userClient;
    const headerGroqKey = req.headers.get('x-groq-api-key');

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || 'prepare').trim();

    if (action === 'evaluate') {
      const title = String(body?.title || 'Uploaded Document').trim();
      const auditorName = String(body?.auditorName || 'Mr. Akash').trim();
      const claimedSkills = filterRealSkills(body?.claimedSkills);
      const projects: AnalyzedDocumentProject[] = Array.isArray(body?.projects) ? body.projects : [];
      const summary = typeof body?.summary === 'string' ? body.summary : '';
      const rawTextExcerpt = typeof body?.rawTextExcerpt === 'string' ? body.rawTextExcerpt : '';
      const questions: string[] = Array.isArray(body?.questions)
        ? body.questions.map((q: any) => String(q || '').trim()).filter(Boolean)
        : [];
      const answers: string[] = Array.isArray(body?.answers)
        ? body.answers.map((a: any) => String(a || '').trim())
        : [];

      const codingResult =
        body?.codingResult && typeof body.codingResult === 'object'
          ? {
              required: Boolean(body.codingResult.required),
              language: (['python', 'javascript', 'java', 'cpp', 'sql'].includes(body.codingResult.language)
                ? body.codingResult.language
                : 'python') as 'python' | 'javascript' | 'java' | 'cpp' | 'sql',
              problemTitle: String(body.codingResult.problemTitle || 'Live Coding Check').slice(0, 140),
              passedTests: Math.max(0, Number(body.codingResult.passedTests) || 0),
              totalTests: Math.max(0, Number(body.codingResult.totalTests) || 0),
              passed: Boolean(body.codingResult.passed),
              skipped: Boolean(body.codingResult.skipped),
              codeSnippet: typeof body.codingResult.codeSnippet === 'string'
                ? body.codingResult.codeSnippet.slice(0, 2000)
                : undefined,
            }
          : undefined;

      const result = await evaluateDefenseWithGroq({
        title,
        auditorName,
        claimedSkills,
        projects,
        summary,
        rawTextExcerpt,
        questions,
        answers,
        codingResult,
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
      // Always select '*' so missing optional columns (like proof_url) never fail PostgreSQL queries
      let { data, error: fetchErr } = await db
        .from('vault_items')
        .select('*')
        .eq('id', docId)
        .eq('user_id', userId)
        .maybeSingle();
      if ((fetchErr || !data) && admin && token) {
        const retry = await userClient
          .from('vault_items')
          .select('*')
          .eq('id', docId)
          .eq('user_id', userId)
          .maybeSingle();
        if (!retry.error && retry.data) data = retry.data;
      } else if (fetchErr) {
        console.warn('[vault/defense-session] DB fetch warning:', fetchErr.message);
      }
      vaultDoc = data;
    }

    const docTitle = vaultDoc?.title || fallbackTitle;
    const docDesc = String(vaultDoc?.description || '');
    const dbSkills = filterRealSkills(vaultDoc?.skill_tags);

    let groqAnalysis = null;
    let effectiveRawText = '';
    let attemptedFileDownload = false;
    let unreadableReason = '';

    // 1. Download the REAL uploaded file from Supabase Storage ('resumes' bucket) with strict user namespace guard
    const storageMatch = docDesc.match(/Storage:\s*([^\s]+)/i);
    let storagePath = storageMatch ? storageMatch[1].trim().replace(/[.,;)]+$/, '') : '';
    const proofUrl = typeof vaultDoc?.proof_url === 'string' ? vaultDoc.proof_url : '';
    if (!storagePath && proofUrl.includes('resumes/')) {
      storagePath = proofUrl.split('resumes/')[1]?.split('?')[0]?.trim() || '';
    }

    if (storagePath && storagePath.startsWith(`vault/${userId}/`)) {
      attemptedFileDownload = true;
      try {
        let { data: blob, error: dlErr } = await db.storage.from('resumes').download(storagePath);
        if ((dlErr || !blob) && admin && token) {
          const retry = await userClient.storage.from('resumes').download(storagePath);
          blob = retry.data;
          dlErr = retry.error;
        }
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
          effectiveRawText = (analyzed.effectiveRawText || analyzed.groqAnalysis?.rawTextExcerpt || '').trim();
          if (!effectiveRawText && !groqAnalysis) {
            unreadableReason =
              'Could not extract readable text from this file (it may be a password-protected or flattened scan without selectable text). Try uploading a standard PDF, DOCX, or clear PNG/JPG screenshot of your resume.';
          }
        } else if (dlErr) {
          console.warn('[vault/defense-session] Storage download warning:', dlErr.message);
          unreadableReason = 'Could not load the stored document file from secure vault storage.';
        }
      } catch (storageErr: any) {
        console.warn('[vault/defense-session] Storage analysis warning:', storageErr?.message || storageErr);
        unreadableReason = 'Error reading the stored document file.';
      }
    }

    // 2. If manual entry (no binary file in storage), analyze non-boilerplate notes via Groq
    if (!groqAnalysis && !attemptedFileDownload) {
      const cleanDesc = docDesc
        .replace(/^Uploaded to Candidate Secure Vault.*$/gim, '')
        .replace(/Storage:\s*[^\s]+/gi, '')
        .trim();
      const nonGenericExisting = [...dbSkills, ...clientSkills].filter(
        (s) => !FALLBACK_GENERIC_SKILLS.has(s.toLowerCase())
      );
      const syntheticText = [
        docTitle && docTitle !== 'Supporting Document' ? `Document Title: ${docTitle}` : '',
        vaultDoc?.organization_name && vaultDoc.organization_name !== 'Academic Institution'
          ? `Organization: ${vaultDoc.organization_name}`
          : '',
        cleanDesc ? `Details: ${cleanDesc}` : '',
        nonGenericExisting.length > 0 ? `Claimed Skills: ${nonGenericExisting.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      if (syntheticText.length >= 25) {
        effectiveRawText = syntheticText;
        groqAnalysis = await analyzeDocumentTextWithGroq(syntheticText, {
          title: docTitle,
          auditorName,
          customGroqKey: headerGroqKey,
        });
      }
    }

    // Merge real extracted skills (Groq primary + deterministic extraction from REAL PDF text + non-generic existing)
    const mergedMap = new Map<string, string>();
    const groqSkills = groqAnalysis?.skills || [];
    const textDictSkills = isReadableDocumentText(effectiveRawText)
      ? extractSkillsFast(effectiveRawText)
      : [];
    const existingNonGeneric = [...dbSkills, ...clientSkills].filter(
      (s) => !FALLBACK_GENERIC_SKILLS.has(s.toLowerCase())
    );
    for (const sk of [...groqSkills, ...textDictSkills, ...existingNonGeneric]) {
      const clean = String(sk || '').trim();
      if (clean && !mergedMap.has(clean.toLowerCase())) {
        mergedMap.set(clean.toLowerCase(), clean);
      }
    }

    const claimedSkills = Array.from(mergedMap.values()).slice(0, 18);
    const resolvedTitle =
      groqAnalysis?.documentTitle && groqAnalysis.documentTitle.length >= 4
        ? groqAnalysis.documentTitle
        : docTitle === 'Supporting Document' && groqAnalysis?.documentType === 'resume'
        ? 'Candidate Master Resume'
        : docTitle;
    const resolvedType =
      groqAnalysis?.documentType && groqAnalysis.documentType !== 'other'
        ? groqAnalysis.documentType
        : vaultDoc?.item_type || 'resume';

    const readable = Boolean(
      isReadableDocumentText(effectiveRawText) ||
        groqSkills.length > 0 ||
        (groqAnalysis?.projects?.length || 0) > 0 ||
        claimedSkills.length > 0
    );

    // Backfill real extracted skills & heal generic 'Supporting Document' / 'other' metadata in Supabase!
    if (docId && vaultDoc && readable) {
      try {
        const updatePayload: Record<string, any> = {};
        if (claimedSkills.length > 0) {
          updatePayload.skill_tags = claimedSkills;
        }
        if (
          resolvedTitle &&
          resolvedTitle !== vaultDoc.title &&
          (vaultDoc.title === 'Supporting Document' || vaultDoc.title === 'Primary Candidate Master Resume')
        ) {
          updatePayload.title = resolvedTitle;
        }
        if (resolvedType && resolvedType !== 'other' && vaultDoc.item_type === 'other') {
          updatePayload.item_type = resolvedType;
        }
        if (
          groqAnalysis?.institution &&
          (!vaultDoc.organization_name || vaultDoc.organization_name === 'Academic Institution')
        ) {
          updatePayload.organization_name = groqAnalysis.institution;
        }
        if (Object.keys(updatePayload).length > 0) {
          await db
            .from('vault_items')
            .update(updatePayload)
            .eq('id', docId)
            .eq('user_id', userId);
        }
      } catch (updateErr) {
        console.warn('[vault/defense-session] vault_items backfill warning:', updateErr);
      }
    }

    return NextResponse.json({
      ok: true,
      readable,
      unreadableReason: readable ? '' : unreadableReason || 'No readable resume/certificate text was found in this document.',
      analysisSource: groqAnalysis?.source || (isReadableDocumentText(effectiveRawText) ? 'pdfjs-text' : 'fallback'),
      documentTitle: resolvedTitle,
      documentType: resolvedType,
      claimedSkills,
      projects: groqAnalysis?.projects || [],
      certifications: groqAnalysis?.certifications || [],
      summary: groqAnalysis?.summary || '',
      rawTextExcerpt: effectiveRawText.slice(0, 4500),
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

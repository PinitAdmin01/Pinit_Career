import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAndConsumeExamSessionToken } from '@/lib/portfolio/examToken';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    // Defect 007: Authenticate caller before evaluating certificate exam
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json();
    const { examSessionToken } = body;
    const selectedAnswers = body.selectedAnswers || body.answers;
    const certificateTitle = (body.certificateTitle || body.title || 'Verified Certificate').trim();
    const issuer = (body.issuer || 'PinIT Exam Engine').trim();

    if (!examSessionToken || typeof examSessionToken !== 'string') {
      return NextResponse.json(
        { ok: false, passed: false, error: 'Missing or invalid examSessionToken.' },
        { status: 400 }
      );
    }

    if (!selectedAnswers || typeof selectedAnswers !== 'object') {
      return NextResponse.json(
        { ok: false, passed: false, error: 'Candidate selected answers object required.' },
        { status: 400 }
      );
    }

    // Atomically verify cryptographic authenticity AND consume single-use nonce
    const verification = verifyAndConsumeExamSessionToken(examSessionToken);
    if (!verification.valid) {
      return NextResponse.json(
        {
          ok: false,
          passed: false,
          error: verification.error,
          code: verification.code || 'INVALID_EXAM_TOKEN'
        },
        { status: verification.code === 'NONCE_REPLAY' ? 409 : 403 }
      );
    }

    // Defect 007: Enforce studentId identity binding
    if (verification.studentId && verification.studentId !== gated.user!.id) {
      console.warn(`[SECURITY ALERT] Exam token student mismatch: caller=${gated.user!.id} vs token=${verification.studentId}`);
      return NextResponse.json(
        { ok: false, passed: false, error: 'FORBIDDEN: Exam session belongs to a different candidate.' },
        { status: 403 }
      );
    }

    // N5: Enforce certificateTitle binding
    if (verification.certificateTitle && verification.certificateTitle.toLowerCase().trim() !== certificateTitle.toLowerCase().trim()) {
      console.warn(`[SECURITY ALERT] Exam token title mismatch: requested=${certificateTitle} vs token=${verification.certificateTitle}`);
      return NextResponse.json(
        { ok: false, passed: false, error: 'FORBIDDEN: Exam token was issued for a different certificate.' },
        { status: 403 }
      );
    }

    const correctAnswers = verification.answers;
    const questionIds = Object.keys(correctAnswers);
    const total = questionIds.length;

    if (total === 0) {
      return NextResponse.json(
        { ok: false, passed: false, error: 'No questions associated with this session token.' },
        { status: 400 }
      );
    }

    let correctCount = 0;
    for (const qId of questionIds) {
      const selected = Number(selectedAnswers[qId]);
      const actual = Number(correctAnswers[qId]);
      if (!isNaN(selected) && selected === actual) {
        correctCount++;
      }
    }

    const scorePercentage = Math.round((correctCount / total) * 100);
    const passThreshold = Math.ceil(total * 0.6);
    const passed = correctCount >= passThreshold;

    let savedCertificate: any = null;
    if (passed) {
      // N6: Fail closed if SUPABASE_SERVICE_ROLE_KEY is missing (no fallback to anon key)
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceKey) {
        console.error('[VerifyExam] SUPABASE_SERVICE_ROLE_KEY missing - failing closed');
        return NextResponse.json(
          { ok: false, passed: false, error: 'Database service role configuration missing.' },
          { status: 500 }
        );
      }

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
      const supabaseAdmin = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      try {
        const { data: existingRow, error: fetchErr } = await supabaseAdmin
          .from('portfolio_items')
          .select('item_data')
          .eq('user_id', gated.user!.id)
          .eq('item_type', 'certificates')
          .maybeSingle();

        if (fetchErr) {
          console.error('[VerifyExam] Error fetching portfolio_items:', fetchErr.message);
          return NextResponse.json(
            { ok: false, passed: false, error: 'Database persistence failed' },
            { status: 500 }
          );
        }

        const existingItems = Array.isArray(existingRow?.item_data?.items)
          ? existingRow.item_data.items
          : Array.isArray(existingRow?.item_data)
          ? existingRow.item_data
          : [];

        const certId = `c_${Date.now()}`;
        let matched = false;
        const updatedCerts = existingItems.map((c: any) => {
          if (c.title && c.title.toLowerCase().trim() === certificateTitle.toLowerCase().trim()) {
            matched = true;
            savedCertificate = {
              ...c,
              verified: Boolean(c.verified), // Preserve existing verified status if previously audited by faculty, else false
              assessmentPassed: true,
              assessmentScore: scorePercentage,
              verificationStatus: c.verified ? 'VERIFIED' : 'KNOWLEDGE_ASSESSED',
              auditStatus: c.verified ? 'VERIFIED' : 'PENDING_FACULTY_AUDIT',
              assessedAt: new Date().toISOString(),
            };
            return savedCertificate;
          }
          return c;
        });

        if (!matched) {
          savedCertificate = {
            id: certId,
            title: certificateTitle,
            issuer,
            verified: false, // 3-MCQ quiz demonstrates subject understanding, not official institution certificate issuance
            assessmentPassed: true,
            assessmentScore: scorePercentage,
            verificationStatus: 'KNOWLEDGE_ASSESSED',
            auditStatus: 'PENDING_FACULTY_AUDIT',
            assessedAt: new Date().toISOString(),
          };
          updatedCerts.push(savedCertificate);
        }

        const { error: upsertErr } = await supabaseAdmin
          .from('portfolio_items')
          .upsert({
            user_id: gated.user!.id,
            item_type: 'certificates',
            item_data: { items: updatedCerts },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,item_type' });

        if (upsertErr) {
          console.error('[VerifyExam] Failed to persist verified certificate to portfolio_items:', upsertErr.message);
          return NextResponse.json(
            { ok: false, passed: false, error: 'Database persistence failed' },
            { status: 500 }
          );
        }
      } catch (dbErr: any) {
        console.error('[VerifyExam] Error persisting to portfolio_items:', dbErr);
        return NextResponse.json(
          { ok: false, passed: false, error: 'Database persistence failed' },
          { status: 500 }
        );
      }
    } else {
      // Oracle defense: Do not return correctCount, total, passThreshold, or answer hints on failure
      return NextResponse.json({
        ok: true,
        passed: false,
        verified: false,
        message: 'Assessment passing threshold was not achieved. This session token has been consumed. Please review course materials and request a new evaluation.',
        certificate: null
      });
    }

    return NextResponse.json({
      ok: true,
      passed: true,
      verified: Boolean(savedCertificate?.verified),
      assessmentPassed: true,
      certificate: savedCertificate,
      score: scorePercentage,
      message: 'Subject knowledge assessment passed! Credential recorded as Knowledge Assessed (pending faculty or issuer audit).'
    });
  } catch (err: any) {
    console.error('[VerifyExam] Error processing exam verification:', err);
    return NextResponse.json(
      { ok: false, passed: false, error: err.message || 'Internal server error evaluating exam.' },
      { status: 500 }
    );
  }
}

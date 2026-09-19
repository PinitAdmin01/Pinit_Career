import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { MissionEvaluator } from '@/lib/missions/missionEvaluator';
import { AiArchitectReviewer } from '@/lib/missions/aiArchitectReviewer';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    const isGuest = Boolean(gated.error);
    const studentId = gated.user?.id || 'guest_student';
    const body = await req.json().catch(() => ({}));

    const {
      missionId,
      missionTitle = 'Career Mission',
      programId = 'prog_swe_accelerated_9m',
      targetRole = 'Full-Stack Software Engineer',
      competencyId = 'comp_backend_apis_frameworks_l3',
      codeSubmission = '',
      unitTestResults,
      attemptCount = 1,
      githubRepoUrl,
      commitSha,
    } = body;

    if (!missionId) {
      return NextResponse.json({ error: 'Missing missionId parameter' }, { status: 400 });
    }

    // 1. Run Deterministic Zero-Cost Test Evaluation
    const evaluation = MissionEvaluator.evaluateSubmission({
      missionId,
      missionTitle,
      studentId,
      programId,
      competencyId,
      codeSubmission,
      unitTestResults,
      attemptCount,
      githubRepoUrl,
      commitSha,
    });

    let architectReview = null;

    // 2. If failing, generate Socratic AI Senior Architect PR Review
    if (!evaluation.isPassed) {
      architectReview = await AiArchitectReviewer.reviewSubmission({
        missionId,
        missionTitle,
        targetRole,
        failingStackTraces: evaluation.failingStackTraces,
        studentCodeDiff: codeSubmission,
        attemptCount,
      });
    }

    // 3. Persist evidence record and credit Pins into Supabase if passed and authenticated
    if (evaluation.isPassed && evaluation.evidenceRecord && !isGuest) {
      const admin = getSupabaseAdmin();
      const r = evaluation.evidenceRecord;
      try {
        await admin.from('competency_evidence_records').upsert({
          id: r.id,
          student_id: studentId,
          competency_id: r.competencyId,
          competency_version: r.competencyVersion,
          program_id: r.programId,
          evidence_class: r.evidenceClass,
          difficulty: r.difficulty,
          evidence_family_id: r.evidenceFamilyId || null,
          source_type: r.sourceType,
          source_id: r.sourceId,
          attempt_id: r.attemptId,
          score: r.score,
          evaluator_type: r.evaluatorType,
          evaluator_version: r.evaluatorVersion,
          rubric_version: r.rubricVersion,
          timestamp: r.timestamp,
          integrity_hash: r.integrityHash,
          artifacts: r.artifacts || {},
        }, { onConflict: 'id' });

        // Authoritatively credit student's Pin balance
        if (evaluation.pinsAwarded > 0) {
          const { data: rpcRes, error: rpcErr } = await admin.rpc('credit_pins', {
            p_user_id: studentId,
            p_amount: evaluation.pinsAwarded,
            p_reason: `Mission completed: ${missionTitle}`,
            p_source: 'mission_complete',
          });
          if (rpcErr || !rpcRes?.ok) {
            const { data: userRow } = await admin.from('users').select('pins').eq('id', studentId).maybeSingle();
            const newBalance = (userRow?.pins || 0) + evaluation.pinsAwarded;
            await admin.from('users').update({ pins: newBalance }).eq('id', studentId);
          }
        }
      } catch (dbErr: any) {
        console.warn('[Mission Evaluate DB Upsert Notice]:', dbErr?.message);
      }
    }

    return NextResponse.json({
      ok: true,
      passed: evaluation.isPassed,
      pinsAwarded: evaluation.isPassed ? (isGuest ? 0 : evaluation.pinsAwarded) : 0,
      integrityHash: evaluation.evidenceRecord?.integrityHash,
      evaluation,
      architectReview,
      review: architectReview,
      isGuest,
      message: evaluation.isPassed
        ? (isGuest ? 'Mission passed in sandbox! Sign in to claim your Pins and record verified evidence in your Vault.' : 'Mission passed and evidence verified.')
        : 'Mission needs revision.',
    });
  } catch (err: any) {
    console.error('[Mission Evaluate Route Error]:', err);
    return NextResponse.json({ error: err.message || 'Mission evaluation server error' }, { status: 500 });
  }
}

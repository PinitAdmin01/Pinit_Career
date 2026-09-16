import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { COMPETENCY_CATALOG_V1 } from '@/lib/pathway/competencyCatalog';
import { verifyEvidenceIntegrity } from '@/lib/pathway/evidenceEngine';
import { evaluateCompetencyMastery } from '@/lib/pathway/masteryEngine';
import { CompetencyEvidenceRecord } from '@/lib/pathway/competencySchema';

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();
    const body = await req.json();
    const evidenceRecord: CompetencyEvidenceRecord = body?.evidenceRecord || body;

    if (!evidenceRecord || !evidenceRecord.competencyId) {
      return NextResponse.json({ error: 'Invalid evidence payload' }, { status: 400 });
    }

    // Security Guard: Candidate can only submit evidence for their own authenticated account
    if (evidenceRecord.studentId && evidenceRecord.studentId !== studentId) {
      return NextResponse.json({ error: 'Forbidden: Cannot submit evidence for another student' }, { status: 403 });
    }

    evidenceRecord.studentId = studentId;

    // Cryptographic integrity validation
    if (!verifyEvidenceIntegrity(evidenceRecord)) {
      return NextResponse.json({ error: 'Cryptographic integrity verification failed' }, { status: 400 });
    }

    const compDef = COMPETENCY_CATALOG_V1.find(c => c.id === evidenceRecord.competencyId);
    if (!compDef) {
      return NextResponse.json({ error: `Unknown competency: ${evidenceRecord.competencyId}` }, { status: 404 });
    }

    // Persist to Supabase competency_evidence_records
    let dbPersisted = false;
    try {
      const { error: insErr } = await supabase.from('competency_evidence_records').upsert({
        id: evidenceRecord.id,
        student_id: studentId,
        competency_id: evidenceRecord.competencyId,
        competency_version: evidenceRecord.competencyVersion,
        program_id: evidenceRecord.programId,
        evidence_class: evidenceRecord.evidenceClass,
        difficulty: evidenceRecord.difficulty,
        evidence_family_id: evidenceRecord.evidenceFamilyId,
        source_type: evidenceRecord.sourceType,
        source_id: evidenceRecord.sourceId,
        attempt_id: evidenceRecord.attemptId,
        score: evidenceRecord.score,
        evaluator_type: evidenceRecord.evaluatorType,
        evaluator_version: evidenceRecord.evaluatorVersion,
        rubric_version: evidenceRecord.rubricVersion,
        timestamp: evidenceRecord.timestamp,
        integrity_hash: evidenceRecord.integrityHash,
        artifacts: evidenceRecord.artifacts || {},
        critical_failures_detected: evidenceRecord.criticalFailuresDetected || [],
      });
      if (!insErr) dbPersisted = true;
    } catch {
      dbPersisted = false;
    }

    // Authoritative fallback: Persist into users.onboarding_answers.evidence_records
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('onboarding_answers')
        .eq('id', studentId)
        .maybeSingle();

      if (userRow) {
        const ob = { ...(userRow.onboarding_answers || {}) };
        const existing = Array.isArray(ob.evidence_records) ? ob.evidence_records : [];
        const filtered = existing.filter((e: any) => e.id !== evidenceRecord.id);
        filtered.push(evidenceRecord);
        ob.evidence_records = filtered;

        const { error: updateErr } = await supabase
          .from('users')
          .update({ onboarding_answers: ob })
          .eq('id', studentId);
        if (!updateErr) dbPersisted = true;
      }
    } catch (err) {
      console.warn('[Evidence Route] User profile fallback update warning:', err);
    }

    // Evaluate mastery state machine
    const updatedMastery = evaluateCompetencyMastery({
      competency: compDef,
      rawEvidenceRecords: [evidenceRecord],
      prerequisiteMasteryStates: {},
    });

    try {
      await supabase.from('student_competency_mastery').upsert({
        student_id: studentId,
        competency_id: evidenceRecord.competencyId,
        competency_version: updatedMastery.competencyVersion,
        mastery_policy_version: updatedMastery.masteryPolicyVersion,
        state: updatedMastery.state,
        composite_score: updatedMastery.compositeScore,
        evidence_coverage_pct: updatedMastery.evidenceCoveragePct,
        independent_evidence_count: updatedMastery.independentEvidenceCount,
        last_evaluated_at: updatedMastery.lastEvaluatedAt,
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      success: true,
      dbPersisted,
      evidenceRecord,
      updatedMastery,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

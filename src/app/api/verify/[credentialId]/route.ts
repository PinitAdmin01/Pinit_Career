import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { verifyEvidenceIntegrity } from '@/lib/pathway/evidenceEngine';
import { CompetencyEvidenceRecord } from '@/lib/pathway/competencySchema';

export async function GET(
  _req: NextRequest,
  { params }: { params: { credentialId: string } }
) {
  try {
    const rawId = params?.credentialId;
    if (!rawId || typeof rawId !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'BAD_REQUEST', message: 'Missing credential identifier.' },
        { status: 400 }
      );
    }

    const credentialId = decodeURIComponent(rawId).trim();

    // 1. Evidence Record Verification (IDs starting with 'ev_' or containing '_')
    if (credentialId.startsWith('ev_') || credentialId.includes('_')) {
      let foundRecord: CompetencyEvidenceRecord | null = null;

      // Query Supabase competency_evidence_records table
      try {
        const supabase = getSupabaseAdmin();
        const { data: dbRecord, error } = await supabase
          .from('competency_evidence_records')
          .select('*')
          .eq('id', credentialId)
          .maybeSingle();

        if (!error && dbRecord) {
          foundRecord = {
            id: dbRecord.id,
            competencyId: dbRecord.competency_id,
            competencyVersion: dbRecord.competency_version,
            studentId: dbRecord.student_id,
            programId: dbRecord.program_id,
            evidenceClass: dbRecord.evidence_class,
            difficulty: dbRecord.difficulty,
            evidenceFamilyId: dbRecord.evidence_family_id,
            sourceType: dbRecord.source_type,
            sourceId: dbRecord.source_id,
            attemptId: dbRecord.attempt_id,
            score: dbRecord.score,
            evaluatorType: dbRecord.evaluator_type,
            evaluatorVersion: dbRecord.evaluator_version,
            rubricVersion: dbRecord.rubric_version,
            timestamp: dbRecord.timestamp,
            integrityHash: dbRecord.integrity_hash,
            artifacts: dbRecord.artifacts || {},
            criticalFailuresDetected: dbRecord.critical_failures_detected || [],
          };
        }
      } catch {
        // Fall through to in-memory lookup
      }

      // Check PathwayApiService local/in-memory records for dev/fixtures
      if (!foundRecord) {
        const studentCandidates = ['demo_student_user', 'test_user_001', 'stu_dev_octocat_01', 'stu_dev_tester_01'];
        for (const sId of studentCandidates) {
          const records = await PathwayApiService.getAllStudentEvidence(sId);
          const match = records.find(r => r.id === credentialId);
          if (match) {
            foundRecord = match;
            break;
          }
        }
      }

      if (foundRecord) {
        const isIntegrityValid = verifyEvidenceIntegrity(foundRecord);
        if (!isIntegrityValid) {
          return NextResponse.json({
            valid: false,
            status: 'INTEGRITY_TAMPERED',
            type: 'evidence',
            error: 'INTEGRITY_TAMPERED',
            message: 'Cryptographic HMAC-SHA256 signature mismatch: evidence payload has been altered or forged.'
          }, { status: 200 });
        }

        return NextResponse.json({
          valid: true,
          status: 'VERIFIED',
          type: 'evidence',
          evidenceRecord: {
            id: foundRecord.id,
            competencyId: foundRecord.competencyId,
            evidenceClass: foundRecord.evidenceClass,
            difficulty: foundRecord.difficulty,
            score: foundRecord.score,
            sourceType: foundRecord.sourceType,
            timestamp: foundRecord.timestamp,
            integrityHash: foundRecord.integrityHash,
            evaluatorType: foundRecord.evaluatorType,
            studentId: foundRecord.studentId,
          }
        });
      }

      return NextResponse.json({
        valid: false,
        type: 'evidence',
        error: 'NOT_FOUND',
        message: 'Evidence record not found in authoritative registry.'
      }, { status: 200 });
    }

    // 2. Student Skill Profile & Transcript Verification
    try {
      const profile = await PathwayApiService.getStudentSkillProfile(credentialId);
      const readiness = await PathwayApiService.getRoleReadiness(credentialId);
      const hasVerifiedOrDemonstrated = Boolean(
        (profile?.verified && profile.verified.length > 0) ||
        (profile?.demonstrated && profile.demonstrated.length > 0)
      );

      if (hasVerifiedOrDemonstrated) {
        return NextResponse.json({
          valid: true,
          type: 'student_profile',
          studentProfile: profile,
          roleReadiness: readiness
        });
      }
    } catch {
      // Profile not found
    }

    return NextResponse.json({
      valid: false,
      error: 'NOT_FOUND',
      message: 'Credential record not found in authoritative registry.'
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      valid: false,
      error: 'SERVER_ERROR',
      message: err?.message || 'Internal verification gateway error.'
    }, { status: 500 });
  }
}

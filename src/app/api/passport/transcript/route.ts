import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { getBearerToken, requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin, getSupabaseUserClient } from '@/lib/server/supabaseAdmin';
import { verifyEvidenceIntegrity } from '@/lib/pathway/evidenceEngine';

export async function GET(req: NextRequest) {
  try {
    // ── Auth Gate ────────────────────────────────────────────────────────────
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { searchParams } = new URL(req.url);
    const programId = searchParams.get('programId') || 'prog_swe_accelerated_9m';

    // Enforce: studentId is always the authenticated user's own ID — not user-supplied
    const studentId = gated.user!.id;

    const profile = await PathwayApiService.getStudentSkillProfile(studentId);
    const readiness = await PathwayApiService.getRoleReadiness(studentId, programId);
    const evidenceList = await PathwayApiService.getAllStudentEvidence(studentId);

    // DEF-063 Fix: Authoritative server database verification of student competency evidence
    let verifiedMasteryRecords: any[] = [];
    let serverEvidenceRecords: any[] = [];
    try {
      const bearerToken = getBearerToken(req);
      const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? getSupabaseAdmin()
        : getSupabaseUserClient(bearerToken);

      const { data: dbMastery } = await supabase
        .from('student_competency_mastery')
        .select('*')
        .eq('student_id', studentId)
        .eq('state', 'verified');
      if (dbMastery) verifiedMasteryRecords = dbMastery;

      const { data: dbEvidence } = await supabase
        .from('competency_evidence_records')
        .select('*')
        .eq('student_id', studentId);
      if (dbEvidence) serverEvidenceRecords = dbEvidence;
    } catch {
      // Fallback
    }

    const allEvidenceToCheck = [
      ...evidenceList,
      ...serverEvidenceRecords.map((r: any) => ({
        id: r.id,
        competencyId: r.competency_id,
        competencyVersion: r.competency_version,
        studentId: r.student_id,
        programId: r.program_id,
        evidenceClass: r.evidence_class,
        difficulty: r.difficulty,
        evidenceFamilyId: r.evidence_family_id,
        sourceType: r.source_type,
        sourceId: r.source_id,
        attemptId: r.attempt_id,
        score: r.score,
        evaluatorType: r.evaluator_type,
        evaluatorVersion: r.evaluator_version,
        rubricVersion: r.rubric_version,
        timestamp: r.timestamp,
        integrityHash: r.integrity_hash,
        artifacts: r.artifacts || {},
        criticalFailuresDetected: r.critical_failures_detected || [],
      }))
    ];

    const uniqueEvidence = Array.from(new Map(allEvidenceToCheck.map(e => [e.id, e])).values());

    let verifiedEvidenceCount = 0;
    for (const ev of uniqueEvidence) {
      if (ev.integrityHash && verifyEvidenceIntegrity(ev)) {
        verifiedEvidenceCount++;
      }
    }

    const hasVerifiedCompetencies = (profile.verified.length > 0 || verifiedMasteryRecords.length > 0);
    const isShaVerified = hasVerifiedCompetencies && verifiedEvidenceCount > 0 && (verifiedEvidenceCount === uniqueEvidence.length);

    const secret = process.env.EVIDENCE_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXAM_SECRET || 'dev_transcript_secret';
    const issueDate = new Date().toISOString().slice(0, 10);
    const transcriptDigest = crypto.createHmac('sha256', secret)
      .update(`${studentId}:${profile.verified.map(s => `${s.id}:${s.score}`).join(';')}:${verifiedEvidenceCount}:${issueDate}`)
      .digest('hex');

    const badgeText = isShaVerified ? '✓ HMAC-SHA256 Verified' : 'Provisional / Unverified';
    const badgeBg = isShaVerified ? '#10b981' : '#f59e0b';
    const sealText = isShaVerified
      ? `Tamper-Evident Ledger Seal: ${transcriptDigest.slice(0, 16)}...`
      : 'Ledger Status: Evidence Pending Verification';

    const defenseScore = Number(readiness.capstoneDefenseScore || 0);
    const defenseEvaluator = readiness.capstoneDefenseEvaluator || 'AI/Mentor Panel';
    let defenseCopy = '';
    let defenseColor = '';
    if (defenseScore >= 70) {
      defenseCopy = `Passed rigorous multi-stage architectural defense verifying independent problem solving and code provenance (${defenseScore}/100).`;
      defenseColor = '#166534';
    } else if (defenseScore > 0) {
      defenseCopy = `Capstone oral defense completed with score ${defenseScore}/100 (Passing threshold: 70/100). Re-evaluation required.`;
      defenseColor = '#b45309';
    } else {
      defenseCopy = 'Capstone oral defense pending evaluation. Architectural viva defense not yet completed.';
      defenseColor = '#64748b';
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Competency Transcript — ${studentId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #fff; line-height: 1.5; }
    .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 24px; font-weight: 900; color: #4f46e5; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { background: ${badgeBg}; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .student-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { text-align: left; padding: 10px; background: #f1f5f9; color: #475569; text-transform: uppercase; font-size: 11px; border-bottom: 1px solid #cbd5e1; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    .defense-card { margin-top: 24px; padding: 16px; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; font-size: 13px; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">PinIT Career OS Academy</div>
      <div class="subtitle">Official Evidence-Backed Verifiable Transcript & Residency Record</div>
    </div>
    <div>
      <span class="badge">${badgeText}</span>
    </div>
  </div>

  <div class="student-meta">
    <div><strong>Student Identifier:</strong> ${studentId}</div>
    <div><strong>Program Track:</strong> ${readiness.targetRole} (9M Accelerated)</div>
    <div><strong>Readiness Status:</strong> <span style="text-transform: uppercase; color: #10b981; font-weight: 700;">${readiness.status.replace(/_/g, ' ')}</span></div>
    <div><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</div>
  </div>

  <h3 style="margin-bottom: 8px;">Verified Competencies (${profile.verified.length})</h3>
  <table>
    <thead>
      <tr>
        <th>Competency</th>
        <th>Score</th>
        <th>Level</th>
        <th>Last Verified</th>
      </tr>
    </thead>
    <tbody>
      ${profile.verified.map(s => `
        <tr>
          <td><strong>${s.name}</strong> (${s.id})</td>
          <td style="color: #10b981; font-weight: 700;">${s.score}/100</td>
          <td>Level ${s.level}</td>
          <td>${new Date(s.verifiedAt).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="defense-card">
    <strong>Capstone Oral Defense & Viva Score:</strong> ${defenseScore}/100 (Evaluator: ${defenseEvaluator})
    <p style="margin: 4px 0 0 0; color: ${defenseColor};">${defenseCopy}</p>
  </div>

  <div class="footer">
    <div>Cryptographic Proof: https://pinit.app/verify/${studentId}</div>
    <div>${sealText}</div>
  </div>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { auditResumeATS, RoleCategory } from '@/lib/ats/atsScreener';
import { bridgeAtsToCompetencyGraph } from '@/lib/pathway/atsCompetencyBridge';
import { ValidatedCandidateGraph } from '@/lib/ats/factCheckValidator';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { resumeText = '', targetRole = 'sde', jobDescription = '' } = await req.json();

    const validRoles: RoleCategory[] = [
      'sde', 'backend', 'frontend', 'devops', 'data_analyst',
      'pm', 'business_analyst', 'sales_marketing', 'general_tech', 'general_non_tech'
    ];

    const cleanRole: RoleCategory = validRoles.includes(targetRole) ? targetRole : 'sde';

    const auditReport = auditResumeATS(resumeText, {
      targetRole: cleanRole,
      jobDescription: (jobDescription || '').slice(0, 10000)
    });

    // Wire ATS Diagnostic directly into the Competency DAG
    let competencyBridge = null;
    try {
      const candidateGraph: ValidatedCandidateGraph = {
        candidateName: (gated.user as any)?.displayName || 'Candidate',
        documentSupportedSkills: auditReport.extractedProfile?.skillsDetected || [],
        aspirationalSkills: auditReport.extractedProfile?.missingSkills || [],
        projects: [],
        scoreOrGpa: auditReport.compositeScore ? `${auditReport.compositeScore}%` : undefined,
        provenanceRecords: [],
        overallGroundedConfidence: 0.85,
      };

      competencyBridge = bridgeAtsToCompetencyGraph(
        candidateGraph,
        gated.user!.id,
        cleanRole === 'data_analyst' ? 'prog_data_analytics_6m' : 'prog_swe_accelerated_9m'
      );
    } catch (bridgeErr: any) {
      console.warn('[Resume Analyze Bridge Notice]:', bridgeErr?.message);
    }

    return NextResponse.json({
      auditReport,
      competencyBridge: competencyBridge ? {
        targetRole: competencyBridge.targetRole,
        readinessPercentage: competencyBridge.readinessPercentage,
        demonstratedCount: competencyBridge.demonstratedCount,
        diagnosticGapsCount: competencyBridge.diagnosticGaps.length,
        diagnosticGaps: competencyBridge.diagnosticGaps,
      } : null,
      success: true
    });
  } catch (err: any) {
    console.error('[Resume ATS Analyze Error]:', err);
    return NextResponse.json({ error: err.message || 'Server ATS analysis error' }, { status: 500 });
  }
}

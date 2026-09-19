import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { COMPETENCY_CATALOG_V1 } from '@/lib/pathway/competencyCatalog';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = (searchParams.get('role') || 'fullstack').toLowerCase();

    // Check auth cookie/header
    const authHeader = req.headers.get('authorization') || '';
    const admin = getSupabaseAdmin();

    // Fetch user if token present, else check if demo student exists
    let userId: string | null = null;
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await admin.auth.getUser(token);
      if (user) userId = user.id;
    }

    let userData: any = null;
    let evidenceRecords: any[] = [];

    if (userId) {
      const { data: u } = await admin.from('users').select('*').eq('id', userId).maybeSingle();
      userData = u;
      const { data: ev } = await admin.from('competency_evidence_records').select('*').eq('user_id', userId);
      evidenceRecords = ev || [];
    } else {
      // Guest or public mode: inspect database for any registered student baseline
      const { data: u } = await admin.from('users').select('*').limit(1).maybeSingle();
      userData = u;
      if (userData?.id) {
        const { data: ev } = await admin.from('competency_evidence_records').select('*').eq('user_id', userData.id);
        evidenceRecords = ev || [];
      }
    }

    // Role-specific competency mapping
    const roleCompetencyKeys: Record<string, string[]> = {
      fullstack: ['comp_react_delivery', 'comp_api_security', 'comp_system_design', 'comp_cloud_deploy'],
      cloud: ['comp_linux_networking', 'comp_docker_ops', 'comp_k8s_troubleshooting', 'comp_iac_review'],
      ai: ['comp_python_data', 'comp_prompt_safety', 'comp_vector_tuning', 'comp_model_observability'],
      data: ['comp_sql_optimization', 'comp_dbt_modeling', 'comp_warehouse_cost', 'comp_data_contracts'],
    };

    const targetKeys = roleCompetencyKeys[role] || roleCompetencyKeys.fullstack;
    const verifiedMap = new Map<string, any>();
    for (const rec of evidenceRecords) {
      verifiedMap.set(rec.competency_id, rec);
    }

    const academicBaseline = typeof userData?.ats_score === 'number' ? userData.ats_score : 50;
    const verifiedCount = targetKeys.filter(k => verifiedMap.has(k)).length;
    const evidenceScore = Math.min(100, Math.round((verifiedCount / targetKeys.length) * 100));
    const overallReadiness = Math.round((academicBaseline * 0.4) + (evidenceScore * 0.6));

    // Build live competency rows from COMPETENCY_CATALOG_V1 array
    const competencyRows = targetKeys.map(k => {
      const isVerified = verifiedMap.has(k);
      const cat = Array.isArray(COMPETENCY_CATALOG_V1)
        ? COMPETENCY_CATALOG_V1.find((c: any) => c.id === k)
        : null;

      return {
        name: cat?.title || k.replace('comp_', '').replace(/_/g, ' ').toUpperCase(),
        evidence: isVerified ? 'HMAC-SHA256 Verified Evidence Record' : 'No verified artifact in Vault',
        pins: isVerified ? 35 : 0,
        status: isVerified ? 'verified' : 'gap',
        urgency: isVerified ? undefined : 'critical',
        fix: isVerified ? undefined : 'Launch diagnostic mission in sandbox'
      };
    });

    return NextResponse.json({
      success: true,
      isAuthenticated: Boolean(userId),
      role,
      readiness: overallReadiness,
      academic: academicBaseline,
      evidence: evidenceScore,
      competencies: competencyRows,
      pinsMinted: verifiedCount * 35,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { probePublicUrl } from '@/lib/server/publicUrlProbe';
import { verifyTopicEvaluationSignature } from '@/lib/interview/evaluationSignature';
import { isCapstoneInterviewPassed } from '@/lib/interview/capstoneInterview';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const demoUrl = typeof body.demoUrl === 'string' ? body.demoUrl.trim() : '';
    const score = typeof body.score === 'number' ? body.score : undefined;
    const verdict = typeof body.verdict === 'string' ? body.verdict.trim() : undefined;
    const topicToken = typeof body.topicToken === 'string' ? body.topicToken.trim() : undefined;

    const admin = getSupabaseAdmin();

    // 1. Load active Tier 2 enrollment for the user
    const { data: enrollment, error: enrErr } = await admin
      .from('internship_enrollments')
      .select('id, student_id, tier, status')
      .eq('student_id', userId)
      .eq('tier', 't2_virtual_team')
      .in('status', ['active', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (enrErr || !enrollment) {
      return fail(404, 'ENROLLMENT_NOT_FOUND', 'Active Tier 2 virtual internship enrollment not found.');
    }

    // 2. Fetch the team and product brief
    const { data: member } = await admin
      .from('internship_team_members')
      .select('team_id')
      .eq('student_id', userId)
      .limit(1)
      .maybeSingle();

    let teamId = member?.team_id;
    let productName = 'Cloud Backend Service';

    if (teamId) {
      const { data: team } = await admin
        .from('internship_teams')
        .select('project_brief')
        .eq('id', teamId)
        .maybeSingle();

      const brief = team?.project_brief as { productName?: string } | null;
      if (brief?.productName) {
        productName = brief.productName;
      }
    }

    const updates: Record<string, unknown> = {};

    // 3. If submitting demo URL: probe reachability and save
    if (demoUrl) {
      if (!demoUrl.startsWith('https://')) {
        return fail(400, 'INVALID_DEMO_URL', 'Demo URL must begin with https://.');
      }

      const probe = await probePublicUrl(demoUrl);
      if (!probe.ok) {
        return fail(
          400,
          'DEMO_NOT_REACHABLE',
          'Demo application URL is not publicly reachable. Please verify deployment.'
        );
      }

      if (teamId) {
        await admin
          .from('internship_teams')
          .update({
            project_brief: {
              ...(await admin
                .from('internship_teams')
                .select('project_brief')
                .eq('id', teamId)
                .maybeSingle()
                .then((r) => r.data?.project_brief || {})),
              demoUrl,
            },
          })
          .eq('id', teamId);
      }

      updates.demo_url = demoUrl;
    }

    // 4. If submitting oral defense interview result: verify signature and score
    if (score !== undefined && verdict && topicToken) {
      const topic = `Virtual Internship – ${productName}`;
      const validSignature = verifyTopicEvaluationSignature(userId, score, verdict, topic, topicToken);

      if (!validSignature) {
        return fail(
          400,
          'INVALID_DEFENSE_SIGNATURE',
          'Defense interview cryptographic verification failed. Token is invalid or does not match topic.'
        );
      }

      const passed = isCapstoneInterviewPassed(verdict, score);
      if (!passed) {
        return fail(
          400,
          'DEFENSE_NOT_PASSED',
          `Defense score (${score}/100, verdict "${verdict}") does not meet pass threshold (Score 65+ with Hire or Conditional Hire).`
        );
      }

      const defenseResult = {
        score,
        verdict,
        passed,
        topic,
        completedAt: new Date().toISOString(),
      };

      // Record defense result on enrollment
      await admin
        .from('internship_enrollments')
        .update({
          final_report_check: {
            defenseResult,
            matches: true,
          },
        })
        .eq('id', enrollment.id);

      updates.defenseResult = defenseResult;
    }

    return NextResponse.json({
      ok: true,
      ...updates,
      message: 'Demo URL and defense evaluation processed successfully.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

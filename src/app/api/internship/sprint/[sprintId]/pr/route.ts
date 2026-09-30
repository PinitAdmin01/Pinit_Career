import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { parseGithubPrLink, validatePrMatchesTeamRepo } from '@/lib/internships/sprints';
import { probePublicUrl } from '@/lib/server/publicUrlProbe';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(
  req: NextRequest,
  { params }: { params: { sprintId: string } }
) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const sprintId = params.sprintId;
    if (!sprintId) {
      return fail(400, 'SPRINT_ID_REQUIRED', 'Sprint ID is required.');
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const rawPrUrl = typeof body.prUrl === 'string' ? body.prUrl.trim() : '';

    if (!rawPrUrl) {
      return fail(400, 'PR_URL_REQUIRED', 'Please provide a pull request URL.');
    }

    // 1. Validate GitHub pull request link format
    const prParsed = parseGithubPrLink(rawPrUrl);
    if (!prParsed) {
      return fail(
        400,
        'INVALID_PR_URL',
        'Pull request URL must be in format https://github.com/<owner>/<repo>/pull/<number>.'
      );
    }

    const admin = getSupabaseAdmin();

    // 2. Lookup sprint
    const { data: sprint, error: sprintErr } = await admin
      .from('internship_sprints')
      .select('id, team_id, internship_enrollment_id, number, status')
      .eq('id', sprintId)
      .maybeSingle();

    if (sprintErr || !sprint) {
      return fail(404, 'SPRINT_NOT_FOUND', 'Sprint not found.');
    }

    // 3. Find the team's repository
    let teamRepoUrl = '';
    if (sprint.team_id) {
      const { data: team } = await admin
        .from('internship_teams')
        .select('repo_url')
        .eq('id', sprint.team_id)
        .maybeSingle();
      teamRepoUrl = team?.repo_url || '';
    }

    if (!teamRepoUrl) {
      return fail(
        400,
        'TEAM_REPO_REQUIRED',
        'Please register your team public GitHub repository first before submitting PR links.'
      );
    }

    // 4. Verify PR matches team repository
    const matchCheck = validatePrMatchesTeamRepo(prParsed.url, teamRepoUrl);
    if (!matchCheck.valid) {
      return fail(400, 'PR_REPO_MISMATCH', matchCheck.reason || 'PR does not belong to team repo.');
    }

    // 5. Probe PR public accessibility
    const probe = await probePublicUrl(prParsed.url);
    if (!probe.ok) {
      return fail(
        400,
        'PR_NOT_REACHABLE',
        'The pull request URL is not publicly accessible. Ensure the repository and PR are public.'
      );
    }

    // 6. Save PR link
    const { data: inserted, error: insertErr } = await admin
      .from('internship_pr_links')
      .insert({
        sprint_id: sprintId,
        student_id: userId,
        url: prParsed.url,
        checked_at: new Date().toISOString(),
      })
      .select('id, url, created_at')
      .single();

    if (insertErr || !inserted) {
      return fail(500, 'SAVE_FAILED', 'Could not record pull request link.');
    }

    return NextResponse.json({
      ok: true,
      prLink: inserted,
      message: 'Pull request link verified and recorded for this sprint.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

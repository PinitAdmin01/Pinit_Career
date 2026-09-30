import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { parseGithubLink } from '@/lib/courses/capstoneSprints';
import { probePublicUrl } from '@/lib/server/publicUrlProbe';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const rawRepoUrl = typeof body.repoUrl === 'string' ? body.repoUrl.trim() : '';

    if (!rawRepoUrl) {
      return fail(400, 'REPO_URL_REQUIRED', 'Please provide a repository URL.');
    }

    // 1. Validate GitHub format (must be repository root URL, not a subpath file/tree)
    const parsed = parseGithubLink(rawRepoUrl);
    if (!parsed || parsed.isPath) {
      return fail(
        400,
        'INVALID_GITHUB_REPO',
        'Repository URL must be a public GitHub repository root (e.g. https://github.com/owner/repo).'
      );
    }

    // 2. Probe public accessibility
    const probe = await probePublicUrl(parsed.repoUrl);
    if (!probe.ok) {
      return fail(
        400,
        'REPO_NOT_REACHABLE',
        'The GitHub repository is not publicly accessible. Please ensure it exists and is public.'
      );
    }

    const admin = getSupabaseAdmin();

    // 3. Find the student's assigned virtual team
    const { data: member, error: memErr } = await admin
      .from('internship_team_members')
      .select('team_id')
      .eq('student_id', userId)
      .limit(1)
      .maybeSingle();

    if (memErr || !member) {
      return fail(
        404,
        'NO_TEAM',
        'You are not currently assigned to a virtual internship team.'
      );
    }

    // 4. Update the team's repository URL
    const { error: updateErr } = await admin
      .from('internship_teams')
      .update({ repo_url: parsed.repoUrl })
      .eq('id', member.team_id);

    if (updateErr) {
      return fail(500, 'UPDATE_FAILED', 'Could not update team repository.');
    }

    return NextResponse.json({
      ok: true,
      repoUrl: parsed.repoUrl,
      message: 'Team repository successfully updated and verified.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

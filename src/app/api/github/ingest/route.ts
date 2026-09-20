import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { ingestGithubRepository, parseAndValidateGithubUrl } from '@/lib/github/githubIngestion';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json();
    const { repoUrl, studentUsername } = body || {};

    const validation = parseAndValidateGithubUrl(repoUrl);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error || 'Invalid GitHub URL' }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN || undefined;
    // DEF-040 Hardening: Require verified GitHub username from authenticated session; strictly forbid guessing from email prefix or untrusted body parameters
    const userMeta = (gated.user as any)?.user_metadata || {};
    const authenticatedUsername = (gated.user as any)?.githubUsername || userMeta.github_username || userMeta.user_name || (gated.user as any)?.username || undefined;
    const report = await ingestGithubRepository(repoUrl, token, authenticatedUsername);

    if (report.status === 'RATE_LIMITED') {
      return NextResponse.json({
        report,
        success: false,
        error: 'GitHub API rate limit reached. Please configure GITHUB_TOKEN on the server or try again later.'
      }, { status: 429 });
    }

    if (report.status === 'PRIVATE_OR_NOT_FOUND') {
      return NextResponse.json({
        report,
        success: false,
        error: 'GitHub repository is private or does not exist.'
      }, { status: 404 });
    }

    return NextResponse.json({
      report,
      success: report.status === 'VERIFIED' || report.status === 'PARTIAL'
    });
  } catch (err: any) {
    console.error('[GitHub Ingestion Error]:', err);
    return NextResponse.json({ error: err.message || 'Server ingestion error' }, { status: 500 });
  }
}

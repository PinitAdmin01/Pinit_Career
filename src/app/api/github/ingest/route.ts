import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { ingestGithubRepository, parseAndValidateGithubUrl } from '@/lib/github/githubIngestion';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const { repoUrl } = await req.json();

    const validation = parseAndValidateGithubUrl(repoUrl);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error || 'Invalid GitHub URL' }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN || undefined;
    const report = await ingestGithubRepository(repoUrl, token);

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

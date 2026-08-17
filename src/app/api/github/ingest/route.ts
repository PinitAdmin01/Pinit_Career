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

    const token = process.env.GITHUB_TOKEN;
    const report = await ingestGithubRepository(repoUrl, token);

    return NextResponse.json({
      report,
      success: report.status === 'VERIFIED'
    });
  } catch (err: any) {
    console.error('[GitHub Ingestion Error]:', err);
    return NextResponse.json({ error: err.message || 'Server ingestion error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PathwayApiService } from '@/lib/api/pathwayApi';

function verifyGitHubSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false; // Fail-closed
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    const a = Buffer.from(digest);
    const b = Buffer.from(signature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export interface LinkedStudentResult {
  verified: boolean;
  studentId?: string;
  error?: string;
}

const DEV_LINKED_ACCOUNTS: Record<string, { studentId: string; githubId: number; claimedRepos: string[] }> = {
  octocat: {
    studentId: 'stu_dev_octocat_01',
    githubId: 12345,
    claimedRepos: ['https://github.com/octocat/hello-world', 'https://github.com/octocat/repo'],
  },
  student_tester: {
    studentId: 'stu_dev_tester_01',
    githubId: 99999,
    claimedRepos: ['https://github.com/student/my-repo', 'https://github.com/student/my-docs', 'https://github.com/student/my-api'],
  },
};

export async function resolveLinkedStudent(
  githubUsername: string,
  githubId: number,
  repoUrl: string
): Promise<LinkedStudentResult> {
  const normalizedUser = (githubUsername || '').toLowerCase().trim();
  const normalizedRepo = (repoUrl || '').toLowerCase().trim().replace(/\.git$/, '');

  // 1. Query Supabase users or github_integrations table by github_username or github_id
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('github_integrations')
      .select('student_id, claimed_repos, github_username, github_id')
      .or(`github_username.ilike.${normalizedUser},github_id.eq.${githubId}`)
      .maybeSingle();

    if (!error && data?.student_id) {
      const claimed = Array.isArray(data.claimed_repos) ? data.claimed_repos : [];
      if (claimed.length === 0) {
        return {
          verified: false,
          error: 'REPOSITORY_UNCLAIMED',
        };
      }
      const isClaimed = claimed.some(
        (r: string) => (r || '').toLowerCase().trim().replace(/\.git$/, '') === normalizedRepo
      );
      if (!isClaimed) {
        return {
          verified: false,
          error: 'REPOSITORY_UNCLAIMED',
        };
      }
      return {
        verified: true,
        studentId: data.student_id,
      };
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('id, claimed_repos, github_username')
      .eq('github_username', normalizedUser)
      .maybeSingle();

    if (userProfile?.id) {
      const claimed = Array.isArray(userProfile.claimed_repos) ? userProfile.claimed_repos : [];
      if (claimed.length === 0) {
        return {
          verified: false,
          error: 'REPOSITORY_UNCLAIMED',
        };
      }
      const isClaimed = claimed.some(
        (r: string) => (r || '').toLowerCase().trim().replace(/\.git$/, '') === normalizedRepo
      );
      if (!isClaimed) {
        return {
          verified: false,
          error: 'REPOSITORY_UNCLAIMED',
        };
      }
      return {
        verified: true,
        studentId: userProfile.id,
      };
    }
  } catch (err) {
    console.warn('[GitHub Webhook] Supabase student resolution exception:', err);
  }

  // 2. Dev-only fallback for local testing & fixtures
  if (process.env.NODE_ENV !== 'production') {
    const devLinked = DEV_LINKED_ACCOUNTS[normalizedUser];
    if (devLinked) {
      const isClaimed = devLinked.claimedRepos.some(
        (r) => r.toLowerCase().trim().replace(/\.git$/, '') === normalizedRepo
      );
      if (!isClaimed) {
        return {
          verified: false,
          error: 'REPOSITORY_UNCLAIMED',
        };
      }
      return {
        verified: true,
        studentId: devLinked.studentId,
      };
    }
  }

  return {
    verified: false,
    error: 'UNLINKED_GITHUB_ACCOUNT: No CareerOS student profile is linked to this GitHub identity.',
  };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');
    const event = req.headers.get('x-github-event') || 'push';
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || '';

    // FAIL-CLOSED: GITHUB_WEBHOOK_SECRET is mandatory for receiving webhooks
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'WEBHOOK_NOT_CONFIGURED', message: 'GitHub webhook secret is not configured on the server.' },
        { status: 503 }
      );
    }

    if (!verifyGitHubSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (event === 'push') {
      const repoUrl = payload?.repository?.html_url || '';
      const repoName = payload?.repository?.name || 'repo';
      const commitSha = payload?.after || payload?.head_commit?.id || 'head';
      const commitMessage = payload?.head_commit?.message || 'Updated project source';
      const authorEmail = payload?.head_commit?.author?.email || 'student@pinit.app';
      const rawStudentLogin = payload?.sender?.login || 'student_github_user';
      const studentResolution = await resolveLinkedStudent(rawStudentLogin, payload?.sender?.id || 0, repoUrl);
      if (!studentResolution.verified) {
        return NextResponse.json(
          { error: studentResolution.error || 'GITHUB_VERIFICATION_FAILED' },
          { status: 403 }
        );
      }
      const studentId = studentResolution.studentId!;


      // Inspect commits for functional code files vs documentation/config files
      const commits = Array.isArray(payload?.commits) ? payload.commits : [payload?.head_commit].filter(Boolean);
      const allFiles: string[] = commits.flatMap((c: any) => [
        ...(Array.isArray(c?.added) ? c.added : []),
        ...(Array.isArray(c?.modified) ? c.modified : []),
      ]);

      const isDocsOnly = allFiles.length > 0 && allFiles.every(f =>
        /\.(md|txt|markdown|rst|gitignore|env\.example|license)$/i.test(f)
      );

      const hasFunctionalCode = allFiles.some(f =>
        /\.(ts|tsx|js|jsx|py|java|go|rs|cpp|c|sql|rb|php|cs)$/i.test(f)
      );

      const hasTests = allFiles.some(f =>
        /(test|spec|\.test\.|\.spec\.)/i.test(f)
      );

      // Defect 095: Reject docs-only commits from engineering competency
      if (isDocsOnly || (!hasFunctionalCode && allFiles.length > 0)) {
        return NextResponse.json({
          success: true,
          message: 'Documentation-only or non-functional commit ignored for competency evidence.',
          score: 0,
        });
      }

      // Calculate dynamic score based on commit file breadth, test presence, and multi-commit structure
      // Honest baseline: single unreviewed commit starts at 35 (never artificial 70-95 floor)
      let calculatedScore = 35;
      if (allFiles.length >= 5) {
        calculatedScore += 15;
      } else if (allFiles.length >= 2) {
        calculatedScore += 10;
      }

      if (hasTests) {
        calculatedScore += 20;
      }

      if (commits.length >= 4) {
        calculatedScore += 10;
      } else if (commits.length >= 2) {
        calculatedScore += 5;
      }

      if (commitMessage && commitMessage.trim().length >= 15 && !/^(wip|fix|test|update|chore)$/i.test(commitMessage.trim())) {
        calculatedScore += 5;
      }

      // Automated unreviewed push webhooks are capped at 75 (never 95 "advanced production" without mentor review)
      const dynamicScore = Math.min(75, Math.max(35, calculatedScore));

      // Infer target competency based on repo name or message
      let targetCompId = 'comp_git_version_control_l1';
      if (repoName.includes('api') || repoName.includes('backend')) {
        targetCompId = 'comp_backend_apis_frameworks_l3';
      } else if (repoName.includes('cloud') || repoName.includes('devops')) {
        targetCompId = 'comp_cicd_cloud_devops_l4';
      } else if (repoName.includes('sql') || repoName.includes('db')) {
        targetCompId = 'comp_database_sql_internals_l3';
      }

      // Determine difficulty honestly: basic unless multi-file with verified test suites
      const assessedDifficulty = (hasTests && allFiles.length >= 5) ? 'intermediate' : 'basic';

      // Record authentic project evidence with genuine GitHub commit SHA & dynamic score
      // Single commits represent 'application' competency, never 'production' (which requires live deployment/infrastructure)
      const evidence = await PathwayApiService.recordEvidence({
        id: `ev_github_${commitSha.slice(0, 12)}_${Date.now()}`,
        competencyId: targetCompId,
        competencyVersion: '1.0.0',
        studentId,
        programId: 'prog_swe_accelerated_9m',
        evidenceClass: 'application',
        difficulty: assessedDifficulty,
        evidenceFamilyId: `github_${repoName}`,
        sourceType: 'project',
        sourceId: `repo_${repoName}`,
        attemptId: `commit_${commitSha.slice(0, 7)}`,
        score: dynamicScore,
        evaluatorType: 'deterministic',
        evaluatorVersion: 'github-webhook-ingest-v2',
        rubricVersion: 'rubric-git-commits',
        timestamp: Date.now(),
        artifacts: {
          repoUrl,
          githubRepoUrl: repoUrl,
          commitSha,
          executionLogSnippet: `Verified GitHub push to ${repoName} (${allFiles.length} files). Message: "${commitMessage}" by ${authorEmail}`,
        }
      });

      return NextResponse.json({
        success: true,
        message: 'GitHub commit ingested and sealed to competency ledger',
        evidenceRecordId: evidence.evidenceRecord.id,
        integrityHash: evidence.evidenceRecord.integrityHash,
      });
    }

    return NextResponse.json({ success: true, message: `Event ${event} acknowledged` });
  } catch (err: any) {
    console.error('GitHub Webhook processing error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

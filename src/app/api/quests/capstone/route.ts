import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { toCourseEnrollment } from '@/lib/server/courseEnrollments';
import { parsePublicHttpsUrl, probePublicUrl, type ProbeResult } from '@/lib/server/publicUrlProbe';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { getCrashPlanById } from '@/lib/data/crashPlansData';
import { getCrashCourseCurriculum } from '@/lib/courses/crashCourseProgress';
import {
  courseDefenseTopic,
  nextCapstoneSprint,
  parseCapstoneSubmission,
  parseGithubLink,
  sameGithubRepo,
  type CapstoneMilestones,
} from '@/lib/courses/capstoneSprints';
import { verifyTopicEvaluationSignature } from '@/lib/interview/evaluationSignature';
import { isCapstoneInterviewPassed } from '@/lib/interview/capstoneInterview';

const TABLE = 'user_crash_enrollments';

const fail = (status: number, error: string, message: string) => NextResponse.json({ ok: false, error, message }, { status });

/** A failed check on a GitHub link: missing/private is the student's to fix; GitHub being down is not. */
function githubFailure(probe: Exclude<ProbeResult, { ok: true }>, what: string) {
  if (probe.reason === 'NOT_FOUND') {
    return fail(422, 'GITHUB_NOT_FOUND', `We could not find your ${what} on GitHub. Check the link and make sure the repository is public.`);
  }
  return fail(503, 'GITHUB_UNAVAILABLE', 'GitHub could not be reached to check your link. Please try again in a minute.');
}

/**
 * Submits one capstone sprint of the student's certificate course. The server checks it
 * (the course's lessons are all done, sprints are submitted in order, links really exist, the
 * defense result was signed by PinIT for this course's defense topic) and only then records it on
 * the enrollment. The browser never writes milestones itself.
 */
export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    const rl = checkRateLimit(`capstone_submit_${userId}`, { limit: 10, windowMs: 600_000 });
    if (!rl.allowed) return fail(429, 'RATE_LIMIT', 'Too many submissions. Please wait a few minutes and try again.');

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId : '';
    if (!enrollmentId) return fail(400, 'ENROLLMENT_REQUIRED', 'Which course enrollment is this for?');
    const parsed = parseCapstoneSubmission(body);
    if (!parsed.ok) return fail(400, 'INVALID_SUBMISSION', parsed.message);
    const submission = parsed.submission;

    const admin = getSupabaseAdmin();
    const { data: row, error: rowErr } = await admin
      .from(TABLE)
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    if (rowErr) return fail(503, 'ENROLLMENT_LOOKUP_FAILED', 'Could not load your course. Please try again.');
    if (!row) return fail(404, 'ENROLLMENT_NOT_FOUND', 'No active course enrollment was found.');
    const enrollment = toCourseEnrollment(row as Parameters<typeof toCourseEnrollment>[0]);

    const plan = getCrashPlanById(enrollment.planId);
    if (!plan) return fail(409, 'PLAN_UNKNOWN', 'This course is no longer available.');

    // Phase 1 must really be done: every lesson of this course, as recorded by the server.
    const { data: user, error: userErr } = await admin.from('users').select('completed_quests').eq('id', userId).maybeSingle();
    if (userErr || !user) return fail(503, 'PROFILE_UNAVAILABLE', 'Could not load your progress. Please try again.');
    const done = new Set<string>(Array.isArray(user.completed_quests) ? (user.completed_quests as string[]) : []);
    const lessons = getCrashCourseCurriculum(plan, enrollment.track, COURSES_REGISTRY);
    const missing = lessons.filter((l) => !done.has(l.questId)).length;
    if (lessons.length === 0 || missing > 0) {
      return fail(409, 'TRAINING_NOT_COMPLETE', `Finish every lesson of your course first (${missing} left).`);
    }

    const milestones = (enrollment.milestoneProgress || {}) as CapstoneMilestones;
    const expected = nextCapstoneSprint(milestones);
    if (expected === null) return fail(409, 'CAPSTONE_ALREADY_COMPLETE', 'Your capstone is already complete.');
    if (submission.sprint < expected) return fail(409, 'SPRINT_ALREADY_APPROVED', `Sprint ${submission.sprint} is already approved.`);
    if (submission.sprint > expected) return fail(409, 'SPRINT_LOCKED', `Complete Sprint ${expected} first.`);

    const now = new Date().toISOString();
    let updates: Partial<CapstoneMilestones>;
    let approved = true;
    let message = `Sprint ${submission.sprint} approved.`;

    if (submission.sprint === 1) {
      const repo = parseGithubLink(submission.repoUrl);
      if (!repo || repo.isPath) return fail(400, 'INVALID_REPO_URL', 'Enter your repository link, like https://github.com/you/your-project.');
      const design = parseGithubLink(submission.designUrl);
      if (!design || !design.isPath || !sameGithubRepo(repo, design)) {
        return fail(400, 'INVALID_DESIGN_URL', 'Link a design file or folder inside your repository (open it on GitHub and copy the address).');
      }
      const repoProbe = await probePublicUrl(repo.repoUrl);
      if (!repoProbe.ok) return githubFailure(repoProbe, 'repository');
      const designProbe = await probePublicUrl(design.url);
      if (!designProbe.ok) return githubFailure(designProbe, 'design file or folder');
      updates = { sprint1Approved: true, sprint1RepoUrl: repo.repoUrl, sprint1DesignUrl: design.url, sprint1ApprovedAt: now };
    } else if (submission.sprint === 2) {
      const repo = parseGithubLink(milestones.sprint1RepoUrl);
      if (!repo) return fail(409, 'REPO_MISSING', 'Submit Sprint 1 with your repository first.');
      const api = parseGithubLink(submission.apiUrl);
      if (!api || !api.isPath || !sameGithubRepo(repo, api)) {
        return fail(400, 'INVALID_API_URL', `Link a file or folder with your API code inside ${repo.repoUrl}.`);
      }
      const apiProbe = await probePublicUrl(api.url);
      if (!apiProbe.ok) return githubFailure(apiProbe, 'API code');
      updates = { sprint2Approved: true, sprint2ApiUrl: api.url, sprint2ApprovedAt: now };
    } else if (submission.sprint === 3) {
      const repo = parseGithubLink(milestones.sprint1RepoUrl);
      if (!repo) return fail(409, 'REPO_MISSING', 'Submit Sprint 1 with your repository first.');
      const live = parsePublicHttpsUrl(submission.liveUrl);
      if (!live) return fail(400, 'INVALID_LIVE_URL', 'Enter the https address where your project is deployed.');
      if (/(^|\.)github\.com$/i.test(live.hostname)) {
        return fail(400, 'INVALID_LIVE_URL', 'That is your code on GitHub. Enter the address where the project runs.');
      }
      const repoProbe = await probePublicUrl(repo.repoUrl);
      if (!repoProbe.ok) return githubFailure(repoProbe, 'repository');
      const liveProbe = await probePublicUrl(live.toString());
      if (!liveProbe.ok) {
        if (liveProbe.reason === 'RATE_LIMITED') return fail(503, 'LIVE_URL_BUSY', 'Your site asked us to slow down. Please try again in a minute.');
        const detail = liveProbe.status ? ` (it answered ${liveProbe.status})` : '';
        return fail(422, 'LIVE_URL_UNREACHABLE', `Your live URL did not respond${detail}. Check that the deployment is public and running.`);
      }
      updates = { sprint3RepoUrl: repo.repoUrl, sprint3LiveUrl: live.toString(), sprint3ApprovedAt: now };
    } else {
      const topic = courseDefenseTopic(plan, enrollment.track);
      if (!verifyTopicEvaluationSignature(userId, submission.score, submission.verdict, topic, submission.topicToken)) {
        return fail(403, 'DEFENSE_NOT_VERIFIED', 'This result is not from your capstone defense interview.');
      }
      const score = Math.round(submission.score);
      const attempt = { score, verdict: submission.verdict, at: now };
      if (isCapstoneInterviewPassed(submission.verdict, score)) {
        updates = { sprint4DefenseScore: score, sprint4Verdict: submission.verdict, sprint4ApprovedAt: now, sprint4LastAttempt: attempt };
        message = 'Capstone defense passed. Your capstone is complete.';
      } else {
        approved = false;
        updates = { sprint4LastAttempt: attempt };
        message = `Not passed yet (${submission.verdict}, ${score}). You can take the defense again.`;
      }
    }

    const merged: CapstoneMilestones = { ...milestones, ...updates };
    const currentSprint = nextCapstoneSprint(merged) ?? 4;
    const rowWithStamp = row as { updated_at?: string };
    let update = admin
      .from(TABLE)
      .update({ milestone_progress: merged, current_sprint: currentSprint })
      .eq('enrollment_id', enrollmentId)
      .eq('user_id', userId);
    // Compare-and-swap: a submission that raced with another one must not overwrite it.
    if (rowWithStamp.updated_at) update = update.eq('updated_at', rowWithStamp.updated_at);
    const { data: saved, error: saveErr } = await update.select('*').maybeSingle();
    if (saveErr) return fail(503, 'SAVE_FAILED', 'Could not save your submission. Please try again.');
    if (!saved) return fail(409, 'CONFLICT', 'Your course changed while submitting. Please try again.');

    return NextResponse.json({
      ok: true,
      sprint: submission.sprint,
      approved,
      message,
      enrollment: toCourseEnrollment(saved as Parameters<typeof toCourseEnrollment>[0]),
    });
  } catch (err: unknown) {
    console.error('[quests/capstone] error:', err);
    return fail(500, 'SUBMIT_FAILED', 'Could not submit your sprint. Please try again.');
  }
}

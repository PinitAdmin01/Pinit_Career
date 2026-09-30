import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { getStudentTeam, matchPendingTeams } from '@/lib/internships/teams';

const fail = (status: number, error: string, message: string) =>
  NextResponse.json({ ok: false, error, message }, { status });

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // 1. Check if user already has an assigned team
    const teamData = await getStudentTeam(userId);
    if (teamData.team) {
      return NextResponse.json({
        ok: true,
        inQueue: false,
        team: teamData.team,
        members: teamData.members,
        isSolo: teamData.isSolo,
      });
    }

    // 2. If not, check if student has an active Tier 2 enrollment in matching queue
    const admin = getSupabaseAdmin();
    const { data: enrollment, error: enrErr } = await admin
      .from('internship_enrollments')
      .select('id, started_at, created_at, status, tier')
      .eq('student_id', userId)
      .eq('tier', 't2_virtual_team')
      .in('status', ['generating', 'active'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (enrErr) {
      return fail(500, 'LOOKUP_FAILED', 'Could not check your matching status.');
    }

    if (!enrollment) {
      return fail(
        404,
        'NO_TIER2_ENROLLMENT',
        'No active Tier 2 virtual internship enrollment found for this account.'
      );
    }

    const joinedQueueAt = enrollment.started_at || enrollment.created_at;
    const daysWaiting = Math.floor(
      (Date.now() - new Date(joinedQueueAt).getTime()) / (24 * 60 * 60 * 1000)
    );

    return NextResponse.json({
      ok: true,
      inQueue: true,
      enrollmentId: enrollment.id,
      joinedQueueAt,
      daysWaiting,
      isSolo: false,
      team: null,
      members: [],
      message: 'You are currently in the team matching queue. Teams are formed every 7 days (or minimum 3 peers).',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const userId = gated.user.id;

    // 1. Fast path: check if user already has a team
    const existing = await getStudentTeam(userId);
    if (existing.team) {
      return NextResponse.json({
        ok: true,
        matched: true,
        inQueue: false,
        team: existing.team,
        members: existing.members,
        isSolo: existing.isSolo,
      });
    }

    // 2. Trigger team matching pass for all pending Tier 2 students
    await matchPendingTeams();

    // 3. Re-check if this student got matched into a team
    const fresh = await getStudentTeam(userId);
    if (fresh.team) {
      return NextResponse.json({
        ok: true,
        matched: true,
        inQueue: false,
        team: fresh.team,
        members: fresh.members,
        isSolo: fresh.isSolo,
      });
    }

    return NextResponse.json({
      ok: true,
      matched: false,
      inQueue: true,
      message: 'Still in matching queue. Teams require 3-4 students (or 7 days waiting for solo mode).',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(500, 'SERVER_ERROR', message);
  }
}

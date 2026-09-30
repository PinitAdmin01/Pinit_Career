import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import type {
  InternshipTeamRow,
  InternshipTeamMemberRow,
  ClientInternshipTeam,
  ClientInternshipTeamMember,
} from './types';
import { teamToClient, teamMemberToClient } from './toClient';

export interface TeamQueueEntry {
  studentId: string;
  enrollmentId: string;
  joinedQueueAt: string | Date;
  track?: string;
  displayName?: string;
  email?: string;
}

export interface FormedTeam {
  id?: string;
  tier: string;
  isSolo: boolean;
  members: TeamQueueEntry[];
  windowStart?: string;
  createdAt?: string;
}

export interface FormTeamsResult {
  teams: FormedTeam[];
  leftovers: TeamQueueEntry[];
}

/**
 * Determines optimal team partition sizes for N students with min and max bounds.
 * Maximizes the total number of assigned students while minimizing leftovers.
 */
export function findTeamSizes(n: number, min: number = 3, max: number = 4): number[] {
  if (n < min) return [];

  // Try exact combinations of max (4) and min (3) that sum to n
  for (let numMax = Math.floor(n / max); numMax >= 0; numMax--) {
    const rem = n - numMax * max;
    if (rem % min === 0) {
      const numMin = rem / min;
      const res: number[] = [];
      for (let i = 0; i < numMax; i++) res.push(max);
      for (let i = 0; i < numMin; i++) res.push(min);
      return res;
    }
  }

  // If no exact match (e.g. n = 5):
  // Find the largest target < n that can be partitioned into [min, max]
  for (let target = n - 1; target >= min; target--) {
    const sub = findTeamSizes(target, min, max);
    if (sub.length > 0) {
      return sub;
    }
  }

  return [];
}

/**
 * Pure function: groups queued students into teams of min..max (3..4).
 * Leftovers waiting >= windowDays (7 days) go solo to prevent indefinite blocking.
 */
export function formTeams(
  queue: TeamQueueEntry[],
  windowDays: number = 7,
  min: number = 3,
  max: number = 4,
  options?: { now?: Date | string }
): FormTeamsResult {
  if (!queue || queue.length === 0) {
    return { teams: [], leftovers: [] };
  }

  const now = options?.now ? new Date(options.now) : new Date();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  // Sort queue ascending by joinedQueueAt (first-in-first-out / longest waiting gets priority)
  const sorted = [...queue].sort((a, b) => {
    return new Date(a.joinedQueueAt).getTime() - new Date(b.joinedQueueAt).getTime();
  });

  const sizes = findTeamSizes(sorted.length, min, max);
  const teams: FormedTeam[] = [];
  let offset = 0;

  for (const size of sizes) {
    const members = sorted.slice(offset, offset + size);
    teams.push({
      tier: 't2_virtual_team',
      isSolo: false,
      members,
      windowStart: new Date(members[0].joinedQueueAt).toISOString().split('T')[0],
      createdAt: now.toISOString(),
    });
    offset += size;
  }

  const unassigned = sorted.slice(offset);
  const waitingLeftovers: TeamQueueEntry[] = [];

  for (const leftover of unassigned) {
    const waitTime = now.getTime() - new Date(leftover.joinedQueueAt).getTime();
    if (waitTime >= windowMs) {
      // Leftovers after windowDays (7 days) go solo
      teams.push({
        tier: 't2_virtual_team',
        isSolo: true,
        members: [leftover],
        windowStart: new Date(leftover.joinedQueueAt).toISOString().split('T')[0],
        createdAt: now.toISOString(),
      });
    } else {
      waitingLeftovers.push(leftover);
    }
  }

  return {
    teams,
    leftovers: waitingLeftovers,
  };
}

/**
 * Looks up the student's assigned virtual team, if any.
 */
export async function getStudentTeam(studentId: string): Promise<{
  team: ClientInternshipTeam | null;
  members: ClientInternshipTeamMember[];
  isSolo: boolean;
}> {
  const admin = getSupabaseAdmin();

  // Find team member record for this student
  const { data: memberRow, error: memberErr } = await admin
    .from('internship_team_members')
    .select('team_id, student_id, internship_enrollment_id, stories')
    .eq('student_id', studentId)
    .limit(1)
    .maybeSingle();

  if (memberErr || !memberRow) {
    return { team: null, members: [], isSolo: false };
  }

  // Find team record
  const { data: teamRow, error: teamErr } = await admin
    .from('internship_teams')
    .select('*')
    .eq('id', (memberRow as { team_id: string }).team_id)
    .maybeSingle();

  if (teamErr || !teamRow) {
    return { team: null, members: [], isSolo: false };
  }

  // Fetch all members of this team
  const { data: allMembers } = await admin
    .from('internship_team_members')
    .select('team_id, student_id, internship_enrollment_id, stories')
    .eq('team_id', (teamRow as { id: string }).id);

  const clientTeam = teamToClient(teamRow as InternshipTeamRow);
  const clientMembers = ((allMembers as InternshipTeamMemberRow[]) || []).map(teamMemberToClient);
  const isSolo = Boolean(
    (clientTeam.projectBrief as Record<string, unknown> | null)?.isSolo || clientMembers.length === 1
  );

  return {
    team: clientTeam,
    members: clientMembers,
    isSolo,
  };
}

/**
 * Server database matching runner:
 * Reads unmatched Tier 2 students in queue, runs formTeams, and persists created teams.
 */
export async function matchPendingTeams(options?: { now?: Date | string }): Promise<{
  matchedTeams: number;
  soloTeams: number;
  remainingInQueue: number;
}> {
  const admin = getSupabaseAdmin();
  const now = options?.now ? new Date(options.now) : new Date();

  // 1. Fetch all Tier 2 enrollments in generating or active status
  const { data: enrollments, error: enrErr } = await admin
    .from('internship_enrollments')
    .select('id, student_id, created_at, started_at, track')
    .eq('tier', 't2_virtual_team')
    .in('status', ['generating', 'active']);

  if (enrErr || !enrollments || enrollments.length === 0) {
    return { matchedTeams: 0, soloTeams: 0, remainingInQueue: 0 };
  }

  // 2. Fetch existing team members to filter out already-assigned students
  const enrollmentIds = enrollments.map((e) => e.id);
  const { data: assignedMembers } = await admin
    .from('internship_team_members')
    .select('internship_enrollment_id')
    .in('internship_enrollment_id', enrollmentIds);

  const assignedSet = new Set((assignedMembers || []).map((m) => m.internship_enrollment_id));

  // 3. Build queue of unassigned students
  const queue: TeamQueueEntry[] = enrollments
    .filter((e) => !assignedSet.has(e.id))
    .map((e) => ({
      studentId: e.student_id,
      enrollmentId: e.id,
      joinedQueueAt: e.started_at || e.created_at,
      track: e.track,
    }));

  if (queue.length === 0) {
    return { matchedTeams: 0, soloTeams: 0, remainingInQueue: 0 };
  }

  // 4. Form teams
  const result = formTeams(queue, 7, 3, 4, { now });

  let matchedTeamsCount = 0;
  let soloTeamsCount = 0;

  // 5. Insert created teams and team members into the database
  for (const team of result.teams) {
    const { data: insertedTeam, error: teamErr } = await admin
      .from('internship_teams')
      .insert({
        tier: 't2_virtual_team',
        status: 'active',
        project_brief: team.isSolo ? { isSolo: true } : null,
        window_start: team.windowStart || now.toISOString().split('T')[0],
      })
      .select('id')
      .single();

    if (teamErr || !insertedTeam) {
      console.error('[matchPendingTeams] Failed to create team:', teamErr);
      continue;
    }

    const teamId = (insertedTeam as { id: string }).id;

    // Insert team members
    const memberRows = team.members.map((m) => ({
      team_id: teamId,
      student_id: m.studentId,
      internship_enrollment_id: m.enrollmentId,
      stories: null,
    }));

    await admin.from('internship_team_members').insert(memberRows);

    // Update enrollment status to active if generating, and set due date to 4 weeks (28 days)
    const dueAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString();
    for (const m of team.members) {
      await admin
        .from('internship_enrollments')
        .update({
          status: 'active',
          started_at: m.joinedQueueAt instanceof Date ? m.joinedQueueAt.toISOString() : m.joinedQueueAt,
          due_at: dueAt,
        })
        .eq('id', m.enrollmentId);
    }

    if (team.isSolo) {
      soloTeamsCount++;
    } else {
      matchedTeamsCount++;
    }
  }

  return {
    matchedTeams: matchedTeamsCount,
    soloTeams: soloTeamsCount,
    remainingInQueue: result.leftovers.length,
  };
}

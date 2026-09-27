import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { InternshipRecord } from '@/lib/pathway/competencySchema';

/**
 * Internship records.
 * - Details live in users.onboarding_answers.internships.
 * - Verification lives only in internship_records.verified, which only the server writes
 *   (students can also write onboarding_answers through the onboarding endpoint, so a flag
 *   stored there proves nothing).
 * Students add and edit their own records; they can never mark one verified, and editing a
 * record resets its verification.
 */

type AdminClient = ReturnType<typeof getSupabaseAdmin>;

interface InternshipRow {
  id: string;
  student_id: string;
  company_name: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  skills_used: unknown;
  verified: boolean | null;
  verified_by: string | null;
  created_at: string | null;
}

const ROW_COLUMNS = 'id, student_id, company_name, role, start_date, end_date, description, skills_used, verified, verified_by, created_at';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string' && s.trim() !== '') : [];

function isRecordLike(v: unknown): v is InternshipRecord {
  return !!v && typeof v === 'object' && typeof (v as { id?: unknown }).id === 'string';
}

function rowToRecord(row: InternshipRow): InternshipRecord {
  const description = row.description || '';
  const verified = Boolean(row.verified);
  return {
    id: row.id,
    studentId: row.student_id,
    companyName: row.company_name,
    role: row.role,
    startDate: row.start_date || '',
    endDate: row.end_date || undefined,
    skillsUsed: strList(row.skills_used),
    projectDescription: description,
    description,
    isVerified: verified,
    verified,
    verifiedBy: verified ? row.verified_by || undefined : undefined,
    type: 'campus_internship',
    createdAt: (row.created_at && Date.parse(row.created_at)) || Date.now(),
  };
}

/** Details from the answers; verification only from the table. Newest start date first. */
function mergeRecords(answers: InternshipRecord[], rows: InternshipRow[]): InternshipRecord[] {
  const rowsById = new Map(rows.map((r) => [r.id, r]));
  const merged: InternshipRecord[] = answers.map((rec) => {
    const row = rowsById.get(rec.id);
    rowsById.delete(rec.id);
    const verified = Boolean(row?.verified);
    return { ...rec, isVerified: verified, verified, verifiedBy: verified ? row?.verified_by || undefined : undefined };
  });
  rowsById.forEach((row) => merged.push(rowToRecord(row)));
  return merged.sort(
    (a, b) => (b.startDate || '').localeCompare(a.startDate || '') || (b.createdAt || 0) - (a.createdAt || 0)
  );
}

async function loadAnswers(supabase: AdminClient, studentId: string) {
  const { data, error } = await supabase.from('users').select('onboarding_answers').eq('id', studentId).maybeSingle();
  if (error) throw new Error(`Could not load profile: ${error.message}`);
  const answers = ((data?.onboarding_answers as Record<string, unknown> | null) ?? {}) as Record<string, unknown>;
  const list = Array.isArray(answers.internships) ? answers.internships.filter(isRecordLike) : [];
  return { answers, list };
}

async function loadRows(supabase: AdminClient, studentId: string): Promise<InternshipRow[]> {
  const { data, error } = await supabase.from('internship_records').select(ROW_COLUMNS).eq('student_id', studentId);
  if (error) {
    console.warn('[internships] internship_records read failed:', error.message);
    return [];
  }
  return (data ?? []) as InternshipRow[];
}

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();
    const { list } = await loadAnswers(supabase, studentId);
    const rows = await loadRows(supabase, studentId);

    return NextResponse.json({ ok: true, internships: mergeRecords(list, rows) });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ ok: false, error: 'INVALID_BODY' }, { status: 400 });
    }

    const id = str(body.id) || `internship_${crypto.randomUUID()}`;
    const startDate = str(body.startDate) || new Date().toISOString().slice(0, 10);
    const endDate = str(body.endDate) || undefined;
    if (!DATE_RE.test(startDate) || (endDate && !DATE_RE.test(endDate))) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_DATE', message: 'Dates must be in YYYY-MM-DD format.' },
        { status: 400 }
      );
    }

    // A record id that belongs to another student can never be written (the admin client bypasses RLS).
    const { data: owner, error: ownerErr } = await supabase
      .from('internship_records')
      .select('student_id')
      .eq('id', id)
      .maybeSingle();
    if (!ownerErr && owner && owner.student_id !== studentId) {
      return NextResponse.json({ ok: false, error: 'RECORD_NOT_OWNED' }, { status: 403 });
    }

    const description = str(body.description);
    const record: InternshipRecord = {
      id,
      studentId,
      companyName: str(body.companyName) || str(body.company) || 'Enterprise Partner',
      role: str(body.role) || 'Software Engineering Resident',
      startDate,
      endDate,
      description,
      projectDescription: str(body.projectDescription) || description,
      mentorName: str(body.mentorName) || undefined,
      mentorContact: str(body.mentorContact) || undefined,
      performanceRating: str(body.performanceRating) || undefined,
      certificateUrl: str(body.certificateUrl) || undefined,
      // Never taken from the request: only internship_records.verified (server) can verify.
      isVerified: false,
      verified: false,
      skillsUsed: strList(body.skillsUsed),
      deliverables: strList(body.deliverables),
      type: body.type === 'external_employment' ? 'external_employment' : 'campus_internship',
      createdAt: typeof body.createdAt === 'number' ? body.createdAt : Date.now(),
    };

    if (!ownerErr) {
      const { error: tableErr } = await supabase.from('internship_records').upsert({
        id,
        student_id: studentId,
        company_name: record.companyName,
        role: record.role,
        start_date: startDate,
        end_date: endDate ?? null,
        description: record.projectDescription || description,
        skills_used: record.skillsUsed,
        verified: false,
        verified_by: null,
        verified_at: null,
        updated_at: new Date().toISOString(),
      });
      if (tableErr) console.error('[internships] internship_records write failed:', tableErr.message);
    } else {
      console.error('[internships] internship_records unavailable:', ownerErr.message);
    }

    const { answers, list } = await loadAnswers(supabase, studentId);
    const internships = [record, ...list.filter((item) => item.id !== id)];
    const { error: saveErr } = await supabase
      .from('users')
      .update({ onboarding_answers: { ...answers, internships } })
      .eq('id', studentId);
    if (saveErr) {
      return NextResponse.json({ ok: false, error: 'SAVE_FAILED', message: saveErr.message }, { status: 500 });
    }

    const rows = await loadRows(supabase, studentId);
    return NextResponse.json({ ok: true, success: true, record, internships: mergeRecords(internships, rows) });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'INTERNAL_ERROR' }, { status: 500 });
  }
}

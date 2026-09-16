import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { InternshipRecord } from '@/lib/pathway/competencySchema';

export async function GET(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();

    // 1. Check dedicated internship_records table if exists
    try {
      const { data: records, error } = await supabase
        .from('internship_records')
        .select('*')
        .eq('student_id', studentId)
        .order('start_date', { ascending: false });

      if (!error && records && records.length > 0) {
        return NextResponse.json({ ok: true, internships: records });
      }
    } catch {}

    // 2. Fallback to users.onboarding_answers.internships
    const { data: userRow } = await supabase
      .from('users')
      .select('onboarding_answers')
      .eq('id', studentId)
      .maybeSingle();

    const ob = userRow?.onboarding_answers || {};
    const internships: InternshipRecord[] = Array.isArray(ob.internships) ? ob.internships : [];

    return NextResponse.json({ ok: true, internships });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const supabase = getSupabaseAdmin();
    const body = await req.json();
    const record: InternshipRecord = {
      id: body.id || `internship_${crypto.randomUUID()}`,
      studentId,
      companyName: body.companyName || body.company || 'Enterprise Partner',
      role: body.role || 'Software Engineering Resident',
      startDate: body.startDate || new Date().toISOString().slice(0, 10),
      endDate: body.endDate || undefined,
      description: body.description || '',
      projectDescription: body.projectDescription || body.description || '',
      isVerified: !!body.verified || !!body.isVerified,
      verified: !!body.verified || !!body.isVerified,
      verifiedBy: body.verifiedBy,
      skillsUsed: Array.isArray(body.skillsUsed) ? body.skillsUsed : [],
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : [],
      type: body.type || 'campus_internship',
      createdAt: body.createdAt || Date.now()
    };

    // 1. Try dedicated table
    try {
      await supabase.from('internship_records').upsert({
        id: record.id,
        student_id: studentId,
        company_name: record.companyName,
        role: record.role,
        start_date: record.startDate,
        end_date: record.endDate,
        description: record.description,
        verified: record.verified,
        verified_by: record.verifiedBy,
        skills_used: record.skillsUsed,
      });
    } catch {}

    // 2. Persist into users.onboarding_answers.internships
    const { data: userRow } = await supabase
      .from('users')
      .select('onboarding_answers')
      .eq('id', studentId)
      .maybeSingle();

    const ob = { ...(userRow?.onboarding_answers || {}) };
    const existing = Array.isArray(ob.internships) ? ob.internships : [];
    const filtered = existing.filter((item: any) => item.id !== record.id);
    filtered.unshift(record);
    ob.internships = filtered;

    await supabase
      .from('users')
      .update({ onboarding_answers: ob })
      .eq('id', studentId);

    return NextResponse.json({ ok: true, success: true, record, internships: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireFacultyOrAdminUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const auth = await requireFacultyOrAdminUserFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();
    const { studentId, marks, examId, score, totalMarks } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const recordsToInsert: Array<{
      exam_id: string;
      student_id: string;
      score: number;
      total_marks: number;
      graded_at: string;
    }> = [];

    const now = new Date().toISOString();

    // 1. Direct single exam submission: { studentId, examId, score, totalMarks }
    if (examId && (score !== undefined || marks?.score !== undefined)) {
      const finalScore = Number(score !== undefined ? score : marks?.score);
      const finalTotal = Number(totalMarks !== undefined ? totalMarks : (marks?.totalMarks || 100));
      recordsToInsert.push({
        exam_id: String(examId),
        student_id: String(studentId),
        score: isNaN(finalScore) ? 0 : finalScore,
        total_marks: isNaN(finalTotal) || finalTotal <= 0 ? 100 : finalTotal,
        graded_at: now,
      });
    } else if (marks && typeof marks === 'object') {
      // 2. Marks dictionary: { [examId]: score } or { [examId]: { score, totalMarks } }
      for (const [eId, val] of Object.entries(marks)) {
        if (typeof val === 'number' || typeof val === 'string') {
          const numScore = Number(val);
          recordsToInsert.push({
            exam_id: String(eId),
            student_id: String(studentId),
            score: isNaN(numScore) ? 0 : numScore,
            total_marks: Number(totalMarks) || 100,
            graded_at: now,
          });
        } else if (val && typeof val === 'object') {
          const item = val as any;
          const numScore = Number(item.score);
          const numTotal = Number(item.totalMarks || totalMarks || 100);
          recordsToInsert.push({
            exam_id: String(item.examId || eId),
            student_id: String(studentId),
            score: isNaN(numScore) ? 0 : numScore,
            total_marks: isNaN(numTotal) || numTotal <= 0 ? 100 : numTotal,
            graded_at: now,
          });
        }
      }
    }

    // Persist records into authoritative campus_exam_results table
    if (recordsToInsert.length > 0) {
      for (const record of recordsToInsert) {
        const { error: upsertErr } = await admin
          .from('campus_exam_results')
          .upsert(record, { onConflict: 'exam_id,student_id' });

        if (upsertErr) {
          console.warn('[Teacher Submit Marks] Upsert notice:', upsertErr.message);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      studentId,
      recordsSaved: recordsToInsert.length,
      marks: marks || (examId ? { [examId]: score } : {}),
      recordedBy: auth.user.id,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    console.error('[Teacher Submit Marks Exception]:', err?.message);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { gradeCourseTest } from '@/lib/courses/gradeTest';
import { signPassReceipt } from '@/lib/server/passReceipt';

/**
 * POST /api/quests/grade-test  { questId, answers: (number | null)[] }
 * Marks a course test on the server. A pass returns a signed receipt that /api/quest/complete
 * requires before it records the test as completed.
 */
export async function POST(req: Request) {
  const gated = await requireUserFromRequest(req);
  if (gated.error) return gated.error;

  const body = (await req.json().catch(() => ({}))) as { questId?: unknown; answers?: unknown };
  const questId = typeof body.questId === 'string' ? body.questId.trim() : '';
  const grade = gradeCourseTest(questId, body.answers);
  if (!grade.ok) {
    const message = grade.error === 'BAD_ANSWERS' ? 'Answer every question before submitting.' : 'This is not a course test.';
    return NextResponse.json({ ok: false, error: grade.error, message }, { status: 400 });
  }
  const { correct, total, percent, passed } = grade;
  return NextResponse.json({
    ok: true,
    passed,
    correct,
    total,
    percent,
    receipt: passed ? signPassReceipt(gated.user.id, questId) : null,
  });
}

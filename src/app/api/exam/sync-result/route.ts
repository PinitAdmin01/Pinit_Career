import { NextResponse } from 'next/server';
import { examsService } from '@/lib/services/examsService';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const user = gated.user!;
    const body = await req.json().catch(() => ({}));

    const examId = typeof body?.examId === 'string' ? body.examId.trim() : '';
    if (!examId) {
      return NextResponse.json({ error: 'Valid examId is required' }, { status: 400 });
    }

    const answers = body?.answers && typeof body.answers === 'object' ? body.answers : {};
    const codeAnswers = body?.codeAnswers && typeof body.codeAnswers === 'object' ? body.codeAnswers : {};
    const tabSwitches = Number(body?.tabSwitches || 0);
    const timeTaken = Number(body?.timeTaken || 0);

    const result = await examsService.evaluateAndSubmitExam({
      studentId: user.id,
      registerNumber: (user as any).registerNumber,
      studentName: (user as any).name || (user as any).displayName || 'Student',
      examId,
      answers,
      codeAnswers,
      tabSwitches,
      timeTaken
    });

    return NextResponse.json(result);
  } catch (err: any) {
    const message = err?.message || 'Server error';
    const isClientError = message.includes('already attempted') || message.includes('not found') || message.includes('required');
    return NextResponse.json({ error: message }, { status: isClientError ? 400 : 500 });
  }
}

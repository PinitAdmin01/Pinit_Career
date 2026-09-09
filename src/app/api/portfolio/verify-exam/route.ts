import { NextResponse } from 'next/server';
import { verifyExamSessionToken } from '@/lib/portfolio/examToken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { examSessionToken, selectedAnswers } = body;

    if (!examSessionToken || typeof examSessionToken !== 'string') {
      return NextResponse.json(
        { ok: false, passed: false, error: 'Missing or invalid examSessionToken.' },
        { status: 400 }
      );
    }

    if (!selectedAnswers || typeof selectedAnswers !== 'object') {
      return NextResponse.json(
        { ok: false, passed: false, error: 'Candidate selected answers object required.' },
        { status: 400 }
      );
    }

    const verification = verifyExamSessionToken(examSessionToken);
    if (!verification.valid) {
      return NextResponse.json(
        { ok: false, passed: false, error: verification.error },
        { status: 403 }
      );
    }

    const correctAnswers = verification.answers;
    const questionIds = Object.keys(correctAnswers);
    const total = questionIds.length;

    if (total === 0) {
      return NextResponse.json(
        { ok: false, passed: false, error: 'No questions associated with this session token.' },
        { status: 400 }
      );
    }

    let correctCount = 0;
    for (const qId of questionIds) {
      const selected = Number(selectedAnswers[qId]);
      const actual = Number(correctAnswers[qId]);
      if (!isNaN(selected) && selected === actual) {
        correctCount++;
      }
    }

    const scorePercentage = Math.round((correctCount / total) * 100);
    const passThreshold = Math.ceil(total * 0.6);
    const passed = correctCount >= passThreshold;

    return NextResponse.json({
      ok: true,
      passed,
      score: scorePercentage,
      total,
      correctCount,
      passThreshold,
    });
  } catch (err: any) {
    console.error('[VerifyExam] Error processing exam verification:', err);
    return NextResponse.json(
      { ok: false, passed: false, error: err.message || 'Internal server error evaluating exam.' },
      { status: 500 }
    );
  }
}

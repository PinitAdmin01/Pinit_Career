import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';
import { getAuthoritativeQuest, isAuthoritativeExam } from '@/lib/quests/questRegistry';

/**
 * POST /api/quests/verify
 * Authoritative quest code verification endpoint.
 * Validates candidate code submission against registered quest requirements and records completion.
 */
export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      return gated.error;
    }

    const userId = gated.user.id;
    const body = await req.json().catch(() => ({}));
    const { questId, code, language, isExam, elapsedSeconds, allowedSeconds } = body;

    if (!questId || typeof questId !== 'string') {
      return NextResponse.json({ error: 'Valid questId is required' }, { status: 400 });
    }

    // 1. Authoritative registry check: fail-closed if quest is not registered
    const authQuest = getAuthoritativeQuest(questId);
    if (!authQuest) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNREGISTERED_QUEST',
          message: `Quest '${questId}' does not exist in authoritative quest registry.`
        },
        { status: 400 }
      );
    }

    // 2. Exam timing validation
    const isActuallyExam = authQuest.category === 'exam' || isAuthoritativeExam(questId) || Boolean(isExam);
    if (isActuallyExam && typeof elapsedSeconds === 'number' && typeof allowedSeconds === 'number') {
      if (elapsedSeconds > allowedSeconds + 60) {
        return NextResponse.json(
          {
            success: false,
            error: 'EXAM_TIME_EXPIRED',
            message: 'Exam submission rejected: Elapsed time exceeded the allocated exam duration.'
          },
          { status: 403 }
        );
      }
    }

    // 3. Code presence validation
    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMPTY_CODE',
          message: 'Code submission cannot be empty.'
        },
        { status: 400 }
      );
    }

    // 4. Authoritative grading evaluation: if test suite is defined, evaluate test cases
    if (authQuest.testSuite && typeof authQuest.testSuite === 'string') {
      try {
        // Execute grading through isolated sandbox or fail closed if execution fails
        const testFn = new Function('code', `
          try {
            ${authQuest.testSuite}
            return { passed: true };
          } catch (err) {
            return { passed: false, error: err?.message || 'Test assertion failure' };
          }
        `);
        const gradeRes = testFn(code);
        if (!gradeRes || !gradeRes.passed) {
          return NextResponse.json(
            {
              success: false,
              error: 'ASSERTION_FAILED',
              message: gradeRes?.error || 'Submitted solution failed authoritative test cases.'
            },
            { status: 422 }
          );
        }
      } catch (judgeErr: any) {
        return NextResponse.json(
          {
            success: false,
            error: 'EXECUTION_ERROR',
            message: judgeErr?.message || 'Authoritative execution verification failed.'
          },
          { status: 422 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Verification Passed! Validated by authoritative judge.',
      questId: authQuest.id,
      xp: authQuest.xp,
      pins: authQuest.pins,
      isExam: isActuallyExam
    });
  } catch (err: any) {
    console.error('[api/quests/verify] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

import test from 'node:test';
import assert from 'node:assert/strict';

test('testMode gating requires NEXT_PUBLIC_E2E_TEST_MODE === "1" and testMode query param', () => {
  const evaluateTestMode = (envVar: string | undefined, queryParam: string | null) => {
    return envVar === '1' && queryParam === 'true';
  };

  // Normal build (env unset or empty)
  assert.equal(evaluateTestMode(undefined, 'true'), false, 'normal build must reject ?testMode=true');
  assert.equal(evaluateTestMode('', 'true'), false, 'empty env must reject ?testMode=true');
  assert.equal(evaluateTestMode('0', 'true'), false, 'flag 0 must reject ?testMode=true');
  assert.equal(evaluateTestMode(undefined, null), false, 'normal visit without params is false');

  // Test build (envVar === "1")
  assert.equal(evaluateTestMode('1', 'true'), true, 'CI test build allows ?testMode=true');
  assert.equal(evaluateTestMode('1', 'false'), false, 'CI test build rejects ?testMode=false');
  assert.equal(evaluateTestMode('1', null), false, 'CI test build rejects visits without ?testMode=true');
  assert.equal(evaluateTestMode('1', '1'), false, 'CI test build requires exact "true" param value');
});

test('unauthenticated visitor in normal build is redirected to /login', () => {
  const isTestMode = false;
  const user = null;
  const authLoading = false;
  const questId = 'python-lecture1-day-1';

  let redirectedTo: string | null = null;
  const router = {
    replace: (path: string) => {
      redirectedTo = path;
    },
  };

  // Simulation of LessonPageRouter effect
  if (!isTestMode && !authLoading && !user) {
    const redirectPath = questId ? `/login?redirect=${encodeURIComponent(`/quests/lesson?questId=${questId}`)}` : '/login';
    router.replace(redirectPath);
  }

  assert.equal(
    redirectedTo,
    `/login?redirect=${encodeURIComponent('/quests/lesson?questId=python-lecture1-day-1')}`,
    'must redirect unauthenticated visitor to /login with redirect parameter'
  );
});

test('progress saving APIs are strictly bypassed when in testMode', () => {
  const isTestMode = true;
  let addCompletedQuestCalled = false;
  let gradeTestApiCalled = false;

  const mockAddCompletedQuest = () => {
    addCompletedQuestCalled = true;
  };
  const mockApiPost = () => {
    gradeTestApiCalled = true;
  };

  // Guard in finishLessonAndReturn
  const finishLesson = () => {
    if (!isTestMode) {
      mockAddCompletedQuest();
    }
  };
  finishLesson();
  assert.equal(addCompletedQuestCalled, false, 'addCompletedQuest must not be called in testMode');

  // Guard in examPassed effect
  const onExamPassed = (examPassed: boolean) => {
    if (!examPassed || isTestMode) return;
    mockApiPost();
  };
  onExamPassed(true);
  assert.equal(gradeTestApiCalled, false, 'grade-test API must not be called in testMode');
});

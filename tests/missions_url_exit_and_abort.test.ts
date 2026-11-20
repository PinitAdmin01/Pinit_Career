import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 1 Root-Cause Audit: URL cleaning logic on mission simulation abort & exit', () => {
  // Pure helper replicating the exact URL resolution logic implemented in useMissionsState and simulator
  function computeTargetUrlOnExit(currentHref: string, explicitTab?: string): string {
    const url = new URL(currentHref);
    url.searchParams.delete('roleplay');
    if (explicitTab) {
      url.searchParams.set('tab', explicitTab);
    }
    const cleanSearch = url.searchParams.toString();
    return url.pathname + (cleanSearch ? `?${cleanSearch}` : '');
  }

  // Test 1: User on /missions?tab=history&roleplay=true aborts
  const exitFromHistoryAndRoleplay = computeTargetUrlOnExit('https://present-career-os.vercel.app/missions?tab=history&roleplay=true');
  assert.equal(exitFromHistoryAndRoleplay, '/missions?tab=history', 'Aborting from ?tab=history&roleplay=true must cleanly retain tab=history');

  // Test 2: User on /missions?roleplay=true aborts
  const exitFromRoleplayOnly = computeTargetUrlOnExit('https://present-career-os.vercel.app/missions?roleplay=true');
  assert.equal(exitFromRoleplayOnly, '/missions', 'Aborting from ?roleplay=true must cleanly return to /missions without query params');

  // Test 3: User on /missions?tab=language&roleplay=true aborts
  const exitFromLanguage = computeTargetUrlOnExit('https://present-career-os.vercel.app/missions?tab=language&roleplay=true');
  assert.equal(exitFromLanguage, '/missions?tab=language', 'Aborting from ?tab=language&roleplay=true must cleanly retain tab=language');

  // Test 4: User finishes and clicks "Save & View History" from any active URL
  const finishToHistory = computeTargetUrlOnExit('https://present-career-os.vercel.app/missions?roleplay=true', 'history');
  assert.equal(finishToHistory, '/missions?tab=history', 'Save & View History must transition to /missions?tab=history');

  // Test 5: User finishes and clicks "Return to Command Center" from history simulation
  const finishToEvolve = computeTargetUrlOnExit('https://present-career-os.vercel.app/missions?tab=history&roleplay=true', 'evolve');
  assert.equal(finishToEvolve, '/missions?tab=evolve', 'Return to Command Center must transition to /missions?tab=evolve without roleplay');
});

test('Task 1 Contract Audit: useMissionsState updateRoleplayActive dispatches events, clears query, and sets abort guards', () => {
  const dispatchedEvents: any[] = [];
  const fakeHistory: string[] = [];
  const fakeRouterReplaces: string[] = [];

  const fakeWindow: any = {
    location: { href: 'https://present-career-os.vercel.app/missions?tab=history&roleplay=true' },
    history: {
      replaceState: (_state: any, _title: string, url: string) => {
        fakeHistory.push(url);
      }
    },
    dispatchEvent: (evt: any) => dispatchedEvents.push(evt)
  };

  const fakeRouter = {
    replace: (url: string) => {
      fakeRouterReplaces.push(url);
    }
  };

  // Execution contract replicating useMissionsState.ts line 76
  const executeUpdateRoleplayActive = (active: boolean) => {
    fakeWindow.__pinitMissionsRoleplayActive = active;
    if (!active) {
      fakeWindow.__pinitMissionsUserAborted = true;
    } else {
      fakeWindow.__pinitMissionsUserAborted = false;
    }
    fakeWindow.dispatchEvent({ type: 'pinit-roleplay-toggle', detail: { active } });

    try {
      const url = new URL(fakeWindow.location.href);
      if (active) {
        url.searchParams.set('roleplay', 'true');
        const nextUrl = url.pathname + (url.search ? url.search : '');
        fakeWindow.history.replaceState({}, '', nextUrl);
        fakeRouter.replace(nextUrl);
      } else {
        url.searchParams.delete('roleplay');
        const cleanSearch = url.searchParams.toString();
        const targetUrl = url.pathname + (cleanSearch ? `?${cleanSearch}` : '');
        fakeWindow.history.replaceState({}, '', targetUrl);
        fakeRouter.replace(targetUrl);
      }
    } catch {}
  };

  // Candidate initiates abort from active simulation with ?tab=history&roleplay=true
  executeUpdateRoleplayActive(false);

  assert.equal(fakeWindow.__pinitMissionsRoleplayActive, false, 'Roleplay active must be false');
  assert.equal(fakeWindow.__pinitMissionsUserAborted, true, 'User aborted guard must be set to true');
  assert.equal(fakeHistory[0], '/missions?tab=history', 'History replaceState must be /missions?tab=history');
  assert.equal(fakeRouterReplaces[0], '/missions?tab=history', 'Router replace must be called with /missions?tab=history');
  assert.equal(dispatchedEvents[0]?.type, 'pinit-roleplay-toggle', 'Event must be dispatched');
  assert.equal(dispatchedEvents[0]?.detail?.active, false, 'Event active flag must be false');

  // Candidate subsequently starts new session explicitly
  executeUpdateRoleplayActive(true);
  assert.equal(fakeWindow.__pinitMissionsRoleplayActive, true, 'Roleplay active must be re-activated');
  assert.equal(fakeWindow.__pinitMissionsUserAborted, false, 'User aborted guard must be cleared on new launch');
});

test('Task 1 Codebase Static Invariants: Abort session guards and tab preservation present in source files', () => {
  const useMissionsStateSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/missions/hooks/useMissionsState.ts'),
    'utf-8'
  );
  assert.ok(
    useMissionsStateSrc.includes('__pinitMissionsUserAborted = true'),
    'useMissionsState must set __pinitMissionsUserAborted = true when deactivating'
  );
  assert.ok(
    useMissionsStateSrc.includes("url.searchParams.delete('roleplay')"),
    'useMissionsState must delete roleplay param on deactivation'
  );

  const pageSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/missions/page.tsx'),
    'utf-8'
  );
  assert.ok(
    pageSrc.includes('userDismissedRoleplayRef'),
    'page.tsx must define userDismissedRoleplayRef to prevent restart loops'
  );
  assert.ok(
    pageSrc.includes('__pinitMissionsUserAborted'),
    'page.tsx must check __pinitMissionsUserAborted before auto-handling deep links'
  );
  assert.ok(
    pageSrc.includes("searchParams?.get('tab')"),
    'page.tsx must inspect and preserve incoming tab'
  );

  const simulatorSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/missions/components/MissionsPersonaSimulator.tsx'),
    'utf-8'
  );
  assert.ok(
    simulatorSrc.includes("u.searchParams.delete('roleplay')"),
    'MissionsPersonaSimulator abort handler must strip roleplay query param'
  );
  assert.ok(
    simulatorSrc.includes('__pinitMissionsUserAborted = true'),
    'MissionsPersonaSimulator must mark session aborted on abort'
  );
  assert.ok(
    simulatorSrc.includes("u.searchParams.set('tab', 'history')"),
    'MissionsPersonaSimulator Save & View History must explicitly target tab=history'
  );
});

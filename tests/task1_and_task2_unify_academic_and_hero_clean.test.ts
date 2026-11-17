import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';

// Stub CSS imports for Node.js test environment
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import ReactDOMServer from 'react-dom/server';

describe('BRUTAL VERIFICATION: Task 1 (Unified Academic Tab) & Task 2 (Hero Cleanliness)', () => {
  const root = path.resolve(__dirname, '..');
  let AppHeader: any;
  let CareerOSProvider: any;

  before(async () => {
    const headerMod = await import('../src/components/ui/AppHeader');
    AppHeader = headerMod.AppHeader;
    const ctxMod = await import('../src/lib/context/CareerOSContext');
    CareerOSProvider = ctxMod.CareerOSProvider;
  });

  const renderHeader = (props: any) => {
    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        CareerOSProvider,
        null,
        React.createElement(AppHeader, props)
      )
    );
  };

  it('Task 1.1: Floating CA circle button is eliminated — exactly 1 academic circle tab exists', () => {
    const shellSource = fs.readFileSync(path.join(root, 'src/components/ui/AppShell.tsx'), 'utf8');
    assert.ok(
      !shellSource.includes('campus-academic-circle-btn'),
      'Must NOT contain campus-academic-circle-btn in AppShell. Floating CA button is removed.'
    );
  });

  it('Task 1.2: Disconnected student clicking circle A triggers Connect to College modal', () => {
    let modalOpened = false;
    let sidebarToggled = false;

    const html = renderHeader({
      isLessonOrDetail: false,
      isGroupDiscussionCall: false,
      isRoleplayActive: false,
      effectiveFocusMode: false,
      mobileOpen: false,
      setMobileOpen: () => {},
      pageTitle: 'Dashboard',
      isStudent: true,
      careerScore: 0,
      dnaScore: 0,
      trustScore: 100,
      missionOnlyStreak: 0,
      liteUiMode: false,
      setLiteUiMode: () => {},
      theme: 'dark',
      toggleTheme: () => {},
      wsConnected: true,
      unread: 0,
      userId: 'student-123',
      toggleRightSidebar: () => { sidebarToggled = true; },
      isRightSidebarOpen: false,
      isCollegeConnected: false,
      onOpenConnectCollege: () => { modalOpened = true; },
    });

    assert.ok(html.includes('data-testid="academic-circle-btn"'), 'Academic circle button must be rendered');
    assert.ok(html.includes('>A</button>'), 'Academic circle must show letter "A"');
    assert.ok(html.includes('title="Campus Academic — Connect to College (A)"'), 'Title prompts college connection');
    assert.ok(html.includes('aria-label="Connect to College"'), 'Aria-label indicates connecting to college');
  });

  it('Task 1.3: Connected student clicking circle A toggles sidebar to College Home Dashboard', () => {
    const htmlClosed = renderHeader({
      isLessonOrDetail: false,
      isGroupDiscussionCall: false,
      isRoleplayActive: false,
      effectiveFocusMode: false,
      mobileOpen: false,
      setMobileOpen: () => {},
      pageTitle: 'Dashboard',
      isStudent: true,
      careerScore: 50,
      dnaScore: 60,
      trustScore: 100,
      missionOnlyStreak: 2,
      liteUiMode: false,
      setLiteUiMode: () => {},
      theme: 'dark',
      toggleTheme: () => {},
      wsConnected: true,
      unread: 0,
      userId: 'student-123',
      toggleRightSidebar: () => {},
      isRightSidebarOpen: false,
      isCollegeConnected: true,
    });

    assert.ok(htmlClosed.includes('title="Open Academic Tabs (A)"'), 'Title shows Open Academic Tabs when closed and connected');

    const htmlOpen = renderHeader({
      isLessonOrDetail: false,
      isGroupDiscussionCall: false,
      isRoleplayActive: false,
      effectiveFocusMode: false,
      mobileOpen: false,
      setMobileOpen: () => {},
      pageTitle: 'Dashboard',
      isStudent: true,
      careerScore: 50,
      dnaScore: 60,
      trustScore: 100,
      missionOnlyStreak: 2,
      liteUiMode: false,
      setLiteUiMode: () => {},
      theme: 'dark',
      toggleTheme: () => {},
      wsConnected: true,
      unread: 0,
      userId: 'student-123',
      toggleRightSidebar: () => {},
      isRightSidebarOpen: true,
      isCollegeConnected: true,
    });

    assert.ok(htmlOpen.includes('title="Close Academic Tabs (A)"'), 'Title shows Close Academic Tabs when open and connected');
  });

  it('Task 1.4: AppShell handleConnectCollegeSubmit unlocks right sidebar & opens home dashboard directly', () => {
    const shellSource = fs.readFileSync(path.join(root, 'src/components/ui/AppShell.tsx'), 'utf8');
    assert.ok(shellSource.includes("setActiveAcademicTab('home')"), 'Must switch active academic tab to home on connect');
    assert.ok(shellSource.includes('setRightCollapsed(false)'), 'Must immediately expand right sidebar on connect');
    assert.ok(shellSource.includes('pinit_connected_college'), 'Must persist connection in localStorage');
  });

  it('Task 2.1: Hero section completely removes ". Personal • Orientation" status pill', () => {
    const hudSource = fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf8');
    assert.ok(!hudSource.includes('Personal &bull;'), 'Must not contain Personal status pill');
    assert.ok(!hudSource.includes('Orientation'), 'Must not contain Orientation label in HUD');
    assert.ok(!hudSource.includes('Active Sprint'), 'Must not contain Active Sprint label in HUD');
  });

  it('Task 2.2: Hero section removes all 4 status lines from telemetry cards', () => {
    const hudSource = fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf8');
    assert.ok(!hudSource.includes('Good Standing'), 'Card 1 must not contain "Good Standing"');
    assert.ok(!hudSource.includes('No Active Course'), 'Card 2 must not contain "No Active Course"');
    assert.ok(!hudSource.includes('In Progress'), 'Card 2 must not contain "In Progress"');
    assert.ok(!hudSource.includes('Unranked • Placement'), 'Card 3 must not contain "Unranked • Placement"');
    assert.ok(!hudSource.includes('Rating:'), 'Card 3 must not contain "Rating:"');
    assert.ok(!hudSource.includes('No Activity'), 'Card 4 must not contain "No Activity"');
    assert.ok(!hudSource.includes('Active Momentum'), 'Card 4 must not contain "Active Momentum"');
  });

  it('Task 2.3: Telemetry cards maintain proper metric labels and honest baseline scores', () => {
    const hudSource = fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf8');
    assert.ok(hudSource.includes('TRUST SCORE'), 'Retains TRUST SCORE metric label');
    assert.ok(hudSource.includes('CAREER SCORE'), 'Retains CAREER SCORE metric label');
    assert.ok(hudSource.includes('ARENA ELO'), 'Retains ARENA ELO metric label');
    assert.ok(hudSource.includes('WEEKLY EXP'), 'Retains WEEKLY EXP metric label');
    assert.ok(hudSource.includes('{dynamicTrust}'), 'Renders dynamic trust score');
    assert.ok(hudSource.includes('{dynamicCareer}'), 'Renders dynamic career score');
    assert.ok(hudSource.includes('{dynamicElo}'), 'Renders dynamic elo score');
    assert.ok(hudSource.includes('{dynamicWeeklyExp}'), 'Renders dynamic weekly exp score');
  });
});

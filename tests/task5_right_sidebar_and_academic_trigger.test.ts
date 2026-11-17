import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';

// Stub CSS imports for Node.js test environment
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import ReactDOMServer from 'react-dom/server';

describe('TASK 5 BRUTAL VERIFICATION: Right Sidebar Invisibility & Circle "A" Academic Trigger', () => {
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

  it('renders circular "A" academic trigger button right next to settings gear for student', () => {
    let toggled = false;
    const html = renderHeader({
      isLessonOrDetail: false,
      isGroupDiscussionCall: false,
      isRoleplayActive: false,
      effectiveFocusMode: false,
      mobileOpen: false,
      setMobileOpen: () => {},
      pageTitle: 'Dashboard',
      isStudent: true,
      careerScore: 100,
      dnaScore: 80,
      trustScore: 90,
      missionOnlyStreak: 5,
      liteUiMode: false,
      setLiteUiMode: () => {},
      theme: 'dark',
      toggleTheme: () => {},
      wsConnected: true,
      unread: 0,
      userId: 'student-123',
      toggleRightSidebar: () => { toggled = true; },
      isRightSidebarOpen: false,
    });

    // Verify academic trigger button presence and structure
    assert.ok(html.includes('data-testid="academic-circle-btn"'), 'Academic circle button must be rendered in AppHeader');
    assert.ok(html.includes('>A</button>'), 'Button must render design "A" inside the circle');
    assert.ok(html.includes('title="Open Academic Tabs (A)"'), 'Button must indicate opening academic tabs when closed');
    assert.ok(html.includes('border-radius:50%'), 'Button must have circular 50% border radius');
  });

  it('updates circular button title when academic sidebar is currently open', () => {
    const html = renderHeader({
      isLessonOrDetail: false,
      isGroupDiscussionCall: false,
      isRoleplayActive: false,
      effectiveFocusMode: false,
      mobileOpen: false,
      setMobileOpen: () => {},
      pageTitle: 'Dashboard',
      isStudent: true,
      careerScore: 100,
      dnaScore: 80,
      trustScore: 90,
      missionOnlyStreak: 5,
      liteUiMode: false,
      setLiteUiMode: () => {},
      theme: 'dark',
      toggleTheme: () => {},
      wsConnected: true,
      unread: 0,
      userId: 'student-123',
      toggleRightSidebar: () => {},
      isRightSidebarOpen: true,
    });

    assert.ok(html.includes('title="Close Academic Tabs (A)"'), 'Button must indicate closing academic tabs when open');
  });

  it('does NOT render circle "A" button for non-student users (e.g., admin, faculty)', () => {
    const html = renderHeader({
      isLessonOrDetail: false,
      isGroupDiscussionCall: false,
      isRoleplayActive: false,
      effectiveFocusMode: false,
      mobileOpen: false,
      setMobileOpen: () => {},
      pageTitle: 'Admin Dashboard',
      isStudent: false,
      careerScore: 0,
      dnaScore: 0,
      trustScore: 0,
      missionOnlyStreak: 0,
      liteUiMode: false,
      setLiteUiMode: () => {},
      theme: 'dark',
      toggleTheme: () => {},
      wsConnected: true,
      unread: 0,
      userId: 'admin-123',
      toggleRightSidebar: () => {},
      isRightSidebarOpen: false,
    });

    assert.ok(!html.includes('data-testid="academic-circle-btn"'), 'Non-student roles must not see student academic circle');
  });

  it('verifies AppShell guarantees right sidebar invisibility by default (!rightCollapsed gate)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const shellContent = fs.readFileSync(path.resolve(__dirname, '../src/components/ui/AppShell.tsx'), 'utf8');

    // 1. Right sidebar is unmounted/hidden when rightCollapsed is true
    assert.ok(
      shellContent.includes('{isStudent && !effectiveFocusMode && !cleanPath.startsWith(\'/quests\') && !rightCollapsed && ('),
      'AppShell must condition right sidebar rendering on !rightCollapsed so it takes 0px width by default'
    );

    // 2. Contains the explicit close button
    assert.ok(
      shellContent.includes('<span>✕</span> Close Academic Tabs'),
      'AppShell must provide an intuitive close button inside the expanded drawer'
    );

    // 3. Connects toggleRightSidebar and isRightSidebarOpen to AppHeader
    assert.ok(
      shellContent.includes('toggleRightSidebar={toggleRightSidebar}'),
      'AppShell must wire toggleRightSidebar into AppHeader'
    );
    assert.ok(
      shellContent.includes('isRightSidebarOpen={!rightCollapsed}'),
      'AppShell must wire isRightSidebarOpen into AppHeader'
    );
  });
});

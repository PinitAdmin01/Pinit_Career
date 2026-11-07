import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 8 & 11: My Network Tab & Mutual Privacy Gate Audit', () => {
  const root = process.cwd();

  it('Task 8.1: Sidebar and Shell navigation references are updated to "My Network"', () => {
    const appShellPath = path.join(root, 'src', 'components', 'ui', 'AppShell.tsx');
    const appSidebarPath = path.join(root, 'src', 'components', 'ui', 'AppSidebar.tsx');

    const appShellContent = fs.readFileSync(appShellPath, 'utf8');
    const appSidebarContent = fs.readFileSync(appSidebarPath, 'utf8');

    // AppShell title mapping check
    assert.match(appShellContent, /'\/friends':\s*'My Network'/, 'PAGE_TITLES["/friends"] should map to "My Network"');

    // AppSidebar labels check
    assert.match(appSidebarContent, /'\/friends':\s*\{\s*label:\s*'My Network'/);
    assert.match(appSidebarContent, /id:\s*'friends',\s*href:\s*'\/friends',\s*icon:\s*'👥',\s*label:\s*'My Network'/);
    assert.match(appSidebarContent, /href:\s*'\/friends',\s*icon:\s*'👥',\s*label:\s*'My Network'/);
  });

  it('Task 8.2: Friends page title is updated to "My Network" and filter buttons under search bar are removed', () => {
    const friendsPagePath = path.join(root, 'src', 'app', 'friends', 'page.tsx');
    const content = fs.readFileSync(friendsPagePath, 'utf8');

    // Title updated to My Network
    assert.match(content, /My\s*<span>Network<\/span>/, 'Hero header must display "My Network"');
    assert.match(content, /My Network\s*\{networkStats\.friendsCount/, 'Tab pill must be labeled "My Network"');

    // Filter button row under search bar is removed
    assert.doesNotMatch(content, /className="friends-filters-row"/, 'Filter button row under search bar must be removed');
    assert.doesNotMatch(content, /className="filter-chips-left"/, 'Filter chips container under search bar must be removed');
    assert.doesNotMatch(content, /ref-filter-chip/, 'Filter chip buttons must be removed');
  });

  it('Task 8.3: No occurrences of the word "portfolio" exist in friends page and components', () => {
    const targetDirs = [
      path.join(root, 'src', 'app', 'friends'),
      path.join(root, 'src', 'components', 'friends')
    ];

    const violations: string[] = [];
    for (const dir of targetDirs) {
      const files = fs.readdirSync(dir, { recursive: true }) as string[];
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Case insensitive match for "portfolio"
          if (/portfolio/i.test(content)) {
            violations.push(`${file}: contains "portfolio"`);
          }
        }
      }
    }

    assert.deepEqual(violations, [], `Found prohibited word "portfolio" in friends files: ${violations.join(', ')}`);
  });

  it('Task 11.1: FriendProfileDrawer enables full profile navigation and provides connection notice when user is not a friend', () => {
    const drawerPath = path.join(root, 'src', 'components', 'friends', 'FriendProfileDrawer.tsx');
    const content = fs.readFileSync(drawerPath, 'utf8');

    // Check relationship friend check
    assert.match(content, /const isFriend = student\.relationship === 'friends' \|\| Boolean\(student\.isSelf\);/, 'Friend status gate logic must exist');

    // Check non-friend state UI
    assert.match(content, /data-testid="drawer-profile-locked-state"/, 'Must render drawer-profile-locked-state banner when not friends');
    assert.match(content, /Public Student Profile/, 'Must clearly explain public profile status');
    assert.match(content, /Full Profile →/, 'Full Profile button must be enabled and navigate for viewers');
  });

  it('Task 11.2: StudentProfilePage (/friends/[id]) renders full profile while showing connection notice when user is not a friend', () => {
    const pagePath = path.join(root, 'src', 'app', 'friends', '[id]', 'page.tsx');
    const content = fs.readFileSync(pagePath, 'utf8');

    // Check relationship friend check
    assert.match(content, /const isFriend = student \? \(student\.relationship === "friends" \|\| Boolean\(student\.isSelf\)\) : false;/, 'Friend status gate logic must exist on direct page route');

    // Check non-friend state UI
    assert.match(content, /data-testid="page-profile-locked-state"/, 'Must render page-profile-locked-state when not friends');
    assert.match(content, /Public Student Profile/, 'Must clearly explain public profile status on page');
    assert.match(content, /profile-stats-grid/, 'Must render profile stats grid for viewers');
  });
});

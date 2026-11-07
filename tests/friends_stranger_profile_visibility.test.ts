import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 1: Stranger & Peer Full Profile Visibility Audit', () => {
  const root = process.cwd();
  const pagePath = path.join(root, 'src', 'app', 'friends', '[id]', 'page.tsx');
  const drawerPath = path.join(root, 'src', 'components', 'friends', 'FriendProfileDrawer.tsx');

  it('1. StudentProfilePage (/friends/[id]) renders stats quad cards and tabs without blocking strangers', () => {
    const content = fs.readFileSync(pagePath, 'utf8');

    // Confirms no blocking {!isFriend ? (...) : (<>...stats...tabs...</>)} gate
    assert.doesNotMatch(
      content,
      /\{!isFriend\s*\?\s*\([\s\S]*?Full Student Profile Locked Behind Connection[\s\S]*?\)\s*:\s*\(/,
      'Must NOT block entire profile body behind !isFriend lock screen'
    );

    // Confirms stats quad cards and tabs are always rendered
    assert.match(content, /className="profile-stats-grid"/, 'Stats quad cards must always be rendered');
    assert.match(content, /Career Target & Vision/, 'Overview tab content must be present');
    assert.match(content, /Demonstrated Technical Competencies/, 'Skills tab content must be present');
    assert.match(content, /Projects & Squads/, 'Projects tab button must be present');
    assert.match(content, /Battle Record/, 'Battle record tab must be present');
  });

  it('2. StudentProfilePage renders sleek connection banner for non-friends while keeping profile visible', () => {
    const content = fs.readFileSync(pagePath, 'utf8');

    assert.match(content, /data-testid="page-profile-locked-state"/, 'Banner must have testid');
    assert.match(content, /Public Student Profile/, 'Banner must indicate public profile');
    assert.match(content, /Connect with \{student\.name\} to unlock 1v1 Arena Duels, Direct Messaging, and Squad Invites\./);
  });

  it('3. Direct interactive actions (Arena Duels and Chat Messages) remain strictly gated to friends', () => {
    const content = fs.readFileSync(pagePath, 'utf8');

    // Arena duel and message buttons are only present when relationship is 'friends'
    assert.match(
      content,
      /student\.relationship === 'friends'[\s\S]*?handleArenaDuel[\s\S]*?handleOpenChat/,
      'Arena Duel and Message must only be offered to connected friends'
    );
  });

  it('4. FriendProfileDrawer allows strangers to click "Full Profile →" without disabled lock', () => {
    const content = fs.readFileSync(drawerPath, 'utf8');

    // Full Profile button must not be disabled with 🔒 Full Profile
    assert.doesNotMatch(content, /🔒 Full Profile/, 'Drawer must not render disabled lock button for full profile');
    assert.match(content, /Full Profile →/, 'Drawer must render active clickable Full Profile button');
    assert.match(content, /router\.push\(`\/friends\/\$\{student\.id\}`\)/, 'Full profile button must route to /friends/[id]');
  });

  it('5. FriendProfileDrawer renders stats and tabs for all viewers with non-friend invitation notice', () => {
    const content = fs.readFileSync(drawerPath, 'utf8');

    // Confirms stats grid and tabs are not wrapped in {!isFriend ? (...) : (<>...)}
    assert.doesNotMatch(
      content,
      /\{!isFriend\s*\?\s*\([\s\S]*?Profile Locked Behind Connection[\s\S]*?\)\s*:\s*\(/,
      'Drawer must not hide stats grid behind blocking lock wall'
    );

    assert.match(content, /className="drawer-stats-grid"/, 'Drawer stats grid must always render');
    assert.match(content, /data-testid="drawer-profile-locked-state"/, 'Notice banner must exist for non-friends');
  });
});

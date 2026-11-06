import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getCompatibilityDetails } from '../src/components/friends/FriendProfileDrawer';

test('Block 40: Friends Network & Profile Drawer UX Invariants', () => {
  const drawerSource = fs.readFileSync(path.join(__dirname, '../src/components/friends/FriendProfileDrawer.tsx'), 'utf8');
  const cssSource = fs.readFileSync(path.join(__dirname, '../src/styles/friends.css'), 'utf8');

  // 1. Zero fake numbers or mock capstone projects
  assert.strictEqual(drawerSource.includes('student.careerScore || 85'), false, 'Fake career score fallback must not exist');
  assert.strictEqual(drawerSource.includes('student.xp || 2400'), false, 'Fake XP fallback must not exist');
  assert.strictEqual(drawerSource.includes('student.arenaWins || 12'), false, 'Fake arena wins fallback must not exist');

  // 2. Light mode styles present
  assert.ok(cssSource.includes(':root.light .friends-network-card'), 'Light mode network card styles must be defined');
  assert.ok(cssSource.includes(':root.light .friends-profile-drawer'), 'Light mode profile modal styles must be defined');

  // 3. Mathematical boundary thresholds for compatibility
  assert.strictEqual(getCompatibilityDetails(100).label, 'Subordinate Level');
  assert.strictEqual(getCompatibilityDetails(92).label, 'Best Compatible');
  assert.strictEqual(getCompatibilityDetails(75).label, 'Good');
  assert.strictEqual(getCompatibilityDetails(55).label, 'Likely');
  assert.strictEqual(getCompatibilityDetails(35).label, 'OK');
  assert.strictEqual(getCompatibilityDetails(15).label, 'Basic Match');
});

test('Block 40: Friends API Endpoints Parity', () => {
  const friendsRoute = path.join(__dirname, '../src/app/api/friends');
  assert.ok(fs.existsSync(friendsRoute), 'src/app/api/friends must exist');
});

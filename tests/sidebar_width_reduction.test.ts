import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 3: Sidebar Width 5% Reduction Verification', async (t) => {
  const globals = fs.readFileSync(path.join(__dirname, '../src/styles/globals.css'), 'utf8');
  const appSidebar = fs.readFileSync(path.join(__dirname, '../src/components/ui/AppSidebar.tsx'), 'utf8');
  const appShell = fs.readFileSync(path.join(__dirname, '../src/components/ui/AppShell.tsx'), 'utf8');

  await t.test('1. globals.css defines 5% reduced left sidebar variable clamp(220px, 15.7vw, 247px)', () => {
    assert.ok(globals.includes('--sidebar-w: clamp(220px, 15.7vw, 247px);'), 'Must define reduced --sidebar-w');
    assert.ok(globals.includes('--sidebar-collapsed-w: 64px;'), 'Must define reduced --sidebar-collapsed-w (64px from 68px)');
    assert.ok(globals.includes('--sidebar-right-w: 228px;'), 'Must define reduced right sidebar width (228px from 240px)');
    assert.strictEqual(globals.includes('clamp(232px, 16.5vw, 260px)'), false, 'Old unreduced sidebar width must not be present');
  });

  await t.test('2. globals.css .sidebar.collapsed width uses 64px fallback', () => {
    assert.ok(globals.includes('.sidebar.collapsed { width: var(--sidebar-collapsed-w, 64px); }'), 'Must use 64px for collapsed sidebar');
  });

  await t.test('3. AppSidebar.tsx uses reduced widths', () => {
    assert.ok(appSidebar.includes("'var(--sidebar-w, clamp(220px, 15.7vw, 247px))'"), 'AppSidebar expanded width must be reduced by 5%');
    assert.ok(appSidebar.includes("'var(--sidebar-collapsed-w, 64px)'"), 'AppSidebar collapsed width must be 64px');
  });

  await t.test('4. AppShell.tsx right sidebar uses reduced 228px expanded and 64px collapsed', () => {
    assert.ok(appShell.includes("'var(--sidebar-right-w, 228px)'"), 'Right sidebar expanded width must be 228px (240px - 5%)');
    assert.ok(appShell.includes("'var(--sidebar-collapsed-w, 64px)'"), 'Right sidebar collapsed width must be 64px');
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 5: Sidebar Creative CSS Shading Verification', async (t) => {
  const globals = fs.readFileSync(path.join(__dirname, '../src/styles/globals.css'), 'utf8');
  const appShell = fs.readFileSync(path.join(__dirname, '../src/components/ui/AppShell.tsx'), 'utf8');

  await t.test('1. Left sidebar (.sidebar) features atmospheric radial mesh shading', () => {
    assert.ok(globals.includes('radial-gradient(ellipse 180% 60% at 0% 0%'), 'Left sidebar must feature top-left radial indigo aura');
    assert.ok(globals.includes('linear-gradient(90deg, transparent 0%'), 'Left sidebar must feature vertical edge depth shading');
    assert.ok(globals.includes('inset -1px 0 0 rgba(255, 255, 255, 0.06)'), 'Left sidebar must have inner border highlight shade');
  });

  await t.test('2. Right sidebar in AppShell & globals.css features institutional amethyst radial mesh shading', () => {
    assert.ok(appShell.includes('radial-gradient(ellipse 180% 60% at 100% 0%'), 'Right sidebar must feature top-right radial amethyst aura');
    assert.ok(appShell.includes('linear-gradient(270deg, transparent 0%'), 'Right sidebar must feature reverse edge depth shading');
    assert.ok(globals.includes('inset 1px 0 0 rgba(255, 255, 255, 0.06)'), 'Right sidebar must have inner border highlight shade in globals.css');
  });

  await t.test('3. Continuous gradient substring preserved for design system consistency', () => {
    assert.ok(globals.includes('linear-gradient(180deg, rgba(99, 102, 241, 0.05)'), 'Globals .sidebar must retain continuous gradient');
    assert.ok(appShell.includes('linear-gradient(180deg, rgba(99, 102, 241, 0.05)'), 'AppShell right-sidebar must retain continuous gradient');
  });
});

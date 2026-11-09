import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('THEME CONTINUITY: useAppStore initializes from pc_theme and data-theme', () => {
  const storePath = path.join(process.cwd(), 'src/lib/store/useAppStore.ts');
  const code = fs.readFileSync(storePath, 'utf8');

  assert.ok(code.includes('getInitialTheme'), 'useAppStore must declare getInitialTheme helper');
  assert.ok(code.includes("localStorage.getItem('pc_theme')"), 'useAppStore must read pc_theme from localStorage');
  assert.ok(code.includes("document.documentElement.getAttribute('data-theme')"), 'useAppStore must check data-theme on documentElement');
  assert.ok(code.includes('theme:          getInitialTheme()'), 'useAppStore must initialize theme with getInitialTheme()');
});

test('THEME CONTINUITY: PublicNavbar binds directly to useAppStore theme and toggle', () => {
  const navPath = path.join(process.cwd(), 'src/components/nav/PublicNavbar.tsx');
  const code = fs.readFileSync(navPath, 'utf8');

  assert.ok(code.includes("useAppStore((s) => s.theme)"), 'PublicNavbar must subscribe to useAppStore.theme');
  assert.ok(code.includes("useAppStore((s) => s.toggleTheme)"), 'PublicNavbar must use useAppStore.toggleTheme');
  assert.ok(!code.includes("const [theme, setTheme] = useState<'dark' | 'light'>('dark')"), 'PublicNavbar must not maintain isolated local theme state');
});

test('THEME CONTINUITY: Signup page syncs with useAppStore and listens to pc_theme_toggled events', () => {
  const signupPath = path.join(process.cwd(), 'src/app/signup/page.tsx');
  const code = fs.readFileSync(signupPath, 'utf8');

  assert.ok(code.includes("useAppStore((s) => s.theme)"), 'Signup page must subscribe to useAppStore.theme');
  assert.ok(code.includes("localStorage.getItem('pc_theme')"), 'Signup page must check pc_theme on mount');
  assert.ok(code.includes("pc_theme_toggled"), 'Signup page must listen to pc_theme_toggled events');
});

test('THEME CONTINUITY: GearAudioHub evaluates activeTheme from storeTheme before fallback', () => {
  const gearPath = path.join(process.cwd(), 'src/components/nav/GearAudioHub.tsx');
  const code = fs.readFileSync(gearPath, 'utf8');

  assert.ok(code.includes("const activeTheme = storeTheme || theme || 'dark';"), 'GearAudioHub must evaluate storeTheme first');
});

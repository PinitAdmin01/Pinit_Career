import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('GD Engine, Brand Logo Restoration & Student Portal Emoji Audit', () => {
  test('GD1.1: GdAudioVisualizer safe color resolution prevents CanvasGradient crash', () => {
    const visualizerCode = fs.readFileSync(path.resolve('src/app/group-discussion/components/GdAudioVisualizer.tsx'), 'utf8');
    assert.ok(visualizerCode.includes('resolveCanvasColor'), 'GdAudioVisualizer must include resolveCanvasColor helper');
    assert.ok(visualizerCode.includes("color = '#14b8a6'"), "default color prop must be concrete hex, not 'var(--teal)'");
    assert.ok(!visualizerCode.includes("gradient.addColorStop(0, color)"), "addColorStop must not directly pass unparsed color");
    assert.ok(visualizerCode.includes("gradient.addColorStop(0, safeColor)"), "addColorStop must use safeColor");
  });

  test('GD1.2: useGdOrchestrator provides bypassPinGate and respects embedded status', () => {
    const orchCode = fs.readFileSync(path.resolve('src/app/group-discussion/hooks/useGdOrchestrator.ts'), 'utf8');
    assert.ok(orchCode.includes('handleStartCall = async (bypassPinGate = false)'), 'handleStartCall must accept bypassPinGate parameter');
    assert.ok(orchCode.includes('embedded?: boolean'), 'useGdOrchestrator must accept embedded prop');
    assert.ok(orchCode.includes("router.push('/interview?tab=gd&call=true')"), 'embedded GD call must route to /interview?tab=gd&call=true');
    assert.ok(!orchCode.includes("'/group-discussion/'"), 'canonical GD URLs must not have trailing slashes');
  });

  test('GD1.3: GroupDiscussionPage initializes with non-empty default topic and cleans stale URL', () => {
    const gdPageCode = fs.readFileSync(path.resolve('src/app/group-discussion/page.tsx'), 'utf8');
    assert.ok(!gdPageCode.includes("const [roomName, setRoomName] = useState('');"), 'roomName must have a non-empty default for instant setup');
    assert.ok(gdPageCode.includes('url.searchParams.delete(\'call\')'), 'must clean up stale ?call=true when not in call_grid step');
    assert.ok(gdPageCode.includes('orch.handleStartCall(true)'), 'PinsGate unlock trigger must pass bypass flag to orch.handleStartCall');
  });

  test('LOGO1.1: AppSidebar correctly renders official company logos without pitch black backgrounds', () => {
    const sidebarCode = fs.readFileSync(path.resolve('src/components/ui/AppSidebar.tsx'), 'utf8');
    assert.ok(sidebarCode.includes('/brand/pinit-career-mark.png'), 'AppSidebar must render pinit-career-mark.png in compact mode');
    assert.ok(sidebarCode.includes('/brand/pinit-career-logo-clear.png'), 'AppSidebar must render pinit-career-logo-clear.png in expanded mode');
  });

  test('LOGO1.2: Public auth and onboarding pages render clear official company logo', () => {
    const filesToCheck = [
      'src/components/nav/PublicNavbar.tsx',
      'src/app/login/page.tsx',
      'src/app/signup/page.tsx',
      'src/app/reset-password/page.tsx',
      'src/app/onboarding/page.tsx',
      'src/app/about/page.tsx',
      'src/app/admissions/page.tsx',
      'src/components/landing/HeroCockpit.tsx',
      'src/components/landing/PublicFooter.tsx',
      'src/components/nav/PublicFooter.tsx',
    ];

    for (const relPath of filesToCheck) {
      const code = fs.readFileSync(path.resolve(relPath), 'utf8');
      assert.ok(code.includes('/brand/pinit-career-logo-clear.png'), `${relPath} must render official clear company logo`);
    }
  });

  test('EMOJI1.1: Student portal subtabs and primary headings have eliminated unwanted emoji clutter', () => {
    const trackSelector = fs.readFileSync(path.resolve('src/app/quests/components/TrackSelectorDrawer.tsx'), 'utf8');
    assert.ok(!trackSelector.includes('🏆</span>\r\n          <span>Certification Programs</span>'), 'Subtab must not have 🏆 emoji');
    assert.ok(!trackSelector.includes('🗺️</span>\r\n          <span>Custom Roadmap</span>'), 'Subtab must not have 🗺️ emoji');
    assert.ok(!trackSelector.includes('📦</span>\r\n          <span>Standalone Course</span>'), 'Subtab must not have 📦 emoji');
    assert.ok(!trackSelector.includes('🌐</span>\r\n          <span>Language Academy</span>'), 'Subtab must not have 🌐 emoji');

    const planCards = fs.readFileSync(path.resolve('src/app/quests/components/CrashCoursePlanCards.tsx'), 'utf8');
    assert.ok(!planCards.includes('<span>🏆</span> ISO-ALIGNED'), 'Certification banner must not have 🏆 emoji');
    assert.ok(!planCards.includes('<span style={{ fontSize: 24 }}>⚡</span>\r\n              <h3'), 'Title must not have ⚡ emoji');
  });

  test('SIDEBAR1.1: Left and right sidebars preserve navigation emojis as requested', () => {
    const sidebarCode = fs.readFileSync(path.resolve('src/components/ui/AppSidebar.tsx'), 'utf8');
    assert.ok(sidebarCode.includes('Quests & Courses') && sidebarCode.includes('🗺'), 'AppSidebar must preserve Quests & Courses 🗺️ emoji');
    assert.ok(sidebarCode.includes("icon: '⚡'"), 'AppSidebar must preserve Daily Missions ⚡ emoji');
    assert.ok(sidebarCode.includes("icon: '🚀'"), 'AppSidebar must preserve Projects 🚀 emoji');
  });
});

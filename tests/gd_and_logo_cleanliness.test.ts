import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('GD Engine & Brand Logo Cleanliness Audit', () => {
  test('GD1.1: GdAudioVisualizer safe color resolution prevents CanvasGradient crash', () => {
    const visualizerCode = fs.readFileSync(path.resolve('src/app/group-discussion/components/GdAudioVisualizer.tsx'), 'utf8');
    // Ensure resolveCanvasColor helper is defined and used
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

  test('LOGO1.1: AppSidebar contains zero hardcoded logo images or black square boxes', () => {
    const sidebarCode = fs.readFileSync(path.resolve('src/components/ui/AppSidebar.tsx'), 'utf8');
    assert.ok(!sidebarCode.includes('/brand/pinit-career-logo'), 'AppSidebar must not contain /brand/pinit-career-logo');
    assert.ok(!sidebarCode.includes('<Image'), 'AppSidebar must not render <Image tags for logos');
  });

  test('LOGO1.2: Public auth and onboarding pages have removed hardcoded logo images', () => {
    const filesToCheck = [
      'src/components/nav/PublicNavbar.tsx',
      'src/app/login/page.tsx',
      'src/app/signup/page.tsx',
      'src/app/reset-password/page.tsx',
      'src/app/onboarding/page.tsx',
      'src/app/onboarding/components/OnboardingIntro.tsx',
      'src/app/about/page.tsx',
      'src/app/admissions/page.tsx',
      'src/components/landing/HeroCockpit.tsx',
      'src/components/landing/PublicFooter.tsx',
      'src/components/nav/PublicFooter.tsx',
    ];

    for (const relPath of filesToCheck) {
      const code = fs.readFileSync(path.resolve(relPath), 'utf8');
      assert.ok(!code.includes('/brand/pinit-career-logo'), `${relPath} must not contain /brand/pinit-career-logo`);
    }
  });

  test('LOGO1.3: globals.css eliminates pitch black background on logo classes', () => {
    const css = fs.readFileSync(path.resolve('src/styles/globals.css'), 'utf8');
    assert.ok(!css.includes('.logo-mark-img {\r\n  width: 34px;\r\n  height: 34px;\r\n  padding: 0;\r\n  overflow: hidden;\r\n  background: #000;'), 'logo-mark-img must not have background: #000');
    assert.ok(!css.includes('.lp-brand-lockup {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  background: #000;'), 'lp-brand-lockup must not have background: #000');
  });
});

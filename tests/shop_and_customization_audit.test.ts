import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('SHOP & CUSTOMIZATION SYSTEM AUDIT', async (t) => {
  await t.test('1. Shop Page Component & Route Integrity', () => {
    const shopPath = path.join(process.cwd(), 'src/app/shop/page.tsx');
    assert.ok(fs.existsSync(shopPath), 'src/app/shop/page.tsx must exist');

    const content = fs.readFileSync(shopPath, 'utf8');
    assert.match(content, /export default function ShopPage/, 'Must export default ShopPage component');
    assert.match(content, /usePins/, 'Must connect to usePins hook');
    assert.match(content, /useItemLocks/, 'Must connect to useItemLocks hook');
    assert.match(content, /triggerCoinStream/, 'Must include celebratory coin stream animation');
    assert.match(content, /addVaultItem/, 'Must persist unlocked items into Student Vault');
  });

  await t.test('2. Navigation Sidebar Integration', () => {
    const sidebarPath = path.join(process.cwd(), 'src/components/ui/AppSidebar.tsx');
    const content = fs.readFileSync(sidebarPath, 'utf8');
    assert.match(content, /href:\s*'\/shop'/, 'AppSidebar must include /shop link');
    assert.match(content, /href:\s*'\/vault'/, 'AppSidebar must include /vault link');
  });

  await t.test('3. Catalog Rigor & Item Variety', () => {
    const shopPath = path.join(process.cwd(), 'src/app/shop/page.tsx');
    const content = fs.readFileSync(shopPath, 'utf8');

    // Check presence of timed passes, cosmetics, and titles
    assert.match(content, /pass_jury_fasttrack/, 'Must include 30-Min Fast-Track Jury Pass');
    assert.match(content, /pass_resume_deepscan/, 'Must include Deep ATS Resume Audit Pass');
    assert.match(content, /pass_arena_turing/, 'Must include Turing Sparring Booster');
    assert.match(content, /avatar_holo_halo/, 'Must include Cyber Neon Halo');
    assert.match(content, /avatar_apex_visor/, 'Must include Apex Gold Scanner Visor');
    assert.match(content, /title_algorithm_titan/, 'Must include Title: Algorithm Titan');
    assert.match(content, /title_forensic_auditor/, 'Must include Title: Forensic Auditor');
  });

  await t.test('4. Redundant Asset Pruning Verification', () => {
    const hdAvatarDir = path.join(process.cwd(), 'public/avatar/hd');
    assert.ok(!fs.existsSync(hdAvatarDir), 'public/avatar/hd must be deleted to prevent 270MB duplicate build bloat');

    const enginePath = path.join(process.cwd(), 'src/components/avatar/VRoidAvatarEngine.ts');
    const engineContent = fs.readFileSync(enginePath, 'utf8');
    assert.ok(!engineContent.includes('/avatar/hd/'), 'VRoidAvatarEngine must not reference deleted /avatar/hd/ directory');
  });
});
